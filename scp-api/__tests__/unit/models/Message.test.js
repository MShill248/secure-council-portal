const Message = require("../../../models/Message")
const db = require("../../../database/connect")
const encrypter = require("../../../encrypt/crypto")

jest.mock("../../../encrypt/crypto", () => ({
  encryptArray: jest.fn().mockReturnValue([
    "enc_content"
  ])
}));

describe("Message", () => {
    beforeEach(() => jest.clearAllMocks())

    afterAll(() => jest.resetAllMocks())

    xdescribe('getAll', () => {
        it('resolves with messagess on successful db query', async () => {
            // ARRANGE
            const mockMessages = [
                { 
                    message_id: 1, 
                    request_id: 1, 
                    sender_id: 1,
                    receiver_id: 2,
                    content: "message",
                    timestamp: new Date()
                },
                { 
                    message_id: 2, 
                    request_id: 2, 
                    sender_id: 1,
                    receiver_id: 3,
                    content: "message",
                    timestamp: new Date()
                },
            ]
            jest.spyOn(db, 'query').mockResolvedValueOnce({ rows: mockMessages })
            // ACT
            const result = await Message.getAll()
            // ASSERT
            expect(result).toHaveLength(2)
            expect(result[0]).toHaveProperty('message_id')
            expect(result[0].content).toBe('message')
            expect(db.query).toHaveBeenCalledWith("SELECT * FROM messages ORDER BY timestamp DESC;")
        })

        it('should throw an Error when no messages are found', async () => {
            // ARRANGE
            jest.spyOn(db, 'query').mockResolvedValueOnce({ rows: [] })
            // ACT & ASSERT
            await expect(Message.getAll()).rejects.toThrow("No messages available")
        })
    })

    xdescribe("getOneById", () => {
        it("resolves with one instance of message", async () => {
        const mockMessage = { 
            message_id: 1, 
            request_id: 1, 
            sender_id: 1,
            receiver_id: 2,
            content: "message",
            timestamp: new Date()
        }
        
        jest.spyOn(db, "query").mockResolvedValueOnce({ rows: [mockMessage] })
        const result = await Message.getOneById(1)

        expect(result).toBeInstanceOf(Message)
        expect(result).toHaveProperty("message_id", 1)
        expect(result.content).toBe("message")
        expect(db.query).toHaveBeenCalledWith("SELECT * FROM messages WHERE message_id = $1;", [1])
        })

        it("should throw an Error when message is not found", async () => {
        jest.spyOn(db, "query").mockResolvedValueOnce({ rows: [] })

        await expect(Message.getOneById(999)).rejects.toThrow("Unable to locate message.")
        })
    })

    xdescribe('getByRequestId', () => {
        it('resolves with messages filtered by request_id on successful db query', async () => {
            // ARRANGE
            const request_id = 1
            const mockMessage = { 
                message_id: 1, 
                request_id: 1, 
                sender_id: 1,
                receiver_id: 2,
                content: "message",
                timestamp: new Date()
            }
            
            jest.spyOn(db, 'query').mockResolvedValueOnce({ rows: [mockMessage] })
            // ACT
            const result = await Message.getByRequestId(request_id)
            // ASSERT
            expect(result).toHaveLength(1)
            expect(result[0]).toHaveProperty('request_id', 1)
            expect(result[0].content).toBe('message')
            expect(db.query).toHaveBeenCalledWith("SELECT * FROM messages WHERE request_id = $1;", [request_id])
        })

        it('should throw an Error when no messages are found', async () => {
            // ARRANGE
            const request_id = 999
            jest.spyOn(db, 'query').mockResolvedValueOnce({ rows: [] })
            // ACT & ASSERT
            await expect(Message.getByRequestId(request_id)).rejects.toThrow("No messages found")
        })
    })

    xdescribe("create", () => {
        it("creates a message with correct data", async () => {
        const mockMessageData = {  
            request_id: 1, 
            sender_id: 1,
            receiver_id: 2,
            content: "message",
            timestamp: new Date()
        }

        const mockDbResponse = {
            message_id: 1,
            ...mockMessageData
        }

        const mockMessage = { 
            message_id: 1, 
            request_id: 1, 
            sender_id: 1,
            receiver_id: 2,
            content: "message",
            timestamp: new Date()
        }

        jest.spyOn(db, "query").mockResolvedValueOnce({ rows: [{ user_id: 1}] })
        jest.spyOn(db, "query").mockResolvedValueOnce({ rows: [mockDbResponse] })
        jest.spyOn(Message, "getOneById").mockResolvedValueOnce(new Message(mockMessage))
        const result = await Message.create(mockMessageData)

        expect(result).toBeInstanceOf(Message)
        expect(result).toHaveProperty("message_id", 1)
        expect(result.content).toBe("message")
        expect(db.query).toHaveBeenCalledWith("INSERT INTO messages (request_id, sender_id, receiver_id, content) VALUES ($1, $2, $3, $4) RETURNING *;",
                [
                mockMessageData.request_id,
                mockMessageData.sender_id,
                mockMessageData.receiver_id,
                "enc_content",
            ])
        })

        it("throws an error if user does not exist", async () => {
            const incompleteMessageData = { 
                content: 'message',
                message_id: 1
            }
            await expect(Message.create(incompleteMessageData)).rejects.toThrow('A user with this ID does not exist');
        })

        it("throws an error with missing data", async () => {
            const incompleteMessageData = { 
                message_id: 1,
                content: 'message', 
                sender_id: 1
            }
            await expect(Message.create(incompleteMessageData)).rejects.toThrow('Unable to create request.');
        })
    })

    xdescribe('update', () => {
        it('should return the updated message on successful update', async () => {
            // ARRANGE
            const message = new Message({ 
                message_id: 1, 
                request_id: 1, 
                sender_id: 1,
                receiver_id: 2,
                content: "message",
                timestamp: new Date()
            })
            const updatedData = { 
                message_id: message.message_id, 
                request_id: message.request_id, 
                sender_id: message.sender_id,
                receiver_id: message.receiver_id,
                content: "new message",
                timestamp: new Date()
            }
            const updatedMessage = { message_id: 1, ...updatedData }
            jest.spyOn(db, 'query').mockResolvedValueOnce({ rows: [updatedMessage] })
            // ACT
            const result = await message.update(updatedData)
            // ASSERT
            expect(result).toBeInstanceOf(Message)
            expect(result.content).toBe('new message')
            expect(result.message_id).toBe(1)
            expect(db.query).toHaveBeenCalledWith("UPDATE messages SET content = COALESCE($1, content), timestamp = COALESCE($2, timestamp) WHERE message_id = $3 RETURNING *;", 
              [
                "enc_content",
                message.timestamp,
                message.message_id
            ])
        })

        it('should throw an Error on db query failure', async () => {
            // ARRANGE
            const message = new Message({ message_id: 1, content: 'newer message' })
            jest.spyOn(db, 'query').mockRejectedValue(new Error('Database error'));
            // ACT & ASSERT
            await expect(message.update({ title: 'new message' })).rejects.toThrow('Database error');
        });
    })

    describe('destroy', () => {
        it('should return nothing on successful deletion', async () => {
            // ARRANGE
            const message = new Message({ 
                message_id: 1, 
                request_id: 1, 
                sender_id: 1,
                receiver_id: 2,
                content: "message",
                timestamp: new Date()
            })
            jest.spyOn(db, 'query').mockResolvedValueOnce({ rows: [] });
            // ACT
            const result = await message.destroy()
            // ASSERT
            expect(db.query).toHaveBeenCalledWith("DELETE FROM messages WHERE message_id = $1;", [message.message_id])
        })

        it('should throw an Error on db query failure', async () => {
            // ARRANGE
            const message = new Message({ 
                message_id: 1, 
                request_id: 1, 
                sender_id: 1,
                receiver_id: 2,
                content: "message",
                timestamp: new Date()
            })
            jest.spyOn(db, 'query').mockRejectedValue(new Error('Database error'));
            // ACT & ASSERT
            await expect(message.destroy()).rejects.toThrow('Database error')
        });
    })
})

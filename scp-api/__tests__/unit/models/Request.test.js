const Request = require("../../../models/Request")
const db = require("../../../database/connect")
const encrypter = require("../../../encrypt/crypto")

jest.mock("../../../encrypt/crypto", () => ({
  encryptArray: jest.fn().mockReturnValue([
    "enc_title",
    "enc_description",
    "enc_status",
    "enc_category"
  ])
}));

xdescribe("Request", () => {
    beforeEach(() => jest.clearAllMocks())

    afterAll(() => jest.resetAllMocks())

    describe('getAll', () => {
        it('resolves with requests on successful db query', async () => {
            // ARRANGE
            const mockRequest = [
                { 
                    request_id: 1, 
                    user_id: 1, 
                    title: "request 1",
                    description: "lorem ipsum",
                    status: "pending",
                    category: "amenities",
                    priority: 1,
                    type: "service"
                },
                { 
                    request_id: 2, 
                    user_id: 2, 
                    title: "request 2",
                    description: "lorem ipsum",
                    status: "resolved",
                    category: "amenities",
                    priority: 2,
                    type: "incident"
                },
            ]
            jest.spyOn(db, 'query').mockResolvedValueOnce({ rows: mockRequest })
            // ACT
            const result = await Request.getAll()
            // ASSERT
            expect(result).toHaveLength(2)
            expect(result[0]).toHaveProperty('request_id')
            expect(result[0].title).toBe('request 1')
            expect(db.query).toHaveBeenCalledWith("SELECT * FROM requests;")
        })

        it('should throw an Error when no requests are found', async () => {
            // ARRANGE
            jest.spyOn(db, 'query').mockResolvedValueOnce({ rows: [] })
            // ACT & ASSERT
            await expect(Request.getAll()).rejects.toThrow("No requests available")
        })
    })

    describe("getOneById", () => {
        it("resolves with one instance of request", async () => {
        const mockRequest = { 
            request_id: 1, 
            user_id: 1, 
            title: "request 1",
            description: "lorem ipsum",
            status: "pending",
            category: "amenities",
            priority: 1,
            type: "service"
        }
        
        jest.spyOn(db, "query").mockResolvedValueOnce({ rows: [mockRequest] })
        const result = await Request.getOneById(1)

        expect(result).toBeInstanceOf(Request)
        expect(result).toHaveProperty("request_id", 1)
        expect(result.title).toBe("request 1")
        expect(db.query).toHaveBeenCalledWith("SELECT * FROM requests WHERE request_id = $1;", [1])
        })

        it("should throw an Error when request is not found", async () => {
        jest.spyOn(db, "query").mockResolvedValueOnce({ rows: [] })

        await expect(Request.getOneById(999)).rejects.toThrow("Unable to locate request")
        })
    })

    describe('getByUserId', () => {
        it('resolves with requests filtered by user_id on successful db query', async () => {
            // ARRANGE
            const user_id = 1
            const mockRequests = [
                { 
                    request_id: 1, 
                    user_id: 1, 
                    title: "request 1",
                    description: "lorem ipsum",
                    status: "pending",
                    category: "amenities",
                    priority: 1,
                    type: "service"
                },
                { 
                    request_id: 2, 
                    user_id: 1, 
                    title: "request 2",
                    description: "lorem ipsum",
                    status: "resolved",
                    category: "amenities",
                    priority: 2,
                    type: "incident"
                },
            ]
            jest.spyOn(db, 'query').mockResolvedValueOnce({ rows: mockRequests })
            // ACT
            const result = await Request.getByUserId(user_id)
            // ASSERT
            expect(result).toHaveLength(2)
            expect(result[0]).toHaveProperty('request_id', 1)
            expect(result[1]).toHaveProperty('request_id', 2)
            expect(result[0].title).toBe('request 1')
            expect(result[1].title).toBe('request 2')
            expect(db.query).toHaveBeenCalledWith("SELECT * FROM requests WHERE user_id = $1;", [user_id])
        })

        it('should throw an Error when no requests are found', async () => {
            // ARRANGE
            const user_id = 999
            jest.spyOn(db, 'query').mockResolvedValueOnce({ rows: [] })
            // ACT & ASSERT
            await expect(Request.getByUserId(user_id)).rejects.toThrow("No requests found")
        })
    })

    describe('getByStatus', () => {
        it('resolves with requests filtered by status on successful db query', async () => {
            // ARRANGE
            const status = "pending"
            const mockRequests = [
                { 
                    request_id: 1, 
                    user_id: 1, 
                    title: "request 1",
                    description: "lorem ipsum",
                    status: "pending",
                    category: "amenities",
                    priority: 1,
                    type: "service"
                },
                { 
                    request_id: 2, 
                    user_id: 1, 
                    title: "request 2",
                    description: "lorem ipsum",
                    status: "pending",
                    category: "amenities",
                    priority: 2,
                    type: "incident"
                },
            ]
            jest.spyOn(db, 'query').mockResolvedValueOnce({ rows: mockRequests })
            // ACT
            const result = await Request.getByStatus(status)
            // ASSERT
            expect(result).toHaveLength(2)
            expect(result[0]).toHaveProperty('request_id', 1)
            expect(result[0].title).toBe('request 1')
            expect(db.query).toHaveBeenCalledWith("SELECT * FROM requests WHERE status = $1;", [status])
        })

        it('should throw an Error when no requests are found', async () => {
            // ARRANGE
            const status = "unfinished"
            jest.spyOn(db, 'query').mockResolvedValueOnce({ rows: [] })
            // ACT & ASSERT
            await expect(Request.getByStatus(status)).rejects.toThrow("No requests found")
        })
    })

    describe('getByPriority', () => {
        it('resolves with requests filtered by priority on successful db query', async () => {
            // ARRANGE
            const priority = 1
            const mockRequests = [
                { 
                    request_id: 1, 
                    user_id: 1, 
                    title: "request 1",
                    description: "lorem ipsum",
                    status: "pending",
                    category: "amenities",
                    priority: 1,
                    type: "service"
                },
                { 
                    request_id: 2, 
                    user_id: 1, 
                    title: "request 2",
                    description: "lorem ipsum",
                    status: "pending",
                    category: "amenities",
                    priority: 1,
                    type: "incident"
                },
            ]
            jest.spyOn(db, 'query').mockResolvedValueOnce({ rows: mockRequests })
            // ACT
            const result = await Request.getByPriority(priority)
            // ASSERT
            expect(result).toHaveLength(2)
            expect(result[0]).toHaveProperty('request_id', 1)
            expect(result[0].title).toBe('request 1')
            expect(db.query).toHaveBeenCalledWith("SELECT * FROM requests WHERE priority = $1;", [priority])
        })

        it('should throw an Error when no requests are found', async () => {
            // ARRANGE
            const priority = 4
            jest.spyOn(db, 'query').mockResolvedValueOnce({ rows: [] })
            // ACT & ASSERT
            await expect(Request.getByPriority(priority)).rejects.toThrow("No requests found")
        })
    })

    describe('getByCategory', () => {
        it('resolves with requests filtered by category on successful db query', async () => {
            // ARRANGE
            const category = "amenities"
            const mockRequests = [
                { 
                    request_id: 1, 
                    user_id: 1, 
                    title: "request 1",
                    description: "lorem ipsum",
                    status: "pending",
                    category: "amenities",
                    priority: 1,
                    type: "service"
                },
                { 
                    request_id: 2, 
                    user_id: 1, 
                    title: "request 2",
                    description: "lorem ipsum",
                    status: "pending",
                    category: "amenities",
                    priority: 1,
                    type: "incident"
                },
            ]
            jest.spyOn(db, 'query').mockResolvedValueOnce({ rows: mockRequests })
            // ACT
            const result = await Request.getByCategory(category)
            // ASSERT
            expect(result).toHaveLength(2)
            expect(result[0]).toHaveProperty('request_id', 1)
            expect(result[0].title).toBe('request 1')
            expect(db.query).toHaveBeenCalledWith("SELECT * FROM requests WHERE category = $1;", [category])
        })

        it('should throw an Error when no requests are found', async () => {
            // ARRANGE
            const category = 4
            jest.spyOn(db, 'query').mockResolvedValueOnce({ rows: [] })
            // ACT & ASSERT
            await expect(Request.getByCategory(category)).rejects.toThrow("No requests found")
        })
    })

    describe('getByRecent', () => {
        it('resolves with requests filtered by time on successful db query', async () => {
            // ARRANGE
            const mockRequests = [
                { 
                    request_id: 1, 
                    user_id: 1, 
                    title: "request 1",
                    description: "lorem ipsum",
                    status: "pending",
                    category: "amenities",
                    priority: 1,
                    type: "service",
                    created_at: "2025-01-01T10:00:00Z",
                    updated_at: "2025-01-02T12:00:00Z"
                },
                { 
                    request_id: 2, 
                    user_id: 1, 
                    title: "request 2",
                    description: "lorem ipsum",
                    status: "pending",
                    category: "amenities",
                    priority: 1,
                    type: "incident",
                    created_at: "2025-01-01T09:00:00Z",
                    updated_at: "2025-01-02T11:00:00Z"
                },
            ]
            jest.spyOn(db, 'query').mockResolvedValueOnce({ rows: mockRequests })
            // ACT
            const result = await Request.getByRecent()
            // ASSERT
            expect(result).toHaveLength(2)
            expect(result[0]).toBeInstanceOf(Request)
            expect(result[0]).toHaveProperty('request_id', 1)
            expect(result[0].title).toBe('request 1')
            expect(result[1].request_id).toBe(2)
            expect(result[1].title).toBe('request 2')
            expect(db.query).toHaveBeenCalledWith("SELECT * FROM requests ORDER BY updated_at DESC, created_at DESC;")
        })

        it('should throw an Error when no requests are found', async () => {
            // ARRANGE
            jest.spyOn(db, 'query').mockResolvedValueOnce({ rows: [] })
            // ACT & ASSERT
            await expect(Request.getByRecent()).rejects.toThrow("No requests found")
        })
    })

    describe("create", () => {
        it("creates a request with correct data", async () => {
        const mockRequestData = { 
            user_id: 1, 
            title: "request 1",
            description: "lorem ipsum",
            status: "pending",
            category: "amenities",
            priority: 1,
            type: "service"
        }

        const mockDbResponse = {
            request_id: 1,
            user_id: 1, 
            title: "request 1",
            description: "lorem ipsum",
            status: "pending",
            category: "amenities",
            priority: 1,
            type: "service"
        }

        const mockRequest = { 
            request_id: 1, 
            user_id: 1, 
            title: "request 1",
            description: "lorem ipsum",
            status: "pending",
            category: "amenities",
            priority: 1,
            type: "service"
        }

        jest.spyOn(db, "query").mockResolvedValueOnce({ rows: [{ user_id: 1}] })
        jest.spyOn(db, "query").mockResolvedValueOnce({ rows: [mockDbResponse] })
        jest.spyOn(Request, "getOneById").mockResolvedValueOnce(new Request(mockRequest))
        const result = await Request.create(mockRequestData)

        expect(result).toBeInstanceOf(Request)
        expect(result).toHaveProperty("request_id", 1)
        expect(result.title).toBe("request 1")
        expect(db.query).toHaveBeenCalledWith("INSERT INTO requests (user_id, title, description, status, category, priority, type) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *;",
                [
                mockRequestData.user_id,
                "enc_title",
                "enc_description",
                "enc_status",
                "enc_category",
                mockRequestData.priority,
                mockRequestData.type,
            ])
        })

        it("throws an error if user does not exist", async () => {
            const incompleteRequestData = { 
                title: 'request',
                 description: 'something' 
            }
            await expect(Request.create(incompleteRequestData)).rejects.toThrow('A user with this ID does not exist');
        })

        it("throws an error with missing data", async () => {
            const incompleteRequestData = { 
                user_id: 1,
                title: 'request', 
                description: 'something' 
            }
            await expect(Request.create(incompleteRequestData)).rejects.toThrow('Unable to create request.');
        })
    })

    describe('update', () => {
        it('should return the updated request on successful update', async () => {
            // ARRANGE
            const request = new Request({ 
                request_id: 1, 
                user_id: 1, 
                title: "request 1",
                description: "lorem ipsum",
                status: "pending",
                category: "amenities",
                priority: 1,
                type: "service"
            })
            const updatedData = {
                user_id: request.user_id, 
                title: request.title,
                description: request.description,
                status: "resolved",
                category: request.category,
                priority: request.priority,
                type: request.type
            }
            const updatedRequest = { request_id: 1, ...updatedData }
            jest.spyOn(db, 'query').mockResolvedValueOnce({ rows: [updatedRequest] })
            // ACT
            const result = await request.update(updatedData)
            // ASSERT
            expect(result).toBeInstanceOf(Request)
            expect(result.title).toBe('request 1')
            expect(result.request_id).toBe(1)
            expect(db.query).toHaveBeenCalledWith("UPDATE requests SET title = COALESCE($1, title), description = COALESCE($2, description), status = COALESCE($3, status), category = COALESCE($4, category), priority = COALESCE($5, priority), type = COALESCE($6, type), updated_at = COALESCE($7, updated_at) WHERE request_id = $8 RETURNING *;", 
              [
                "enc_title",
                "enc_description",
                "enc_status",
                "enc_category", 
                request.priority, 
                request.type,
                request.updated_at,
                request.request_id
            ])
        })

        it('should throw an Error on db query failure', async () => {
            // ARRANGE
            const request = new Request({ request_id: 1, title: 'request one' })
            jest.spyOn(db, 'query').mockRejectedValue(new Error('Database error'));
            // ACT & ASSERT
            await expect(request.update({ title: 'request 1' })).rejects.toThrow('Database error');
        });
    })

    describe('destroy', () => {
        it('should return nothing on successful deletion', async () => {
            // ARRANGE
            const request = new Request({ 
                request_id: 1, 
                user_id: 1, 
                title: "request 1",
                description: "lorem ipsum",
                status: "pending",
                category: "amenities",
                priority: 1,
                type: "service"
            })
            jest.spyOn(db, 'query').mockResolvedValueOnce({ rows: [] });
            // ACT
            const result = await request.destroy()
            // ASSERT
            expect(db.query).toHaveBeenCalledWith("DELETE FROM requests WHERE request_id = $1;", [request.request_id])
        })

        it('should throw an Error on db query failure', async () => {
            // ARRANGE
            const request = new Request({ 
                request_id: 1, 
                user_id: 1, 
                title: "request 1",
                description: "lorem ipsum",
                status: "pending",
                category: "amenities",
                priority: 1,
                type: "service"
            })
            jest.spyOn(db, 'query').mockRejectedValue(new Error('Database error'));
            // ACT & ASSERT
            await expect(request.destroy()).rejects.toThrow('Database error')
        });
    })
})

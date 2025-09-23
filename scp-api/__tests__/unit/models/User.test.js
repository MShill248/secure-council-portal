const User = require("../../../models/User")
const db = require("../../../database/connect")
const encrypter = require("../../../encrypt/crypto")

jest.mock("../../../encrypt/crypto", () => ({
  encryptArray: jest.fn().mockReturnValue([
    "enc_username",
    "enc_first_name",
    "enc_last_name",
    "enc_email",
    "enc_address",
    "enc_postcode",
    "enc_borough"
  ])
}));

xdescribe("User", () => {
  beforeEach(() => jest.clearAllMocks())

  afterAll(() => jest.resetAllMocks())

  describe('getAll', () => {
        it('resolves with users on successful db query', async () => {
            // ARRANGE
            const mockUser = [
                { 
                    user_id: 1, 
                    username: "userResident", 
                    first_name: "user",
                    last_name: "resident",
                    email: "resident@gmail.com",
                    password: "$2b$12$x/jcsuale8zziXeM4oiI8B9aRpVSdWgzoVUHkXMdyl5Eapcg3s1Fx",
                    dob: "01-01-1990",
                    address: "1 Test Street",
                    postcode: "TE1 2ST",
                    borough: "Redbridge",
                    phone_number: "07987654432",
                    user_role: "resident"
                },
                { 
                    user_id: 2, 
                    username: "userCouncil", 
                    first_name: "user",
                    last_name: "council",
                    email: "council@gmail.com",
                    password: "$2b$12$x/jcsuale8zziXeM4oiI8B9aRpVSdWgzoVUHkXMdyl5Eapcg3s1Fx",
                    dob: "01-01-1990",
                    address: "1 Test Street",
                    postcode: "TE1 2ST",
                    borough: "Redbridge",
                    phone_number: "07987654432",
                    user_role: "council"
                },
            ]
            jest.spyOn(db, 'query').mockResolvedValueOnce({ rows: mockUser })
            // ACT
            const result = await User.getAll()
            // ASSERT
            expect(result).toHaveLength(2)
            expect(result[0]).toHaveProperty('user_id')
            expect(result[0].username).toBe('userResident')
            expect(db.query).toHaveBeenCalledWith("SELECT * FROM users;")
        })

        it('should throw an Error when no users are found', async () => {
            // ARRANGE
            jest.spyOn(db, 'query').mockResolvedValueOnce({ rows: [] })
            // ACT & ASSERT
            await expect(User.getAll()).rejects.toThrow("No users available")
        })
    })

  describe("getOneById", () => {
    it("resolves with one instance of user", async () => {
      const mockUser = { 
        user_id: 1, 
        username: "userResident", 
        first_name: "user",
        last_name: "resident",
        email: "resident@gmail.com",
        password: "$2b$12$x/jcsuale8zziXeM4oiI8B9aRpVSdWgzoVUHkXMdyl5Eapcg3s1Fx",
        dob: "01-01-1990",
        address: "1 Test Street",
        postcode: "TE1 2ST",
        borough: "Redbridge",
        phone_number: "07987654432",
        user_role: "resident"
      }
      
      jest.spyOn(db, "query").mockResolvedValueOnce({ rows: [mockUser] })
      const result = await User.getOneById(1)

      expect(result).toBeInstanceOf(User)
      expect(result).toHaveProperty("user_id", 1)
      expect(result.username).toBe("userResident")
      expect(db.query).toHaveBeenCalledWith("SELECT * FROM users WHERE user_id = $1;", [1])
    })

    it("should throw an Error when user is not found", async () => {
      jest.spyOn(db, "query").mockResolvedValueOnce({ rows: [] })

      await expect(User.getOneById(999)).rejects.toThrow("Unable to locate user")
    })
  })

  describe("getOneByUsername", () => {
    it("resolves with one instance of user", async () => {
      const mockUser = { 
        user_id: 1, 
        username: "userResident", 
        first_name: "user",
        last_name: "resident",
        email: "resident@gmail.com",
        password: "$2b$12$x/jcsuale8zziXeM4oiI8B9aRpVSdWgzoVUHkXMdyl5Eapcg3s1Fx",
        dob: "01-01-1990",
        address: "1 Test Street",
        postcode: "TE1 2ST",
        borough: "Redbridge",
        phone_number: "07987654432",
        user_role: "resident"
      }

      jest.spyOn(db, "query").mockResolvedValueOnce({ rows: [mockUser] })
      const result = await User.getOneByUsername("userResident")

      expect(result).toBeInstanceOf(User)
      expect(result).toHaveProperty("user_id", 1)
      expect(result.username).toBe("userResident")
      expect(db.query).toHaveBeenCalledWith("SELECT * FROM users WHERE username = $1;", ["userResident"])
    })

    it("should throw an Error when user is not found", async () => {
      jest.spyOn(db, "query").mockResolvedValueOnce({ rows: [] })

      await expect(User.getOneByUsername("nonExistent")).rejects.toThrow("Unable to locate user.")
    })
  })

  describe("create", () => {
    it("creates a user with correct data", async () => {
      const mockUserData = { 
        username: "userResident", 
        first_name: "user",
        last_name: "resident",
        email: "resident@gmail.com",
        password: "$2b$12$x/jcsuale8zziXeM4oiI8B9aRpVSdWgzoVUHkXMdyl5Eapcg3s1Fx",
        dob: "01-01-1990",
        address: "1 Test Street",
        postcode: "TE1 2ST",
        borough: "Redbridge",
        phone_number: "07987654432",
        user_role: "resident"
      }

      const mockDbResponse = {
        user_id: 1,
      }

      const mockUser = { 
        user_id: 1, 
        username: "userResident", 
        first_name: "user",
        last_name: "resident",
        email: "resident@gmail.com",
        password: "$2b$12$x/jcsuale8zziXeM4oiI8B9aRpVSdWgzoVUHkXMdyl5Eapcg3s1Fx",
        dob: "01-01-1990",
        address: "1 Test Street",
        postcode: "TE1 2ST",
        borough: "Redbridge",
        phone_number: "07987654432",
        user_role: "resident"
      }

      jest.spyOn(db, "query").mockResolvedValueOnce({ rows: [mockDbResponse] })
      jest.spyOn(User, "getOneById").mockResolvedValueOnce(new User(mockUser))
      const result = await User.create(mockUserData)

      expect(result).toBeInstanceOf(User)
      expect(result).toHaveProperty("user_id", 1)
      expect(result.username).toBe("userResident")
      expect(db.query).toHaveBeenCalledWith("INSERT INTO users (username, first_name, last_name, email, password, dob, address, postcode, borough, phone_number, user_role) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) RETURNING user_id;",
            [
            "enc_username",
            "enc_first_name",
            "enc_last_name",
            "enc_email",
            mockUserData.password,
            mockUserData.dob,
            "enc_address",
            "enc_postcode",
            "enc_borough",
            mockUserData.phone_number,
            mockUserData.user_role
          ])
    })

    it("throws an error with missing data", async () => {
      const incompleteUserData = { username: 'userResident', firstname: 'user' };
      await expect(User.create(incompleteUserData)).rejects.toThrow('Unable to create user.');
    })
  })

  describe('update', () => {
        it('should return the updated user on successful update', async () => {
            // ARRANGE
            const user = new User({ 
              user_id: 1, 
              username: "userResident", 
              first_name: "user",
              last_name: "resident",
              email: "resident@gmail.com",
              password: "$2b$12$x/jcsuale8zziXeM4oiI8B9aRpVSdWgzoVUHkXMdyl5Eapcg3s1Fx",
              dob: "01-01-1990",
              address: "1 Test Street",
              postcode: "TE1 2ST",
              borough: "Redbridge",
              phone_number: "07987654432",
              user_role: "resident"
            })
            const updatedData = { 
              username: user.username,
              first_name: user.first_name,
              last_name: user.last_name,
              email: user.email,
              password: user.password,
              dob: user.dob,
              address: "2 Test Close",
              postcode: "TE2 3ST",
              borough: user.borough,
              phone_number: user.phone_number,
              user_role: user.user_role
            }
            const updatedUser = { user_id: 1, ...updatedData }
            jest.spyOn(db, 'query').mockResolvedValueOnce({ rows: [updatedUser] })
            // ACT
            const result = await user.update(updatedData)
            // ASSERT
            expect(result).toBeInstanceOf(User)
            expect(result.address).toBe('2 Test Close')
            expect(result.user_id).toBe(1)
            expect(db.query).toHaveBeenCalledWith("UPDATE users SET username = COALESCE($1, username), first_name = COALESCE($2, first_name), last_name = COALESCE($3, last_name), email = COALESCE($4, email), password = COALESCE($5, password), dob = COALESCE($6, dob), address = COALESCE($7, address), postcode = COALESCE($8, postcode), borough = COALESCE($9, borough), phone_number = COALESCE($10, phone_number), user_role = COALESCE($11, user_role) WHERE user_id = $12 RETURNING *;", 
              [
                user.username, 
                user.first_name, 
                user.last_name, 
                user.email,
                // "enc_username",
                // "enc_first_name",
                // "enc_last_name",
                // "enc_email", 
                user.password, 
                user.dob, 
                updatedData.address, 
                updatedData.postcode, 
                user.borough,
                // "enc_address",
                // "enc_postcode",
                // "enc_borough", 
                user.phone_number, 
                user.user_role, 
                user.user_id])
        })

        it('should throw an Error on db query failure', async () => {
            // ARRANGE
            const user = new User({ user_id: 1, address: '2 Test Street' })
            jest.spyOn(db, 'query').mockRejectedValue(new Error('Database error'));
            // ACT & ASSERT
            await expect(user.update({ address: '2 Test Close' })).rejects.toThrow('Database error');
        });
  })

  describe('destroy', () => {
        it('should return nothing on successful deletion', async () => {
            // ARRANGE
            const user = new User({ 
              user_id: 1, 
              username: "userResident", 
              first_name: "user",
              last_name: "resident",
              email: "resident@gmail.com",
              password: "$2b$12$x/jcsuale8zziXeM4oiI8B9aRpVSdWgzoVUHkXMdyl5Eapcg3s1Fx",
              dob: "01-01-1990",
              address: "1 Test Street",
              postcode: "TE1 2ST",
              borough: "Redbridge",
              phone_number: "07987654432",
              user_role: "resident"
            })
            jest.spyOn(db, 'query').mockResolvedValueOnce({ rows: [] });
            // ACT
            const result = await user.destroy()
            // ASSERT
            expect(db.query).toHaveBeenCalledWith("DELETE FROM users WHERE user_id = $1;", [user.user_id])
        })

        it('should throw an Error on db query failure', async () => {
            // ARRANGE
            const user = new User({ 
              user_id: 1, 
              username: "userResident", 
              first_name: "user",
              last_name: "resident",
              email: "resident@gmail.com",
              password: "$2b$12$x/jcsuale8zziXeM4oiI8B9aRpVSdWgzoVUHkXMdyl5Eapcg3s1Fx",
              dob: "01-01-1990",
              address: "1 Test Street",
              postcode: "TE1 2ST",
              borough: "Redbridge",
              phone_number: "07987654432",
              user_role: "resident"
            })
            jest.spyOn(db, 'query').mockRejectedValue(new Error('Database error'));
            // ACT & ASSERT
            await expect(user.destroy()).rejects.toThrow('Database error')
        });
    })
})

export {};
const { app, redisIo } = require("../app");
const { authorizationMD } = require("../Middleware/userLoginMiddleware");

const supertest = require("supertest");

const request = {
  body: {
    fullname: "fake_fullName",
    email: "fake_email",
    password: "fake_password",
  },
  user: {
    role: "admin",
  },
};

const reqMD = {
  role: jest.fn(() => "admin"),
};

const response = {
  status: jest.fn((x) => x),
  json: jest.fn((x) => x),
  // send: jest.fn((x) => x),
};

//mock query calls
// jest.mock("../queries/account");
// jest.mock("../db");

// beforeEach(async () => {
//   console.log("Before each");
//   redisIo.connect();
// });

// afterEach(async () => {
//   console.log("After each");
//   await redisIo.disconnect();
// });

// describe("POST / register", () => {
//   // it("returns err msg if user already exist", async () => {
//   //   const res = await supertest(app).post("/api/v1/user/register").send({
//   //     fullname: "test mock",
//   //     email: "testmock@gmail.com",
//   //     password: "mock2222",
//   //   });
//   //   // console.log("res", res);
//   //   expect(res.status).toBe(400);
//   //   expect(res.body).toEqual("Email already exist");
//   // });
///correct below
//   it("returns 201 if user is registered", async () => {
//     try {
//       const res = await supertest(app).post("/api/v1/user/register").send({
//         fullname: "test mockkk",
//         email: "testmock@gmail.com",
//         password: "mock22",
//       });
//       // console.log(res);
//       expect(res.status).toBe(201);
//     } catch (error) {
//       expect(error);
//       // expect(error).toBe("Email already exist");
//     }
//   });
// });

// });

describe(" POST /Login ", () => {
  it("returns 200 if user is logged in", async () => {
    const res = await supertest(app).post("/api/v1/user/login").send({
      // email: "testmock@gmail.com",
      email: "amadigodwin7@gmail.com",
      password: "higodwin",
      // password: "mock22",
    });

    expect(res.status).toBe(200);
    expect(res.body.email).toBe("amadigodwin7@gmail.com");
    // expect(res.body.email).toBe("testmock@gmail.com");
  }, 30000);
});

describe("get user roles", () => {
  it("returns 200 when user role is accessed", async () => {
    const res = await supertest(app).get("/api/v1/user/roles");
    expect(res.status).toBe(200);
  });
});

// const roleMiddleware = (req: reqMD, res: Response) => {
//   return (req.session.user.role = "admin");
// };

//this requires user role authorizatio to go thru
describe("create roles", () => {
  const testMiddleware = authorizationMD("admin");
  try {
    it("returns 201 when user role is successfully created by admin", async () => {
      const res = await supertest(app)
        .post("/api/v1/user/roles")
        // .use(testMiddleware)
        // .auth("amadigodwin77@gmail.com", "higodwin")
        .send({
          // roleid: "accounts-02",
          // role: "accouts/finance22",
          roleid: "accounts-02",
          role: "accouts/financce",
        });
      // console.log("res", res);
      // console.log("res", res);
      // console.log("req.user");
      // expect(roleMiddleware).toBe("admin");
      // expect(testMiddleware).toHaveBeenCalledTimes(1);
    }, 30000);
  } catch (err: any) {
    // console.log("error-testing", error);
    throw new Error(err);
  }
});

//Keeping this on hold for now until I fix the user role auth issue
// describe("update roles", () => {});

const request = require("supertest");
const expect = require("chai").expect;

const app = require("../index.js");

describe("The Users API", () => {
    describe("GET /users", () => {
        it("should return an object with a key of 'users'", () => {
            return request(app)
                .get("/users")
                .expect(200)
                .then(({body}) => {
                    expect(body.users).to.be.an("array");
                });
        });
    });
});


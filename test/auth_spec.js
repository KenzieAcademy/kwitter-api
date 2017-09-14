const request = require("supertest");
const expect = require("chai").expect;
const {bookshelf} = require("../models/db")

const app = require("../index.js");
const {knex} = bookshelf;

describe("auth controllers", () => {
    before(() => knex.migrate.latest());

    after(() => knex.migrate.rollback());

    describe("POST /register", () => {
        it("should be able to register a new user", () => {
            return request(app)
                .post("/auth/register")
                .send({
                    username: "testUser",
                    display_name: "Test User",
                    password: "password",
                })
                .expect(200)
                .then(({ body }) =>  expect(body.rowCount).to.equal(1));
        });
    });

    describe("GET /logout", () => {
        it("should be able to logout a user", () => { expect(true).to.equal(true);
            return request(app)
                .get("/auth/logout")
                .expect(200)
                .then(({ body }) => expect(body.success).to.be.true)
        });
    });

    describe("POST /login", () => {
        it("should be able to login", () => {
            return request(app)
                .post("/auth/login")
                .send({
                    username: "testUser",
                    password: "password",
                })
                .expect(200)
                .then(({ body }) => expect(body).to.have.property("token"))});
    });
});

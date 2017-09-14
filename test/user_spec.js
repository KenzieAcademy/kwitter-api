const request = require("supertest");
const expect = require("chai").expect;
const {bookshelf} = require("../models/db")

const app = require("../index.js");
const {knex} = bookshelf;

describe("user controllers", () => {
    before(() => {
      knex.migrate.latest();
      return request(app)
        .post("/auth/register")
        .send({
            username: "testUser",
            display_name: "Test User",
            password: "password",
        })
    });

    after(() => knex.migrate.rollback());

    describe("GET /user", () => {
        it("should", () => {
            expect(true).to.equal(true);
        });
    });

    describe("PATCH /user", () => {
        it("should", () => {
            expect(true).to.equal(true);
        });
    });

    describe("DELET /user", () => {
        it("should", () => {
            expect(true).to.equal(true);
        });
    });
});

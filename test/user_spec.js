const request = require("supertest");
const expect = require("chai").expect;

const app = require("../index.js");
const models = require("../models");

describe("user controllers", () => {
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

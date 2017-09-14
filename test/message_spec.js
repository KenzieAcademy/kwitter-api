const request = require("supertest");
const expect = require("chai").expect;

const app = require("../index.js");

describe("messages controllers", () => {
  describe("GET /messages", () => {
    it("should", () => {
        expect(true).to.equal(true);
    });
  });

  describe("POST /messages", () => {
    it("should", () => {
        expect(true).to.equal(true);
    });
  });

  describe("GET /messages/:id", () => {
    it("should", () => {
        expect(true).to.equal(true);
    });
  });

  describe("PATCH /messages/:id/like", () => {
    it("should", () => {
        expect(true).to.equal(true);
    });
  });
});

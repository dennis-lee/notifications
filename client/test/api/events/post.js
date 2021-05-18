process.env.NODE_ENV = "test";

const expect = require("chai").expect;
const request = require("supertest");

const app = require("../../../app.js");
const conn = require("../../../db/index.js");

describe("POST /events", () => {
  before((done) => {
    conn
      .connect()
      .then(() => done())
      .catch((err) => done(err));
  });

  after((done) => {
    conn
      .close()
      .then(() => done())
      .catch((err) => done(err));
  });

  it("creates a new event", (done) => {
    request(app)
      .post("/events")
      .send({ name: "test_event", dummy_payload: "{ test_payload: true }" })
      .then((res) => {
        const body = res.body;
        expect(body).to.contain.property("_id");
        expect(body).to.contain.property("name");
        expect(body).to.contain.property("dummy_payload");
        done();
      });
  });

  it("event requires name", (done) => {
    request(app)
      .post("/events")
      .send({})
      .then((res) => {
        const body = res.body;
        expect(body.errors.name.name).equal("ValidatorError");
        done();
      });
  });
});

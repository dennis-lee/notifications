process.env.NODE_ENV = "test";

const expect = require("chai").expect;
const request = require("supertest");

const app = require("../../../app.js");
const conn = require("../../../db/index.js");

describe("GET /events", () => {
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

  it("getting events has no events", (done) => {
    request(app)
      .get("/events")
      .then((res) => {
        const body = res.body;
        expect(body.length).to.equal(0);
        done();
      });
  });

  it("getting events has 1 event", (done) => {
    request(app)
      .post("/events")
      .send({ name: "test_event", dummy_payload: "{ test_payload: true }" })
      .then((res) => {
        request(app)
          .get("/events")
          .then((res) => {
            const body = res.body;
            expect(body.length).to.equal(1);
            done();
          });
      });
  });
});

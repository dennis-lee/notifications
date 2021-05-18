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

  it("getting customers has no customers", (done) => {
    request(app)
      .get("/customers")
      .then((res) => {
        const body = res.body;
        expect(body.length).to.equal(0);
        done();
      });
  });

  it("getting customers has 1 customer", (done) => {
    request(app)
      .post("/events")
      .send({
        user_name: "test_user",
        first_name: "test_name",
        business_id: "abc123",
        verification_token: "zxc",
      })
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

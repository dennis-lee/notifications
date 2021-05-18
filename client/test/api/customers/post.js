process.env.NODE_ENV = "test";

const expect = require("chai").expect;
const request = require("supertest");

const app = require("../../../app.js");
const conn = require("../../../db/index.js");

describe("POST /customers", () => {
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

  it("creates a new customer", (done) => {
    request(app)
      .post("/customers")
      .send({ user_name: "test_user", first_name: "test_name" })
      .then((res) => {
        const body = res.body;
        expect(body).to.contain.property("_id");
        expect(body).to.contain.property("first_name");
        expect(body).to.contain.property("business_id");
        expect(body).to.contain.property("verification_token");
        done();
      });
  });

  it("customer requires username", (done) => {
    request(app)
      .post("/customers")
      .send({ user_name: "" })
      .then((res) => {
        const body = res.body;
        expect(body.errors.user_name.name).equal("ValidatorError");
        done();
      });
  });

  it("customer requires first name", (done) => {
    request(app)
      .post("/customers")
      .send({ user_name: "test_user", first_name: "" })
      .then((res) => {
        const body = res.body;
        expect(body.errors.first_name.name).equal("ValidatorError");
        done();
      });
  });

  it("customer already exists", (done) => {
    request(app)
      .post("/customers")
      .send({ user_name: "test_user", first_name: "test_name" })
      .then((res) => {
        request(app)
          .post("/customers")
          .send({ user_name: "test_user", first_name: "test_name" })
          .then((res) => {
            const body = res.body;
            expect(body.code).equal(11000);
            done();
          });
      });
  });
});

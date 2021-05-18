const secrets = require("../db/secrets.js");
const DB_URI = `mongodb+srv://${secrets.mongodbUser}:${secrets.mongodbPassword}@${secrets.mongodbCluster}/${secrets.mongodbDatabase}`;

const url = require("url");
const Agenda = require("agenda");
const axios = require("axios");
const md5 = require("md5");
const { Notification } = require("../db/models/notification.js");
const { Event } = require("../db/models/event.js");
const { Customer } = require("../db/models/customer.js");
const { Webhook } = require("../db/models/webhook.js");

const agenda = new Agenda({
  db: { address: DB_URI },
  processEvery: "30 seconds",
});
var router = require("express").Router();

router.post("/notifications", (req, res, next) => {
  const body = req.body;
  Customer.findOne({ business_id: body.business_id }, (err, result) => {}).then(
    (customer) => {
      let config = {
        headers: {
          "x-customer-verification-token": customer.verification_token,
        },
      };

      let id_key = req.header("Idempotency-Key");

      if (id_key == null) {
        id_key = md5(`${body.payload}${body.business_id}`);
      }

      getWebhook(body.business_id, body.event).then((webhook) => {
        getIdempotencyKey(res, id_key).then((found) => {
          if (found) {
            res.status(200).send("Sent in the past");
          } else {
            const notification = new Notification({
              target: webhook.target,
              result: 400,
              body: body.payload,
              event: body.event,
              business_id: body.business_id,
              customer_verification_token: customer.verification_token,
              idempotency_key: id_key,
            });

            notification.save(notification).then((notification) => {
              axios
                .post(webhook.target, JSON.parse(body.payload), config)
                .then((res) => {
                  notification.result = 200;
                })
                .catch((err) => {
                  // retry
                  notification.result = 400;
                  //   retrySend(id_key);
                  next(err);
                  //   res.status(400).send(err);
                })
                .finally(() => {
                  notification.save();
                });
            });
          }
        });
      });
    }
  );
});

function retrySend(key) {
  console.log(key);
  getNotification(key)
    .then((notification) => {
      console.log(notification);
      (async function () {
        await agenda.start();
        await agenda.schedule(
          notification.next_retry,
          `retry ${notification.idempotency_key}`,
          async (job) => {
            let config = {
              headers: {
                "x-customer-verification-token":
                  body.customer_verification_token,
              },
            };

            axios
              .post(notification.target, JSON.parse(notification.body), config)
              .then((res) => {})
              .catch((err) => {
                // retry
                Notification.findOneAndUpdate(
                  { idempotency_key: key },
                  {
                    next_retry: new Date(
                      notification.next_retry.getTime() + 60000
                    ),
                  },
                  (err, result) => {
                    if (err) return err;
                  }
                );
                retrySend(id_key);
              });
          }
        );
      })();
    })
    .catch((err) => {
      return err;
    });
}

function getCustomer(business_id) {
  return Customer.findOne({ business_id: business_id });
}

function getWebhook(business_id, event) {
  return Webhook.findOne({ business_id: business_id, event: event });
}

function getNotification(key) {
  return Notification.findOne({ idempotency_key: key });
}

function getIdempotencyKey(res, key) {
  return Notification.find({ idempotency_key: key })
    .then((notification) => {
      return notification.length != 0;
    })
    .catch((err) => {
      return res.status(400).send(err);
    });
}

router.post("/notifications/test", (req, res) => {
  const body = req.body;

  getCustomer(body.business_id).then((customer) => {
    let config = {
      headers: {
        "x-customer-verification-token": customer.verification_token,
      },
    };

    Event.findOne({ name: body.event }, (err, doc) => {}).then((event) => {
      axios
        .post(body.target, JSON.parse(event.dummy_payload), config)
        .then((res) => {
          res.status(200);
        })
        .catch((err) => {
          res.status(400).send(err);
        });
    });
  });
});

module.exports = router;

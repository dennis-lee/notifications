const url = require("url");
const axios = require("axios");
const { Webhook } = require("../db/models/webhook.js");
const { Notification } = require("../db/models/notification.js");

var router = require("express").Router();

router.post("/webhooks", (req, res) => {
  const body = req.body;
  var targetUrl = "";
  try {
    targetUrl = new URL(body.target);
  } catch (error) {
    return res.status(400).send(`${error.input} is not a valid url`);
  }

  const webhook = new Webhook({
    business_id: body.business_id,
    event: body.event,
    target: targetUrl,
  });

  webhook
    .save(webhook)
    .then((webhook) => res.status(201).send(webhook))
    .catch((err) => res.status(400).send(err));
});

router.get("/webhooks", (req, res) => {
  Webhook.find()
    .then((webhooks) => res.status(200).send(webhooks))
    .catch((err) => res.status(400).send(err));
});

router.patch("/webhooks/:event", (req, res) => {
  const body = req.body;
  Event.updateOne(
    { name: res.params.name },
    { dummy_payload: body.dummy_payload }
  )
    .then((event) => res.status(200).send(event))
    .catch((err) => res.status(400));
});

router.delete("/webhooks/:event/", (req, res) => {
  Event.deleteOne({ name: req.params.name })
    .then((event) => res.status(200).send(event))
    .catch((err) => res.status(400));
});

module.exports = router;

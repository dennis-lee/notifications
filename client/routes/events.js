const Event = require("../db/models/event.js").Event;

var router = require("express").Router();

router.post("/events", (req, res) => {
  const body = req.body;
  const event = new Event({
    name: body.name,
    dummy_payload: body.dummy_payload,
  });

  event
    .save(event)
    .then((event) => res.status(201).send(event))
    .catch((err) => res.status(400).send(err));
});

router.get("/events", (req, res) => {
  Event.find()
    .then((events) => res.status(200).send(events))
    .catch((err) => res.status(400).send(err));
});

router.patch("/events/:name", (req, res) => {
  const body = req.body;
  Event.updateOne(
    { name: res.params.name },
    { dummy_payload: body.dummy_payload }
  )
    .then((event) => res.status(200).send(event))
    .catch((err) => res.status(400));
});

router.delete("/events/:name", (req, res) => {
  Event.deleteOne({ name: req.params.name })
    .then((event) => res.status(200).send(event))
    .catch((err) => res.status(400));
});

module.exports = router;

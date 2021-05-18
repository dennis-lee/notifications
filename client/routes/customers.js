const Customer = require("../db/models/customer.js").Customer;

var router = require("express").Router();
const md5 = require("md5");
const { v4: uuidv4 } = require("uuid");

router.post("/customers", (req, res) => {
  const body = req.body;
  var ts = Date.now().toString();
  var business_id = md5(`${body.user_name}${body.first_name}${ts}`);
  var verification_token = uuidv4();

  const customer = new Customer({
    user_name: body.user_name,
    first_name: body.first_name,
    business_id: business_id,
    verification_token: verification_token,
  });

  customer
    .save(customer)
    .then((customer) => res.status(201).send(customer))
    .catch((err) => res.status(400).send(err));
});

router.get("/customers", (req, res) => {
  Customer.find()
    .then((Customers) => res.status(200).send(Customers))
    .catch((err) => res.status(400).send(err));
});

// router.delete("/customers/:name", (req, res) => {
//   Customer.deleteOne({ name: req.params.name })
//     .then((Customer) => res.status(200).send(Customer))
//     .catch((err) => res.status(400));
// });

module.exports = router;

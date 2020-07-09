const express = require('express');
const auth = require('../middlewares/auth');
const admin = require('../middlewares/admin');
const { Customer, validate } = require('../models/customer');

const router = express.Router();

router.get('/', async (req, res) => {
  const customers = await Customer.find();
  res.send(customers);
});

router.get('/:id', async (req, res) => {
  const customer = await Customer.findById(req.params.id);

  if (!customer)
    return res.status(404).send('The customer with the given ID was not found');

  res.send(customer);
});

router.post('/', auth, async (req, res) => {
  try {
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    let customer = new Customer({
      isGold: req.body.isGold,
      name: req.body.name,
      phone: req.body.phone,
    });

    customer = await customer.save();
    res.send(customer);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

router.put('/:id', auth, async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const customer = await Customer.findByIdAndUpdate(
    req.params.id,
    { isGold: req.body.isGold, name: req.body.name, phone: req.body.phone },
    { new: true }
  );

  if (!customer)
    return res.status(404).send('The customer with the given ID was not found');

  res.send(customer);
});

router.delete('/:id', [auth, admin], async (req, res) => {
  const customer = await Customer.findByIdAndDelete(req.params.id);

  if (!customer)
    return res.status(404).send('The customer with the given ID was not found');

  res.send(customer);
});

module.exports = router;

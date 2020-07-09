const Fawn = require('fawn');
const auth = require('../middlewares/auth');
const admin = require('../middlewares/admin');
const { Rental, validate } = require('../models/rental');
const { Movie } = require('../models/movie');
const { Customer } = require('../models/customer');
const mongoose = require('mongoose');
const express = require('express');

const router = express.Router();

Fawn.init(mongoose); // don't forget !

router.get('/', async (req, res) => {
  const rentals = await Rental.find().sort('-dateOut');
  res.send(rentals);
});

router.post('/', auth, async (req, res) => {
  try {
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const customer = await Customer.findById(req.body.customerId);
    if (!customer) return res.status(400).send('Invalid customer.');

    const movie = await Movie.findById(req.body.movieId);
    if (!movie) return res.status(400).send('Invalid movie.');

    if (movie.numberInStock === 0)
      return res.status(400).send('Movie not in stock.');

    let rental = new Rental({
      customer: {
        _id: customer._id, // if we need to request Customer document to get more infos
        name: customer.name,
        phone: customer.phone,
      },
      movie: {
        _id: movie._id, // if we need to request Movie document to get more infos
        title: movie.title,
        dailyRentalRate: movie.dailyRentalRate,
      },
    });

    // to simulate transaction (like validation by 2 commits pattern)
    new Fawn.Task()
      .save('rentals', rental)
      .update('movies', { _id: movie._id }, { $inc: { numberInStock: -1 } })
      .run();
    res.send(rental);
  } catch (ex) {
    console.log(ex);
    return res.status(500).send('Something failed');
  }
});

router.get('/:id', async (req, res) => {
  const rental = await Rental.findById(req.params.id);

  if (!rental)
    return res.status(404).send('The rental with the given ID was not found.');

  res.send(rental);
});

module.exports = router;

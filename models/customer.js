const Joi = require('joi');
const mongoose = require('mongoose');

const customerSchema = mongoose.Schema({
  isGold: {
    type: Boolean,
    default: false,
  },
  name: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 50,
  },
  phone: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 50,
  },
});

const Customer = mongoose.model('Customers', customerSchema);

const validateCustomer = customer => {
  const schema = {
    isGold: Joi.boolean(),
    name: Joi.string().min(3).required(),
    phone: Joi.string().min(5).max(50).required(),
  };
  return Joi.validate(customer, schema);
};

exports.customerSchema = customerSchema;
exports.Customer = Customer;
exports.validate = validateCustomer;

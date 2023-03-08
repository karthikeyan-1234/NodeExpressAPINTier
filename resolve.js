const CustomerService = require('./service');


const awilix = require('awilix');
const { createContainer, asClass } = awilix;
const container = createContainer();

container.register({
  customerService: asClass(CustomerService).singleton(),
});

module.exports = container;
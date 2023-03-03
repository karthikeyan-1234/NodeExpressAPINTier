const GenericRepository = require('./genericRepo');
const redis = require('./redis');

class CustomerService {
  constructor() {
    this.customerRepository = new GenericRepository('Customers');
  }

  async getAllcustomers() {

    redis.GET('Customers').then((ret) => {
        console.log("From redis");
        console.log(ret);
        return ret;
    })

    var customers = await this.customerRepository.getAll();

    redis.SET('Customers',JSON.stringify(customers));
    return customers;

  }

  async getcustomerById(id) {
    return await this.customerRepository.getById(id);
  }

  async createcustomer(customer) {
    return await this.customerRepository.create(customer);
  }

  async updatecustomer(id, customer) {
    return await this.customerRepository.update(id, customer);
  }

  async deletecustomer(id) {
    return await this.customerRepository.delete(id);
  }
}

module.exports = CustomerService;

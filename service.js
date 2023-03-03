const GenericRepository = require('./genericRepo');
const redis = require('./redis');

class EmployeeService {
  constructor() {
    this.employeeRepository = new GenericRepository('Customers');
  }

  async getAllEmployees() {

    redis.GET('Customers').then((ret) => {
        console.log("From redis");
        console.log(ret);
        return ret;
    })

    var employees = await this.employeeRepository.getAll();

    redis.SET('Customers',JSON.stringify(employees));
    return employees;

  }

  async getEmployeeById(id) {
    return await this.employeeRepository.getById(id);
  }

  async createEmployee(employee) {
    return await this.employeeRepository.create(employee);
  }

  async updateEmployee(id, employee) {
    return await this.employeeRepository.update(id, employee);
  }

  async deleteEmployee(id) {
    return await this.employeeRepository.delete(id);
  }
}

module.exports = EmployeeService;

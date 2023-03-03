const express = require('express');
const bodyParser = require('body-parser');
const cors = require("cors");
const EmployeeService = require('./service');

const app = express();
const PORT = 5000;


const employeeService = new EmployeeService();

app.use(bodyParser.json());
app.use(cors());

app.get('/',async (req,res)=>{
    try{       
        res.send("Hello");
    }
    catch(err){
        res.send(err);
    }
})


// GET all employees
app.get('/api/employees', async (req, res) => {
    try {
      const employees = await employeeService.getAllEmployees();
      res.json(employees);
    } catch (err) {
      console.error(err);
      res.status(500).send('Server error');
    }
  });
  
  // GET employee by ID
  app.get('/api/employees/:id', async (req, res) => {
    try {
      const employee = await employeeService.getEmployeeById(req.params.id);
      if (!employee) {
        return res.status(404).json({ msg: 'Employee not found' });
      }
      res.json(employee);
    } catch (err) {
      console.error(err);
      res.status(500).send('Server error');
    }
  });
  
  // CREATE new employee
  app.post('/api/employees', async (req, res) => {
    try {
      const employee = req.body;
      const newEmployee = await employeeService.createEmployee(employee);
      res.json(newEmployee);
    } catch (err) {
      console.error(err);
      res.status(500).send('Server error');
    }
  });
  
  // UPDATE employee by ID
  app.put('/api/employees/:id', async (req, res) => {
    try {
      const employee = req.body;
      const updatedEmployee = await employeeService.updateEmployee(req.params.id, employee);
      if (!updatedEmployee) {
        return res.status(404).json({ msg: 'Employee not found' });
      }
      res.json(updatedEmployee);
    } catch (err) {
      console.error(err);
      res.status(500).send('Server error');
    }
  });
  
  // DELETE employee by ID
  app.delete('/api/employees/:id', async (req, res) => {
    try {
      const deletedEmployee = await employeeService.deleteEmployee(req.params.id);
      if (!deletedEmployee) {
        return res.status(404).json({ msg: 'Employee not found' });
      }
      res.json({ msg: 'Employee deleted' });
    } catch (err) {
      console.error(err);
      res.status(500).send('Server error');
    }
  });

app.listen(PORT,() => {
    console.log("Server is running..")
})
const express = require('express');
const bodyParser = require('body-parser');
const cors = require("cors");
const logger = require('./logger');
const io = require('./socket');
const auth = require('./auth')
const jwt = require("jsonwebtoken");
const container = require('./resolve')


const customerService = container.resolve('customerService');

const app = express();
const PORT = 5000;

require('dotenv').config();

io.listen(3001,() => {
  console.log("IO server running")
})


app.use(bodyParser.json());
app.use(cors());

// DEFAULT
app.get('/',async (req,res)=>{
  try{       
      res.status(200).send("Welcome");
  }
  catch(err){
      res.send(err);
  }
})

// SIGN IN and return JWT Token
app.post('/signin',(req,res) => {

//Implement logic to check validity for username and password

var token = jwt.sign({user_id: req.user_id, email: req.email_id}, process.env.TOKEN_SECRET, {expiresIn: "10000"}) //expires in 10 seconds. Refer https://www.npmjs.com/package/jsonwebtoken for further details
res.status(200).send(token);
})

// GET all customers
app.get('/api/customers',async (req, res) => {
    try {
      const customers = await customerService.getAllcustomers();
      logger.info("Customers shown");
      res.json(customers);
    } catch (err) {
      console.error(err);
      res.status(500).send('Server error');
    }
  });
  
// GET customer by ID
app.get('/api/customers/:id',auth,async (req, res) => {
  try {
    const customer = await customerService.getcustomerById(req.params.id);
    if (!customer) {
      return res.status(404).json({ msg: 'Customer not found' });
    }
    res.json(customer);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

// CREATE new customer
app.post('/api/customers',auth,async (req, res) => {
  try {
    const customer = req.body;
    const newcustomer = await customerService.createcustomer(customer);
    res.json(newcustomer);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

// UPDATE customer by ID
app.put('/api/customers/:id',auth,async (req, res) => {
  try {
    const customer = req.body;
    const updatedcustomer = await customerService.updatecustomer(req.params.id, customer);
    if (!updatedcustomer) {
      return res.status(404).json({ msg: 'customer not found' });
    }
    res.json(updatedcustomer);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

// DELETE customer by ID
app.delete('/api/customers/:id',auth,async (req, res) => {
  try {
    const deletedcustomer = await customerService.deletecustomer(req.params.id);
    if (!deletedcustomer) {
      return res.status(404).json({ msg: 'customer not found' });
    }
    res.json({ msg: 'customer deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

app.listen(PORT,() => {
    console.log("Server is running..")
})
const express = require('express');
const { v4: uuidv4 } = require('uuid')
const app = express();

app.use(express.json())

const customers = [];

function verifyIfExistsAccountCPF(req, res, next) {
  const { cpf } = req.headers;

  const customer = customers.find((customer) => customer.cpf === cpf)

  if(!customer) {
    return res.status(400).json({error: "Customer not found!"})
  }

  req.customer = customer;

  return next();
}

app.post('/v1/api/account', (req, res) => {
  const { cpf, name } = req.body;
  
  const customerAlreadyExists = customers.some((customer)=> customer.cpf === cpf);
  
  if (customerAlreadyExists){
    return res.status(400).json({error: "Customer already exists!"});
  }

  customers.push({
    id: uuidv4(), 
    cpf, 
    name,
    statement: []
  });

  return res.status(201).send();
})

app.get('/v1/api/statement', verifyIfExistsAccountCPF, (req, res) => {
  
  const { customer } = req;

  return res.json(customer.statement);
})


app.post('/v1/api/deposit', verifyIfExistsAccountCPF, (req, res) => {
  const { description, amount } = req.body;

  const { customer } = req;

  const statementOperation = {
    description: description,
    amount: amount,
    created_at: new Date(),
    type: "Credit"
  }

  customer.statement.push(statementOperation)

  return res.status(201).json( customer )
})

app.listen(8000)
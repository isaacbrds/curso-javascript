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

function getBalance(statement) {
  const balance = statement.reduce((acc, operation)=>{
    if (operation.type === 'Credit'){
      return acc + operation.amount;
    }else{
      return acc - operation.amount
    }
  }, 0);

  return balance;
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

app.post('/v1/api/withdraw', verifyIfExistsAccountCPF, (req, res)=>{
  const { amount } = req.body;

  const { customer } = req;

  const balance = getBalance(customer.statement);

  if (balance < amount){
    return res.status(400).json({error: "You don't have enough funds!"})
  }

  const statementOperation = {
    amount,
    created_at: new Date(),
    type: 'Debit'
  };

  customer.statement.push(statementOperation);

  return res.status(201).send()
})

app.get('/v1/api/statement/date', verifyIfExistsAccountCPF, (req, res)=>{
  const {customer} = req;

  const {date} = req.query;

  const dateFormatted = new Date(date + " 00:00");

  const statement = customer.statement.filter((statement)=>{
    statement.created_at.toDateString() === new Date(dateFormatted).toDateString();
  })

  return res.json(statement);
})

app.put('/v1/api/account', verifyIfExistsAccountCPF, (req, res) => {
  const {name} = req.body;
  const {customer} = req;

  customer.name = name;

  return res.status(201).send();
})

app.get('/v1/api/account', verifyIfExistsAccountCPF, (req, res)=>{
  const {customer} = req;

  return res.status(200).json(customer);
})

app.delete('/v1/api/account', verifyIfExistsAccountCPF, (req, res)=>{
  const {customer} = req;

  customers.splice(customer, 1);

  return res.status(200).json(customers);
})

app.get('/v1/api/balance', verifyIfExistsAccountCPF, (req, res)=>{
  const {customer} = req;

  const balance = getBalance(customer.statement);

  return res.json(balance);
})
app.listen(8000)
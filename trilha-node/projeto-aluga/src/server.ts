import express  from 'express';

const app = express();
app.use(express.json()); 

app.get('/', (req, res)=>{
  return res.json({message: 'Hello World!'})
})

app.post('/courses', (req, res)=>{
  const {name} = req.body;

  return res.status(201).json({name})
})

app.listen(3000, ()=>{
  console.log('listening on port 3000')
});
import express from "express";
import {createCourse} from './routes';
const app = express();

app.get('/', (req, res) =>{
  return res.json({message: 'Hello World!'});
})

app.get('/course', createCourse);

app.listen(3000);



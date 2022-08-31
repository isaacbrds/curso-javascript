const express = require('express');

const app = express();

app.get('/cursos', (req, res) => {
  return res.json([
    'Curso 1',
    'Curso 2',
    'Curso 3'
  ])
});

app.post('/cursos', (req, res) => {
  return res.json([
    'Curso 1',
    'Curso 2',
    'Curso 3',
    'Curso 4'
  ])
});

app.put('/cursos/:id', (req, res) => {
  return res.json(['Curso 6', 'Curso 2',
  'Curso 3',
  'Curso 4'])
})

app.patch('/cursos/:id', (req, res) => {
  return res.json(['Curso 6', 'Curso 7',
  'Curso 3',
  'Curso 4'])
})


app.delete('/cursos/:id', (req, res) => {
  return res.json(['Curso 6', 'Curso 7', 'Curso 3'])
})

app.listen(8000);
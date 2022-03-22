const express = require('express')
const logger = require('./loggerMiddleware')
const cors = require('cors')

let notes = [
  {
    id: 1,
    name: 'daniel',
    age: 37
  },
  {
    id: 2,
    name: 'sandra',
    age: 35
  }
]

const app = express()
app.use(express.json())
app.use(cors())

app.use(logger)

app.get('/', (request, response) => {
  response.send('<h1>HOLA MUNDO</H1>')
})

app.get('/api/notes', (req, res) => {
  res.json(notes)
})

app.get('/api/notes/:id', (req, res) => {
  const id = Number(req.params.id)
  const note = notes.find(note => note.id === id)
  if (note) {
    res.json(note)
  } else {
    res.status(404).end()
  }
})

app.delete('/api/notes/:id', (req, res) => {
  const id = Number(req.params.id)
  notes = notes.filter(note => note.id !== id)
  res.status(204).end() // contenido vacío
})

app.post('/api/notes', (req, res) => {
  const note = req.body
  if (!note.name) {
    return res.status(400).json({
      error: 'no se envió el objeto que querían crear'
    })
  }
  const ids = notes.map(note => note.id)
  const maxId = Math.max(...ids)
  const newNote = {
    id: maxId + 1,
    name: note.name,
    age: note.age || 0
  }
  notes = [...notes, newNote]
  res.status(201).json(newNote)
})

app.use((req, res, next) => {
  res.status(404).json({
    error: 'Not found'
  })
})

const PORT = 3001

app.listen(PORT, () => {
  console.log(`servidor corriendo en puerto ${PORT}`)
})

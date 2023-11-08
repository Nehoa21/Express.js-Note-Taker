// require 
const express = require('express');
const path = require('path');
const { readFromFile, writeToFile, readAndAppend } = require('./utils.js');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');

const PORT = process.env.PORT || 3001;
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static('public'));

// GET route to index.html
app.get('/', (req, res) => 
    res.sendFile(path.join(__dirname, 'public/index.html'))
);

// GET route to notes.html
app.get('/notes', (req, res) => 
    res.sendFile(path.join(__dirname, 'public/notes.html'))
);

// GET route to show notes given to db.json file
app.get('/api/notes', (req, res) => 
    fs.readFile('db/db.json', 'utf-8', (err, data) => {
        const notesJson = JSON.parse(data);
        console.log(notesJson);
        res.json(notesJson);
    })
);

// POST route to add new note to db.json file received from user input
app.post('/api/notes', (req, res) => {
    const { title, text } = req.body;

    if (req.body) {
        const newNote = {
            title: title,
            text: text,
            id: uuidv4()
        };
        readAndAppend(newNote, 'db/db.json');
        res.json('Note added!')
    } else {
        res.error('Error in adding note');
    }
});

// DELETE route, reads note from db.json file to be deleted, deletes, rewrites updated db.json file
app.delete('/api/notes/:id', (req, res) => {
    const id = req.params.id;
    readFromFile('./db/db.json')
      .then((data) => JSON.parse(data))
      .then((json) => {
        const result = json.filter((note) => note.id !== id);
        writeToFile('db/db.json', result);
        res.json(`Deleted note ${id}.`);
      });
});

app.listen(PORT, () => console.log(`App listening on port ${PORT}!`));
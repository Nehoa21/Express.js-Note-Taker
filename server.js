const express = require('express');
const path = require('path');
const { readFromFile, writeToFile, readAndAppend } = require('./utils');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');
const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static('public'));

// route to index.html
app.get('*', (req, res) => 
    res.sendFile(path.join(__dirname, '/public/index.html'))
);

// route to notes.html
app.get('/notes', (req, res) => 
    res.sendFile(path.join(__dirname, '/public/notes.html'))
);


app.get('/api/notes', (req, res) => 
    fs.readFile('db/db.json', 'utf-8', (err, data) => {
        const notesJson = JSON.parse(data);
        res.json(notesJson);
    })
);

app.post('/api/notes', (req, res) => {
    const { title, text } = req.body;

    if (req.body) {
        const newNote = {
            title,
            text,
            id: uuidv4()
        };
        readAndAppend(newNote, 'db/db.json');
        res.json('Note added!')
    } else {
        res.error('Error in adding note');
    }
});


app.delete('/:id', (req, res) => {
    const noteId = req.params.id;
    readFromFile('./db/tips.json')
      .then((data) => JSON.parse(data))
      .then((json) => {
        // Make a new array of all tips except the one with the ID provided in the URL
        const result = json.filter((tip) => tip.tip_id !== tipId);
  
        // Save that array to the filesystem
        writeToFile('./db/tips.json', result);
  
        // Respond to the DELETE request
        res.json(`Item ${tipId} has been deleted 🗑️`);
      });
  });

app.listen(PORT, () => console.log(`App listening on port ${PORT}!`));
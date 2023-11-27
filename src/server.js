const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const port = 3001;

const folderPath = path.join(__dirname, 'files'); // Specify the folder path

// Middleware for parsing JSON data
app.use(express.json());

// Create endpoint to create a text file with the current timestamp (POST request)
app.post('/createFile', (req, res) => {
  const currentDate = new Date();
  const fileName = `${currentDate.toISOString().replace(/[:.]/g, '-')}.txt`;
  const filePath = path.join(folderPath, fileName);
  const fileContent = currentDate.toString();

  fs.writeFile(filePath, fileContent, (err) => {
    if (err) {
      console.error(err);
      res.status(500).send('Internal Server Error');
    } else {
      res.status(201).send('File created successfully');
    }
  });
});

// Create endpoint to retrieve all text files in the folder (GET request)
app.get('/getAllFiles', (req, res) => {
  fs.readdir(folderPath, (err, files) => {
    if (err) {
      console.error(err);
      res.status(500).send('Internal Server Error');
    } else {
      const textFiles = files.filter(file => file.endsWith('.txt'));
      res.json({ files: textFiles });
    }
  });
});
// Handle requests to the root URL (GET request)
app.get('/', (req, res) => {
  res.send('Hello, this is your server!');
});
// Handle unsupported HTTP methods
app.all('/createFile', (req, res) => {
  res.status(405).send('Method Not Allowed');
});
app.all('/getAllFiles', (req, res) => {
  res.status(405).send('Method Not Allowed');
});
app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});

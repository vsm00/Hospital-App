const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');

const app = express();
const PORT = 3000;

app.use(bodyParser.json());

const jsonFilePath = 'hospitalData.json';

// Read hospital data from JSON file
const readData = () => {
  try {
    const data = fs.readFileSync(jsonFilePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading data from JSON file:', error.message);
    return [];
  }
};

// Write hospital data to JSON file
const writeData = (data) => {
  try {
    fs.writeFileSync(jsonFilePath, JSON.stringify(data, null, 2), 'utf8');
  } catch (error) {
    console.error('Error writing data to JSON file:', error.message);
  }
};

// Get all hospitals
app.get('/hospitals', (req, res) => {
  const hospitals = readData();
  res.json(hospitals);
});

// Get a specific hospital by name
app.get('/hospitals/:name', (req, res) => {
  const hospitals = readData();
  const hospital = hospitals.find((h) => h.name === req.params.name);

  if (hospital) {
    res.json(hospital);
  } else {
    res.status(404).json({ error: 'Hospital not found' });
  }
});

// Add a new hospital
app.post('/hospitals', (req, res) => {
  const hospitals = readData();
  const newHospital = req.body;

  hospitals.push(newHospital);
  writeData(hospitals);

  res.json(newHospital);
});

// Update a hospital by name
app.put('/hospitals/:name', (req, res) => {
  const hospitals = readData();
  const updatedHospital = req.body;
  const index = hospitals.findIndex((h) => h.name === req.params.name);

  if (index !== -1) {
    hospitals[index] = updatedHospital;
    writeData(hospitals);
    res.json(updatedHospital);
  } else {
    res.status(404).json({ error: 'Hospital not found' });
  }
});

// Delete a hospital by name
app.delete('/hospitals/:name', (req, res) => {
  const hospitals = readData();
  const index = hospitals.findIndex((h) => h.name === req.params.name);

  if (index !== -1) {
    const deletedHospital = hospitals.splice(index, 1)[0];
    writeData(hospitals);
    res.json(deletedHospital);
  } else {
    res.status(404).json({ error: 'Hospital not found' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

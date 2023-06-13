const express = require('express');
const mysql = require('mysql2');
const dotenv = require('dotenv');

dotenv.config();

const app = express();

// Create MySQL connection
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'hellen2003',
  database: 'cars'
});



// Connect to the database
connection.connect(err => {
  if (err) {
    console.error('Error connecting to the database:', err);
    return;
  }
  console.log('Connected to the database!');
});

// Define a route to fetch all cars
app.get('/api/cars', (req, res) => {
  // Query the database
  const query = 'SELECT * FROM car_details';
  connection.query(query, (err, rows) => {
    if (err) {
      console.error('Error executing the query:', err);
      res.status(500).json({ error: 'Error executing the query' });
      return;
    }

    // Send the fetched data as the response
    res.json(rows);
  });
});

// Define a route to fetch a single car by ID
app.get('/api/cars/:id', (req, res) => {
  const carId = req.params.id;

  // Query the database
  const query = 'SELECT * FROM car_details WHERE id = ?';
  connection.query(query, [carId], (err, rows) => {
    if (err) {
      console.error('Error executing the query:', err);
      res.status(500).json({ error: 'Error executing the query' });
      return;
    }

    // If no car is found with the given ID
    if (rows.length === 0) {
      res.status(404).json({ error: 'Car not found' });
      return;
    }

    // Send the fetched data as the response
    res.json(rows[0]);
  });
});

// Start the server
app.listen(3003, () => {
  console.log('Server is listening on port 3003');
});

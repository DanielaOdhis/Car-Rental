const express = require('express');
const mysql = require('mysql2');
const dotenv = require('dotenv');
const cors = require('cors');

dotenv.config();

const app = express();

app.use(cors({
  origin: 'http://localhost:3000'
}));

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'hellen2003',
  database: 'cars'
});

connection.connect(err => {
  if (err) {
    console.error('Error connecting to the database:', err);
    return;
  }
  console.log('Connected to the database!');
});

app.get('/api', (req, res) => {
  res.send('From Server');
});

app.post('/api/signup', (req, res) => {
    const { username, email, password, firstName, lastName, phoneNumber } = req.body;
    const hashedPassword = password;
    const query = 'INSERT INTO users (username, email, password, firstName, lastName, phoneNumber) VALUES (?, ?, ?, ?, ?, ?)';
    connection.query(query, [username, email, hashedPassword, firstName, lastName, phoneNumber], (err, result) => {
      if (err) {
        console.error('Error saving user to database:', err);
        res.status(500).json({ error: 'Error saving user to database' });
        return;
      }
      res.json({ message: 'User registration successful' });
    });
  });

  /*app.get('/login', (req, res) => {
    res.status(405).json({ error: 'Method not allowed' });
  });*/

  app.post('/api/login', (req, res) => {
    const { email, password } = req.body;
    const query = 'SELECT * FROM users WHERE email=? AND password=?';
    connection.query(query, [email, password], (err, result) => {
      if (err) {
        console.error('Error fetching user from database:', err);
        res.status(500).json({ error: 'Error fetching user from database' });
        return;
      }
      if (result.length === 0) {
        res.status(401).json({ error: 'Invalid credentials' });
        return;
      }
      res.json({ message: 'Login successful' });
    });
  });


app.listen(3004, () => {
    console.log('Server is listening on port 3004');
  });

const express = require('express');
const mysql = require('mysql2');
const dotenv = require('dotenv');
const cors = require('cors');
const bodyParser = require('body-parser');

dotenv.config();

const app = express();
app.use(bodyParser.json());
app.use(cors({
  origin: 'http://localhost:3000'
}));

app.use(express.json());

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
  console.log('Signup data:', req.body);
  const query = 'INSERT INTO users (username, email, password, firstName, lastName, phoneNumber) VALUES (?, ?, ?, ?, ?, ?)';
  connection.query(query, [username, email, password, firstName, lastName, phoneNumber], (err, result) => {
    if (err) {
      console.error('Error saving user to database:', err);
      res.status(500).json({ error: 'Error saving user to database' });
      return;
    }
    res.json({ message: 'User registration successful' });
  });
});

app.post('/api/login', (req, res) => {
  const { email, password } = req.body;
  const query = 'SELECT * FROM users WHERE email = ?';
  connection.query(query, [email], (err, result) => {
    if (err) {
      console.error('Error fetching user from database:', err);
      res.status(500).json({ error: 'Error fetching user from database' });
      return;
    }
    if (result.length === 0) {
      res.status(401).json({ error: 'Invalid credentials' });
      return;
    }
    const user = result[0];
    if (user.password !== String(password)) { // Convert password to a string for comparison
      res.status(401).json({ error: 'Invalid credentials' });
      return;
    }
    res.json({ message: 'Login successful' });
  });
});

app.delete('/api/deleteAccount/:email', (req, res) => {
  const email = req.params.email;
  const query = 'DELETE FROM users WHERE email = ?';
  connection.query(query, email , (err, result) => {
    if (err) {
      console.error('Error deleting user account from the database:', err);
      res.status(500).json({ error: 'Error deleting user account from the database' });
      return;
    }
    res.json({ message: 'User account deleted successfully' });
  });
});

app.get('/api/userDetails', (req, res) => {
  const query = 'SELECT * FROM users';
  connection.query(query, (err, rows) => {
    if (err) {
      console.error('Error executing the query:', err);
      res.status(500).json({ error: 'Error executing the query' });
      return;
    }
    res.json(rows);
  });
});

app.get('/api/userDetails/:email', (req, res) => {
  const userId = req.params.email;
  const query = 'SELECT username,email,password,firstName,lastName,phoneNumber FROM users where email=?';
  connection.query(query, [userId], (err, result) => {
    if (err) {
      console.error('Error fetching user details from the database:', err);
      res.status(500).json({ error: 'Error fetching user details from the database' });
      return;
    }
    if (result.length === 0) {
      res.status(404).json({ error: 'User not found' });
      return;
    }
    const userDetails = result[0];
    res.json(userDetails);
  });
});


app.listen(3004, () => {
  console.log('Server is listening on port 3004');
});

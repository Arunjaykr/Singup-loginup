// server.js
const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

const app = express();
const port = 3001;

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public')); // Serve static files from the 'public' directory

// Route to render the signup page
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'signup.html'));
});

// Route to render the login page
app.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

// Route to handle signup form submission
app.post('/signup', (req, res) => {
  const { username, password, name, gender, email } = req.body;

  // Store user data in a file
  const userData = `Name: ${name}, Gender: ${gender}, Email: ${email}, Username: ${username}, Password: ${password}\n`;
  fs.appendFile(path.join(__dirname, 'users.txt'), userData, (err) => {
    if (err) {
      console.error('Error writing to file:', err);
      res.status(500).send('Error saving user data.');
    } else {
      res.send('<h1>Signup successful!</h1><a href="/login">Go to Login Page</a>');
    }
  });
});

// Route to handle login form submission
app.post('/login', (req, res) => {
  const { username, password } = req.body;

  // Read the user data from the file
  fs.readFile(path.join(__dirname, 'users.txt'), 'utf8', (err, data) => {
    if (err) {
      console.error('Error reading file:', err);
      res.status(500).send('Error reading user data.');
      return;
    }

    const users = data.split('\n').map(line => {
      const [nameField, genderField, emailField, usernameField, passwordField] = line.split(', ');
      return {
        username: usernameField?.split(': ')[1],
        password: passwordField?.split(': ')[1]
      };
    });

    const user = users.find(user => user.username === username && user.password === password);

    if (user) {
      res.send(`<h1>Login successful! Welcome, ${username}!</h1>`);
    } else {
      res.send('<h1>Login failed. Invalid username or password.</h1><a href="/login">Try again</a>');
    }
  });
});

// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
});

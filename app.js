const express = require('express');
const fs = require('fs');
const bodyParser = require('body-parser');
const cors = require('cors'); // ✅ Import CORS

const app = express();
const PORT = 3000;

// ✅ Enable CORS for all routes
app.use(cors());

// Middleware to parse JSON in POST bodies
app.use(bodyParser.json());

// Route: /
app.get('/', (req, res) => {
  res.send('<p>Hello, World!</p>');
});

// Route: /privacy_policy
app.get('/privacy_policy', (req, res) => {
  fs.readFile('./privacy_policy.html', 'utf8', (err, data) => {
    if (err) {
      return res.status(500).send('Error loading privacy policy.');
    }
    res.send(data);
  });
});

// Route: /webhook for GET and POST
app.all('/webhook', (req, res) => {
  if (req.method === 'POST') {
    try {
      console.log(JSON.stringify(req.body, null, 4));
    } catch (err) {
      console.error('Error parsing JSON:', err);
    }
    return res.send('<p>This is POST Request, Hello Webhook!</p>');
  }

  if (req.method === 'GET') {
    const hubMode = req.query['hub.mode'];
    const hubChallenge = req.query['hub.challenge'];
    const hubVerifyToken = req.query['hub.verify_token'];

    console.log(req)

    if (hubChallenge) {
      return res.send(hubChallenge);
    } else {
      return res.status(403).send('Verification failed');
    }
  }

  res.send('<p>Unknown method</p>');
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});

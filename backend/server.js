// Use env file
require('dotenv').config(); 
const express = require('express');
const app = express();
app.listen(3000, () => {
  console.log('Server has started! Open http://localhost:3000');
});

app.get('', async (req, res) => {
  res.send('Hello World!');
});

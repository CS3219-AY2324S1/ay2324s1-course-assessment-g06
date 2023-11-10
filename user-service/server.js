const express = require('express');
const cors = require('cors');

const app = express();

app.use(cors());

// parse requests of content-type - application/json
app.use(express.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

// database
const db = require('./models');

db.sequelize.sync();

// force: true will drop the table if it already exists
// db.sequelize.sync({force: true}).then(() => {
//   console.log('Drop and Resync Database with { force: true }');
//   initial();
// });

// Default route to see if server works
app.get('/', (req, res) => {
  res.json({ message: 'Hello World' });
});

// routes
require('./routes/auth.routes')(app);
require('./routes/history.routes')(app);

// set port, listen for requests
const PORT = process.env.USR_SVC_PORT || 3003;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});



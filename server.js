const express = require('express');
const bodyParser = require('body-parser');
const cron = require('node-cron');
const { exec } = require('child_process');
const app = express();
const dbConnect = require("./mongodb");
const api1  = require('./app');
const api2 = require('./selenium-worker');
const api3 = require('./cpe_to_cve');

// Set up middleware to parse incoming request bodies
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
// Define an array to hold the data from each federated source
let federatedData = [];

// Route to receive data from a federated source
// Route to receive data from a federated source
// Route to receive data from a federated source
app.post('/federate', (req, res) => {
    const newData = req.body;
  
    // Add the new data to the federatedData array
    federatedData.push(newData);
  
    res.status(200).send('Data received');
  
    // Insert the new data into the database
    const insert = async () => {
      try {
        // Connect to MongoDB
        const db = await dbConnect();
  
        // Insert the received data into the database
        const result = await db.collection('data').insertOne(newData);
        if (result.acknowledged) {
          console.log("Data inserted successfully");
        }
      } catch (error) {
        console.error(`Error inserting data into database: ${error}`);
      }
    };
  
    insert();
  });
  


// Route to retrieve all federated data

  


// Schedule a task to run every day at midnight
cron.schedule('0 0 * * *', () => {
  // Run a command using child_process.exec
  exec('your-command-here', (error, stdout, stderr) => {
    if (error) {
      console.error(`exec error: ${error}`);
      return;
    }
    console.log(`stdout: ${stdout}`);
    console.error(`stderr: ${stderr}`);
  });
});

// Start the server
app.listen(3000, () => {
  console.log('Server started on port 3000');
});

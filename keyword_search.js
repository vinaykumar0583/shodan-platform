const express = require('express');
const axios = require('axios');
const bodyParser = require('body-parser');
const app = express();

app.use(bodyParser.json());
// Endpoint for GET requests
let cve = [];
app.post('/nvd/:keyword/:version', async (req, res) => {
    try {
      const appId = req.body;
      if(cve==false){
     cve.push(appId);
      }
    // Construct the API URL with the provided keyword
   
    const url = `https://services.nvd.nist.gov/rest/json/cpes/2.0/?keywordSearch=${req.params.keyword} ${req.params.version}`;
    
    // Make the API request using Axios
    const response = await axios.get(url);
   

    // Return the response data to the client
    res.json(response.data);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error retrieving data from NVD');
  }
});

// Start the server
const PORT = process.env.PORT || 6000;
app.listen(PORT, () => console.log(`Keyword search Server listening on port ${PORT}`));

module.exports = {
  cve,
 };
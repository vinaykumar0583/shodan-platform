const express = require('express');
const axios = require('axios');
const {cve} = require('./keyword_search');
const dbConnect = require("./mongodb2");

const app = express();
const port = 7000;
app.get('/nvd-data/:cpe', async (req, res) => {
  
  const apiUrl=`https://services.nvd.nist.gov/rest/json/cves/2.0?cpeName=${req.params.cpe}`;
  try{
    const response=await axios.get(apiUrl);
    cve.push(response.data);
    if(cve[1].vulnerabilities[0]){
        const newData = {
       "appId" :  cve[0].appId,
       "cveId" : cve[1].vulnerabilities[0].cve.id,
       "published":  cve[1].vulnerabilities[0].cve.published,
       "descriptions": cve[1].vulnerabilities[0].cve.descriptions[0].value
     }
     const insert = async () => {
      const db = await dbConnect();
      const result = await db.insertOne(newData);
      if (result.acknowledged) {
        console.log("data insert successfully");
      }
    };
    insert();
    }else{
      const insert = async () => {
        const db = await dbConnect();
        const result = await db.insertOne({
          "appId": cve[0].appId,
          "descriptions":"No vulnerabilities" });
        if (result.acknowledged) {
          console.log("data insert successfully");
        }
      };
      insert();
    }
   
    
    res.json(cve);
  }
  catch(error){
    console.error(error);
    res.status(500).send("There is some error");
  }  
});


app.listen(port, () => {
  console.log(`NVD API listening at http://localhost:${port}`);
});
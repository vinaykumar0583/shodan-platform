const express = require('express');
const { runNmapWorker } = require('./nmap-Worker');
const dbConnect = require("./mongodb");



const app = express();
const port = 4000;

app.use(express.json());

app.post('/api/nmap', (req, res) => {
  const { target } = req.body;
  runNmapWorker(target, (err, rest) => {
    if (err) {
      res.status(500).send(err.message);
    } else {
      res.send(rest);
      const insert = async () => {
        const db = await dbConnect();
        const result = await db.insertOne(rest);
        if (result.acknowledged) {
          console.log("data insert");
        }
      };
      insert();
    }
  })
});





app.listen(port, () => {
  console.log(`Nmap Server running at http://localhost:${port}`);
});










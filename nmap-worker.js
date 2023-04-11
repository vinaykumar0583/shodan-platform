// const { exec } = require('child_process');

// function runNmapWorker(target, callback) {
//   exec(`nmap -sS -sV -T4 ${target} -oX nmap_results.xml`, (err, stdout, stderr) => {
//     if (err) {
//       callback(err)
//     } else {
//       exec('shodan search nmap -f nmap_results.xml', (err, stdout, stderr) => {
//         if (err) {
//           callback(err);
//         } else {
//           callback(null, stdout);
//         }
//       });
//     }
//   });
// }

const { exec } = require('child_process');
const xml2js = require('xml2js');

function runNmapWorker(target, callback) {
  exec(`nmap -T5 --open   -oX - ${target}`, (err, stdout, stderr) => {
    if (err) {
      callback(err);
    } else {
      const results = parseNmapXml(stdout);
      callback(null, results);
    }
  });
}

function parseNmapXml(xml) {
  let results = {};
  xml2js.parseString(xml, (err, result) => {
    if (err) {
      console.error(`Error parsing Nmap XML output: ${err}`);
      return;
    }
    // extract relevant data from the XML object
    const host = result.nmaprun.host[0];
    const hostname = host.hostnames[0].hostname[0].$.name;
    const addresses = host.address;
    const ports = host.ports[0].port;

    // create an object to store the results
    results = {
      hostname,
      addresses: addresses.map(addr => addr.$.addr),
      openPorts: ports.filter(port => port.state[0].$.state === 'open').map(port => ({
        port: port.$.portid,
        protocol: port.$.protocol,
        service: port.service[0].$.name,
      })),
    };
  });
  return results;
}

module.exports = {
  runNmapWorker,
}; 

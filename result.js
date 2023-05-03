const fs = require('fs');
const https = require('https');
const querystring = require('querystring');

let payload = JSON.parse(fs.readFileSync(process.env.INPUT_PAYLOAD, 'utf8'));
let result = JSON.parse(fs.readFileSync(process.env.INPUT_RESULT, 'utf8'));

let body = querystring.stringify(result);

let parsedURL = new URL(payload.server.url);
const options = {
  hostname: parsedURL.host,
  path: payload.server.endpoint,
  headers: {
    'Authorization': `token ${process.env.SERVICE_CATALOG_TOKEN}`,
    'Content-Type': 'application/x-www-form-urlencoded',
    'Content-Length': body.length,
    'User-Agent': 'actions/health-check-result'
  },
  method: 'PATCH'
}

const req = https.request(options, (res) => {
  res.on('data', (data) => {
    console.log(`Got a response ${res.statusCode} from the server.`)
    if (res.statusCode != 200) {
      let parsed = JSON.parse(data);
      
      console.log(`Error: ${parsed.message}`);
      process.exit(1);
    } else {
      console.log('Posted successfully.');
      process.exit(0);
    }
  })
})

req.write(body);

req.on('error', (error) => {
  console.log(`HTTP Error: ${error}`)
  process.exit(1)
})

req.end();
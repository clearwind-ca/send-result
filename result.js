const fs = require('fs');
const https = require('https');
const querystring = require('querystring');

let parsedPayloadFile = false;
let payload = {};

if (process.env.INPUT_PAYLOAD_FILE) {
  console.log(`Reading ${process.env.INPUT_PAYLOAD_FILE}`)
  if (fs.existsSync(process.env.INPUT_PAYLOAD_FILE)) {
    payload = JSON.parse(fs.readFileSync(process.env.INPUT_PAYLOAD_FILE, 'utf8'));
    parsedPayloadFile = true;
  }
}

if (!parsedPayloadFile) {
  console.log(`Using individual payload input.`);
  payload = Buffer.from(process.env.INPUT_PAYLOAD, 'base64').toString('utf-8');
  payload = JSON.parse(payload);
}

let parsedResultFile = false;
let result = {};

if (process.env.INPUT_RESULT_FILE) {
  console.log(`Reading ${process.env.INPUT_RESULT_FILE}`)
  if (fs.existsSync(process.env.INPUT_RESULT_FILE)) {
    result = JSON.parse(fs.readFileSync(process.env.INPUT_RESULT_FILE, 'utf8'));
    parsedResultFile = true;
  }
}

if (!parsedResultFile) {
  console.log(`Using individual inputs.`);
  result = {
    "result": process.env.INPUT_RESULT,
    "message": process.env.INPUT_MESSAGE,
  }
}

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
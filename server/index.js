const express = require('express');
const https = require("https");
const fs = require('fs');
const path = require('path')
const cors = require('cors')

const app = express();
app.use(cors())
app.use(express.json({ limit: '20mb' }));

// Read SSL certificate and private key
const options = {
    key: fs.readFileSync(path.join(__dirname, "localhost-key.pem")),
    cert: fs.readFileSync(path.join(__dirname, "localhost.pem")),
}

const server = https.createServer(options, app)

// Store data here
let icecandidate = {}
let desc = {}

app.get('/clear', (req, res) => {
    icecandidate = {}
    desc = {}
    res.send('success')
})

// get signals
app.get('/signals', (req, res) => {
    res.json({
        icecandidate,
        desc
    })
})

// set ice
app.post('/icecandidate', (req, res) => {
    const { ice, to } = req.body

    if(icecandidate[to]) {
        icecandidate[to].push(ice)
    } else {
        icecandidate[to] = [ice]
    }

    res.send('success')
})

// get ice
app.get('/icecandidate', (req, res) => {
    const { id } = req.query
    res.json(icecandidate[id])
})

// set description
app.post('/description', (req, res) => {
    const { description, to } = req.body
    desc[to] = description

    res.send('success')
})

// get description
app.get('/description', (req, res) => {
    const { id } = req.query
    res.json(desc[id])
})


const PORT = 4000;
server.listen(PORT, () => {
    console.log(`UPD: Server is running on port ${PORT}`);
});

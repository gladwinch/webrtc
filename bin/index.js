const express = require('express');
const https = require("https");
const socketIo = require('socket.io');
const fs = require('fs');
const path = require('path')

const app = express();

// Read SSL certificate and private key
const options = {
    key: fs.readFileSync(path.join(__dirname, "localhost-key.pem")),
    cert: fs.readFileSync(path.join(__dirname, "localhost.pem")),
}

const server = https.createServer(options, app);
const io = socketIo(server, {
    cors: {
        origin: "https://a5aa-106-202-227-50.ngrok-free.app",
    }
})

// Store the offers and answers
let offers = {};
let answers = {};
let iceCandidates = {};

app.post('/offer', (req, res) => {
    const { offer, id } = req.body;
    offers[id] = offer;
    res.status(200).send({ message: 'Offer received' });
});

app.post('/answer', (req, res) => {
    const { answer, id } = req.body;
    answers[id] = answer;
    res.status(200).send({ message: 'Answer received' });
});

app.post('/candidate', (req, res) => {
    const { candidate, id } = req.body;
    if (!iceCandidates[id]) {
        iceCandidates[id] = [];
    }
    iceCandidates[id].push(candidate);
    res.status(200).send({ message: 'Candidate received' });
});

app.get('/offer/:id', (req, res) => {
    res.status(200).send(offers[req.params.id] || {});
});

app.get('/answer/:id', (req, res) => {
    res.status(200).send(answers[req.params.id] || {});
});

app.get('/candidates/:id', (req, res) => {
    res.status(200).send(iceCandidates[req.params.id] || []);
});

// io.on('connection', (socket) => {
//   console.log('A user connected: ' + socket.id);

//   // Relay signal data between clients
//   socket.on('signal', (data) => {
//     console.log('Signaling message received', data);
//     socket.broadcast.emit('signal', data);
//   });
// });

const PORT = 3000;
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

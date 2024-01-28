const express = require('express');
const https = require('https');
const socketIo = require('socket.io');
const fs = require('fs')
const path = require('path')

const app = express();

const options = {
    key: fs.readFileSync(path.join(__dirname, "localhost-key.pem")),
    cert: fs.readFileSync(path.join(__dirname, "localhost.pem")),
}

const server = https.createServer(options, app)

// Add CORS configuration to the Socket.IO server initialization
const io = socketIo(server, {
  cors: {
    origin: "https://192.168.1.10:3000", // Specify allowed origin(s) here, or use "*" for allowing all origins
    methods: ["GET", "POST"], // Allowed HTTP request methods
    allowedHeaders: ["my-custom-header"], // Optional: Custom headers that you want to allow
    credentials: true // Optional: Indicates whether or not response to the request can be exposed when the credentials flag is true
  }
});

// Serve static files from a specified directory (e.g., 'public')
// app.use(express.static('public'));

app.get('/ping', (req, res) => {
    res.send('pong from server')
})

io.on('connection', (socket) => {
  console.log('A user connected: ' + socket.id);

  // Relay signal data between clients
  socket.on('signal', (data) => {
    console.log('Signaling message received', data);
    socket.broadcast.emit('signal', data);
  });
});

const PORT = 4000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

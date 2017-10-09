const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const sticky = require('sticky-session');
const http = require('http');
const socket = require('socket.io');
const path = require('path');
const mongoose = require('mongoose');
const redis = require('socket.io-redis');
const cluster = require('cluster');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use((req, res, next) => {
  const host = req.headers.host;
  const worker = cluster.worker.id;
  console.log(`Request received. HOST[${host}], WORKER[${worker}]`);
  next();
});

app.get([ '/rooma', '/roomb' ], (req, res) => {
  return res.sendFile(path.join(__dirname, 'public/index.html'));
});

const Message = mongoose.model('Message', { room: String, message: String });

const server = http.createServer(app);
const io = socket(server);

io.adapter(redis({ host: 'redis', port: '6379' }));
io.on('connection', (socket) => {
  socket.on('room', (room) => {
    socket.join(room);
  });
});

const keys = { 
  rooma: 'roomb',
  roomb: 'rooma'
};

app.post('/message', (req, res) => {
  const { message, room } = req.body;
  (new Message({ room, message }))
    .save((err) => {
      io.to(keys[room])
        .emit('message', JSON.stringify({ message }));
      res.sendStatus(201);
    });
});

app.get('/messages', (req, res) => {
  Message.find({})
    .exec((err, documents) => {
      res.status(200)
        .send(documents);
    });
});

app.get('/status', (req, res) => {
  res.sendStatus(200);
});

if (!sticky.listen(server, 3000)) {
  server.once('listening', () => {
    console.log(`Server started on port: 3000`);
  });
} else {
  mongoose.connect('mongodb://mongo:27017/db', { useMongoClient: true });
  const db = mongoose.connection;
  db.once('open', function() {
    console.log('Connected to MongoDB');
  });
}
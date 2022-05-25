const path = require('path');
const express = require('express')
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);

app.use(express.static(__dirname + '/client/'));
app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname, '/client/index.html'))
})

io.sockets.on('connect', function (socket) {
    socket.userData = { x: 0, y: 0, z: 0, heading: 0 };//Default values;

    console.log(`${socket.id} connected`);
    socket.emit('setId', { id: socket.id });

    socket.on('disconnect', function () {
        console.log("disconeeeeeect", socket.id)
        socket.broadcast.emit('deletePlayer', socket.id);
    });

    socket.on('init', function (data) {
        console.log(`socket.init ${data}`);
        socket.userData.x = data.x;
        socket.userData.y = data.y;
        socket.userData.z = data.z;
        socket.userData.heading = data.h;
        socket.userData.pb = data.pb;
        socket.userData.action = data.action;
    });

    socket.on('update', function (data) {
        socket.userData.x = data.x;
        socket.userData.y = data.y;
        socket.userData.z = data.z;
        socket.userData.heading = data.h;
        socket.userData.pb = data.pb;
        socket.userData.action = data.action;
    });

    socket.on('error', function (err) {
        if (err.description) throw err.description;
        else throw err; // Or whatever you want to do
    });


});


http.listen(3000, function () {
    console.log("Listenting on port 3000")
})

setInterval(function () {
    let pack = [];
    for (const [_, socket] of io.of("/").sockets) {
        pack.push({
            id: socket.id,
            x: socket.userData.x,
            y: socket.userData.y,
            z: socket.userData.z,
            heading: socket.userData.heading,
            pb: socket.userData.pb,
            action: socket.userData.action
        });
    }
    if (pack.length > 0) {
        io.emit('remoteData', pack);
    }
}, 40);
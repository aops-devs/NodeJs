var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var fs = require('fs');
var port = process.env.PORT || 8001;

app.get('/', function(req,res){
    res.sendFile(__dirname + '/chat.html');
});

// Variables for User, Username and Database of Current Users
var userNo = 0;
var userName = '';
var userInfo = [];

// On connection, do the actions below. 
// Also, inside it are events that are to be done once action is done on the HTML Side (client)
io.on('connection', function(socket){
    var dateNow = new Date();
    userNo = userNo + 1;
    userName = 'user' + userNo;
    userInfo.push({id: socket.id, user: userName});
    var alertMsg = 'Alert Message: ' + userName + ' Joined!';

    console.log(userName + ' connected.');
    io.to(socket.id).emit('alert', alertMsg);

    socket.on('chat message', function(msg){
        for (var i = 0; i < userInfo.length; i++) {
            if (socket.id == userInfo[i].id) {
                msg =  ' [' + userInfo[i].user + '] : ' + msg;
                break;
            }
        }
        console.log('[' + dateNow.toISOString() + '] Message from' + msg);
        io.emit('chat message', msg); // send the message to everyone
    });

    socket.on('disconnect', function(){
        console.log(userName + ' disconnected.');
    });
});

http.listen(8001, function(){
    console.log('listening on %d', port);
});
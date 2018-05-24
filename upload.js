var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var fs = require('fs');
var port = process.env.PORT || 8099;
var msg = 'Upload Complete!';

app.get('/', function(req,res){
    res.sendFile(__dirname + '/upload.html');
});

io.on('connection', function(socket){

    console.log('User connected');
	
    /* socket.on('connect', function(alertMsg){
        io.emit('alert', alertMsg);
    }); */

	socket.on('upload', function(File){
	
	var readerStream = fs.createReadStream(File);
	var writerStream = fs.createWriteStream('output.txt');
	var data = '';
	
	readerStream.setEncoding('UTF8');
	
	readerStream.on('data', function(chunk) {
    data += chunk;
	});
	
	readerStream.on('end',function(){
		writerStream.write(data,'UTF8');
		writerStream.end();
		writerStream.on('finish', function() {
			io.emit('alert', msg);
			console.log("Write completed.");
		});
		writerStream.on('error', function(err){
			console.log(err.stack);
		});
	});
	
	readerStream.on('error', function(err){
		console.log(err.stack);
	});
	});
	

    socket.on('disconnect', function(){
        console.log('User disconnected.');
    });
	});

http.listen(8099, function(){
    console.log('listening on %d', port);
});
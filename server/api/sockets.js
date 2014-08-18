module.exports.addSocket = function (io) {

  io.on('connection', function(socket) {
    console.log('a new user has connected');

    socket.on('message', function(message) {
      message = { body: message, time: Date.now() };
      io.emit('message:new', message);
    });

  });

};

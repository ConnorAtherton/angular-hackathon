module.exports.addSocket = function (io) {

  io.on('connection', function(socket) {

    socket.on('message', function(message) {
      message = { body: message, time: Date.now() };
      io.emit('message:new', message);
    });

  });

};

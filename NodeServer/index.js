//Node server that will handle our socket.io connections
const io=require('socket.io')(8000)

const users={};

io.on('connection', socket =>{
    //If any new user joins, let other users connected to the server know
    socket.on('new-user-joined', name =>{
        console.log("New user has entered the chat : ", name)
        users[socket.id] = name;
        socket.broadcast.emit('user-joined', name);
    });

    //If someone sends a message, broadcast the message to everyone in the chat
    socket.on('send', message =>{
        socket.broadcast.emit('receive', {message: message, name: users[socket.id]})
    });

    //If someone leaves the chat, let everyone else in the chat know
    socket.on('disconnect', message =>{                 //disconnect is a built-in event in socket.io programming
        socket.broadcast.emit('left', users[socket.id]);
        delete users[socket.id]
    });
})
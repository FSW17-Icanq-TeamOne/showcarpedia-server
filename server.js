
const http = require("http");
const app = require("./index");
const PORT = process.env.PORT || 3001;
const server = http.createServer(app);

const io = require('socket.io')(server, {
    cors: {
        origin: "http://localhost:3001",
        credentials: true,
        methods: ["GET", "POST"]
    }
})

//Socket.IO
io.on('connection', (socket) => {
    socket.on('login', ({room}) => {
        socket.join(room)
    })

    socket.on('sendMsg',({name, room, msg}) => {
        io.to(room).emit('message', {
            user: name,
            text: msg
        })
    })

    socket.on('disconnect', () => {  
    })

})

server.listen(PORT, () => { console.log(`Listening on port http://localhost:${PORT}`)}) 

const express = require('express')
const app = express()

const http = require('http')
const cors = require('cors')

const { Server } = require("socket.io")
app.use(cors());



const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "http://localhost:5173",
        methods: ["GET", "POST"]
    }
});

io.on("connection", (socket) => {
    console.log("Socket ID:", socket.id);

     socket.on("join_room", (data) => {
        try {
            socket.join(data);
            console.log(`User with ID:${socket.id} joined room:${data}`);
        } catch (error) {
            console.error("Error joining room:", error);
        }
    });

    socket.on("send_message", (data) => {
        try {
            
            socket.to(data.room).emit("receive_message",data)
        } catch (error) {
            console.log(error,"Error sending message:");
        }
    })


    socket.on("disconnect", () => {
        console.log("User Disconnected", socket.id);
    })
})

server.listen(3001, () => {
    console.log("Server Running")
})
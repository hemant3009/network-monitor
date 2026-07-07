require("dotenv").config();
const express = require('express');
const http = require('http'); // it's built in Node.js module
const { Server } = require('socket.io');
const cors = require("cors");

const connectDB = require("./config/db.js");
const { pollAllHosts } = require("./poller.js");
const { Socket } = require("dgram");

const app = express();
const server = http.createServer(app);  //wrap express in an http server

const io = new Server(server, {
    cors: {
        origin: "*", // allow connections form any origin/website.
        methods: ["GET", "POST"],
    },
});

app.use(cors());
app.use(express.json());

// log when browser connects / disconnects
io.on("connection", (socket) => {
    console.log(`Client connected: ${socket.id}`);

    socket.on("disconnect", () => {
        console.log(`Client disconnected: ${socket.id}`);
    });
});

const PORT = process.env.PORT || 3000;

// connect to DB, then start the server and the poll loop
const start = async () => {
    await connectDB();

    server.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });

    // the poll loop
    setInterval(async () => {
        try {
            const results = await pollAllHosts();
            io.emit("metrics", results);
            console.log(`Polled ${results.length} hosts`);
        } catch (error) {
            console.error(error);
        }
    }, 2000);
};

start();
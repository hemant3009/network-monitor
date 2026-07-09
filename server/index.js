require("dotenv").config();
const express = require('express');
const http = require('http'); // it's built in Node.js module
const { Server } = require('socket.io');
const cors = require("cors");

const connectDB = require("./config/db.js");
const { pollAllHosts } = require("./poller.js");
const { Socket } = require("dgram");
const { checkMetric } = require("./alertEngine.js");

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

            // check each host for alerts
            const allAlerts = [];
            results.forEach((metric) => {
                const alerts = checkMetric(metric);
                allAlerts.push(...alerts);
            });

            if(allAlerts.length > 0){
                io.emit("alerts", allAlerts);
                console.log(`Polled ${results.length} hosts, ${allAlerts.length} alert(s)`);
            }else {
                console.log(`polled ${results.length}hosts, all healthy`);
            }
        } catch (error) {
            console.error("Poll loop error:", error.message);
        }
    }, 2000);
};

start();
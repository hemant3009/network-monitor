const ping = require("ping");
const net = require("net");
const Host = require("./models/Host");

// TCP check , returns promise <boolean>
const checkPort = (ip, port, timeout = 1000) => {
    return new Promise((resolve) => { // wrap in promise so we can await later
        const socket = new net.Socket(); // creates TCP socket

        socket.setTimeout(timeout); // if nothing happens in 1 sec give up

        socket.on("connect", () => {
            socket.destroy(); // clean up socket so we don't leak resources
            resolve(true); // connected -> port is open
        });

        socket.on("timeout", () => {
            socket.destroy();
            resolve(false); // no response -> port is open
        });

        socket.on("error", () => {
            socket.destroy();
            resolve(false); // refused/error -> port closed
        });

        socket.connect(port, ip); // actually starts the connection attempt
    });
};

// takes one host and produces it's completion status
const pingHost = async (host) => { // coz pinging and checking port takes time.
    const res = await ping.promise.probe(host.ip); // sends an ICMP ping request to the IP add. and stores the response
    // res.alive , res.time, res.packetLoss
    
    const portResults = {};
    await Promise.all(
        host.ports.map(async(port) => {
            portResults[port] = await checkPort(host.ip, port);
        })
    );

    return {
        hostId: host._id,
        name: host.name,
        ip: host.ip,
        status: res.alive ? "up" : "down",
        latency: res.alive ? Math.round(res.time) : null,
        loss: parseFloat(res.packetLoss) || 0, // convert the string into actual number
        ports: portResults,
        timestamp: new Date(),
    };
}; 

// reads all active hosts and return the result array
const pollAllHosts = async () => {
    const hosts = await Host.find({active: true});

    const results = await Promise.all(
        hosts.map((host) => pingHost(host))
    );

    return results;
};

module.exports = { pollAllHosts, pingHost };
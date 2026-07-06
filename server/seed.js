require("dotenv").config();
// const { connect } = require("mongoose");
const connectDB = require("./config/db.js");
const Host = require("./models/Host.js");

const seedHosts = [
    { name: "google", ip: "google.com", ports: [80, 443, 3306] },
    { name: "cloudflare", ip: "1.1.1.1", ports: [80, 443] },
    { name: "github", ip: "github.com", ports: [443, 22] },
];

(async () => {
    await connectDB();

    await Host.deleteMany({});
    const created = await Host.insertMany(seedHosts);

    console.log(`Seeded ${created.length} hosts: `);
    created.forEach((h) => console.log(` ${h.name} (${h.ip}) - ports: ${h.ports}`));

    process.exit(0);
})();
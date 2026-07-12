const express = require("express");
const Host = require("../models/Host.js");
const router = express.Router();

router.get("/", async(req, res) => {
   try {
    const hosts = await Host.find();
    res.json(hosts);
   } catch (err) {
    res.status(500).json({ error: err.message});
   }
});

router.post("/", async(req,res) => {
    try {
        const host = await Host.create(req.body);
        res.status(201).json(host);
    } catch (err) {
        res.status(400).json({error: err.message});
    }
});

router.delete("/:id", async(req,res) => {
    try {
        const host = await Host.findByIdAndDelete(req.params.id);
        if(!host) return res.status(404).json({ error: "Host not found"});
        res.json({ message: "Host deleted"});
    } catch (err) {
        res.status(500).json({error: err.message});
    }
});

module.exports = router;
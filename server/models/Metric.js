const mongoose = require("mongoose");

const metricSchema = new mongoose.Schema({
    hostId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Host",
        required: true,
    },
    status: {
        type: String,
        enum: ["up", "down", "warn"],
        required: true,
    },
    latency: {
        type: Number,
        default: null,
    },
    loss: {
        type: Number,
        default: 0,
    },
    ports: { // a key value pair
        type: Map,
        of: Boolean,
        default: {},
    },
    timestamp: {
        type: Date,
        default: Date.now,
    },
});

metricSchema.index({ hostId: 1, timestamp: -1 });

const Metric = mongoose.model("Metric", metricSchema);
module.exports = Metric;
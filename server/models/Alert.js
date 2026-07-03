const mongoose = require("mongoose");

const alertSchema = new mongoose.Schema({
    hostId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Host",
        required: true,
    },
    type: {
        type: String,
        enum: ["crit", "warn", "info"],
        required: true,
    },
    message: {
        type: String,
        required: true,
    },
    resolved: {
        type: Boolean,
        default: false,
    },
}, {
    timestamps: true,
});

const Alert = mongoose.model("Alert", alertSchema);
module.exports = Alert;
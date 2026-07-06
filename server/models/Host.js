const mongoose  = require("mongoose");

const hostSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  ip: {
    type: String,
    required: true,
  },
  ports: {
    type: [Number],
    default: [80, 443, 22],
  },
  active: { // with this we can show a toggle switch on the dashboard
    type: Boolean,
    default: true,
  },
}, {
    timestamps: true,
});

const Host = mongoose.model("Host", hostSchema);
module.exports = Host;
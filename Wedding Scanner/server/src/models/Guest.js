const mongoose = require("mongoose");

const guestSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    phone: {
      type: String,
      required: true,
      trim: true,
    },
    qrToken: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    checkedIn: {
      type: Boolean,
      default: false,
    },
    category: {
      type: String,
      default: "General",
      trim: true,
    },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
  },
);

module.exports = mongoose.model("Guest", guestSchema);

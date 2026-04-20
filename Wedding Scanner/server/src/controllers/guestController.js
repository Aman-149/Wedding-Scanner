const csvParser = require("csv-parser");
const { Readable } = require("stream");
const QRCode = require("qrcode");
const { v4: uuidv4 } = require("uuid");
const Guest = require("../models/Guest");

const parseCsvBuffer = (buffer) =>
  new Promise((resolve, reject) => {
    const rows = [];
    Readable.from(buffer.toString())
      .pipe(csvParser())
      .on("data", (data) => rows.push(data))
      .on("end", () => resolve(rows))
      .on("error", (error) => reject(error));
  });

const normalizeGuest = (rawGuest) => {
  const name = (rawGuest.name || "").trim();
  const phone = (rawGuest.phone || "").toString().trim();
  const category = (rawGuest.category || "General").toString().trim();

  if (!name || !phone) {
    return null;
  }

  return {
    name,
    phone,
    category,
    qrToken: uuidv4(),
    checkedIn: false,
  };
};

const uploadGuests = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "File is required." });
    }

    const extension = (req.file.originalname.split(".").pop() || "").toLowerCase();
    let guestRows = [];

    if (extension === "csv") {
      guestRows = await parseCsvBuffer(req.file.buffer);
    } else if (extension === "json") {
      guestRows = JSON.parse(req.file.buffer.toString());
      if (!Array.isArray(guestRows)) {
        return res.status(400).json({ message: "JSON must be an array of guests." });
      }
    } else {
      return res.status(400).json({ message: "Only CSV and JSON files are supported." });
    }

    const guestsToInsert = guestRows.map(normalizeGuest).filter(Boolean);

    if (!guestsToInsert.length) {
      return res.status(400).json({
        message: "No valid guests found. Ensure each record has name and phone.",
      });
    }

    const insertedGuests = await Guest.insertMany(guestsToInsert);

    return res.status(201).json({
      message: "Guest list uploaded successfully.",
      guests: insertedGuests,
    });
  } catch (error) {
    if (error.code === "23505") {
      return res.status(409).json({ message: "Duplicate token conflict. Please retry upload." });
    }
    if (error.message.includes("Unexpected token")) {
      return res.status(400).json({ message: "Invalid JSON format." });
    }
    return next(error);
  }
};

const getQrCode = async (req, res, next) => {
  try {
    const { token } = req.params;
    const targetUrl = `${process.env.BASE_URL || "http://localhost:5000"}/api/checkin/${token}`;
    const qrBuffer = await QRCode.toBuffer(targetUrl, {
      type: "png",
      margin: 2,
      width: 320,
    });
    res.setHeader("Content-Type", "image/png");
    return res.send(qrBuffer);
  } catch (error) {
    return next(error);
  }
};

const checkInGuest = async (req, res, next) => {
  try {
    const { token } = req.params;
    const guest = await Guest.findOne({ qrToken: token });

    if (!guest) {
      return res.status(404).json({ message: "Invalid QR code." });
    }

    if (guest.checkedIn) {
      return res.status(409).json({ message: "Already checked in.", name: guest.name });
    }

    await Guest.markCheckedIn(guest.id);

    return res.json({ message: "Check-in successful.", name: guest.name });
  } catch (error) {
    return next(error);
  }
};

const getGuests = async (_req, res, next) => {
  try {
    const guests = await Guest.find();
    return res.json(guests);
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  uploadGuests,
  getQrCode,
  checkInGuest,
  getGuests,
};

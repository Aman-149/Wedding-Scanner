const express = require("express");
const upload = require("../middleware/upload");
const {
  uploadGuests,
  getQrCode,
  checkInGuest,
  getGuests,
} = require("../controllers/guestController");

const router = express.Router();

router.post("/upload", upload.single("file"), uploadGuests);
router.get("/qrcode/:token", getQrCode);
router.get("/checkin/:token", checkInGuest);
router.get("/guests", getGuests);

module.exports = router;

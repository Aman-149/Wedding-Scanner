const { getPool } = require("../config/db");

const mapGuestRow = (row) => ({
  id: row.id,
  name: row.name,
  phone: row.phone,
  qrToken: row.qr_token,
  checkedIn: row.checked_in,
  category: row.category,
  createdAt: row.created_at,
});

const insertMany = async (guests) => {
  const pool = getPool();
  const values = [];
  const placeholders = guests.map((guest, index) => {
    const offset = index * 5;
    values.push(guest.name, guest.phone, guest.qrToken, guest.checkedIn, guest.category);
    return `($${offset + 1}, $${offset + 2}, $${offset + 3}::uuid, $${offset + 4}, $${offset + 5})`;
  });

  const result = await pool.query(
    `
      INSERT INTO guests (name, phone, qr_token, checked_in, category)
      VALUES ${placeholders.join(", ")}
      RETURNING id, name, phone, qr_token, checked_in, category, created_at
    `,
    values,
  );

  return result.rows.map(mapGuestRow);
};

const findOne = async ({ qrToken }) => {
  const pool = getPool();
  const result = await pool.query(
    `
      SELECT id, name, phone, qr_token, checked_in, category, created_at
      FROM guests
      WHERE qr_token = $1::uuid
      LIMIT 1
    `,
    [qrToken],
  );

  if (!result.rows.length) {
    return null;
  }

  return mapGuestRow(result.rows[0]);
};

const markCheckedIn = async (id) => {
  const pool = getPool();
  const result = await pool.query(
    `
      UPDATE guests
      SET checked_in = TRUE
      WHERE id = $1
      RETURNING id, name, phone, qr_token, checked_in, category, created_at
    `,
    [id],
  );

  if (!result.rows.length) {
    return null;
  }

  return mapGuestRow(result.rows[0]);
};

const find = async () => {
  const pool = getPool();
  const result = await pool.query(
    `
      SELECT id, name, phone, qr_token, checked_in, category, created_at
      FROM guests
      ORDER BY created_at DESC
    `,
  );

  return result.rows.map(mapGuestRow);
};

module.exports = {
  insertMany,
  findOne,
  markCheckedIn,
  find,
};

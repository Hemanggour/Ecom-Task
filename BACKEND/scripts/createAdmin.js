const db = require('../db');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const createAdmin = async () => {
  const name = process.env.ADMIN_NAME || 'Admin User';
  const email = process.env.ADMIN_EMAIL || 'admin@example.com';
  const password = process.env.ADMIN_PASSWORD || 'adminpassword123';

  try {
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const res = await db.query(
      'INSERT INTO users (name, email, password_hash, role) VALUES ($1, $2, $3, $4) RETURNING id, email, role',
      [name, email, passwordHash, 'admin']
    );

    console.log('Admin user created successfully:');
    console.log(res.rows[0]);
    process.exit(0);
  } catch (err) {
    if (err.code === '23505') { // Unique violation
      console.log('User already exists. Attempting to promote to admin...');
      const res = await db.query(
        "UPDATE users SET role = 'admin' WHERE email = $1 RETURNING id, email, role",
        [email]
      );
      console.log('User promoted to admin:');
      console.log(res.rows[0]);
      process.exit(0);
    } else {
      console.error('Error creating admin:', err.message);
      process.exit(1);
    }
  }
};

createAdmin();

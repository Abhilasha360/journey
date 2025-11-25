const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const nodemailer = require('nodemailer');
const { v4: uuidv4 } = require('uuid');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// In-memory bookings store (demo only)
const bookings = {};

// Configure SMTP transporter (replace with real creds)
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.example.com',
  port: process.env.SMTP_PORT ? parseInt(process.env.SMTP_PORT) : 587,
  secure: false,
  auth: {
    user: process.env.SMTP_USER || 'user@example.com',
    pass: process.env.SMTP_PASS || 'password'
  }
});

// Basic route to check server
app.get('/', (req, res) => res.send({ status: 'ok' }));

// Check availability (demo stub)
app.get('/api/availability', (req, res) => {
  res.send({ availableSeats: 42 });
});

// Create booking
app.post('/api/book', async (req, res) => {
  const { name, email, date, from, to, seats = 1 } = req.body;
  if(!name || !email || !date || !from || !to) {
    return res.status(400).send({ error: 'missing fields' });
  }
  const id = uuidv4();
  const booking = { id, name, email, date, from, to, seats, createdAt: new Date().toISOString() };
  bookings[id] = booking;

  // Send confirmation email (best-effort)
  const mailOptions = {
    from: process.env.FROM_EMAIL || 'no-reply@journeyapp.local',
    to: email,
    subject: `Booking confirmation #${id}`,
    text: `Hi ${name},\n\nYour booking (ID: ${id}) from ${from} to ${to} on ${date} for ${seats} seat(s) is confirmed.\n\nThanks,\nJourney App`
  };

  try {
    await transporter.sendMail(mailOptions);
    // return success with booking id and message
    res.send({ success: true, booking, message: 'Booking created and email sent' });
  } catch (err) {
    // If email fails, still keep booking but inform user
    console.error('email error', err.message);
    res.send({ success: true, booking, message: 'Booking created but email failed', emailError: err.message });
  }
});

// Get booking by id
app.get('/api/bookings/:id', (req, res) => {
  const b = bookings[req.params.id];
  if(!b) return res.status(404).send({ error: 'not found' });
  res.send(b);
});

// Simple self-test (used by CI to verify server starts)
if (process.argv.includes('--selftest')) {
  const server = app.listen(0, async () => {
    console.log('selftest ok');
    server.close();
    process.exit(0);
  });
} else {
  const port = process.env.PORT || 4000;
  app.listen(port, () => console.log(`Backend listening on ${port}`));
}

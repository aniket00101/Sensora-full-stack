// Creates (or updates the password of) the first admin account.
// Run once: npm run seed:admin
require("dotenv").config();
const mongoose = require("mongoose");
const Admin = require("../models/Admin");

const dns = require("dns");

dns.setServers([
  '1.1.1.1',
  '8.8.8.8'
])

async function run() {
  await mongoose.connect(process.env.MONGO_URI);

  const username = process.env.ADMIN_USERNAME || "admin";
  const email = (process.env.ADMIN_EMAIL || "admin@sensoratech.in").toLowerCase();
  const password = process.env.ADMIN_PASSWORD || "ChangeMe123!";

  let admin = await Admin.findOne({ $or: [{ username }, { email }] });
  if (admin) {
    admin.password = password;
    await admin.save();
    console.log(`Updated password for existing admin "${admin.username}"`);
  } else {
    admin = await Admin.create({ username, email, password, role: "superadmin" });
    console.log(`Created admin "${admin.username}" (${admin.email})`);
  }

  console.log("Login with this username/email and the password from your .env file.");
  await mongoose.disconnect();
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});

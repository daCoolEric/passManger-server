const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

mongoose.set("strictQuery", true);
const accountsRoute = require("./routes/accounts");
const userRoute = require("./routes/users");

// Fail fast if critical secrets are missing — never boot insecurely.
["DB_URI", "JWT_SECRET"].forEach((key) => {
  if (!process.env[key]) {
    console.error(`FATAL: ${key} is not set. Refusing to start.`);
    process.exit(1);
  }
});

const app = express();

// Lock CORS to the known frontend origin(s). Set CLIENT_ORIGIN in env,
// comma-separated if you have more than one (e.g. localhost + vercel).
const allowedOrigins = (process.env.CLIENT_ORIGIN || "")
  .split(",")
  .map((s) => s.trim())
  .filter(Boolean);

app.use(
  cors({
    origin: (origin, cb) => {
      // allow same-origin / curl (no origin) and whitelisted origins only
      if (!origin || allowedOrigins.includes(origin)) return cb(null, true);
      return cb(new Error("Not allowed by CORS"));
    },
  })
);

app.use(express.json({ limit: "100kb" }));

app.use("/api/user/accounts", accountsRoute);
app.use("/api/user", userRoute);

const PORT = process.env.PORT || 5500;

// mongoose
//   .connect(process.env.DB_URI)
//   .then(() =>
//     app.listen(PORT, () => console.log(`Server running on port ${PORT}`))
//   )
//   .catch((err) => {
//     console.error("DB connection failed:", err.message);
//     process.exit(1);
//   });

mongoose
  .connect(process.env.DB_URI, { dbName: "PasswordManager" })
  .then(() => {
    console.log("Connected to DB:", mongoose.connection.name);
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((err) => {
    console.error("DB connection failed:", err.message);
    process.exit(1);
  });

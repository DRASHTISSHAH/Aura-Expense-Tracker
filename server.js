// expense-tracker-api/server.js

const express = require("express");
const cors = require("cors");
const path = require("path");
const authenticateUser = require("./middleware/authMiddleware");
const transactionRoutes = require("./routes/transactionRoutes");

const walletRoutes = require("./routes/walletRoutes");
const savingsRoutes = require("./routes/savingsRoutes");
const investmentsRoutes = require("./routes/investmentsRoutes");

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: true,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// Global Terminal Logger
app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    console.log(`[${new Date().toLocaleTimeString()}] ${req.method} ${req.originalUrl} - ${res.statusCode} (${duration}ms)`);
  });
  next();
});

// Serve static frontend files
app.use(express.static(path.join(__dirname, "dist")));

// Protected Routes
app.use("/api/transactions", authenticateUser, transactionRoutes);
app.use("/api/wallets", authenticateUser, walletRoutes);
app.use("/api/savings", authenticateUser, savingsRoutes);
app.use("/api/investments", authenticateUser, investmentsRoutes);

// Wildcard handler for React Router client-side routing
app.get(/.*/, (req, res) => {
  res.sendFile(path.join(__dirname, "dist", "index.html"));
});

// Start Server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
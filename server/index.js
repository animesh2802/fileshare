const express = require("express");
require("./database/db");
const { Config } = require("./config");
const app = express();
const cors = require("cors");
const UploadRoute = require("./routes/upload");
const port = Config.PORT; // You can choose any available port
const fileUpload = require("express-fileupload");
const ViewFile = require("./routes/viewfile");
const path = require("path");
const DLFile = require("./routes/dl_file");
const dashboard = require("./routes/dashboard");

// Serve uploaded files as static assets
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Middleware
app.use(fileUpload({
  limits: { fileSize: 100 * 1024 * 1024 }, // Limit files to 100MB
  abortOnLimit: true,
}));
app.use(cors());
app.use(express.json());

// Test Route
app.get("/", (req, res) => {
  res.send("Hello, Express!");
});

// API Routes
app.post("/api/upload", UploadRoute);  // Upload a file
app.get("/api/view/:id", ViewFile);  // View file metadata
app.get("/api/file/:id", DLFile);  // Download file
app.post("/api/dashboard", dashboard);  // Dashboard endpoint

// 404 Error Handling for undefined routes
app.use((req, res, next) => {
  res.status(404).send("Route not found");
});

// Centralized Error Handling
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).send("Internal server error");
});

// Start server
app.listen(port, () => {
  console.log(`Server is running on ${Config.BACKEND_DOMAIN}:${port}`);
});

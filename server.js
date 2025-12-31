const express = require("express");
const compression = require("compression");
const path = require("path");

const app = express();
const port = process.env.PORT || 3000;

// Compress all responses
app.use(compression());

// Serve static assets from Public with aggressive caching
app.use("/Public", express.static(path.join(__dirname, "Public"), {
  maxAge: "1y",
  immutable: true
}));

// Serve everything else (HTML, data, service worker, etc.)
app.use(express.static(__dirname, {
  maxAge: "1h"
}));

// Basic health check
app.get("/health", (_req, res) => {
  res.send("ok");
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});

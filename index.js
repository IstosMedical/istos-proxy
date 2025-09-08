import express from "express";
import fetch from "node-fetch";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// 🔐 Middleware: JSON parsing
app.use(express.json());

// 🌐 Middleware: CORS + Preflight
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }
  next();
});

// 🚀 Route: /run-assistant
app.post("/run-assistant", async (req, res) => {
  const payload = req.body;

  try {
    const upstreamResponse = await fetch(process.env.APPS_SCRIPT_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    const responseText = await upstreamResponse.text();

    res
      .status(upstreamResponse.status)
      .set({
        "Access-Control-Allow-Origin": "*",
        "Content-Type": "application/json"
      })
      .send(responseText);
  } catch (error) {
    console.error("🛑 Proxy error:", error.message);

    res
      .status(500)
      .set({ "Access-Control-Allow-Origin": "*" })
      .json({
        fallback: true,
        message: "⚠️ Assistant unavailable. Please try again later.",
        error: error.message
      });
  }
});

// 🟢 Start server
app.listen(PORT, () => {
  console.log(`🚀 istos-proxy live at http://localhost:${PORT}`);
});

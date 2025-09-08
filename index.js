import express from "express";
import fetch from "node-fetch";
import dotenv from "dotenv";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.post("/run-assistant", async (req, res) => {
  try {
    const response = await fetch(process.env.APPS_SCRIPT_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(req.body)
    });

    const text = await response.text();

    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Headers", "*");
    res.setHeader("Content-Type", "application/json");
    res.status(response.status).send(text);
  } catch (err) {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.status(500).json({
      fallback: true,
      message: "⚠️ Proxy error. Please try again later.",
      error: err.message
    });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Proxy running on http://localhost:${PORT}`);
});

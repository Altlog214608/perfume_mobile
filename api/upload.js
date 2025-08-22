// api/upload.js
const { put } = require("@vercel/blob");

module.exports = async (req, res) => {
  try {
    if (req.method !== "POST") {
      res.status(405).json({ error: "Method not allowed" });
      return;
    }
    const { dataUrl, filename = `story-${Date.now()}.jpg` } = req.body || {};
    if (!dataUrl || !dataUrl.startsWith("data:image/")) {
      res.status(400).json({ error: "Invalid dataUrl" });
      return;
    }
    const base64 = dataUrl.split(",")[1];
    const buffer = Buffer.from(base64, "base64");

    const blob = await put(`stories/${filename}`, buffer, {
      access: "public",
      contentType: "image/jpeg",
      addRandomSuffix: true,
    });

    res.status(200).json({ url: blob.url });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: e.message });
  }
};

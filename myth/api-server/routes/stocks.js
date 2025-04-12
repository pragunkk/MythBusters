const express = require("express");
const router = express.Router();
const db = require("../firebase/firebase");

router.get("/", async (req, res) => {
  const snapshot = await db.collection("stocks").get();
  const stocks = snapshot.docs.map(doc => ({
    id: doc.id,
    name: doc.data().name,
    symbol: doc.data().symbol,
    price: doc.data().price,
  }));
  res.json(stocks);
});

router.get("/:id", async (req, res) => {
  const doc = await db.collection("stocks").doc(req.params.id).get();
  if (!doc.exists) return res.status(404).json({ error: "Stock not found" });
  res.json({ id: doc.id, ...doc.data() });
});

module.exports = router;

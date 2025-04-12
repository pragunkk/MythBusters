const express = require("express");
const stocksRouter = require("./routes/stocks");

const app = express();
const PORT = 3000;

app.use(express.json());
app.use("/stocks", stocksRouter);

app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});

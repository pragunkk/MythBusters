const fs = require("fs");
const path = require("path");
const csv = require("csv-parser");
const db = require("./firebase/firebase");

const DATA_DIR = path.join(__dirname, "data");

function parseNumber(value) {
  return parseFloat(value.replace(/,/g, "")) || 0;
}

async function loadAllCSVs() {
  const files = fs.readdirSync(DATA_DIR).filter(f => f.endsWith(".csv"));

  for (const file of files) {
    const filePath = path.join(DATA_DIR, file);
    const stockSymbol = path.basename(file, ".csv").toUpperCase(); // use filename as symbol
    const historical = [];

    await new Promise((resolve, reject) => {
      fs.createReadStream(filePath)
        .pipe(csv())
        .on("data", (row) => {
          historical.push({
            date: row["Date "].trim(),
            open: parseNumber(row["OPEN "]),
            high: parseNumber(row["HIGH "]),
            low: parseNumber(row["LOW "]),
            prevClose: parseNumber(row["PREV. CLOSE "]),
            ltp: parseNumber(row["ltp "]),
            close: parseNumber(row["close "]),
            vwap: parseNumber(row["vwap "]),
            volume: parseNumber(row["VOLUME "]),
            value: parseNumber(row["VALUE "]),
            trades: parseNumber(row["No of trades "])
          });
        })
        .on("end", resolve)
        .on("error", reject);
    });

    const stockDoc = {
      name: stockSymbol, // you can improve this with a symbol-name map
      symbol: stockSymbol,
      historical
    };

    await db.collection("stocks").add(stockDoc);
    console.log(`✅ Uploaded: ${stockSymbol} (${historical.length} records)`);
  }

  console.log("📡 All stock CSVs uploaded to Firestore!");
}

loadAllCSVs();

const csv = require("csvtojson");
//const converter = require("json-2-csv");
const dotenv = require("dotenv");

dotenv.config({ path: "../config.env" });
const fs = require("fs");

const db = require("../db");

const reworkPriceData = async function () {
  try {
    const ids = await db.execute(
      "SELECT typeID FROM itemLookup ORDER BY typeID"
    );
    let idsArray = [];

    ids[0].forEach((el) => idsArray.push(el.typeID));
    const dates = [
      "2023-02-08",
      "2023-02-09",
      "2023-02-10",
      "2023-02-11",
      "2023-02-12",
    ];
    //const dates = ["2023-02-12"];
    let pricesData = [];
    for await (const date of dates) {
      for await (const id of idsArray) {
        const sql = `SELECT * FROM eve_price_tracker.priceData WHERE DATE(date) = "${date}"  AND id = ${id};`;
        const result = await db.execute(sql);
        let array = [];
        for await (const arr of result[0]) {
          if (arr.location === "1dq1-a") {
            const typeId = arr.id,
              dq1aSell = arr.sell,
              dq1aSellVolume = arr.sellVolume,
              dq1aBuy = arr.buy,
              dq1aBuyVolume = arr.buyVolume,
              updatedAtSource = arr.updatedAtSource,
              date = new Date(arr.date)
                .toISOString()
                .slice(0, 19)
                .replace("T", " "),
              date2 = "'" + date + "'";

            array.push({
              typeId,
              dq1aSell,
              dq1aSellVolume,
              dq1aBuy,
              dq1aBuyVolume,
              date,
              updatedAtSource,
            });
          }
          if (arr.location === "amarr") {
            const amarrSell = arr.sell,
              amarrSellVolume = arr.sellVolume,
              amarrBuy = arr.buy,
              amarrBuyVolume = arr.buyVolume;
            array.push({
              amarrSell,
              amarrSellVolume,
              amarrBuy,
              amarrBuyVolume,
            });
          }
          if (arr.location === "jita") {
            const jitaSell = arr.sell,
              jitaSellVolume = arr.sellVolume,
              jitaBuy = arr.buy,
              jitaBuyVolume = arr.buyVolume;
            array.push({ jitaSell, jitaSellVolume, jitaBuy, jitaBuyVolume });
          }
        }
        pricesData.push(
          array.reduce(function (acc, cur) {
            return Object.assign(acc, cur);
          }, {})
        );
      }

      // db.execute(`INSERT`);
      // console.log(pricesData);
    }
    const newPricesArray = pricesData.filter(
      (value) => Object.keys(value).length !== 0
    );
    // console.log(newPricesArray);
    // console.log(newPricesArray.length);
    // const stringyJson = JSON.stringify(pricesData);
    // console.log(stringyJson);
    // console.log(pricesData);
    // const csv = converter.json2csv(pricesData, (err) => console.log(err));
    // console.log(csv);
    // fs.writeFileSync("pricesDataTest.csv", csv);
    for await (const pricesDataObj of newPricesArray) {
      // console.log(pricesDataObj);
      const sql2 = `INSERT INTO eve_price_tracker.priceDataExtended (typeID, dq1aBuy, dq1aBuyVolume, dq1aSell, dq1aSellVolume, updatedAtSource, amarrBuy, amarrBuyVolume, amarrSell, amarrSellVolume, jitaBuy, jitaBuyVolume, jitaSell, jitaSellVolume, date) VALUES(${pricesDataObj.typeId}, ${pricesDataObj.dq1aBuy}, ${pricesDataObj.dq1aBuyVolume}, ${pricesDataObj.dq1aSell}, ${pricesDataObj.dq1aSellVolume}, "${pricesDataObj.updatedAtSource}", ${pricesDataObj.amarrBuy}, ${pricesDataObj.amarrBuyVolume}, ${pricesDataObj.amarrSell}, ${pricesDataObj.amarrSellVolume}, ${pricesDataObj.jitaBuy}, ${pricesDataObj.jitaBuyVolume}, ${pricesDataObj.jitaSell}, ${pricesDataObj.jitaSellVolume}, TIMESTAMP(\'${pricesDataObj.date}\'));`;
      // console.log(sql2);
      await db.execute(sql2);
    }
  } catch (error) {
    console.log(error);
  }
};

(async () => {
  await reworkPriceData();
  process.exit();
  // console.log(result);
})();

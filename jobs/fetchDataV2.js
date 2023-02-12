const dotenv = require("dotenv");
dotenv.config({ path: "../config.env" });
const csv = require("csvtojson");
const express = require("express");
const fetch = require("node-fetch");
const parseStringPromise = require("xml2js").parseStringPromise;
const parseString = require("xml2js").parseString;

const marketLookup = require("../marketLookup");
const db = require("../db");
const itemLookupCSV = "../items-test.csv";

const fetchIDs = async function () {
  try {
    const sql = `SELECT typeID FROM itemLookup ORDER BY typeID;`;
    const ids = await db.execute(sql);
    let idsArray = [];
    ids[0].forEach((el) => idsArray.push(el.typeID));
    const paginateIdsArray = paginate(idsArray, 50);
    // console.log(paginateIdsArray);
    return paginateIdsArray;
  } catch (error) {
    console.log(error);
  }
};

// const dataLookup = async function (idList) {
//   try {
//     const data = await marketLookup(idList);
//     return data;
//   } catch (error) {
//     console.log(error);
//   }
// };

(async () => {
  const ids = await fetchIDs();
  // console.log(ids);
  await priceCheck(ids[0]);

  // for await (const page of ids) {
  //   await priceCheck(page);
  // }
  process.exit();
  // console.log(result);
})();

const paginate = function (arr, size) {
  return arr.reduce((acc, val, i) => {
    let index = Math.floor(i / size);
    let page = acc[index] || (acc[index] = []);
    page.push(val);

    return acc;
  }, []);
};

const priceCheck = async function (ids) {
  try {
    const raw1dq1aData = await fetch(
      `https://goonmetrics.apps.goonswarm.org/api/price_data/?station_id=1030049082711&type_id=${ids}`,

      {
        method: "GET",
      }
    );
    // console.log(raw1dq1aData);
    const rawAmarrData = await fetch(
      `https://api.evemarketer.com/ec/marketstat?typeid=${ids}&usesystem=30002187`,

      {
        method: "GET",
      }
    );
    // console.log(rawAmarrData);
    const rawJitaData = await fetch(
      `https://api.evemarketer.com/ec/marketstat?typeid=${ids}&usesystem=30000142`,

      {
        method: "GET",
      }
    );
    // console.log(rawJitaData);
    const dq1aData = await raw1dq1aData.text();
    const amarrData = await rawAmarrData.text();
    const jitaData = await rawJitaData.text();
    const dq1aPriceData = await parseStringPromise(dq1aData);
    const amarr2PriceData = await parseStringPromise(amarrData);
    const jitaPriceData = await parseStringPromise(jitaData);
    const dq1a = dq1aPriceData.goonmetrics.price_data[0].type;
    const amarr = amarr2PriceData.exec_api.marketstat[0].type;
    const jita = jitaPriceData.exec_api.marketstat[0].type;
    // console.log(dq1a);
    // console.log(amarr);
    let count = 0;
    let result = [];
    for await (const type of dq1a) {
      // console.log(type);
      // console.log(amarr[count]);
      // console.log(jita[count]);
      const id = type.$.id,
        [dq1aSell] = type.sell[0].min,
        [dq1aSellVolume] = type.sell[0].listed || type.sell[0].volume,
        [dq1aBuy] = type.buy[0].max,
        [dq1aBuyVolume] = type.buy[0].listed || type.buy[0].volume,
        [dq1aUpdatedAtSource] = type.updated || null,
        [amarrSell] = amarr[count].sell[0].min,
        [amarrSellVolume] = amarr[count].sell[0].listed || amarr[count].sell[0].volume,
        [amarrBuy] = amarr[count].buy[0].max,
        [amarrBuyVolume] = amarr[count].buy[0].listed || amarr[count].buy[0].volume,
        [jitaSell] = jita[count].sell[0].min,
        [jitaSellVolume] = jita[count].sell[0].listed || jita[count].sell[0].volume,
        [jitaBuy] = jita[count].buy[0].max,
        [jitaBuyVolume] = jita[count].buy[0].listed || jita[count].buy[0].volume;
      // console.log({ id, dq1aBuy, dq1aBuyVolume, dq1aSell, dq1aSellVolume, dq1aUpdatedAtSource, amarrBuy, amarrBuyVolume, amarrSell, amarrSellVolume, jitaBuy, jitaBuyVolume, jitaSell, jitaSellVolume });
      result[count] = { id, dq1aBuy, dq1aBuyVolume, dq1aSell, dq1aSellVolume, dq1aUpdatedAtSource, amarrBuy, amarrBuyVolume, amarrSell, amarrSellVolume, jitaBuy, jitaBuyVolume, jitaSell, jitaSellVolume };
      const sql2 = `INSERT INTO priceDataExtended (typeID, dq1aBuy, dq1aBuyVolume, dq1aSell, dq1aSellVolume, updatedAtSource, amarrBuy, amarrBuyVolume, amarrSell, amarrSellVolume, jitaBuy, jitaBuyVolume, jitaSell, jitaSellVolume) VALUES(${id}, ${dq1aBuy}, ${dq1aBuyVolume}, ${dq1aSell}, ${dq1aSellVolume}, "${dq1aUpdatedAtSource}", ${amarrBuy}, ${amarrBuyVolume}, ${amarrSell}, ${amarrSellVolume}, ${jitaBuy}, ${jitaBuyVolume}, ${jitaSell}, ${jitaSellVolume} )`;
      await db.execute(sql2);

      count++;
    }
    console.log(result);
  } catch (error) {
    console.log(error);
  }
};

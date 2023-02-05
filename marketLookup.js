const parseString = require("xml2js").parseString;
// const { parse } = require('dotenv');
const fetch = require("node-fetch");
const xml2js = require("xml2js");
const parseStringPromise = require("xml2js").parseStringPromise;
const { inspect } = require("util");
const fs = require("fs");

module.exports = async function (idList) {
  try {
    if (idList.length > 50) throw new Error("Id List too long!");
    const ids = idList.join(",");

    const raw1dq1aData = await fetch(
      `https://goonmetrics.apps.goonswarm.org/api/price_data/?station_id=1030049082711&type_id=${ids}`,

      {
        method: "GET",
      }
    );
    const rawAmarrData = await fetch(
      `https://api.evemarketer.com/ec/marketstat?typeid=${ids}&usesystem=30002187`,

      {
        method: "GET",
      }
    );
    const rawJitaData = await fetch(
      `https://api.evemarketer.com/ec/marketstat?typeid=${ids}&usesystem=30000142`,

      {
        method: "GET",
      }
    );

    const dq1aData = await raw1dq1aData.text();
    const amarrData = await rawAmarrData.text();
    const jitaData = await rawJitaData.text();

    const dq1aPriceData = await parseStringPromise(dq1aData);
    const amarr2PriceData = await parseStringPromise(amarrData);
    const jitaPriceData = await parseStringPromise(jitaData);

    const cleanded1dq1aPriceData = itemDataExtract(dq1aPriceData.goonmetrics.price_data[0].type, "1dq1-a");
    const cleandedAmarrPriceData = itemDataExtract(amarr2PriceData.exec_api.marketstat[0].type, "amarr");
    const cleandedJitaPriceData = itemDataExtract(jitaPriceData.exec_api.marketstat[0].type, "jita");

    const combinedPriceData = [...cleanded1dq1aPriceData, ...cleandedAmarrPriceData, ...cleandedJitaPriceData];

    // console.log(combinedPriceData);
    return combinedPriceData;
  } catch (error) {
    console.log(error);
  }
};

const ids = [34, 35, 36, 37, 38, 39];

const itemDataExtract = function (inputData, loc = "unknown") {
  let combinedPriceData = [];
  inputData.forEach((type) => {
    const location = loc,
      id = type.$.id,
      [sell] = type.sell[0].min,
      [sellVolume] = type.sell[0].listed || type.sell[0].volume,
      [buy] = type.buy[0].max,
      [buyVolume] = type.buy[0].listed || type.buy[0].volume,
      updatedAtSource = type.updated || null;
    combinedPriceData.push({ location, id, sell, sellVolume, buy, buyVolume, updatedAtSource });
  });
  return combinedPriceData;
};

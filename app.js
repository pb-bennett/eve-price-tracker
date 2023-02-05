const dotenv = require("dotenv");
dotenv.config({ path: "./config.env" });
const csv = require("csvtojson");
const express = require("express");

const marketLookup = require("./marketLookup");
const db = require("./db");
const itemLookupCSV = "./items-test.csv";

// console.log(itemLookupList);

const dataLookup = async function (idList) {
  try {
    const data = await marketLookup(idList);
    return data;
  } catch (error) {
    console.log(error);
  }
};

(async () => {
  // code goes here
  const testLookup = await dataLookup([34, 35]);
  console.log("from test", testLookup);
})();
// (async () => {
//   // code goes here
//   const jsonArray = await csv().fromFile(itemLookupCSV);
//   for await (const element of jsonArray) {
//     const item = await itemLookup(element.itemName);
//     console.log(item);
//   }
// })();

// const itemLookup = async function (typeName) {
//   try {
//     // const sql = `SELECT typeName, volume, iconID, typeID FROM invTypes WHERE typeName = '${typeName}'`;
//     const sql = `SELECT typeID, GroupID, typeName, volume, marketGroupID, iconID FROM invTypes WHERE typeName = '${typeName}'`;
//     result = await db.execute(sql);
//     const sql2 = `INSERT INTO itemLookup (typeID, GroupID, typeName, volume, marketGroupID, iconID) VALUES ("${result[0][0].typeID}", "${result[0][0].GroupID}", "${result[0][0].typeName}", "${result[0][0].volume}", "${result[0][0].marketGroupID}", "${result[0][0].iconID}")`;
//     await db.execute(sql2);
//     //   console.log('The result is:', result[0][0].ItemName);
//     // console.log();
//     // console.log(itemID, result[0][0]);
//     return result[0][0];
//   } catch (error) {
//     console.error(error);
//   }
// };

// (async () => {
//   // code goes here

//   const item34 = await itemLookup(34);
//   console.log(item34);
// })();

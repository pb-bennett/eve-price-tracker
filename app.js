const dotenv = require("dotenv");
dotenv.config({ path: "./config.env" });
const csv = require("csvtojson");
const express = require("express");

const marketLookup = require("./marketLookup");
const db = require("./db");
const itemLookupCSV = "./items-test.csv";

// console.log(itemLookupList);

const fetchIDs = async function () {
  try {
    const sql = `SELECT typeID FROM itemLookup ORDER BY typeID;`;
    const ids = await db.execute(sql);
    let idsArray = [];
    ids[0].forEach((el) => idsArray.push(el.typeID));
    const paginateIdsArray = paginate(idsArray, 50);
    console.log(paginateIdsArray);
    return paginateIdsArray;
  } catch (error) {
    console.log(error);
  }
};

// fetchIDs();

const dataLookup = async function (idList) {
  try {
    const data = await marketLookup(idList);
    return data;
  } catch (error) {
    console.log(error);
  }
};

(async () => {
  const ids = await fetchIDs();
  // console.log(ids);
  for await (const page of ids) {
    await dataLookup(page);
  }
  // console.log(result);
})();

// (async () => {
//   // code goes here
//   const testLookup = await dataLookup([34, 35]);
//   console.log("from test", testLookup);
// })();
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

function paginate(arr, size) {
  return arr.reduce((acc, val, i) => {
    let idx = Math.floor(i / size);
    // console.log("i =", i, "size =", size, "Math.floor()=", Math.floor(i / size), "val: ", val, "acc:", acc);
    let page = acc[idx] || (acc[idx] = []);
    page.push(val);

    return acc;
  }, []);
}

// let array = [1, 22, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16];
// let page_size = 3;
// let pages = paginate(array, page_size);

// console.log(pages); // all pages
// console.log(pages[1]); // second page

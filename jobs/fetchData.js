const dotenv = require("dotenv");
dotenv.config({ path: "../config.env" });
const csv = require("csvtojson");
const express = require("express");

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
    console.log(paginateIdsArray);
    return paginateIdsArray;
  } catch (error) {
    console.log(error);
  }
};

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
  process.exit();
  // console.log(result);
})();

function paginate(arr, size) {
  return arr.reduce((acc, val, i) => {
    let index = Math.floor(i / size);
    let page = acc[index] || (acc[index] = []);
    page.push(val);

    return acc;
  }, []);
}

const csv = require("csvtojson");
const dotenv = require("dotenv");
dotenv.config({ path: "../config.env" });

const db = require("../db");
const itemLookupCSV = "../items-test.csv";

(async () => {
  // code goes here
  const sql1 = `DROP TABLE IF EXISTS itemLookup ;`;
  const sql2 = `CREATE TABLE itemLookup (
    typeID INT PRIMARY KEY,
    groupID INT NOT NULL,
    typeName VARCHAR(100) NOT NULL UNIQUE,
    volume DOUBLE NOT NULL,
    marketGroupID INT NOT NULL,
    iconID INT
  );`;
  await db.execute(sql1);
  await db.execute(sql2);
  const jsonArray = await csv().fromFile(itemLookupCSV);
  for await (const element of jsonArray) {
    const item = await itemLookup(element.itemName);
    console.log(item.typeName);
  }
})();

const itemLookup = async function (typeName) {
  try {
    // const sql = `SELECT typeName, volume, iconID, typeID FROM invTypes WHERE typeName = '${typeName}'`;
    const sql = `SELECT typeID, GroupID, typeName, volume, marketGroupID, iconID FROM invTypes WHERE typeName = '${typeName}'`;
    result = await db.execute(sql);
    const sql2 = `INSERT INTO itemLookup (typeID, GroupID, typeName, volume, marketGroupID, iconID) VALUES ("${result[0][0].typeID}", "${result[0][0].GroupID}", "${result[0][0].typeName}", "${result[0][0].volume}", "${
      result[0][0].marketGroupID
    }", "${result[0][0].iconID || 0}")`;
    await db.execute(sql2);
    //   console.log('The result is:', result[0][0].ItemName);
    // console.log();
    // console.log(itemID, result[0][0]);
    return result[0][0];
  } catch (error) {
    console.error(error);
  }
};

const dotenv = require("dotenv");
dotenv.config({ path: "./config.env" });

const express = require("express");

const marketLookup = require("./marketLookup");

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
  console.log(testLookup);
})();

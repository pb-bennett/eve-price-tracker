const Bree = require("bree");
const bree = new Bree({ jobs: [{ name: "fetchData", interval: "at 19:00" }] });
const bree2 = new Bree({
  jobs: [{ name: "fetchDataV2", interval: "at 18:30" }],
});
const bree3 = new Bree({ jobs: [{ name: "test", interval: "20s" }] });

(async () => {
  await bree.start();
  await bree2.start();
  //await bree3.start();
})();

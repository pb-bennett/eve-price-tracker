const Bree = require("bree");
const bree = new Bree({ jobs: [{ name: "fetchData", interval: "at 19:00" }] });

(async () => {
  await bree.start();
})();

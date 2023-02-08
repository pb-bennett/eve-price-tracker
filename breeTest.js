const Bree = require("bree");
const bree = new Bree({ jobs: [{ name: "fetchData", interval: "at 22:34" }] });

(async () => {
  await bree.start();
})();

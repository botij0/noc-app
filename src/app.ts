import server = require("./presentation/server");

(async () => {
  main();
})();

function main() {
  server.Server.start();
}

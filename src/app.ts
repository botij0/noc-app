import "dotenv/config";

import { Server } from "./presentation/server";

(async () => {
  main();
})();

function main() {
  console.log(process.env.PORT);
  Server.start();
}

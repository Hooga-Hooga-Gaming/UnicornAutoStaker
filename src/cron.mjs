import cron from "node-cron"
import { main } from "./main.mjs";

// run once
(async () => {
  try {
      await main()
      await main()
  } catch (err) {}
})();

// Everyday at 1am
cron.schedule("0 * * * *", () => {
    (async () => {
        await main()
        await main()
    })()
});
import dotenv from "dotenv";

import connectDB from "./db/index.js";
import { app } from "./app.js";
import job from "./cron/cron.js";

dotenv.config({
  path: "./.env",
});

// job.start();

connectDB()
  .then(() => {
    app.listen(process.env.PORT || 8000, () => {
      console.log(`Server is running at port : ${process.env.PORT}`);
    });
  })
  .catch((err) => {
    console.log("MongoDb connection failed !!!!", err);
  });

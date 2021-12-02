import axios from "axios";
import csv from "csv-parser";
import fs from "fs";
import path from "path";

const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

const URL = "";

(async function () {
  try {
    const insert: any = [];

    fs.createReadStream(path.join(__dirname, "users.csv"))
      .pipe(csv(["name"]))
      .on("data", row => {
        insert.push(row);
      })
      .on("end", async () => {
        const users = insert.map(({ name }: any) => ({
          name: name.split(";")[4],
          email: name.split(";")[5],
          password: Math.floor(Math.random() * 1000000000).toString(),
          noNotification: true,
        }));

        for (const [index, user] of users.entries()) {
          try {
            if (user.name === "FullName") continue;
            console.log({ ...user, index });

            const response = await axios.post(URL, user);

            console.log("created user ==> ", response.data);
            await delay(1500);
          } catch (err: any) {
            console.log("err ===> ", err);
            await delay(3000);
          }
        }

        console.log("CSV file successfully processed");
      });
  } catch (err) {
    console.log(" err ===> ", err);
  }
})();

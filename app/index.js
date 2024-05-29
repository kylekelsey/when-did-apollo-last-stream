require("dotenv").config();
const express = require("express");
const app = express();
const port = process.env.PORT;
const cron = require("./cron");
const db = require('./db');
const logger = require("./logger");

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

app.use("/assets", express.static(__dirname + "/assets"));

app.get("/api", async (req, res) => {
  const client = await db.getClient();
  let lastStream;
  try {
    const res = await client.query("SELECT * from last_stream");
    lastStream = res.rows[0].laststream;
    isLive = res.rows[0].islive
  } catch (err) {
    console.error(err.message);
  } finally {
    await client.end();
  }
  res.send({ lastStream: lastStream, isLive: isLive });
});

cron.initScheduledJobs();

app.listen(port, () => {
  logger.info(`Server started!`);
});
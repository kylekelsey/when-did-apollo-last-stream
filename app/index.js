require("dotenv").config();
const express = require("express");
const app = express();
const cron = require("./cron");
const db = require("./db");
const logger = require("./logger");
const https = require("https");
const fs = require("fs");
const compression = require("compression");
const port = process.env.PORT;
var httpsServer;

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/static/index.html");
});

app.use(express.static("./app/static"));
app.use(compression());

app.get("/api", async (req, res) => {
  const client = await db.getClient();
  let lastStream;
  try {
    const res = await client.query("SELECT * from last_stream");
    lastStream = res.rows[0].laststream;
    isLive = res.rows[0].islive;
  } catch (err) {
    console.error(err.message);
  } finally {
    await client.end();
  }
  res.send({ lastStream: lastStream, isLive: isLive });
});

cron.initScheduledJobs();

if (process.env.ENV != "local") {
  httpsServer = https.createServer(
    {
      key: fs.readFileSync(process.env.KEY_PATH),
      cert: fs.readFileSync(process.env.CERT_PATH),
    },
    app
  );
  httpsServer.listen(port, () => {
    logger.info(`HTTPS Server started!`);
  });
} else {
  app.listen(port, () => {
    logger.info(`HTTP Server started!`);
  });
}

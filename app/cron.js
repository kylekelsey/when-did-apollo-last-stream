const CronJob = require("node-cron");
const logger = require("./logger");
const db = require("./db");

exports.initScheduledJobs = () => {
  const scheduledJobFunction = CronJob.schedule("*/5 * * * *", async () => {
    logger.info("STARTING CRON JOB");
    const token = await getTwitchToken();
    let streamInfo = await getStreamInfo(token);
    await updateDB(streamInfo);
  });

  scheduledJobFunction.start();
};

async function getTwitchToken() {
  logger.info("Getting twitch token");
  const data = {
    client_id: process.env.CLIENT_ID,
    client_secret: process.env.CLIENT_SECRET,
    grant_type: "client_credentials",
  };

  try {
    const response = await fetch("https://id.twitch.tv/oauth2/token", {
      method: "POST",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
      },
      referrerPolicy: "no-referrer",
      body: JSON.stringify(data),
    });
    const json = await response.json();
    return json.access_token;
  } catch (err) {
    logger.error("Failed to get Twitch token:" + err.message);
  }
}

async function getStreamInfo(token) {
  logger.info("Getting stream info");
  const options = {
    method: "GET",
    headers: new Headers({
      Authorization: `Bearer ${token}`,
      "Client-Id": process.env.CLIENT_ID,
    }),
  };

  try {
    const response = await fetch(
      "https://api.twitch.tv/helix/streams?user_login=apollo22237",
      options
    );
    const json = await response.json();
    return json;
  } catch (err) {
    logger.error("Failed to get stream info: " + err.message);
  }
}

async function updateDB(streamInfo) {
  const client = await db.getClient();

  let text;
  let values;

  if (streamInfo.data.length == 0) {
    logger.info("Not Streaming! Updating DB...");
    text = `UPDATE "${process.env.TABLE}" SET "islive" = $1 WHERE "stream_id" = 0`;
    values = [false];
  } else {
    logger.info("He is streaming! Updating DB...");
    text = `UPDATE "${process.env.TABLE}" SET "islive" = $1, "laststream" = $2 WHERE "stream_id" = 0`;
    const now = new Date();
    values = [true, now];
  }

  try {
    const response = await client.query(text, values);
    if (response.rowCount == 1) {
      logger.info("Updated DB!");
    }
  } catch (err) {
    logger.error("Failed to update DB: " + err.message);
  } finally {
    await client.end();
  }
}

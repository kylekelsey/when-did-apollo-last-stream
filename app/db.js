const pg = require("pg");

exports.getClient = async () => {
  const { Client } = pg;

  try {
    const client = new Client({
      user: process.env.PGUSER,
      password: process.env.PGPASSWORD,
      host: process.env.PGHOST,
      port: process.env.PGPORT,
      database: process.env.PGDATABASE,
    });
    await client.connect();
    return client;
  } catch (err) {
    logger.error("Failed to connect to DB: " + err.message);
  }
};

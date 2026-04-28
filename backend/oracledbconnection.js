

const oracledb = require("oracledb");

// Only the client libraries path
oracledb.initOracleClient({
  libDir: "C:/Users/Shyam/Desktop/EventDecor/event-decoration-site/backend/instantclient/instantclient_23_8"
});

async function test() {
  try {
    const conn = await oracledb.getConnection({
      user: "ADMIN",
      password: "Oracle@123Oracle@123?",
      connectString: "atpdbsa_high", // defined in tnsnames.ora
      configDir: "C:/Users/Shyam/Desktop/EventDecor/event-decoration-site/backend/wallet", // path to wallet
      walletLocation: "C:/Users/Shyam/Desktop/EventDecor/event-decoration-site/backend/wallet" // optional
   
    });

    console.log("✅ Connected!");
    const result = await conn.execute("SELECT sysdate FROM dual");
    console.log(result.rows);
    await conn.close();
  } catch (err) {
    console.error(err);
  }
}

test();
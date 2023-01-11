/**
 * Script to stop the (MongoDB replicaset) database server
 * Options:
 *  -d --down:
 *    invokes "docker-compose down". This will also delete the database volumes,
 *    and every previously stored data will be lost.
 *    Consequently, the next time the complementary "start-db" script is invoked,
 *    "docker-compose up" is called to setup the database afresh.
 *
 *  If the -d (--down) option is not specified,
 *    "docker-compose stop" is invoked instead.
 *    Then, the on the next invocation of the "start-db" script,
 *    "docker-compose start" is called.
 *
 *  USAGE: stop-db.js [-d (--down)]
 */

const fs = require("fs");
const { parentDir, runCommand } = require("./_include");

const REGEX = /\\/g;
const DELIM = "*".repeat(45);
const cmdArgs = process.argv.slice(2);
const destroyDbArgs = cmdArgs.filter(arg => ["-d", "--down"].includes(arg));
const destroyDb = destroyDbArgs.length > 0;
const dbSetupDir = `${parentDir}/`.replace(REGEX, "/");
const composeFile = `${dbSetupDir}/docker-compose.yml`;

const command = destroyDb
  ? `docker-compose -f ${composeFile} down -v`
  : `docker-compose -f ${composeFile} stop`;


console.log();
console.log(DELIM);
console.log(`Running ${command}...`);

runCommand(command)
  .then(() => {
    console.log("Database service stopped");

    if(destroyDb) {
      const dataDir = `${dbSetupDir}/.data`.replace(REGEX, "/");

      try {
        fs.rmSync(dataDir, { recursive: true });
        //fs.rmdirSync(dataDir, { recursive: true });
        console.log("Data directory deleted");
      } catch(err) {
        console.log("Error deleting data directory: ", err);
      }
    }
  })
  .catch(err => console.log(`Error stopping the database service: ${err}`))
  .finally(() => {
    console.log(DELIM);
    console.log();
  });

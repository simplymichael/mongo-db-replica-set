/**
 * Script to start the (MongoDB replicaset) database server
 *
 * If the /.data/mongodb/mongodata1 directory already exists,
 * then we assume we've previously run "docker-compose up",
 * so, we just run "docker-compose start". Otherwise,
 * we run "docker-compose up" to create a clean database
 */

const fs = require("fs");
const { parentDir, runCommand } = require("./_include");

const DELIM = "*".repeat(45);
const dbSetupDir = `${parentDir}`.replace(/\\/g, "/");
const dataDir = `${dbSetupDir}/.data`;
const composeFile = `${dbSetupDir}/docker-compose.yml`;

const command = fs.existsSync(`${dataDir}/mongodata1`)
  ? `docker-compose -f ${composeFile} start`
  : `docker-compose -f ${composeFile} up -d`;

console.log();
console.log(DELIM);
console.log(`Running ${command}...`);

runCommand(command)
  .then(() => console.log("Database service started successfully"))
  .catch(err => console.log(`Error starting the database service: ${err}`))
  .finally(() => {
    console.log(DELIM);
    console.log();
  });

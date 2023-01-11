/**
 * Script to back-up the (MongoDB replicaset) database server
 */
const fs = require("fs");
const { env, parentDir, runCommand } = require("./_include");

const {
  PRIMARY_HOST,
  PRIMARY_HOST_PORT,
  DB_NAME,
  REPLICA_SET_ID,
  PROXY_CONTAINER_NAME
} = env;

const backupDir = `${parentDir}/.backup`.replace(/\\/g, "/");
const backupDate = formatBackupDate(Date.now());
const backupFile = `${backupDir}/db.${backupDate}.archive`;
const proxyContainer = PROXY_CONTAINER_NAME;

const connString = `mongodb://${PRIMARY_HOST}:${PRIMARY_HOST_PORT}/${DB_NAME}?replicaSet=${REPLICA_SET_ID}`;
const command = `docker exec ${proxyContainer} mongodump ${connString} -d ${DB_NAME} --archive > ${backupFile}`;

// Create backup directory if it  does not already exist
fs.existsSync(backupDir) || fs.mkdirSync(backupDir);

console.log();
console.log(`Running ${command}...`);

runCommand(command)
  .then(() => {
    console.log("Database backup completed successfully");
  
    try {
      const backupNameTextFile = `${backupDir}/last-backup.txt`;
  
      fs.writeFileSync(backupNameTextFile, backupFile);
  
      console.log(`
        Successfully written backup file name to text file "${backupNameTextFile}".
        Read this file to get the name of the last backup. 
        Run "npm run db:restore" to restore data from the last backup file.`
      );
    } catch(err) {
      console.log(`Error writing backup name "${backupFile}" to text file "${backupNameTextFile}"`);
    }
  })
  .catch(err => {
    console.log(`Error backing up the database: command ${command} exited with code ${err}`);
  });

function formatBackupDate(date) {
  let d     = new Date(date);
  let month = "" + (d.getUTCMonth() + 1);
  let day   = "" + d.getUTCDate();
  let year  = d.getUTCFullYear();

  let hour    = "" + (d.getUTCHours());
  let minutes = "" + d.getUTCMinutes();
  let seconds = "" + d.getUTCSeconds();

  if (month.length < 2) {
    month = "0" + month;
  }

  if (day.length < 2) {
    day = "0" + day;
  }

  if(hour.length < 2) {
    hour = "0" + hour;
  }

  if(minutes.length < 2) {
    minutes = "0" + minutes;
  }

  if(seconds.length < 2) {
    seconds = "0" + seconds;
  }

  return `${[year, month, day].join("")}_${[hour, minutes, seconds].join("")}`;
}

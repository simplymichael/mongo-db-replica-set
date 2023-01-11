/**
 * Script to restore the last back-up of the (MongoDB replicaset) database server
 */
const fs = require("fs");
const { env, parentDir, runCommand } = require("./_include");

const { PRIMARY_CONTAINER_NAME, DB_NAME } = env;
const backupDir = `${parentDir}/.backup`.replace(/\\/g, "/");
const lastBackupFile = fs.readFileSync(`${backupDir}/last-backup.txt`, "utf8").trim();
const backupFilename = lastBackupFile.split("/").pop();

const targetFile = `/${backupFilename}`;
const targetContainer = PRIMARY_CONTAINER_NAME;

const command = `docker exec ${targetContainer} sh -c "exec mongorestore -d ${DB_NAME} --archive=${targetFile}"`;

console.log();
console.log("Copying backup file from docker host to container...");

runCommand(`docker cp ${lastBackupFile} ${targetContainer}:${targetFile}`)
.then(() => {
  console.log(`Running database restore command: ${command} ...`);

  return runCommand(command);
})
.then(() => {
  console.log("Database restore completed successfully");
  console.log("Deleting backup file from container");

  return runCommand(`docker exec ${targetContainer} sh -c "rm ${targetFile}"`)
})
.then(() => console.log("Deleted backup file from container"))
.catch(err => console.log(`Error restoring database from backup: ${err}`))
.finally(() => console.log());

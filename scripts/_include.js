const path = require("path");
const runCommand = require("./command-runner");

const parentDir = path.resolve(__dirname, "..");

require("dotenv").config({
  path: `${parentDir.replace(/\\/g, "/")}/.env`, 
});

const { env } = process;

module.exports = {
  env,
  parentDir, 
  runCommand,
};

/**
 * Script to login to the DB containers
 * 
 * Arguments:
 *  <target>:
 *    required.
 *    The target container to log into.
 *    Supported targets are: primary, secondary, tertiary, and proxy
 * <command>: 
 *   optional.
 *   The docker command to run once inside the container.
 *   For now, only two commands are supported: bash and mongo.
 *
 *  USAGE: login-to-db.js <primary|secondary|tertiary|proxy> [bash|mongo]
 */
const { env, runCommand } = require("./_include"); 

const {
  PRIMARY_CONTAINER_NAME,
  SECONDARY_CONTAINER_NAME,
  TERTIARY_CONTAINER_NAME,
  PROXY_CONTAINER_NAME
} = env;

let container = PRIMARY_CONTAINER_NAME;
let dockerCommand = 'bash';

// If we are passed command line arguments,
// it means the file is being run on the command line, e.g:
// node src/scripts/create-config-files.js cypress
// node src/scripts/create-config-files.js jekyll
// node src/scripts/create-config-files.js search
// node src/scripts/create-config-files.js cypress jekyll search
// Parse the command line arguments and
// create a config file from each of the passed arguments
if (process.argv.length >= 3) {
  const cliArgs = process.argv.slice(2).map(f => f.trim().toLowerCase());
  const targetContainer = cliArgs[0];
  const allowedDockerCommands = ['bash', 'mongo'];

  if(typeof cliArgs[1] !== 'undefined' && allowedDockerCommands.includes(cliArgs[1])) {
    dockerCommand = cliArgs[1];
  }

  switch(targetContainer) { 
    case '2'        : 
    case 'secondary': container = SECONDARY_CONTAINER_NAME; break;

    case '3'        : 
    case 'tertiary' : container = TERTIARY_CONTAINER_NAME; break;

    case '4'        : 
    case 'proxy'    : container = PROXY_CONTAINER_NAME; break;

    case '1'        : 
    case 'primary'  : 
    default         : container = PRIMARY_CONTAINER_NAME; break;
    
  }
}

if(container === PROXY_CONTAINER_NAME) {
  dockerCommand = 'bash';
}

let command = `docker exec -it ${container} ${dockerCommand}`;


console.log(`Logging into database container: ${container} ...`);

runCommand(command)
  .then(() => {})
  .catch(err => {
    console.log(`Error logging into the database container: command ${command} exited with code ${err}`);
  });

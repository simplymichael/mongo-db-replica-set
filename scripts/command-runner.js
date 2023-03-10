const cp = require("child_process");

module.exports = function runCommand(command) { 
  return new Promise((resolve, reject) => {
    const ps = cp.spawn(command, {
      stdio: 'inherit',
      shell: true
    });

    ps.on('close', (code) => {
      if(code === 0) {
        resolve(code);
      } else {
        reject(code);
      }
    });
  });
};

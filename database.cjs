var exec = require('child_process').exec;

exec('npx json-server --watch database.json --port 3010', async (err, stdout, stderr) => {
    console.log(err);
    console.log(stdout);
    console.log(stderr);
})
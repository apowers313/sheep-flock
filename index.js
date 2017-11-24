var gofast = require("gofast");
var GoFastServer = gofast.Server;

var workerConfig = {
    api: {
        provider: "digitalocean",
        // token: "DEADBEEF0BADCODE" // from command line, or environment
    },
    server: {
        region: "SFO1",
        size: "512mb",
        image: "ubuntu-14-04-x64",
        ssh_keys: ["a7:f9:cb:48:e3:97:39:4c:9b:e7:d9:57:9e:7d:17:96"], // ssh-keygen -l -E md5 -f ~/.ssh/id_rsa.pub
        backups: false,
        ipv6: false,
        private_networking: false,
    },
    config: {
        user: "root",
        pkFile: "/Users/apowers/.ssh/id_rsa", // TODO: from command line
        setupCmds: [{
            function: "sshExec",
            args: ["apt-get update"]
        }, {
            function: "sshExec",
            args: ["curl -sL https://deb.nodesource.com/setup_4.x | sudo -E bash - && sudo apt-get install -y nodejs"]
        }],
    }
};

var projectConfig = {
    path: "./worker"
};

var callbacks = {
    getJob: getJob,
    receiveResult: receiveResult,
};

var options = {
    concurrency: 3,
    test: true,
    testVerbose: true
};

var server = new GoFastServer(workerConfig, projectConfig, callbacks, options);
server.init();

var i = 0;

function getJob(done) {
    // console.log ("getJob");
    this.log.info("Server: Dishing up a Job");
    i++;
    if (i > 10) done(null);
    else done("job " + i);
}

function receiveResult(result, done) {
    this.log.info("Server: Got a result:", result);
    done(null);
    // console.log ("receiveResult");
}
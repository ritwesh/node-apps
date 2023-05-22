const mysql = require('mysql2');
const fs = require('fs');
const { Client } = require('ssh2');
const sshClient = new Client();
const dbServer = {
    host: '127.0.0.1',
    port:'3306',
    user: 'edxapp001',
    password: 'g8yIXL69N7RZXLMO2oyIsFD9hl2FaQzVOtD',
    database: 'edxapp'
}
const tunnelConfig = {
    host: '43.205.9.167',
    port: 22,
    username: 'ubuntu',
    privateKey: fs.readFileSync('./lms-test.pem')
}
const forwardConfig = {
    srcHost: '127.0.0.1',
    srcPort: 3306,
    dstHost: dbServer.host,
    dstPort: dbServer.port
};
const SSHConnection = new Promise((resolve, reject) => {
    sshClient.on('ready', () => {
        sshClient.forwardOut(
        forwardConfig.srcHost,
        forwardConfig.srcPort,
        forwardConfig.dstHost,
        forwardConfig.dstPort,
        (err, stream) => {
             if (err) reject(err);
             const updatedDbServer = {
                 ...dbServer,
                 stream
            };
            const connection =  mysql.createConnection(updatedDbServer);
            connection.query('SELECT * FROM routine_batch LIMIT 10', (error, results, fields) => {
                if (error) throw error;
                // console.log('The solution is: ', results);
                connection.end();
                sshClient.end();
              });
            // connection.connect((error) => {
            //     if (error) {
            //         reject(error);
            //     }
            //     console.log("running")
                
            // resolve(connection);
            // });
        });
    }).connect(tunnelConfig);
});


module.exports={
    SSHConnection,
    tunnelConfig,
    dbServer,
forwardConfig
};
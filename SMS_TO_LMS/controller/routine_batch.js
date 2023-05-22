const dbConfig = require('../dbconfig');
const { Client } = require('ssh2');
const mysql = require('mysql2');
const { NEWDATE } = require('mysql/lib/protocol/constants/types');
const sshClient = new Client();


const check_if_videos_uploaded_to_vimeo = async (req, res) => {
    try {

        SSHConnection = new Promise((resolve, reject) => {
            sshClient.on('ready', () => {
                sshClient.forwardOut(
                    dbConfig.forwardConfig.srcHost,
                    dbConfig.forwardConfig.srcPort,
                    dbConfig.forwardConfig.dstHost,
                    dbConfig.forwardConfig.dstPort,
                    (err, stream) => {
                        if (err) reject(err);
                        const updatedDbServer = {
                            ...dbConfig.dbServer,
                            stream
                        };
                        const connection = mysql.createConnection(updatedDbServer);

                        connection.query('SELECT * from routine_batch LIMIT 50', (error, results, fields) => {
                            if (error) res.send(error);
                            console.log("result", results);
                            console.log("result", results.length);


                            const response = {
                                data: results,
                                statusCode: 200
                            }
                            // res.send(response);
                            resolve(response);
                            connection.end();
                            sshClient.end();
                        });


                    });
            }).connect(dbConfig.tunnelConfig);
        });
    } catch (e) {
        // res.send(e);
        resolve(e);
    }

    SSHConnection.then((value) => {
        console.log(value);
        res.send(value);
    });
};

/* The code defines an asynchronous function create_batch that handles a POST request to create a new batch in a MySQL database.

The function tries to establish an SSH connection using the sshClient object provided in the dbConfig object. The connection is established by forwarding a local port through the remote host to the target database server specified in dbConfig.

Once the SSH connection is established, the function creates a new MySQL connection using the mysql.createConnection() method along with the updatedDbServer object which includes the forwarded stream.

The function then extracts the branchUniqueId value from the request body and uses it to query the routine_branch table to fetch the corresponding id.

After getting the id, it constructs an array of values required to insert a new row in the routine_batch table. The values are obtained from the data in the request body and other sources such as the current date and time.

Finally, the function inserts the new record into the routine_batch table using the connection.query() method and sends a success response to the client. It also closes both the MySQL and SSH connections using connection.end() and sshClient.end(), respectively. If there's any error during the process, it sends an error response to the client.

Note: The code assumes that all required modules, objects, and configurations have been properly imported and initialized before this function is called. */

const create_batch = async (req, res) => {
    try {

        SSHConnection = new Promise((resolve, reject) => {
            sshClient.on('ready', () => {
                sshClient.forwardOut(
                    dbConfig.forwardConfig.srcHost,
                    dbConfig.forwardConfig.srcPort,
                    dbConfig.forwardConfig.dstHost,
                    dbConfig.forwardConfig.dstPort,
                    (err, stream) => {
                        if (err) reject(err);
                        const updatedDbServer = {
                            ...dbConfig.dbServer,
                            stream
                        };
                        const connection = mysql.createConnection(updatedDbServer);

                        let value1 = req.body.data.branchUniqueId;

                        console.log("req.body.data.branchUniqueId;", value1);



                        connection.query('SELECT id from routine_batch where batch_unique_id = ?', req.body.data.batchUniqueId, (error, results, fields) => {
                            if (error) res.send(error);
                            console.log("result", results);
                            console.log("result", results.length);


                            if (results.length === 1) {
                                const response = {
                                    warning: "Duplicate value for batch unique id",
                                    statusCode: 200
                                }
                                // res.send(response);
                                resolve(response);
                            }

                            else {
                                // connection.query('SELECT id from routine_slot where start_time = ? and ',value)
                                connection.query('SELECT id from routine_branch where branch_unique_id = ?', value1, (error, results, fields) => {
                                    if (error) res.send(error);
                                    console.log("result", results[0].id);
                                    let values = [
                                        batch_name = req.body.data.batchName,
                                        student_strength = req.body.data.studentStrength,
                                        day_preferences = req.body.data.dayPref,
                                        start_date = req.body.data.startDate,
                                        end_date = req.body.data.endDate,
                                        created_datetime = new Date(),
                                        modified_datetime = new Date(),
                                        branch_id = (results[0].id).toString(),
                                        course_id = req.body.data.courseId,
                                        batch_unique_id = req.body.data.batchUniqueId,
                                        is_deactivated = req.body.data.is_deactivated,
                                        class_mode = req.body.data.classMode,
                                        min_strength = req.body.data.minimumStrength,
                                        batch_type = req.body.data.batch_type,
                                        category_id = req.body.data.category_id,
                                        language_id = req.body.data.language_id,
                                        current_batch_strength = req.body.data.current_batch_strength,
                                        enrollment_type = req.body.data.enrollment_type,
                                        first_enrollment_date = req.body.data.first_enrollment_date,
                                        grace_period_in_days = req.body.data.grace_period_in_days,
                                        max_join_buffer = req.body.data.max_join_buffer,
                                        last_start_date = req.body.data.last_start_date
                                    ]
                                    console.log("languageId", req.body.data.language_id);
                                    connection.query('INSERT INTO routine_batch (batch_name,student_strength,day_preferences,start_date,end_date,created_datetime,modified_datetime,branch_id,course_id,batch_unique_id,is_deactivated,class_mode,min_strength,batch_type,category_id,language_id,current_batch_strength,enrollment_type,first_enrollment_date,grace_period_in_days,max_join_buffer,last_start_date) VALUE (?)', [values], (error, results, fields) => {
                                        if (error) throw error;

                                        const response = {
                                            success: "true",
                                            statusCode: 200,
                                            data: results
                                        }
                                        // res.send(response);
                                        resolve(response);
                                        connection.end();
                                        sshClient.end();
                                    });
                                });
                            }



                        });


                    });
            }).connect(dbConfig.tunnelConfig);
        });
    } catch (e) {
        // res.send(e);
        resolve(e);
    }

    SSHConnection.then((value) => {
        console.log(value);
        res.send(value);
    });
};

let resp = {};


// The code defines an asynchronous function update_batch that handles a POST request to update an existing batch in a MySQL database.

// The function first tries to establish an SSH connection using the sshClient object provided in the dbConfig object. The connection is established by forwarding a local port through the remote host to the target database server specified in dbConfig.

// Once the SSH connection is established, the function creates a new MySQL connection using the mysql.createConnection() method along with the updatedDbServer object which includes the forwarded stream.

// The function then extracts the batchUniqueId value from the request body and uses it to query the routine_batch table to fetch the corresponding record. If the record exists, it checks whether the is_deactivated flag is already set to 1 or not.

// If the status field of the request body is defined, the function updates the is_deactivated flag accordingly if it's not already set to the same value. Otherwise, if the status field is not defined, the function updates the other fields of the record based on the data in the request body.

// After updating the record, the function sends a success response to the client and ends both the MySQL and SSH connections using connection.end() and sshClient.end(), respectively. If there's any error during the process, it sends an error response to the client.

// Note: The code assumes that all required modules, objects, and configurations have been properly imported and initialized before this function is called.

const update_batch = async (req, res) => {
    try {

        SSHConnection = new Promise((resolve, reject) => {
            sshClient.on('ready', () => {
                sshClient.forwardOut(
                    dbConfig.forwardConfig.srcHost,
                    dbConfig.forwardConfig.srcPort,
                    dbConfig.forwardConfig.dstHost,
                    dbConfig.forwardConfig.dstPort,
                    (err, stream) => {
                        if (err) reject(err);
                        const updatedDbServer = {
                            ...dbConfig.dbServer,
                            stream
                        };
                        const connection = mysql.createConnection(updatedDbServer);

                        let value1 = req.body.data.batchUniqueId;

                        // console.log("req.body.data.batchUniqueId;", value1);
                        connection.query('SELECT is_deactivated from routine_batch where batch_unique_id = ?', value1, (error, results, fields) => {
                            if (error) res.send(error);
                            console.log("result", results);
                            console.log("result", results.length);


                            if (req.body.data.status != undefined) {

                                if (results[0].is_deactivated === 0) {
                                    let values =
                                    {
                                        batch_unique_id: req.body.data.batchUniqueId,
                                        is_deactivated: req.body.data.status === 'deactivated' ? '1' : '0'

                                    }

                                    connection.query('UPDATE routine_batch SET ? where batch_unique_id= ?', [values, req.body.data.batchUniqueId], (error, results, fields) => {
                                        if (error) throw error;

                                        resp = {
                                            success: "true",
                                            statusCode: 200,
                                            data:results
                                        }

                                        resolve(resp);
                                    });


                                }
                                else if (results[0].is_deactivated === 1) {
                                    resp = {
                                        error: "Batch is already Deactivated",
                                        statusCode: 200
                                    }

                                    console.log('Batch is already Deactivated');
                                    resolve(resp);
                                }

                            }
                            else {



                                if (results.length >= 1 && results[0].is_deactivated === 0) {
                                    console.log("Inside If block");
                                    let values = {
                                        batch_name: req.body.data.batchName,
                                        student_strength: req.body.data.studentStrength,
                                        day_preferences: req.body.data.dayPref,
                                        start_date: req.body.data.startDate,
                                        end_date: req.body.data.endDate,
                                        // created_datetime = new Date(),
                                        modified_datetime: new Date(),
                                        // branch_id = (results[0].id).toString(),
                                        course_id: req.body.data.courseId,
                                        batch_unique_id: req.body.data.batchUniqueId,
                                        is_deactivated: req.body.data.is_deactivated,
                                        class_mode: req.body.data.classMode,
                                        min_strength: req.body.data.minimumStrength,
                                        batch_type: req.body.data.batch_type,
                                        category_id: req.body.data.category_id,
                                        language_id: req.body.data.language_id,
                                        current_batch_strength: req.body.data.current_batch_strength,
                                        enrollment_type: req.body.data.enrollment_type,
                                        first_enrollment_date: req.body.data.first_enrollment_date,
                                        grace_period_in_days: req.body.data.grace_period_in_days,
                                        max_join_buffer: req.body.data.max_join_buffer,
                                        last_start_date: req.body.data.last_start_date
                                    }
                                    connection.query('UPDATE routine_batch SET ? where batch_unique_id= ?', [values, req.body.data.batchUniqueId], (error, results, fields) => {
                                        if (error) throw error;

                                        resp = {
                                            success: "true",
                                            statusCode: 200
                                        }
                                        // res.send(resp);
                                        resolve(resp);
                                        connection.end();
                                        sshClient.end();
                                    });
                                }
                                else if (results.length >= 1 && results[0].is_deactivated === 1) {
                                    resp = {
                                        error: "Batch is already Deactivated",
                                        statusCode: 200
                                    }
                                    resolve(resp);
                                    connection.end();
                                    sshClient.end();
                                }
                                else if (results.length === 0) {
                                    resp = {
                                        error: "Batch Does Not Exist",
                                        statusCode: 404
                                    }
                                    resolve(resp);
                                    connection.end();
                                    sshClient.end();
                                }
                            }


                        });
                    });
            }).connect(dbConfig.tunnelConfig);
        });
    } catch (e) {
        resolve(e);
        // res.send(e);
    }

    SSHConnection.then((value) => {
        console.log(value);
        res.send(value);
    });
};


const update_student = async (req, res) => {
    try {
        SSHConnection = new Promise((resolve, reject) => {
            sshClient.on('ready', () => {
                sshClient.forwardOut(
                    dbConfig.forwardConfig.srcHost,
                    dbConfig.forwardConfig.srcPort,
                    dbConfig.forwardConfig.dstHost,
                    dbConfig.forwardConfig.dstPort,
                    (err, stream) => {
                        if (err) reject(err);
                        const updatedDbServer = {
                            ...dbConfig.dbServer,
                            stream
                        };
                        const connection = mysql.createConnection(updatedDbServer);

                        let value1 = req.body.data.studentUniqueId;

                        // console.log("req.body.data.batchUniqueId;", value1);
                        connection.query('SELECT id from routine_student where student_unique_id = ?', value1, (error, results, fields) => {
                            if (error) res.send(error);
                            console.log("result", results);
                            console.log("result", results.length);

                            if (results.length >= 0) {
                                console.log("Inside If block");
                                let values = {
                                    student_unique_id: req.body.data.studentUniqueId,
                                    student_detail_id: req.body.data.studentDetailId,
                                    contact_no: req.body.data.contactNo,
                                    address: req.body.data.address,
                                    state: req.body.data.state,
                                    city: req.body.data.city,
                                    pincode: req.body.data.pincode,
                                    is_discontinued: req.body.data.is_discontinued,
                                    modified_datetime: new Date(),
                                    lms_student_id: req.body.data.lms_student_id,
                                    enrolled_pathways: req.body.data.enrolled_pathways,
                                    has_completed: req.body.data.has_completed,
                                    is_defaulter: req.body.data.is_defaulter,
                                    is_dropout: req.body.data.is_dropout,
                                    is_onleave: req.body.data.is_onleave,
                                    is_predefaulter: req.body.data.is_predefaulter,
                                    is_waiting: req.body.data.is_waiting,
                                    defaulter_date: req.body.data.defaulter_date,
                                    second_language: req.body.data.second_language,
                                    is_payment_due: req.body.data.is_payment_due,
                                    payment_due_date: req.body.data.payment_due_date,
                                    // grace_period_in_days: req.body.data.grace_period_in_days,
                                    // max_join_buffer: req.body.data.max_join_buffer,
                                    // last_start_date: req.body.data.last_start_date
                                }
                                connection.query('UPDATE routine_student SET ? where student_unique_id= ?', [values, req.body.data.studentUniqueId], (error, results, fields) => {
                                    if (error) throw error;

                                    resp = {
                                        success: "true",
                                        statusCode: 200
                                    }
                                    // res.send(resp);
                                    resolve(resp);
                                    connection.end();
                                    sshClient.end();
                                });
                            }
                            else {
                                resp = {
                                    error: "Student Does not exists",
                                    statusCode: 200
                                }
                                resolve(resp);
                                connection.end();
                                sshClient.end();
                            }

                        });
                    });
            }).connect(dbConfig.tunnelConfig);
        });
    } catch (e) {
        res.send(e);
    }
};

const add_student_to_batch = async (req, res) => {
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
                    const connection = mysql.createConnection(updatedDbServer);
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
}


module.exports = {
    create_batch,
    update_batch,
    update_student,
    add_student_to_batch,
    check_if_videos_uploaded_to_vimeo
};
const express = require('express');
const bodyParser = require('body-parser');
const app = express();

const dbConfig = require('./dbconfig');

// const routine_batch=require('./controller/routine_batch');

app.use(bodyParser.json());

const mysql = require('mysql2');
const routine_batch = require('./controller/routine_batch');

app.get('/check_if_videos_uploaded_to_vimeo', routine_batch.check_if_videos_uploaded_to_vimeo);

app.post('/routine_batch/create', routine_batch.create_batch);

app.put('/routine_batch/update', routine_batch.update_batch);

app.put('/status/update', routine_batch.update_batch);

app.put('/student/update', routine_batch.update_student);



app.listen(8000, () => {
    console.log(`server is running on port : 8000`);
});

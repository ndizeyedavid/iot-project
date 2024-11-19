const express = require('express');
const cors = require('cors');
const mysql = require('mysql2');
const bcrypt = require("bcrypt");
const app = express();
const bodyParser = require('body-parser');
const dotenv = require('dotenv');

dotenv.config();

const port = process.env.PORT;

app.use(cors());
app.use(bodyParser.json({ limit: '50mb' })); 

app.listen(port, ()=>{
    console.log("Server running. Port: "+ port);
});

const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DATABASE,
    port: process.env.DB_PORT
});
let isConnect = false;

db.on('error', (err)=>{
    console.log("DB Connection failed, \nError: " + err);
})
db.on('connect', (stream)=>{
    isConnect = true;
    console.log('DB connected!');
})


app.get('/', (req, res)=>{
  res.json({Server: "Online", Port: port, Database_connected: isConnect});  
})




//  ============================== unique ==============================





// Login
app.post('/admin/login', (req, res)=>{
    const email = req.body.email; 
    const password = req.body.password;
    const sql = "SELECT name, email, password FROM admin WHERE email = ?";
    db.query(sql, [email], async (err, result)=>{
        if (err) return res.json({error: "Operation failed", message: err.sqlMessage});

        if(result.length > 0){
            const hashedPassword = result[0].password;
            bcrypt.compare(password, hashedPassword, (err, result)=>{
                if(err) return res.json({error: "Operation failed", message: err.sqlMessage});
                if(result){
                    res.json({success: "Login successful"});
                }else{
                    res.json({error: "Incorrect password"});
                }
            });    
        }else{
            res.json({error: "Invalid Credentials"});
        }
    });
});

// stats fetching 
app.get('/admin/stats', (req, res) => {
    const stats = [];
    const sql1 = "SELECT COUNT(*) as total_users FROM users WHERE user_name !='000000'";
    db.query(sql1, (err, result) => {
        if (err) return res.json({error: "Operation failed", message: err.sqlMessage});
        stats.push({total_users: result[0].total_users});
        // res.json(stats);
    });
    
    const sql2 = "SELECT COUNT(*) as total_messages FROM messages";
    db.query(sql2, (err, result) => {
        // console.log(stats);
        if (err) return res.json({error: "Operation failed", message: err.sqlMessage});
        stats.push({total_messages: result[0].total_messages});
        res.json(stats);
    });
})

// recent activities
app.get('/admin/recent', (req, res) => {
    const recent_activities = [];
    const sql1 = "SELECT user_name as recent FROM users WHERE user_name !='000000' ORDER BY id DESC LIMIT 1";
    db.query(sql1, (err, result) => {
        if (err) return res.json({error: "Operation failed", message: err.sqlMessage});
        recent_activities.push(result[0]);
        // res.json(recent_activities);
    });
    
    const sql2 = "SELECT COUNT(*) as total_messages FROM messages where isRead = 0 ";
    db.query(sql2, (err, result) => {
        // console.log(recent_activities);
        if (err) return res.json({error: "Operation failed", message: err.sqlMessage});
        recent_activities.push({total_messages: result[0].total_messages});
        res.json(recent_activities);
    });
})

// view all users
app.get('/admin/users', (req, res) => {
    const sql = "SELECT users.user_id, users.user_name, users.phone, users.pregnant_date, user_details.temperature, user_details.blood_pressure FROM users INNER JOIN user_details ON users.user_id=user_details.user_id";
    db.query(sql, (err, result) => {
        if (err) return res.json({error: "Operation failed", message: err.sqlMessage});
        res.json(result);
    });
})

// =================== Messages =================
app.get('/admin/message/view/all', (req, res) => {
    // const id = req.query.id;
    const sql = `
        SELECT DISTINCT users.user_name, messages.isRead, messages.sender_id
        FROM users
        INNER JOIN messages ON users.user_id = messages.sender_id
        WHERE messages.receiver_id = 'admin';
    `;
    db.query(sql, (err, result) => {
        if (err) return res.json({error: "Operation failed", message: err.sqlMessage});
        res.json(result);
    });
})

app.get('/admin/message/view/single', (req, res) => {
    const sender_id = req.query.id;
    // const sql = "SELECT messages.message_sent as sender_message FROM users INNER JOIN messages ON users.user_id=messages.sender_id WHERE messages.receiver_id='admin' AND messages.sender_id= ?"
    const sql = `
    SELECT messages.msg_id, messages.message_sent as message, messages.receiver_id, sender_id FROM users INNER JOIN messages ON users.user_id=messages.sender_id WHERE messages.sender_id= ? OR (messages.sender_id='admin' AND messages.receiver_id= ? );
    `;
    
    db.query(sql, [sender_id, sender_id], (err, result) => {
        if (err) return res.json({error: "Operation failed", message: err.sqlMessage});
        res.json(result);
    })
})

app.get('/admin/message/view/read', (req, res) => {
    const sender_id = req.query.id;
    const sql = "UPDATE messages SET isRead = 1 WHERE sender_id = ?";
    db.query(sql, [sender_id], (err, result) => {
        if (err) return res.json({error: "Operation failed", message: err.sqlMessage});
        // res.json({success: "Message read status updated"});
    }) 
    
})


app.post('/admin/message/send', (req, res) => {
    const message = req.body.message;
    const receiver_id = req.body.receiver_id;
    const msg_id = Math.floor(Math.random() * 100000);
    const sql = "INSERT INTO messages (msg_id, sender_id, receiver_id, message_sent, isRead) VALUES (?, ?, ?, ?, ?)";
    db.query(sql, [msg_id, 'admin', receiver_id, message, 1], (err, result) => {
        if (err) return res.json({error: "Operation failed", message: err.sqlMessage});

        // fetch new messages

        const fetch = `
        SELECT messages.msg_id, messages.message_sent as message, messages.receiver_id, sender_id FROM users INNER JOIN messages ON users.user_id=messages.sender_id WHERE messages.sender_id= ? OR (messages.sender_id='admin' AND messages.receiver_id= ? );
        `;
        db.query(fetch, [receiver_id, receiver_id], (err, result) => {
            res.json(result);
        })
    })
})

// ================= profile updating =================
app.post('/admin/update', (req, res) => {
    const email = req.body.email;
    const name = req.body.name;
    const password = req.body.password;
    
    const sql = `
    UPDATE admin SET email = ?, name = ?, password = ?
    ` 
    db.query(sql, [email, name, password], (err, result) => {
        if (err) return res.json({error: "Operation failed", message: err.sqlMessage});
        res.json({success: "Profile updated"});
    })
})
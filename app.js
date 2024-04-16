const multer = require('multer');
const express = require("express");
const path = require("path");
const bcrypt = require("bcrypt");
const sqlite3 = require('better-sqlite3');
const db = sqlite3('./database.db', { verbose: console.log });
const session = require('express-session');
const dotenv = require('dotenv');
const upload = multer();

dotenv.config();

const saltRounds = 10;
const app = express();
const staticPath = path.join(__dirname, 'public');

app.use(express.urlencoded({ extended: true }));

app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false
}));

app.use(express.static(staticPath));

//Checks if password and familycode are correct, gives them data back
app.post('/login', upload.none(), (req, res) => {
    try {
        let user = checkUserPassword(req.body.username, req.body.password);
        if (user != null) {
            req.session.loggedIn = true;
            req.session.username = user.username;
            req.session.userrole = user.role;
            req.session.userid = user.userid;
            res.json(user);
        } else {
            res.json(null);
        }
    } catch (error) {
        console.error(error);
        res.json(null);
    }
});

app.post('/register', (req, res) => {
    const reguser = req.body;
    const user = addUser(reguser.username, reguser.firstname, reguser.lastname, reguser.epost, reguser.password, reguser.mobile, reguser.age, reguser.role);
    if (user) {
        req.session.loggedIn = true;
        req.session.username = user.username;
        req.session.userrole = user.role;
        req.session.userid = user.userid;
        res.send(true);
    } else {
        res.send(false);
    }
});

function addUser(username, firstname, lastname, email, password, mobile, age, idrole) {
    const hash = bcrypt.hashSync(password, saltRounds);
    
    // First, insert the user into the user table
    const sqlUser = db.prepare("INSERT INTO user (username, firstname, lastname, email, password, mobile, age, idrole) VALUES (?, ?, ?, ?, ?, ?, ?, ?)");
    try {
        const info = sqlUser.run(username, firstname, lastname, email, hash, mobile, age, idrole);
        const insertedUserId = info.lastInsertRowid;
        
        // Return the user data
        const user = getUserById(insertedUserId);
        return user;
    } catch (error) {
        console.error("Error adding user:", error);
        return null;
    }
}


app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, "public/login.html"));
});


function checkUserPassword(username, password) {
    const sql = db.prepare(`
        SELECT user.id AS userid, username, role.name AS role, password 
        FROM user 
        INNER JOIN role ON user.idrole = role.id 
        WHERE username = ?
    `);
    let user = sql.get(username);
    if (user && bcrypt.compareSync(password, user.password)) {
        return user;
    } else {
        return null;
    }
}


// Middleware to check if the user is logged in
function checkLoggedIn(req, res, next) {
    console.log(1)
    if (!req.session.loggedIn) {
        console.log(2)
        res.sendFile(path.join(__dirname, "public/login.html")); // Send the login page
        console.log(3)
    } else {
        next();
    }
}

function getUserById(userId) {
    const sql = db.prepare('SELECT user.id as userid, username, role.name as role FROM user INNER JOIN role ON user.idrole = role.id WHERE user.id = ?');
    const user = sql.get(userId);
    return user;
}

// Middleware function to check if the user is an admin
function isAdmin(req, res, next) {
    // Check if the user is logged in and has the admin role
    if (req.session.loggedIn && req.session.userrole === 'admin') {
        // User is admin, allow access to the next middleware or route handler
        next();
    } else {
        // User is not admin, deny access
        res.status(403).send('Forbidden');
    }
}

// Route for serving admin.html, protected by isAdmin middleware
app.get('/admin', isAdmin, (req, res) => {
    // Serve the admin.html page
    res.sendFile(path.join(__dirname, 'public/admin.html'));
});

app.get('/currentUser', checkLoggedIn,  (req, res) => {
    const sql = db.prepare('SELECT user.id AS userid, username, role.name AS role, firstname, lastname, email, mobile, age FROM user INNER JOIN role ON user.idrole = role.id WHERE user.id = ?');
    const user = sql.get(req.session.userid);
    res.send([user.userid, user.username, user.role, user.firstname, user.lastname, user.epost, user.mobile, user.age]);
});

app.get('/', checkLoggedIn, (req, res) => {
    res.sendFile(path.join(__dirname, "public/index.html"));
});

app.get('/users', checkLoggedIn,  (req, res) => {
    const sql=db.prepare('select id, username from user');
    let rows = sql.all();
    console.log("rows.length",rows.length);
    res.send(rows);
});

// Define a route to fetch role names
app.get('/roles', (req, res) => {
    try {
        // Query the database to fetch role names
        const sql = db.prepare('SELECT * FROM role');
        const role = sql.all();
        res.json(role);
    } catch (error) {
        console.error('Error fetching roles from database:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.get('/category', (req, res) => {
    try {
        // Query the database to fetch role names
        const sql = db.prepare('SELECT * FROM category');
        const category = sql.all();
        res.json(category);
    } catch (error) {
        console.error('Error fetching category from database:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.use(express.static(staticPath));

app.listen(3000, () => {
    console.log("Server is running on http://localhost:3000");
});
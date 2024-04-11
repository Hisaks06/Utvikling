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
        let user = checkUserPassword(req.body.familycode, req.body.username, req.body.password);
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
    const familyId = addFamily(reguser.lastname); // Create a new family entry with the user's last name
    if (familyId) {
        const user = addUser(reguser.username, reguser.firstname, reguser.lastname, reguser.epost, reguser.password, reguser.mobile, reguser.role, familyId);
        if (user) {
            req.session.loggedIn = true;
            req.session.username = user.username;
            req.session.userrole = user.role;
            req.session.userid = user.userid;
            res.send(true);
        } else {
            res.send(false);
        }
    } else {
        res.send(false);
    }
});

function checkUserPassword(familyName, username, password) {
    const sql = db.prepare(`
        SELECT user.id AS userid, username, role.name AS role, password 
        FROM user 
        INNER JOIN role ON user.idrole = role.id 
        INNER JOIN family ON user.idfamily = family.id 
        WHERE username = ? AND family.name = ?
    `);
    let user = sql.get(username, familyName);
    if (user && bcrypt.compareSync(password, user.password)) {
        return user;
    } else {
        return null;
    }
}


// Middleware to check if the user is logged in and has appropriate role
function checkLoggedIn(req, res, next) {
    if (!req.session.loggedIn || req.session.userrole === 'unknown') {
        res.sendFile(path.join(__dirname, "public/login.html"));
    } else {
        next();
    }
}

// Middleware to check if the user is allowed to create a new task
function checkTaskCreationPermission(req, res, next) {
    if (req.session.userrole === 'unknown') {
        res.status(403).send("Forbidden: Unknown users cannot create tasks.");
    } else {
        next();
    }
}


function addUser(username, firstname, lastname, email, password, mobile, idrole, idfamily) {
    const hash = bcrypt.hashSync(password, saltRounds);
    
    // First, insert the user into the user table
    const sqlUser = db.prepare("INSERT INTO user (username, firstname, lastname, email, password, mobile, idrole, idfamily) VALUES (?, ?, ?, ?, ?, ?, ?, ?)");
    try {
        const info = sqlUser.run(username, firstname, lastname, email, hash, mobile, idrole, idfamily);
        const insertedUserId = info.lastInsertRowid;
        
        // Retrieve the family id
        const sqlGetFamilyId = db.prepare("SELECT id FROM family WHERE name = ?");
        const familyId = sqlGetFamilyId.get(lastname).id;
        
        // Update the user's family id
        const sqlUpdateFamilyId = db.prepare("UPDATE user SET idfamily = ? WHERE id = ?");
        sqlUpdateFamilyId.run(familyId, insertedUserId);
        
        // Return the user data
        const user = getUserById(insertedUserId);
        return user;
    } catch (error) {
        console.error("Error adding user:", error);
        return null;
    }
}


function addFamily(lastname) {
    // Check if the family already exists in the table
    const sqlCheckFamily = db.prepare("SELECT id FROM family WHERE name = ?");
    let existingFamily = sqlCheckFamily.get(lastname);

    if (existingFamily) {
        let newLastName = lastname;
        let suffix = 1;
        
        // Generate a unique family name
        while (existingFamily) {
            newLastName = `${lastname}_${suffix}`;
            existingFamily = sqlCheckFamily.get(newLastName);
            suffix++;
        }
        lastname = newLastName; // Update the family name to the unique one
    }

    // Insert the new family into the database
    const sqlInsertFamily = db.prepare("INSERT INTO family (name) VALUES (?)");
    try {
        const info = sqlInsertFamily.run(lastname);
        return info.lastInsertRowid; // Return the ID of the newly inserted family entry
    } catch (error) {
        console.error("Error adding family:", error);
        return null;
    }
}

function getUserById(userId) {
    const sql = db.prepare('SELECT user.id as userid, username, role.name as role FROM user INNER JOIN role ON user.idrole = role.id WHERE user.id = ?');
    const user = sql.get(userId);
    return user;
}

// Server-Side (Backend)
/*app.post('/invite', checkLoggedIn, (req, res) => {
    const { username, familyName } = req.body;

    // Check if the family exists
    const familyId = getFamilyIdByName(familyName);
    if (!familyId) {
        res.status(400).send("Family does not exist");
        return;
    }

    // Update the user's family
    const success = updateUserFamily(username, familyId);
    if (success) {
        res.status(200).send("User invited to family successfully");
    } else {
        res.status(500).send("Failed to invite user to family");
    }
});

// Function to update user's family in the database
function updateUserFamily(username, familyId) {
    // Retrieve the user id based on the username
    const sqlGetUserId = db.prepare("SELECT id FROM user WHERE username = ?");
    const user = sqlGetUserId.get(username);
    if (!user) {
        return false; // User not found
    }

    // Update the user's family id
    const sqlUpdateFamilyId = db.prepare("UPDATE user SET idfamily = ? WHERE id = ?");
    try {
        sqlUpdateFamilyId.run(familyId, user.id);
        return true; // Successfully updated the user's family
    } catch (error) {
        console.error("Error updating user's family:", error);
        return false; // Failed to update the user's family
    }
}

// Function to get family id by name
function getFamilyIdByName(familyName) {
    const sql = db.prepare("SELECT id FROM family WHERE name = ?");
    const family = sql.get(familyName);
    return family ? family.id : null;
}*/

app.get('/currentUser', checkLoggedIn,  (req, res) => {
    const sql = db.prepare('SELECT user.id AS userid, username, role.name AS role, firstname, lastname FROM user INNER JOIN role ON user.idrole = role.id WHERE user.id = ?');
    const user = sql.get(req.session.userid);
    res.send([user.userid, user.username, user.role, user.firstname, user.lastname]);
});

app.get('/', checkLoggedIn, (req, res) => {
    res.sendFile(path.join(__dirname, "public/app.html"));
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

app.use(express.static(staticPath));

app.listen(3000, () => {
    console.log("Server is running on http://localhost:3000");
});
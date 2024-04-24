const multer = require('multer');
const express = require("express");
const cors = require('cors');
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

// Add middleware to parse incoming JSON data
app.use(express.json());

// Configure CORS to allow requests from your client's origin
app.use(cors());

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
    const user = addUser(reguser.username, reguser.firstname, reguser.lastname, reguser.email, reguser.password, reguser.mobile, reguser.age, reguser.role);
    if (user) {
        req.session.loggedIn = true;
        req.session.username = user.username;
        req.session.userrole = user.role;
        req.session.userid = user.userid;
        res.send(true);
        res.sendFile(path.join(__dirname, "public/app.html"));
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

// Handle POST request to edit user profile
app.post('/editProfile', (req, res) => {
    // Extract edited data from the request body
    const { editedUsername, editedFirstName, editedLastName, editedEmail, editedMobile, editedAge, editedPassword } = req.body;

    // Hash the edited password before updating the database
    const hashedPassword = bcrypt.hashSync(editedPassword, saltRounds);

    // Update the user profile in the database
    const updateQuery = `
        UPDATE user 
        SET username = ?, 
            firstname = ?, 
            lastname = ?, 
            email = ?, 
            mobile = ?, 
            age = ?, 
            password = ?
        WHERE id = ?`;

    try {
        const stmt = db.prepare(updateQuery);
        stmt.run(editedUsername, editedFirstName, editedLastName, editedEmail, editedMobile, editedAge, hashedPassword, req.session.userid, (err) => {
            if (err) {
                console.error('Error updating user profile:', err);
                res.status(500).json({ success: false, error: 'Internal Server Error' });
            } else {
                // Send a success response
                res.json({ success: true });
            }
        });
    } catch (error) {
        console.error('Error updating user profile:', error);
        res.status(500).json({ success: false, error: 'Internal Server Error' });
    }
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

// Middleware to check if the user is authenticated and has the admin role
function checkAdmin(req, res, next) {
    if (req.session.loggedIn && req.session.userrole === 'admin') {
        // User is authenticated and has admin role, allow access
        next();
    } else {
        // User is not authorized, redirect to login page or display an error
        res.redirect('/login'); // Assuming you have a login route
    }
}

function getUserById(userId) {
    const sql = db.prepare('SELECT user.id as userid, username, role.name as role FROM user INNER JOIN role ON user.idrole = role.id WHERE user.id = ?');
    const user = sql.get(userId);
    return user;
}

function addProject(name, description, category, status, completedBy) {
    const sql = db.prepare("INSERT INTO project (name, description, category, status, completedBy) VALUES (?, ?, ?, ?, ?)");
    try {
        const info = sql.run(name, description, category, status, completedBy);
        const insertedProjectId = info.lastInsertRowid;
        const project = getProjectById(insertedProjectId);
        return project;
    } catch (error) {
        console.error("Error adding project:", error);
        return null;
    }
}

function getProjectById(projectId) {
    const sql = db.prepare('SELECT * FROM project WHERE id = ?');
    const project = sql.get(projectId);
    return project;
}

// Route to handle user creation by admin
app.post('/admin/project', checkAdmin, (req, res) => {
    // Log when a request is received
    console.log('Received POST request to /admin/project');

    // Log the request body
    console.log('Request body:', req.body);

    // Extract user data from the request body
    const { name, description, category, status, completedBy } = req.body;

    // Add the new user to the database
    const project = addProject(name, description, category, status, completedBy);
    
    if (project) {
        // Return success response if user is added successfully
        res.status(201).json({ success: true, message: 'project added successfully', project: project });
    } else {
        // Return error response if user addition fails
        res.status(500).json({ success: false, error: 'Failed to add project' });
    }
});

// Update a project record
app.put('/projects/:id', (req, res) => {
    const projectId = req.params.id;
    const { name, description, category, status, completedBy } = req.body;

    try {
        const updateQuery = `
            UPDATE project 
            SET name = ?, 
                description = ?, 
                category = ?, 
                status = ?, 
                completedBy = ?
            WHERE id = ?`;

        const stmt = db.prepare(updateQuery);
        stmt.run(name, description, category, status, completedBy, projectId);
        res.status(200).json({ success: true });
    } catch (error) {
        console.error('Error updating project:', error);
        res.status(500).json({ success: false, error: 'Internal Server Error' });
    }
});

// Delete a project record
app.delete('/projects/:id', (req, res) => {
    const projectId = req.params.id;

    try {
        const deleteQuery = `
            DELETE FROM project
            WHERE id = ?`;

        const stmt = db.prepare(deleteQuery);
        stmt.run(projectId);
        res.status(200).json({ success: true });
    } catch (error) {
        console.error('Error deleting project:', error);
        res.status(500).json({ success: false, error: 'Internal Server Error' });
    }
});

// Route to handle user creation by admin
app.post('/admin/user', checkAdmin, (req, res) => {
    // Log when a request is received
    console.log('Received POST request to /admin/user');

    // Log the request body
    console.log('Request body:', req.body);

    // Extract user data from the request body
    const { username, firstname, lastname, email, password, mobile, age, idrole } = req.body;

    if (!password) {
        return res.status(400).json({ success: false, error: 'Password is required' });
    }

    // Hash the password
    const hash = bcrypt.hashSync(password, saltRounds);

    // Add the new user to the database
    const user = addUser(username, firstname, lastname, email, hash, mobile, age, idrole);
    
    if (user) {
        // Return success response if user is added successfully
        res.status(201).json({ success: true, message: 'User added successfully', user: user });
    } else {
        // Return error response if user addition fails
        res.status(500).json({ success: false, error: 'Failed to add user' });
    }
});

// Route to handle editing user profile by admin
app.put('/admin/user/:id', checkAdmin, (req, res) => {
    const userId = req.params.id;
    const { username, firstname, lastname, email, mobile, age, idrole } = req.body;

    try {
        // Update user information in the database
        const updateQuery = `
            UPDATE user 
            SET username = ?, 
                firstname = ?, 
                lastname = ?, 
                email = ?, 
                mobile = ?, 
                age = ?, 
                idrole = ?
            WHERE id = ?`;

        const stmt = db.prepare(updateQuery);
        stmt.run(username, firstname, lastname, email, mobile, age, idrole, userId);
        res.status(200).json({ success: true }); // Send success response
    } catch (error) {
        console.error('Error updating user:', error);
        res.status(500).json({ success: false, error: 'Internal Server Error' }); // Internal server error
    }
});

// Route to handle deleting a user by admin
app.delete('/admin/user/:id', checkAdmin, (req, res) => {
    const userId = req.params.id;

    try {
        // Delete user from the database
        const deleteQuery = `
            DELETE FROM user
            WHERE id = ?`;

        const stmt = db.prepare(deleteQuery);
        stmt.run(userId);
        res.status(200).json({ success: true }); // Send success response
    } catch (error) {
        console.error('Error deleting user:', error);
        res.status(500).json({ success: false, error: 'Internal Server Error' }); // Internal server error
    }
});

function addRole(name) {
    const sql = db.prepare("INSERT INTO role (name) VALUES (?)");
    try {
        const info = sql.run(name);
        const insertedRoleId = info.lastInsertRowid;
        const role = getRoleById(insertedRoleId);
        return role;
    } catch (error) {
        console.error("Error adding role:", error);
        return null;
    }
}

function getRoleById(roleId) {
    const sql = db.prepare('SELECT * FROM role WHERE id = ?');
    const role = sql.get(roleId);
    return role;
}

// Route to handle user creation by admin
app.post('/admin/role', checkAdmin, (req, res) => {
    // Log when a request is received
    console.log('Received POST request to /admin/role');

    // Log the request body
    console.log('Request body:', req.body);

    // Extract user data from the request body
    const { rolename } = req.body;

    // Add the new user to the database
    const role = addRole(rolename);
    
    if (role) {
        // Return success response if user is added successfully
        res.status(201).json({ success: true, message: 'role added successfully', role: role });
    } else {
        // Return error response if user addition fails
        res.status(500).json({ success: false, error: 'Failed to add role' });
    }
});

// Update a role record
app.put('/role/:id', (req, res) => {
    const roleId = req.params.id;
    const { name } = req.body;

    try {
        const updateQuery = `
            UPDATE role 
            SET name = ?
            WHERE id = ?`;

        const stmt = db.prepare(updateQuery);
        stmt.run(name, roleId);
        res.status(200).json({ success: true });
    } catch (error) {
        console.error('Error updating role:', error);
        res.status(500).json({ success: false, error: 'Internal Server Error' });
    }
});

// Delete a role record
app.delete('/role/:id', (req, res) => {
    const roleId = req.params.id;

    try {
        const deleteQuery = `
            DELETE FROM role
            WHERE id = ?`;

        const stmt = db.prepare(deleteQuery);
        stmt.run(roleId);
        res.status(200).json({ success: true });
    } catch (error) {
        console.error('Error deleting role:', error);
        res.status(500).json({ success: false, error: 'Internal Server Error' });
    }
});

function addCategory(name) {
    const sql = db.prepare("INSERT INTO category (name) VALUES (?)");
    try {
        const info = sql.run(name);
        const insertedCategoryId = info.lastInsertRowid;
        const category = getCategoryById(insertedCategoryId);
        return category;
    } catch (error) {
        console.error("Error adding category:", error);
        return null;
    }
}

function getCategoryById(categoryId) {
    const sql = db.prepare('SELECT * FROM category WHERE id = ?');
    const category = sql.get(categoryId);
    return category;
}

// Route to handle category creation by admin
app.post('/admin/category', checkAdmin, (req, res) => {
    // Log when a request is received
    console.log('Received POST request to /admin/category');

    // Log the request body
    console.log('Request body:', req.body);

    // Extract category data from the request body
    const { categoryname } = req.body;

    // Add the new category to the database
    const category = addCategory(categoryname);
    
    if (category) {
        // Return success response if category is added successfully
        res.status(201).json({ success: true, message: 'category added successfully', category: category });
    } else {
        // Return error response if category addition fails
        res.status(500).json({ success: false, error: 'Failed to add category' });
    }
});

// Update a category record
app.put('/category/:id', (req, res) => {
    const categoryId = req.params.id;
    const { name } = req.body;

    try {
        const updateQuery = `
            UPDATE category 
            SET name = ?
            WHERE id = ?`;

        const stmt = db.prepare(updateQuery);
        stmt.run(name, categoryId);
        res.status(200).json({ success: true });
    } catch (error) {
        console.error('Error updating category:', error);
        res.status(500).json({ success: false, error: 'Internal Server Error' });
    }
});

// Delete a category record
app.delete('/category/:id', (req, res) => {
    const categoryId = req.params.id;

    try {
        const deleteQuery = `
            DELETE FROM category
            WHERE id = ?`;

        const stmt = db.prepare(deleteQuery);
        stmt.run(categoryId);
        res.status(200).json({ success: true });
    } catch (error) {
        console.error('Error deleting category:', error);
        res.status(500).json({ success: false, error: 'Internal Server Error' });
    }
});

app.get('/editProfile', checkLoggedIn, (req, res) => {
    // Assuming you have a function to fetch the user's current profile data
    const userId = req.session.userid;
    const userProfile = getUserProfile(userId);

    if (userProfile) {
        // If the user profile data is retrieved successfully, render the edit profile form
        res.render('editProfile', { userProfile });
    } else {
        // If the user profile data cannot be retrieved, send an error response
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Define a route to fetch all data for the admin page
app.get('/admin/data', (req, res) => {
    try {
        // Query the database to fetch all data
        const sql = db.prepare(`
            SELECT user.username, user.firstname, user.lastname, user.email, user.password, user.mobile, user.age, role.name AS role
            FROM user
            INNER JOIN role ON user.idRole = role.id
        `);
        const data = sql.all();
        res.json(data);
    } catch (error) {
        console.error('Error fetching data from database:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Define a route to fetch all data for the project table
app.get('/projects/data', (req, res) => {
    try {
        // Query the database to fetch all project data
        const sql = db.prepare(`
            SELECT * 
            FROM project
        `);
        const data = sql.all();
        res.json(data);
    } catch (error) {
        console.error('Error fetching project data from database:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Define a route to fetch data for the role table
app.get('/roles/data', (req, res) => {
    try {
        // Query the database to fetch all role data
        const sql = db.prepare(`
            SELECT * 
            FROM role
        `);
        const data = sql.all();
        res.json(data);
    } catch (error) {
        console.error('Error fetching role data from database:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Define a route to fetch data for the category table
app.get('/categories/data', (req, res) => {
    try {
        // Query the database to fetch all category data
        const sql = db.prepare(`
            SELECT * 
            FROM category
        `);
        const data = sql.all();
        res.json(data);
    } catch (error) {
        console.error('Error fetching category data from database:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Define a route to handle admin operations for a specific user
app.get('/admin/user/:id', checkAdmin, (req, res) => {
    const userId = req.params.id;

    try {
        // Query the database to fetch user details by user ID
        const sql = db.prepare(`
            SELECT user.id, user.username, user.firstname, user.lastname, user.email, user.mobile, user.age, role.name AS role
            FROM user
            INNER JOIN role ON user.idrole = role.id
            WHERE user.id = ?
        `);
        const user = sql.get(userId);

        if (user) {
            res.json(user); // Send user details as JSON response
        } else {
            res.status(404).json({ error: 'User not found' }); // User with given ID not found
        }
    } catch (error) {
        console.error('Error fetching user data from database:', error);
        res.status(500).json({ error: 'Internal Server Error' }); // Internal server error
    }
});

// Route to update user information
app.put('/admin/user/:id', checkAdmin, (req, res) => {
    const userId = req.params.id;
    const { username, firstname, lastname, email, mobile, age, idrole } = req.body;

    try {
        // Update user information in the database
        const updateQuery = `
            UPDATE user 
            SET username = ?, 
                firstname = ?, 
                lastname = ?, 
                email = ?, 
                mobile = ?, 
                age = ?, 
                idrole = ?
            WHERE id = ?`;

        const stmt = db.prepare(updateQuery);
        stmt.run(username, firstname, lastname, email, mobile, age, idrole, userId);
        res.status(200).json({ success: true }); // Send success response
    } catch (error) {
        console.error('Error updating user:', error);
        res.status(500).json({ success: false, error: 'Internal Server Error' }); // Internal server error
    }
});

// Route to delete a user
app.delete('/admin/user/:id', checkAdmin, (req, res) => {
    const userId = req.params.id;

    try {
        // Delete user from the database
        const deleteQuery = `
            DELETE FROM user
            WHERE id = ?`;

        const stmt = db.prepare(deleteQuery);
        stmt.run(userId);
        res.status(200).json({ success: true }); // Send success response
    } catch (error) {
        console.error('Error deleting user:', error);
        res.status(500).json({ success: false, error: 'Internal Server Error' }); // Internal server error
    }
});


// Route to serve admin.html, protected by checkAdmin middleware
app.get('/admin', checkAdmin, (req, res) => {
    res.sendFile(path.join(__dirname, 'public/admin.html'));
});

app.get('/currentUser', checkLoggedIn,  (req, res) => {
    const sql = db.prepare('SELECT user.id AS userid, username, role.name AS role, firstname, lastname, email, mobile, age FROM user INNER JOIN role ON user.idrole = role.id WHERE user.id = ?');
    const user = sql.get(req.session.userid);
    res.send([user.userid, user.username, user.role, user.firstname, user.lastname, user.email, user.mobile, user.age]);
});

app.get('/', checkLoggedIn, (req, res) => {
    res.sendFile(path.join(__dirname, "public/login.html"));
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

app.get('/project', (req, res) => {
    try {
        // Query the database to fetch role names
        const sql = db.prepare('SELECT * FROM project');
        const project = sql.all();
        res.json(project);
    } catch (error) {
        console.error('Error fetching project from database:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.use(express.static(staticPath));

app.listen(3000, () => {
    console.log("Server is running on http://localhost:3000");
});
const usersSelect = document.getElementById("users");
const projectsSelect = document.getElementById("project");
const categorySelect = document.getElementById("category");
const pastSelect = document.getElementById("past");
const yearSelect = document.getElementById("year");
const monthSelect = document.getElementById("month");
const divReport = document.getElementById("detail-report");

class Role {
    constructor(id, name) {
        this.id = id;
        this.name = name;
    }
}

class User {
    constructor(id, username) {
        this.id = id;
        this.username = username;
    }
}

class Project {
    constructor(id, name, description, status) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.status = status;
    }
}

class Category {
    constructor(id, name) {
        this.id = id;
        this.name = name;
    }
}

const users = [];
const project = [];
const category = [];
let thisUser = null;

async function main() {
    await fetchData();
}

document.addEventListener('DOMContentLoaded', main);

/*async function fetchUsers() {
    try {
        const response = await fetch('/users');
        const usersJ = await response.json();
        users.length = 0;
        usersJ.forEach(({ ID, username }) => {
            users.push(new User(ID, username));
        });
        populateFamilyMembers(users);
    } catch (error) {
        console.log('Failed to fetch user:', error);
    }
}*/

// Retrives the data from the current user
async function fetchCurrentUser() {
    try {
        const response = await fetch('/currentUser');
        const user = await response.json();
        const userId = user[0];
        const username = user[1];
        const roles = user[2];
        const firstName = user[3];
        const lastName = user[4];
        thisUser = new User(userId, username);
        document.getElementById("username").innerText = `${username}`;
        document.getElementById("firstName").innerText = `${firstName}`;
        document.getElementById("lastName").innerText = `${lastName}`;
        document.getElementById("role").innerText = `${roles}`;
        document.getElementById("userId").innerText = `${userId}`;
    } catch (error) {
        console.log('Failed to fetch thisUser:', error);
    }
}

async function fetchData() {
    try {
        await fetchCurrentUser();
        /*await fetchUsers();*/
    } catch (error) {
        console.log('Failed to fetch data:', error);
    }
}

// a list of users registered on the website
/*function populateFamilyMembers(users) {
    usersSelect.innerHTML = "";
    users.forEach(user => {
        const option = document.createElement("option");
        option.value = user.id;
        option.textContent = user.username;
        usersSelect.appendChild(option);
    });
}*/

document.addEventListener('DOMContentLoaded', () => {
    // Add event listeners for showing modals

    let IsHideUser = true;
    document.getElementById('addUserBtn').addEventListener("click", () => {
        if(IsHideUser){
            document.getElementById('addUserForm').style.display = "block";
            IsHideUser = false;
        } else if(!IsHideUser){
            document.getElementById('addUserForm').style.display = "none";
            IsHideUser = true;
        }
    })    
    
    let IsHideProject = true;
    document.getElementById('addProjectBtn').addEventListener("click", () => {
        if(IsHideProject){
            document.getElementById('addProjectForm').style.display = "block";
            IsHideProject = false;
        } else if(!IsHideProject){
            document.getElementById('addProjectForm').style.display = "none";
            IsHideProject = true;
        }
    }) 

    let IsHideRole = true;
    document.getElementById('addRoleBtn').addEventListener("click", () => {
        if(IsHideRole){
            document.getElementById('addRoleForm').style.display = "block";
            IsHideRole = false;
        } else if(!IsHideRole){
            document.getElementById('addRoleForm').style.display = "none";
            IsHideRole = true;
        }
    }) 

    let IsHideCategory = true;
    document.getElementById('addCategoryBtn').addEventListener("click", () => {
        if(IsHideCategory){
            document.getElementById('addCategoryForm').style.display = "block";
            IsHideCategory = false;
        } else if(!IsHideCategory){
            document.getElementById('addCategoryForm').style.display = "none";
            IsHideCategory = true;
        }
    })

    // Fetch role names from the server and populate the dropdown
    fetchRoles();
    fetchCategories();
});

function createTableRow(data) {
    // Create a new table row
    const row = document.createElement('tr');

    // Create a new table data cell for each property in data
    for (const prop in data) {
        const cell = document.createElement('td');
        cell.textContent = data[prop];
        row.appendChild(cell);
    }

    return row;
}

// Fetch role names from the server and populate the dropdown
async function fetchRoles() {
    try {
        const response = await fetch('/roles');
        const roles = await response.json();
        const roleSelect = document.getElementById('roleSelect');
        roles.forEach(role => {
            const option = document.createElement('option');
            option.value = role.id;
            option.textContent = role.name;
            roleSelect.appendChild(option);
        });
    } catch (error) {
        console.error('Failed to fetch roles:', error);
    }
}

// Fetch role names from the server and populate the dropdown
async function fetchCategories() {
    try {
        const response = await fetch('/category');
        const categories = await response.json();
        const categorySelect = document.getElementById('categorySelect');
        categories.forEach(category => {
            const option = document.createElement('option');
            option.value = category.id;
            option.textContent = category.name;
            categorySelect.appendChild(option);
        });
    } catch (error) {
        console.error('Failed to fetch categories:', error);
    }
}

// Function to handle form submission for adding a user
document.getElementById('addUserForm').addEventListener('submit', event => {
    event.preventDefault();
    addUser(event);
});

// Function to handle form submission for adding a project
document.getElementById('addProjectForm').addEventListener('submit', event => {
    event.preventDefault();
    addProject(event);
});

// Function to handle form submission for adding a role
document.getElementById('addRoleForm').addEventListener('submit', event => {
    event.preventDefault();
    addRole(event);
});

// Function to handle form submission for adding a category
document.getElementById('addCategoryForm').addEventListener('submit', event => {
    event.preventDefault();
    addCategory(event);
});

// Function to show add user modal
function showAddUserModal() {
    const modal = document.getElementById('addUserModal');
    modal.style.display = 'block';
}

// Function to show add project modal
function showAddProjectModal() {
    const modal = document.getElementById('addProjectModal');
    modal.style.display = 'block';
}

// Function to show add role modal
function showAddRoleModal() {
    const modal = document.getElementById('addRoleModal');
    modal.style.display = 'block';
}

// Function to show add category modal
function showAddCategoryModal() {
    const modal = document.getElementById('addCategoryModal');
    modal.style.display = 'block';
}

// Function to hide modal
function hideModal(modal) {
    modal.style.display = 'none';
}

// Fetch data from the server and display it in the table
fetch('/admin/data')
    .then(response => response.json())
    .then(data => {
        const adminDataBody = document.getElementById('adminDataBody');
        data.forEach(user => {
            console.log(user);
            const row = `
                <tr>
                    <td>${user.id}</td>
                    <td>${user.username}</td>
                    <td>${user.firstname}</td>
                    <td>${user.lastname}</td>
                    <td>${user.email}</td>
                    <td>${user.password}
                    <td>${user.mobile}</td>
                    <td>${user.age}</td>
                    <td>${user.role}</td>
                    <td>
                        <button onclick="editUser(${user.id})">Edit</button>
                        <button onclick="deleteUser(${user.id})">Delete</button>
                    </td>
                </tr>
            `;
            adminDataBody.innerHTML += row;
        });
    })
    .catch(error => console.error('Error fetching admin data:', error));

// Fetch data for the project table
fetch('/projects/data')
    .then(response => response.json())
    .then(data => {
        const projectDataBody = document.getElementById('projectDataBody');
        data.forEach(project => {
            console.log(project);
            const row = `
                <tr>
                    <td>${project.id}</td>
                    <td>${project.name}</td>
                    <td>${project.description}</td>
                    <td>${project.category}</td>
                    <td>${project.status}</td>
                    <td>${project.completedBy}</td>
                    <td>
                        <button onclick="editProject(${project.id})">Edit</button>
                        <button onclick="deleteProject(${project.id})">Delete</button>
                    </td>
                </tr>
            `;
            projectDataBody.innerHTML += row;
        });
    })
    .catch(error => console.error('Error fetching project data:', error));

// Fetch data for the role table
fetch('/roles/data')
    .then(response => response.json())
    .then(data => {
        const roleDataBody = document.getElementById('roleDataBody');
        data.forEach(role => {
            console.log(role);
            const row = `
                <tr>
                    <td>${role.id}</td>
                    <td>${role.name}</td>
                    <td>
                        <button onclick="editRole(${role.id})">Edit</button>
                        <button onclick="deleteRole(${role.id})">Delete</button>
                    </td>
                </tr>
            `;
            roleDataBody.innerHTML += row;
        });
    })
    .catch(error => console.error('Error fetching role data:', error));

// Fetch data for the category table
fetch('/categories/data')
    .then(response => response.json())
    .then(data => {
        const categoryDataBody = document.getElementById('categoryDataBody');
        data.forEach(category => {
            console.log(category);
            const row = `
                <tr>
                    <td>${category.id}</td>
                    <td>${category.name}</td>
                    <td>
                        <button onclick="editCategory(${category.id})">Edit</button>
                        <button onclick="deleteCategory(${category.id})">Delete</button>
                    </td>
                </tr>
            `;
            categoryDataBody.innerHTML += row;
        });
    })
    .catch(error => console.error('Error fetching category data:', error));

// Function to handle edit user
function editUser(userId) {
// Fetch the user data by userId
fetch(`/admin/user/${userId}`)
.then(response => response.json())
.then(user => {
    // Populate the form fields with user data
    document.getElementById('usernameInput').value = user.username;
    document.getElementById('firstnameInput').value = user.firstname;
    document.getElementById('lastnameInput').value = user.lastname;
    document.getElementById('emailInput').value = user.email;
    document.getElementById('passwordInput').value = user.password;
    document.getElementById('mobileInput').value = user.mobile;
    document.getElementById('ageInput').value = user.age;
    document.getElementById('roleInput').value = user.role;
    
    // Display the form for editing
    document.getElementById('editUserForm').style.display = 'block';
})
.catch(error => console.error('Error fetching user data for editing:', error));
}

// Function to handle delete user
function deleteUser(userId) {
// Send a DELETE request to delete the user by userId
fetch(`/admin/user/${userId}`, {
method: 'DELETE'
})
.then(response => {
if (response.ok) {
    // Remove the user row from the table
    document.getElementById(`userRow${userId}`).remove();
    console.log(`User with ID ${userId} deleted successfully.`);
} else {
    console.error(`Error deleting user with ID ${userId}.`);
}
})
.catch(error => console.error('Error deleting user:', error));
}

// Function to handle form submission for adding a user
function addUser(event) {
    event.preventDefault();

// Convert FormData to JSON
const formData = new FormData(document.getElementById('addUserForm'));
let formDataJSON = Object.fromEntries(formData.entries());

// Rename 'role' field to 'idrole'
if (formDataJSON.role) {
    formDataJSON.idrole = formDataJSON.role;
    delete formDataJSON.role;
}

// Log the data that's being sent to the server
console.log('Data being sent to server:', formDataJSON);

// Send POST request to server with form data
fetch('/admin/user', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify(formDataJSON)
})
    .then(response => {
        if (!response.ok) {
            throw new Error('Failed to add user');
        }
        return response.json();
    })
    .then(data => {
        // Close the modal
        document.getElementById('addUserModal').style.display = 'none';

        // Add new row to the table with added user data
        const newRow = createTableRow(data);
        document.getElementById('adminDataBody').appendChild(newRow);
    })
}

// Function to handle edit project
function editProject(projectId) {
// Assume there's a form for editing projects with input fields for name, description, category, status, and completedBy
// Fetch the project data by projectId
fetch(`/projects/${projectId}`)
.then(response => response.json())
.then(project => {
    // Populate the form fields with project data
    document.getElementById('nameInput').value = project.name;
    document.getElementById('descriptionInput').value = project.description;
    document.getElementById('categoryInput').value = project.category;
    document.getElementById('statusInput').value = project.status;
    document.getElementById('completedByInput').value = project.completedBy;
    
    // Display the form for editing
    document.getElementById('editProjectForm').style.display = 'block';
})
.catch(error => console.error('Error fetching project data for editing:', error));
}

// Function to handle delete project
function deleteProject(projectId) {
// Send a DELETE request to delete the project by projectId
fetch(`/projects/${projectId}`, {
method: 'DELETE'
})
.then(response => {
if (response.ok) {
    // Remove the project row from the table
    document.getElementById(`projectRow${projectId}`).remove();
    console.log(`Project with ID ${projectId} deleted successfully.`);
} else {
    console.error(`Error deleting project with ID ${projectId}.`);
}
})
.catch(error => console.error('Error deleting project:', error));
}

// Function to handle form submission for adding a project
function addProject(event) {
    event.preventDefault();

    // Get form data
    const formData = new FormData(document.getElementById('addProjectForm'));
    let formDataJSON = Object.fromEntries(formData.entries());

    // Log the data that's being sent to the server
    console.log('Data being sent to server:', formDataJSON);

    // Send POST request to server with form data
    fetch('/admin/project', {
        method: 'POST',
        headers:{
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(formDataJSON)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Failed to add project');
        }
        return response.json();
    })
    .then(data => {
        // Close the modal
        document.getElementById('projectDataBody').style.display = 'none';

        // Add new row to the table with added project data
        const newRow = createTableRow(data);
        document.getElementById('projectDataBody').appendChild(newRow);
    })
    .catch(error => console.error('Error adding project:', error));
}

// Function to handle edit role
function editRole(roleId) {
// Assume there's a form for editing roles with an input field for name
// Fetch the role data by roleId
fetch(`/admin/roles/${roleId}`)
.then(response => response.json())
.then(role => {
    // Populate the form field with role data
    document.getElementById('roleNameInput').value = role.name;
    
    // Display the form for editing
    document.getElementById('editRoleForm').style.display = 'block';
})
.catch(error => console.error('Error fetching role data for editing:', error));
}

// Function to handle delete role
function deleteRole(roleId) {
    // Prompt the user for confirmation
    if (!confirm("Are you sure you want to delete this role?")) {
        return; // If the user cancels, do nothing
    }

    // Send a DELETE request to delete the role by roleId
    fetch(`/admin/role/${roleId}`, { // Use backticks for string interpolation
        method: 'DELETE'
    })
    .then(response => {
        if (response.ok) {
            // Remove the role row from the table
            document.getElementById(`roleRow${roleId}`).remove();
            console.log(`Role with ID ${roleId} deleted successfully.`);
        } else {
            // Handle server errors
            console.error(`Error deleting role with ID ${roleId}: ${response.statusText}`);
            // Optionally provide user feedback about the error
            alert(`Error deleting role: ${response.statusText}`);
        }
    })
    .catch(error => {
        // Handle network errors
        console.error('Network error:', error);
        // Optionally provide user feedback about the error
        alert('Network error. Please try again later.');
    });
}

// Function to handle form submission for adding a role
function addRole(event) {
    event.preventDefault();

    // Get form data
    const formData = new FormData(document.getElementById('addRoleForm'));
    let formDataJSON = Object.fromEntries(formData.entries());

    // Log the data that's being sent to the server
console.log('Data being sent to server:', formDataJSON);
    // Send POST request to server with form data
    fetch('/admin/role', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(formDataJSON)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Failed to add role');
        }
        return response.json();
    })
    .then(data => {
        // Close the modal
        document.getElementById('roleDataBody').style.display = 'none';

        // Add new row to the table with added role data
        const newRow = createTableRow(data);
        document.getElementById('roleDataBody').appendChild(newRow);
    })
    .catch(error => console.error('Error adding role:', error));
}

// Function to handle edit category
function editCategory(categoryId) {
    // Assume there's a form for editing categories with an input field for the category name
    // Fetch the category data by categoryId
    fetch(`/categories/${categoryId}`)
        .then(response => response.json())
        .then(category => {
            // Populate the form field with category data
            document.getElementById('categoryNameInput').value = category.name;
            
            // Display the form for editing
            document.getElementById('editCategoryForm').style.display = 'block';
        })
        .catch(error => console.error('Error fetching category data for editing:', error));
}

// Function to handle delete category
function deleteCategory(categoryId) {
    // Send a DELETE request to delete the category by categoryId
    fetch(`/categories/${categoryId}`, {
        method: 'DELETE'
    })
    .then(response => {
        if (response.ok) {
            // Remove the category row from the table
            document.getElementById(`categoryRow${categoryId}`).remove();
            console.log(`Category with ID ${categoryId} deleted successfully.`);
        } else {
            console.error(`Error deleting category with ID ${categoryId}.`);
        }
    })
    .catch(error => console.error('Error deleting category:', error));
}

// Function to handle form submission for adding a category
function addCategory(event) {
    event.preventDefault();

    // Get form data
    const formData = new FormData(document.getElementById('addCategoryForm'));
    let formDataJSON = Object.fromEntries(formData.entries());

    // Log the data that's being sent to the server
    console.log('Data being sent to server:', formDataJSON);

    // Send POST request to server with form data
    fetch('/admin/category', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(formDataJSON)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Failed to add category');
        }
        return response.json();
    })
    .then(data => {
        // Close the modal
        document.getElementById('categoryDataBody').style.display = 'none';

        // Add new row to the table with added category data
        const newRow = createTableRow(data);
        document.getElementById('categoryDataBody').appendChild(newRow);
    })
    .catch(error => console.error('Error adding category:', error));
}

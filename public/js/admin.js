
document.addEventListener('DOMContentLoaded', () => {
    // Add event listeners for showing modals
    document.getElementById('addUserBtn').addEventListener('click', () => {
        showAddUserModal();
    });

    document.getElementById('addProjectBtn').addEventListener('click', () => {
        showAddProjectModal();
    });

    document.getElementById('addRoleBtn').addEventListener('click', () => {
        showAddRoleModal();
    });

    document.getElementById('addCategoryBtn').addEventListener('click', () => {
        showAddCategoryModal();
    });

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
    // Add event listeners for closing modals
    const closeButtons = document.querySelectorAll('.close');
    closeButtons.forEach(button => {
        button.addEventListener('click', () => {
            const modal = button.parentElement.parentElement;
            hideModal(modal);
        });
    });

    // Close the modal when clicking outside of it
    window.addEventListener('click', event => {
        const modals = document.querySelectorAll('.modal');
        modals.forEach(modal => {
            if (event.target === modal) {
                hideModal(modal);
            }
        });
    });

    // Fetch role names from the server and populate the dropdown
    fetchRoles();
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
        data.forEach(item => {
            const row = `
                <tr>
                    <td>${item.username}</td>
                    <td>${item.firstname}</td>
                    <td>${item.lastname}</td>
                    <td>${item.email}</td>
                    <td>${item.mobile}</td>
                    <td>${item.age}</td>
                    <td>${item.role}</td>
                    <td>
                        <button onclick="editUser(${item.id})">Edit</button>
                        <button onclick="deleteUser(${item.id})">Delete</button>
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
// Assume there's a form for editing users with input fields for username, firstname, lastname, email, mobile, age, and role
// Fetch the user data by userId
fetch(`/admin/user/${userId}`)
.then(response => response.json())
.then(user => {
    // Populate the form fields with user data
    document.getElementById('usernameInput').value = user.username;
    document.getElementById('firstnameInput').value = user.firstname;
    document.getElementById('lastnameInput').value = user.lastname;
    document.getElementById('emailInput').value = user.email;
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

    // Get form data
    const formData = new FormData(document.getElementById('addUserForm'));

    // Send POST request to server with form data
    fetch('/admin/user', {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        // Close the modal
        document.getElementById('addUserModal').style.display = 'none';

        // Add new row to the table with added user data
        const newRow = createTableRow(data);
        document.getElementById('adminDataBody').appendChild(newRow);
    })
    .catch(error => console.error('Error adding user:', error));
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

    // Send POST request to server with form data
    fetch('/admin/project', {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
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
fetch(`/roles/${roleId}`)
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
// Send a DELETE request to delete the role by roleId
fetch(`/roles/${roleId}`, {
method: 'DELETE'
})
.then(response => {
if (response.ok) {
    // Remove the role row from the table
    document.getElementById(`roleRow${roleId}`).remove();
    console.log(`Role with ID ${roleId} deleted successfully.`);
} else {
    console.error(`Error deleting role with ID ${roleId}.`);
}
})
.catch(error => console.error('Error deleting role:', error));
}

// Function to handle form submission for adding a role
function addRole(event) {
    event.preventDefault();

    // Get form data
    const formData = new FormData(document.getElementById('addRoleForm'));

    // Send POST request to server with form data
    fetch('/admin/role', {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
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

    // Send POST request to server with form data
    fetch('/admin/category', {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        // Close the modal
        document.getElementById('categoryDataBody').style.display = 'none';

        // Add new row to the table with added category data
        const newRow = createTableRow(data);
        document.getElementById('categoryDataBody').appendChild(newRow);
    })
    .catch(error => console.error('Error adding category:', error));
}

// Fetch role names from the server and populate the dropdown
async function fetchRoles() {
    try {
        const response = await fetch('/roles');
        const roles = await response.json();
        const roleSelect = document.getElementById('roleSelect');
        roles.forEach(role => {
            const option = document.createElement('option');
            option.value = role.id; // Assuming role.id is the unique identifier for each role
            option.textContent = role.name; // Assuming role.name is the name of the role
            roleSelect.appendChild(option);
        });
    } catch (error) {
        console.error('Failed to fetch roles:', error);
    }
}

// Call the fetchRoles function when the page loads
document.addEventListener('DOMContentLoaded', fetchRoles);  

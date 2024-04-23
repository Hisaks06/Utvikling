document.addEventListener("DOMContentLoaded", function() {
    const adminTab = document.getElementById('adminTab'); // Use getElementById to find the element

    if (adminTab) {
        // Make an API call to fetch the current user's role
        fetch('/currentUser')
            .then(response => response.json())
            .then(data => {
                const userRole = data[2]; // Assuming the role is at index 2 in the response array
                if (userRole !== 'admin') {
                    // Hide the admin tab if the user is not an admin
                    adminTab.style.display = 'none';
                }
            })
            .catch(error => console.error('Error fetching current user:', error));
    } else {
        console.error('Admin tab element not found.');
    }
});

document.addEventListener("DOMContentLoaded", function() {
    const editButton = document.querySelector('#editButton');
    const editForm = document.querySelector('#editForm');

    editButton.addEventListener('click', function(event) {
        event.preventDefault(); // Prevent the default form submission action
        editForm.style.display = 'block';
    });

    const saveChangesButton = document.querySelector('#saveChanges');
    saveChangesButton.addEventListener('click', function() {
        // Retrieve edited values from input fields
        const editedUsername = document.querySelector('#editUsername').value;
        const editedFirstName = document.querySelector('#editFirstName').value;
        const editedLastName = document.querySelector('#editLastName').value;
        const editedEmail = document.querySelector('#editEmail').value;
        const editedMobile = document.querySelector('#editMobile').value;
        const editedAge = document.querySelector('#editAge').value;
        const editedPassword = document.querySelector('#editPassword').value;

        // Send edited data to server using fetch or AJAX
        // Example using fetch:
        fetch('/editProfile', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                editedUsername,
                editedFirstName,
                editedLastName,
                editedEmail,
                editedMobile,
                editedAge,
                editedPassword
            })
        })
        .then(response => response.json())
        .then(data => {
            // Handle response from server
            console.log(data);
        })
        .catch(error => {
            console.error('Error editing profile:', error);
        });
    });
});

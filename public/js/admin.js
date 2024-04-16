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

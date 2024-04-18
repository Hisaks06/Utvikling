btnLogin = document.getElementById('btnLogin');
btnRegister = document.getElementById('btnRegister');
btnLogin.addEventListener('click', () => showForm('login'));
btnRegister.addEventListener('click', () => showForm('register'));
const loginForm = document.getElementById('loginForm');

function showForm(form) {
    document.getElementById('loginForm').style.display = form === 'login' ? 'block' : 'none';
    document.getElementById('registerForm').style.display = form === 'register' ? 'block' : 'none';
}


loginForm.addEventListener('submit', login)

async function login(evt) {
        evt.preventDefault(); // Prevent the default form submission
        const loginForm = document.getElementById('loginForm'); // Ensure you have this line if it's not defined elsewhere
        const loginFeedback = document.getElementById('loginFeedback'); // Make sure you have an element with this ID in your HTML
    
        try {
            const formData = new FormData(loginForm);
            const response = await fetch('/login', {
                method: 'POST',
                body: formData
            });
            
            const user = await response.json();
    
            // Assuming the JSON response structure is { id: "someId", username: "someUsername" }
            // Adjust this according to your actual response structure
            if (user){ 
                console.log(user);
                window.location.href = '/app.html'; 
                // Possibly redirect the user or update UI to show a successful login
            } else {
                // Handle case where user data is not in the expected format
                throw new Error('Unsuccessful login. Please try again.');
            }
        } catch (error) {
            console.log('Failed to fetch thisUser:', error);
            loginFeedback.innerText = error.message || 'Unsuccessful login. Please try again.';
            loginFeedback.style.color = 'red';
        }
    }
    
      
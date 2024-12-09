function validateForm(event) { 
    const username = document.getElementById("username").value; 
    const usernameError = document.getElementById("usernameError"); 
    const name = document.getElementById("name").value; 
    const nameError = document.getElementById("nameError"); 
    const password = document.getElementById("password").value; 
    const passwordError = document.getElementById("passwordError"); 
    const confirmPassword = document.getElementById("confirm-password").value; 
    let valid = true; 
// Check if name is at least 3 characters 
if (name.length < 3) { nameError.textContent = "Name must be at least 3 characters"; 
valid = false; 
} else { 
    nameError.textContent = ""; } 
// Check if username is at least 3 characters 
if (username.length < 3) { usernameError.textContent = "Username must be at least 3 characters"; 
valid = false; 
} else { 
    usernameError.textContent = ""; } 
 // Check if passwords match 
if (password !== confirmPassword) {
    alert("Passwords do not match. Please try again."); 
    valid = false; } 

if (!valid) {event.preventDefault();
 } } 
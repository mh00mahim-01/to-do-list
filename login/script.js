
const STORAGE_KEY = "registeredUsers";

// Find the form on the current page
const form = document.querySelector(".form");

// Find the page type
const isSignUp = document.querySelector(".signup_container") !== null;

// Create a message area
const message = document.createElement("p");

message.className = "form-message";
message.setAttribute("role", "status");
message.style.marginTop = "12px";
message.style.fontSize = "14px";
message.style.textAlign = "center";

form.appendChild(message);

// Display success or error messages
function showMessage(text, success) {
    message.textContent = text;
    message.style.color = success ? "#8ee6ad" : "#ff9999";
}

// Get registered users from browser storage
function getUsers() {
    const savedUsers = localStorage.getItem(STORAGE_KEY);

    if (savedUsers === null) {
        return [];
    }

    try {
        const users = JSON.parse(savedUsers);
        return Array.isArray(users) ? users : [];
    } catch {
        return [];
    }
}

// Handle form submission
form.addEventListener("submit", function (event) {
    event.preventDefault();

    // Get email and password
    const email = form.elements.email.value.trim().toLowerCase();
    const password = form.elements.password.value;

    // Check required fields
    if (email === "" || password === "") {
        showMessage("Please fill in all required fields.", false);
        return;
    }

    // Basic email format validation
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailPattern.test(email)) {
        showMessage("Please enter a valid email address.", false);
        return;
    }

    // Get existing registered users
    const users = getUsers();

    // SIGN UP
    if (isSignUp) {
        const fullName = form.elements.fullname.value.trim();
        const confirmPassword = form.elements["confirm-password"].value;

        if (fullName === "") {
            showMessage("Please enter your full name.", false);
            return;
        }

        if (password.length < 8) {
            showMessage("Password must contain at least 8 characters.", false);
            return;
        }

        if (password !== confirmPassword) {
            showMessage("Passwords do not match.", false);
            return;
        }

        // Check whether the email is already registered
        const existingUser = users.find(function (user) {
            return user.email === email;
        });

        if (existingUser) {
            showMessage("This email is already registered.", false);
            return;
        }

        // Save the new user
        users.push({
            fullname: fullName,
            email: email,
            password: password
        });

        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(users));
        } catch {
            showMessage("Unable to save account in this browser.", false);
            return;
        }

        showMessage("Account created! Redirecting to Sign In...", true);

        setTimeout(function () {
            window.location.href = "index.html";
        }, 1500);
    }

    // SIGN IN
    else {
        const existingUser = users.find(function (user) {
            return user.email === email &&
                   user.password === password;
        });

        if (!existingUser) {
            showMessage("Incorrect email or password.", false);
            return;
        }

        showMessage("Welcome back, " + existingUser.fullname + "!", true);

        // Save the current login for this browser
        sessionStorage.setItem("currentUser", JSON.stringify({
            fullname: existingUser.fullname,
            email: existingUser.email
        }));

        setTimeout(function () {
            window.location.href = "index.html";
        }, 1000);
    }
});

// Social login buttons are placeholders
const socialButtons = document.querySelectorAll(".social-btn");

socialButtons.forEach(function (button) {
    button.addEventListener("click", function () {
        showMessage(
            "Social login is not configured yet.",
            false
        );
    });
});

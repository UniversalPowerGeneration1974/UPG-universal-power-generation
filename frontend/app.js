// Configuration
const API_BASE_URL = 'http://localhost:5000/api';
let currentUser = null;
let selectedContact = null;
let currentChatMessages = [];

// Initialize app
window.addEventListener('load', () => {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    
    if (token && user) {
        currentUser = JSON.parse(user);
        showPage('home');
        loadContacts();
    } else {
        showPage('login');
        document.querySelector('.navbar').style.display = 'none';
    }
});

// Show/Hide Pages
function showPage(pageName) {
    // Hide all pages
    const pages = document.querySelectorAll('.page');
    pages.forEach(page => page.style.display = 'none');
    
    // Show selected page
    const selectedPage = document.getElementById(pageName);
    if (selectedPage) {
        selectedPage.style.display = 'block';
    }
    
    // Load page-specific data
    if (pageName === 'profile') {
        loadProfile();
    } else if (pageName === 'chat') {
        loadContacts();
    }
}

// ========== AUTHENTICATION ==========

// Handle Login
async function handleLogin(event) {
    event.preventDefault();
    
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    
    try {
        const response = await fetch(`${API_BASE_URL}/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
        });
        
        const data = await response.json();
        
        if (data.success) {
            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify(data.user));
            currentUser = data.user;
            document.querySelector('.navbar').style.display = 'block';
            showPage('home');
            showMessage('Login successful!', 'success');
        } else {
            showMessage('Invalid email or password', 'error');
        }
    } catch (error) {
        showMessage('Login failed: ' + error.message, 'error');
    }
}

// Handle Signup
async function handleSignup(event) {
    event.preventDefault();
    
    const fullname = document.getElementById('signupFullname').value;
    const username = document.getElementById('signupUsername').value;
    const email = document.getElementById('signupEmail').value;
    const password = document.getElementById('signupPassword').value;
    
    try {
        const response = await fetch(`${API_BASE_URL}/auth/signup`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ fullname, username, email, password })
        });
        
        const data = await response.json();
        
        if (data.success) {
            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify(data.user));
            currentUser = data.user;
            document.querySelector('.navbar').style.display = 'block';
            showPage('home');
            showMessage('Account created successfully!', 'success');
        } else {
            showMessage('Signup failed: ' + data.error, 'error');
        }
    } catch (error) {
        showMessage('Signup failed: ' + error.message, 'error');
    }
}

// Logout
function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    currentUser = null;
    document.querySelector('.navbar').style.display = 'none';
    showPage('login');
}

// ========== PROFILE ==========

// Load Profile
async function loadProfile() {
    if (!currentUser) return;
    
    try {
        const response = await fetch(`${API_BASE_URL}/users/${currentUser.id}`);
        const user = await response.json();
        
        document.getElementById('profileName').textContent = user.fullname || user.username;
        document.getElementById('profileUsername').value = user.username;
        document.getElementById('profileEmail').value = user.email;
        document.getElementById('profileFullname').value = user.fullname || '';
        document.getElementById('profilePhone').value = user.phone || '';
        document.getElementById('profileCompany').value = user.company || '';
        document.getElementById('profileLocation').value = user.location || '';
        
        // Update avatar
        const initials = (user.fullname || user.username).substring(0, 2).toUpperCase();
        document.getElementById('avatarDisplay').textContent = initials;
    } catch (error) {
        showMessage('Failed to load profile: ' + error.message, 'error');
    }
}

// Update Profile
async function updateProfile() {
    if (!currentUser) return;
    
    const fullname = document.getElementById('profileFullname').value;
    const phone = document.getElementById('profilePhone').value;
    const company = document.getElementById('profileCompany').value;
    const location = document.getElementById('profileLocation').value;
    
    const token = localStorage.getItem('token');
    
    try {
        const response = await fetch(`${API_BASE_URL}/users/${currentUser.id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ fullname, phone, company, location })
        });
        
        const data = await response.json();
        
        if (data.success) {
            showMessage('Profile updated successfully!', 'success');
            loadProfile();
        } else {
            showMessage('Failed to update profile', 'error');
        }
    } catch (error) {
        showMessage('Update failed: ' + error.message, 'error');
    }
}

// ========== CHAT ==========

// Load Contacts
async function loadContacts() {
    try {
        const response = await fetch(`${API_BASE_URL}/users`);
        const users = await response.json();
        
        const contactsList = document.getElementById('contactsList');
        contactsList.innerHTML = '';
        
        users.forEach(user => {
            if (user.id !== currentUser.id) {
                const li = document.createElement('li');
                li.className = 'contact-item';
                li.innerHTML = `<strong>${user.fullname || user.username}</strong><br><small>@${user.username}</small>`;
                li.onclick = () => selectContact(user);
                contactsList.appendChild(li);
            }
        });
    } catch (error) {
        showMessage('Failed to load contacts: ' + error.message, 'error');
    }
}

// Select Contact
async function selectContact(user) {
    selectedContact = user;
    document.getElementById('chatContactName').textContent = user.fullname || user.username;
    
    // Load messages
    const token = localStorage.getItem('token');
    try {
        const response = await fetch(`${API_BASE_URL}/messages/${user.id}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        
        currentChatMessages = await response.json();
        displayMessages();
    } catch (error) {
        showMessage('Failed to load messages: ' + error.message, 'error');
    }
}

// Display Messages
function displayMessages() {
    const chatMessages = document.getElementById('chatMessages');
    chatMessages.innerHTML = '';
    
    currentChatMessages.forEach(msg => {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${msg.sender_id === currentUser.id ? 'sent' : 'received'}`;
        messageDiv.textContent = msg.message;
        chatMessages.appendChild(messageDiv);
    });
    
    // Scroll to bottom
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

// Send Message
async function sendMessage() {
    if (!selectedContact) {
        showMessage('Please select a contact first', 'error');
        return;
    }
    
    const messageInput = document.getElementById('messageInput');
    const message = messageInput.value.trim();
    
    if (!message) return;
    
    const token = localStorage.getItem('token');
    
    try {
        const response = await fetch(`${API_BASE_URL}/messages`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                receiver_id: selectedContact.id,
                message: message
            })
        });
        
        const data = await response.json();
        
        if (data.success) {
            messageInput.value = '';
            // Reload messages
            selectContact(selectedContact);
        } else {
            showMessage('Failed to send message', 'error');
        }
    } catch (error) {
        showMessage('Send failed: ' + error.message, 'error');
    }
}

// Handle Message Keypress
function handleMessageKeypress(event) {
    if (event.key === 'Enter') {
        event.preventDefault();
        sendMessage();
    }
}

// ========== UTILITIES ==========

// Show Message
function showMessage(message, type) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `${type}-message`;
    messageDiv.textContent = message;
    
    const container = document.querySelector('#app');
    container.insertBefore(messageDiv, container.firstChild);
    
    // Auto remove after 3 seconds
    setTimeout(() => {
        messageDiv.remove();
    }, 3000);
}

// Refresh messages periodically
setInterval(() => {
    if (selectedContact && currentUser) {
        selectContact(selectedContact);
    }
}, 5000);

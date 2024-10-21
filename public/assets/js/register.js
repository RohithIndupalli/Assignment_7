document.getElementById('registrationForm').addEventListener('submit', function(event) {
  event.preventDefault(); // Prevent form from submitting normally

  // Get the new user data from the form
  const formData = {
      name: document.getElementById('name').value,
      email: document.getElementById('email').value,
      phone: document.getElementById('phone').value,
      dob: document.getElementById('dob').value,
      status: document.getElementById('status').value
  };

  // Retrieve existing users from localStorage
  let users = JSON.parse(localStorage.getItem('users')) || [];

  // Add the new user to the array
  users.push(formData);
  
  // Save the updated array of users back to localStorage
  localStorage.setItem('users', JSON.stringify(users));

  // Optionally redirect to the dashboard page
  window.location.href = './dashbord.html';
});
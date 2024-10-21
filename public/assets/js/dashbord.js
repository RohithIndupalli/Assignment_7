document.addEventListener('DOMContentLoaded', () => {
    // Retrieve all users from localStorage
    const users = JSON.parse(localStorage.getItem('users')) || [];

    // Get the container where the user details will be displayed
    const detailsContainer = document.querySelector('.details-container');

    if (users.length > 0) {
        // Iterate through the list of users and display their details
        users.forEach(user => {
            const userDetails = document.createElement('div');
            userDetails.classList.add('user-details');
            userDetails.innerHTML = `
                <p><strong>Name:</strong> ${user.name}</p>
                <p><strong>Email:</strong> ${user.email}</p>
                <p><strong>Phone:</strong> ${user.phone}</p>
                <p><strong>Date of Birth:</strong> ${user.dob}</p>
                <p><strong>Status:</strong> ${user.status}</p>
                <hr>
            `;
            detailsContainer.appendChild(userDetails);
        });
    } else {
        detailsContainer.innerHTML = '<p>No registered users yet.</p>';
    }
});
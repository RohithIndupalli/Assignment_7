document.addEventListener('DOMContentLoaded', function() {
    const editIcons = document.querySelectorAll('.edit-icon');
    const saveButton = document.getElementById('saveChanges');
    let editedFields = {};
    let originalValues = {}; // Store original values
  
    // Add event listeners to all edit icons
    editIcons.forEach(icon => {
      icon.addEventListener('click', function(event) {
        event.preventDefault();
  
        const field = this.getAttribute('data-field');
        const displaySpan = document.getElementById(`${field}Display`);
        const inputField = document.getElementById(`${field}Input`);
        const cancelButton = document.getElementById(`cancel${capitalizeFirstLetter(field)}`);
  
        // Save the original value before editing
        originalValues[field] = inputField.value;
  
        // Show the input field and hide the display span
        displaySpan.style.display = 'none';
        inputField.style.display = 'inline';
        cancelButton.style.display = 'inline';
  
        // Show the save button
        saveButton.style.display = 'inline';
  
        // Store the edited field
        editedFields[field] = inputField.value;
      });
    });
  
    // Cancel functionality
    document.querySelectorAll('button[id^="cancel"]').forEach(cancelButton => {
      cancelButton.addEventListener('click', function(event) {
        const field = this.id.replace('cancel', '').toLowerCase();
        const displaySpan = document.getElementById(`${field}Display`);
        const inputField = document.getElementById(`${field}Input`);
  
        // Revert to original value and hide input
        inputField.value = originalValues[field];
        inputField.style.display = 'none';
        displaySpan.style.display = 'inline';
        displaySpan.textContent = originalValues[field];
  
        // Hide cancel button
        this.style.display = 'none';
  
        // Hide the save button if no fields are being edited
        checkIfAllInputsHidden();
      });
    });
  
    // Save button functionality
    saveButton.addEventListener('click', function() {
      fetch('/update-profile', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(editedFields)
      })
      .then(response => response.json())
      .then(data => {
        if (data.success) {
          // Update the fields with the saved values
          for (const field in editedFields) {
            document.getElementById(`${field}Display`).textContent = editedFields[field];
            document.getElementById(`${field}Display`).style.display = 'inline';
            document.getElementById(`${field}Input`).style.display = 'none';
            document.getElementById(`cancel${capitalizeFirstLetter(field)}`).style.display = 'none'; // Hide cancel button
          }
  
          // Hide the save button after saving
          saveButton.style.display = 'none';
        } else {
          alert('Failed to update profile.');
        }
      })
      .catch(error => console.error('Error:', error));
    });
  
    // Helper function to check if all inputs are hidden
    function checkIfAllInputsHidden() {
      const allInputsHidden = Array.from(document.querySelectorAll('input[type="text"], input[type="date"]')).every(input => input.style.display === 'none');
      if (allInputsHidden) {
        saveButton.style.display = 'none';
      }
    }
  
    // Helper function to capitalize the first letter
    function capitalizeFirstLetter(string) {
      return string.charAt(0).toUpperCase() + string.slice(1);
    }
  });
  


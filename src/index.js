document.addEventListener("DOMContentLoaded", () => {
    const dogForm = document.getElementById("dog-form");
    const dogTable = document.getElementById("dog-table");
  
    // Load dogs on page load
    loadDogs();
  
    // Event listener for form submission
    dogForm.addEventListener("submit", event => {
      event.preventDefault();
      const formData = new FormData(dogForm);
      const name = formData.get("name");
      const breed = formData.get("breed");
      const sex = formData.get("sex");
      const dogId = dogForm.dataset.id; // If editing, use the dog ID from the form dataset
      if (dogId) {
        updateDog({ id: dogId, name, breed, sex });
      }
    });
  
    // Function to load dogs
    function loadDogs() {
      fetch("http://localhost:3000/dogs")
        .then(response => response.json())
        .then(dogs => renderDogs(dogs))
        .catch(error => console.error("Error loading dogs:", error));
    }
  
    // Function to render dogs in table
    function renderDogs(dogs) {
      dogTable.innerHTML = ""; // Clear previous content
      dogs.forEach(dog => {
        const row = document.createElement("tr");
        row.innerHTML = `
          <td>${dog.name}</td>
          <td>${dog.breed}</td>
          <td>${dog.sex}</td>
          <td><button class="edit-btn" data-id="${dog.id}">Edit</button></td>
        `;
        row.querySelector(".edit-btn").addEventListener("click", () => populateForm(dog));
        dogTable.appendChild(row);
      });
    }
  
    // Function to populate form with dog information
    function populateForm(dog) {
      dogForm.dataset.id = dog.id;
      document.getElementById("name").value = dog.name;
      document.getElementById("breed").value = dog.breed;
      document.getElementById("sex").value = dog.sex;
    }
  
    // Function to update dog information
    function updateDog(dog) {
      fetch(`http://localhost:3000/dogs/${dog.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json"
        },
        body: JSON.stringify(dog)
      })
      .then(() => loadDogs()) // Reload dogs after successful update
      .catch(error => console.error("Error updating dog:", error));
    }
  });
  
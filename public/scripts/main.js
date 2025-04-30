// filepath: c:\Users\divak\OneDrive\Desktop\website\manual\lynx-foundation-site\public\scripts\main.js

// Automatically update the date to today's date
function updateDate() {
    const currentDateElement = document.getElementById('current-date');
    if (currentDateElement) {
      const today = new Date();
      const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
      currentDateElement.textContent = today.toLocaleDateString('en-US', options);
    }
  }
  
  // Fetch and render the lead story
  function loadLeadStory() {
    fetch('articles/featured.json')
      .then(response => response.json())
      .then(data => {
        document.getElementById('image').src = data.image;
        document.getElementById('title').textContent = data.headline;
        document.getElementById('excerpt').textContent = data.content;
      })
      .catch(error => console.error('Error loading lead story:', error));
  }
  
  // Load the navbar dynamically
  function loadNavbar() {
    fetch('includes/hgnav.html')
      .then(response => response.text())
      .then(data => {
        document.getElementById('navbar-placeholder').innerHTML = data;

        // Update the date after the navbar is loaded
        updateDate();

        // Attach the search toggle functionality
        const searchToggle = document.getElementById('searchToggle');
        const searchBar = document.getElementById('searchBar');

        if (searchToggle && searchBar) {
          searchToggle.addEventListener('click', () => {
            searchBar.classList.toggle('hidden');
            if (!searchBar.classList.contains('hidden')) {
              searchBar.focus();
            }
          });
        }
      })
      .catch(error => console.error('Error loading navbar:', error));
  }
  
  // Load the footer dynamically
  function loadFooter() {
    fetch('includes/footer.html')
      .then(response => response.text())
      .then(data => {
        document.getElementById('footer-placeholder').innerHTML = data;
      })
      .catch(error => console.error('Error loading footer:', error));
  }
  
  // Initialize all scripts
  document.addEventListener('DOMContentLoaded', () => {
    loadNavbar();
    loadLeadStory();
    loadFooter();

    // Wait for the navbar to load dynamically
    document.addEventListener('DOMContentLoaded', () => {
      const navbar = document.querySelector('.sticky-nav'); // Select the original navbar

      if (navbar) {
        const stickyClone = navbar.cloneNode(true); // Create a clone of the navbar
        stickyClone.classList.add('sticky-clone'); // Add a class to the cloned navbar
        document.body.appendChild(stickyClone); // Append the cloned navbar to the body

        const triggerPoint = 300; // Distance in pixels to trigger the sticky effect

        window.addEventListener('scroll', () => {
          if (window.scrollY > triggerPoint) {
            stickyClone.style.display = 'block'; // Show the sticky navbar
          } else {
            stickyClone.style.display = 'none'; // Hide the sticky navbar
          }
        });
      } else {
        console.error('Navbar not found. Ensure the .sticky-nav element exists.');
      }
    });
  });
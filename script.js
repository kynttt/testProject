// Wait for the DOM to be fully loaded before executing the script
document.addEventListener('DOMContentLoaded', () => {
  // Get references to the search button, keyword input, and results container
  const searchBtn = document.getElementById('searchBtn');
  const keywordInput = document.getElementById('keyword');
  const resultsContainer = document.getElementById('results');

  // Add a click event listener to the search button
  searchBtn.addEventListener('click', () => {
    // Get the trimmed keyword from the input field
    const keyword = keywordInput.value.trim();

    // Check if the keyword is not empty
    if (keyword !== '') {
      // Fetch data from the backend API using the keyword
      fetch(`http://localhost:5500/api/scrape?keyword=${keyword}`)
        .then(response => {
          // Check if the response is OK (status code 200)
          if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
          }
          // Parse the response as JSON and return the result
          return response.json();
        })
        .then(data => {
          // Call the displayResults function with the retrieved data
          displayResults(data);
        })
        .catch(error => {
          // Handle errors by logging them to the console and displaying an error message
          console.error(error);
          resultsContainer.innerHTML = `Error fetching data: ${error.message}`;
        });
    }
  });

  // Function to display search results on the page
  function displayResults(data) {
    // Clear the existing content in the results container
    resultsContainer.innerHTML = '';

    // Check if there are no results
    if (data.length === 0) {
      resultsContainer.innerHTML = 'No results found.';
      return;
    }

    // Loop through each product in the data and create a corresponding HTML element
    data.forEach(product => {
      const productDiv = document.createElement('div');
      productDiv.classList.add('product');
      // Populate the HTML element with product information
      productDiv.innerHTML = `
        <h3>${product.title}</h3>
        <p>Rating: ${product.rating}</p>
        <p>Number of Reviews: ${product.reviews}</p>
        <img src="${product.image}" alt="${product.title}" />
      `;
      // Append the product element to the results container
      resultsContainer.appendChild(productDiv);
    });
  }
});

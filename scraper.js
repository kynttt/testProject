// Import necessary modules
const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');
const cors = require('cors');

// Create an instance of the Express application
const app = express();
const PORT = 5500;

// Enable CORS middleware to handle cross-origin requests
app.use(cors());

// Define a route for handling API requests to scrape Amazon search results
app.get('/api/scrape', async (req, res) => {
  try {
    // Extract the keyword from the query parameter
    const keyword = req.query.keyword;

    // Construct the Amazon search URL with the provided keyword
    const amazonUrl = `https://www.amazon.com/s?k=${keyword}`;

    // Fetch HTML content from the Amazon search results page
    const { data } = await axios.get(amazonUrl, {
      // Include a User-Agent header to simulate a browser request
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3',
      },
    });

    // Parse HTML using Cheerio
    const $ = cheerio.load(data);

    // Extract data for each product listing on the search results page
    const products = [];
    $('.s-result-item').each((index, element) => {
      // Extract product title
      const title = $(element).find('.s-title-instructions').text().trim();
      
      // Extract product rating
      const rating = $(element).find('.a-icon-star-small .a-icon-alt').text().trim();
      
      // Extract number of reviews
      const reviews = $(element).find('.s-rating-number').text().trim();
      
      // Extract product image URL
      const image = $(element).find('img').attr('src');

      // Create an object with extracted information and push it to the products array
      products.push({ title, rating, reviews, image });
    });

    // Send the extracted product data as a JSON response
    res.json(products);
  } catch (error) {
    // Handle errors and send a 500 Internal Server Error response
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Start the server and listen on the specified port
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

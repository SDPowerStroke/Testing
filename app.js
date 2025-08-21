const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: true }));

// Serve static files if needed
app.use(express.static('public'));

// Render the main page
app.get('/', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>YouTube Viewer</title>
      <style>
        body { font-family: Arial, sans-serif; margin: 0; padding: 0; }
        header { background-color: #333; padding: 10px; color: white; text-align: center; }
        nav { margin: 0; }
        nav a { color: white; margin: 0 15px; text-decoration: none; font-weight: bold; }
        .container { padding: 20px; max-width: 800px; margin: auto; }
        form { margin-bottom: 20px; }
        input[type=text] { width: 80%; padding: 10px; font-size: 16px; }
        button { padding: 10px 20px; font-size: 16px; }
        .video-container { margin-top: 20px; }
        iframe { width: 100%; height: 480px; }
      </style>
    </head>
    <body>
      <header>
        <nav>
          <a href="#">Home</a>
          <a href="#">About</a>
        </nav>
      </header>
      <div class="container">
        <h1>YouTube Video Viewer</h1>
        <form method="POST" action="/show">
          <input type="text" name="youtubeUrl" placeholder="Enter YouTube URL" required />
          <button type="submit">Submit</button>
        </form>
        ${req.query.videoId ? `
          <div class="video-container">
            <iframe src="https://www.youtube.com/embed/${req.query.videoId}" frameborder="0" allowfullscreen></iframe>
          </div>
        ` : ''}
      </div>
    </body>
    </html>
  `);
});

// Handle form submission
app.post('/show', (req, res) => {
  const youtubeUrl = req.body.youtubeUrl;
  const videoId = extractVideoID(youtubeUrl);
  if (videoId) {
    // Redirect to the main page with videoId query param
    res.redirect('/?videoId=' + videoId);
  } else {
    // Invalid URL, redirect back without video
    res.redirect('/');
  }
});

// Function to extract YouTube video ID from URL
function extractVideoID(url) {
  const regex = /(?:youtube\\.com\\/(?:[^\\/\\s]+\\/\\S+\\/|(?:v|embed)\\/|\\?v=)|youtu\\.be\\/)([a-zA-Z0-9_-]{11})/;
  const match = url.match(regex);
  return match ? match[1] : null;
}

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});

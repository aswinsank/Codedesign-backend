const express = require('express');
const app = express();
const reportRoutes = require('./routes/report');
const PORT = process.env.PORT || 3000;

app.use(express.json()); // Middleware to parse JSON bodies

// Mount the report routes
app.use('/report', reportRoutes);

// Simple health check endpoint
app.get('/', (req, res) => {
  res.send('B2B SaaS Backend is running!');
});

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
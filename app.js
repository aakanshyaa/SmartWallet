const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const expressLayouts = require('express-ejs-layouts');
const session = require('express-session');
const flash = require('connect-flash');
const methodOverride = require('method-override');
const dotenv = require('dotenv');
const passport = require('passport');

// Load environment variables
dotenv.config();
console.log('Environment loaded, NODE_ENV:', process.env.NODE_ENV);

// Passport config
require('./src/config/passport');

// Initialize express app
const app = express();

// Set view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(expressLayouts);
app.set('layout', 'partials/layout');
app.set('layout extractScripts', true);
app.set('layout extractStyles', true);

// Explicitly set the default charset to prevent encoding issues
app.use((req, res, next) => {
  res.charset = 'utf-8';
  next();
});

// Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')));

// Set proper content encoding for all responses
app.use((req, res, next) => {
  // Only set content type for HTML responses, not for EJS templates
  if (!req.path.includes('.ejs')) {
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
  }
  next();
});

// Session configuration
app.use(session({
  secret: process.env.SESSION_SECRET || 'smart-wallet-secret',
  resave: false,
  saveUninitialized: true,
  cookie: { 
    secure: process.env.NODE_ENV === 'production',
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  }
}));

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Flash messages
app.use(flash());

// Global variables
app.use((req, res, next) => {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  res.locals.user = req.session.user || req.user || null;
  
  // Set path variable for active menu highlighting
  // Get the base path without query parameters
  const fullPath = req.originalUrl.split('?')[0];
  // Extract the first-level path (e.g., /savings/add -> /savings)
  res.locals.path = '/' + fullPath.split('/')[1];
  
  next();
});

// Database initialization
const db = require('./src/models/db');
db.initializeDatabase();

// Routes
const authRoutes = require('./src/routes/auth');
const dashboardRoutes = require('./src/routes/dashboard');
const incomeRoutes = require('./src/routes/income');
const expenseRoutes = require('./src/routes/expense');
const landingRoutes = require('./src/routes/landingRoutes');
const savingsRoutes = require('./src/routes/savings');
const loansRoutes = require('./src/routes/loans');

// Landing route (must be first to take precedence)
app.use('/', landingRoutes);

app.use('/auth', authRoutes);
app.use('/dashboard', dashboardRoutes);
app.use('/income', incomeRoutes);
app.use('/expense', expenseRoutes);
app.use('/savings', savingsRoutes);
app.use('/loans', loansRoutes);

// 404 route
app.use((req, res) => {
  res.status(404).render('partials/404', {
    title: '404 - Page Not Found',
    layout: 'partials/layout'
  });
});

// Global error handler for template rendering
app.use((err, req, res, next) => {
  console.error('Global error handler caught an error:', err);
  
  // If it's a template rendering error
  if (err.message && (err.message.includes('template') || err.message.includes('render') || err.message.includes('ejs'))) {
    console.error('Template rendering error, sending basic HTML response');
    
    // Send a basic HTML response
    res.status(500).send(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Error - Smart Wallet</title>
        <link rel="stylesheet" href="/css/style.css">
        <style>
          body { padding: 30px; font-family: Arial, sans-serif; }
          .error-container { max-width: 800px; margin: 0 auto; background: #fff; padding: 20px; border-radius: 5px; box-shadow: 0 2px 5px rgba(0,0,0,0.1); }
          h1 { color: #e74c3c; }
          .btn { display: inline-block; padding: 10px 15px; background: #3498db; color: white; text-decoration: none; border-radius: 4px; margin-top: 20px; }
        </style>
      </head>
      <body>
        <div class="error-container">
          <h1>Template Rendering Error</h1>
          <p>Sorry, we encountered an error rendering the page you requested.</p>
          <p>This is likely due to a template formatting issue.</p>
          <p>Please try one of these options:</p>
          <ul>
            <li>Return to the <a href="/dashboard">dashboard</a></li>
            <li>Try the <a href="/loans">loans overview</a></li>
            <li>If you were trying to add a loan, use the <a href="/loans/add-basic">basic add loan form</a></li>
          </ul>
          <a href="/dashboard" class="btn">Go to Dashboard</a>
        </div>
      </body>
      </html>
    `);
  } else {
    // For other errors, continue to the default error handler
    next(err);
  }
});

// Start server
const PORT = 5173;
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
}); 
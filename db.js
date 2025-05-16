const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const bcrypt = require('bcrypt');

// Database path
const dbPath = path.join(__dirname, '../../data/smartwallet.db');

// Create database connection
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error connecting to database:', err.message);
  } else {
    console.log('Connected to SQLite database');
  }
});

// Initialize database tables
const initializeDatabase = () => {
  // Create users table
  db.run(`CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT,
    google_id TEXT UNIQUE,
    profile_image TEXT DEFAULT 'default.png',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`, (err) => {
    if (err) {
      console.error('Error creating users table:', err.message);
    } else {
      console.log('Users table created or already exists');
      
      // Check if google_id column exists in users table
      db.all("PRAGMA table_info(users)", (err, columns) => {
        if (err) {
          console.error('Error checking table columns:', err.message);
          return;
        }
        
        const googleIdExists = columns.some(column => column.name === 'google_id');
        
        if (!googleIdExists) {
          console.log('Adding google_id column to users table...');
          db.run("ALTER TABLE users ADD COLUMN google_id TEXT UNIQUE", (err) => {
            if (err) {
              console.error('Error adding google_id column:', err.message);
            } else {
              console.log('google_id column added successfully');
            }
          });
        }
      });
    }
  });

  // Create password reset tokens table
  db.run(`CREATE TABLE IF NOT EXISTS password_reset_tokens (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    token TEXT NOT NULL,
    expires_at DATETIME NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
  )`, (err) => {
    if (err) {
      console.error('Error creating password_reset_tokens table:', err.message);
    } else {
      console.log('Password reset tokens table created or already exists');
    }
  });

  // Create income table
  db.run(`CREATE TABLE IF NOT EXISTS income (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    source TEXT NOT NULL,
    amount REAL NOT NULL,
    date DATETIME DEFAULT CURRENT_TIMESTAMP,
    icon TEXT DEFAULT 'dollar',
    description TEXT,
    FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
  )`, (err) => {
    if (err) {
      console.error('Error creating income table:', err.message);
    } else {
      console.log('Income table created or already exists');
    }
  });

  // Create expenses table
  db.run(`CREATE TABLE IF NOT EXISTS expenses (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    category TEXT NOT NULL,
    amount REAL NOT NULL,
    date DATETIME DEFAULT CURRENT_TIMESTAMP,
    icon TEXT DEFAULT 'shopping-cart',
    description TEXT,
    FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
  )`, (err) => {
    if (err) {
      console.error('Error creating expenses table:', err.message);
    } else {
      console.log('Expenses table created or already exists');
    }
  });

  // Create savings table
  db.run(`CREATE TABLE IF NOT EXISTS savings (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    name TEXT NOT NULL,
    target_amount REAL NOT NULL,
    current_amount REAL DEFAULT 0,
    start_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    target_date DATETIME,
    icon TEXT DEFAULT 'piggy-bank',
    description TEXT,
    FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
  )`, (err) => {
    if (err) {
      console.error('Error creating savings table:', err.message);
    } else {
      console.log('Savings table created or already exists');
    }
  });

  // Create loans table
  db.run(`CREATE TABLE IF NOT EXISTS loans (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    name TEXT NOT NULL,
    total_amount REAL NOT NULL,
    remaining_amount REAL NOT NULL,
    interest_rate REAL DEFAULT 0,
    start_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    due_date DATETIME,
    icon TEXT DEFAULT 'hand-holding-usd',
    description TEXT,
    type TEXT NOT NULL, /* 'borrowed' or 'lent' */
    FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
  )`, (err) => {
    if (err) {
      console.error('Error creating loans table:', err.message);
    } else {
      console.log('Loans table created or already exists');
    }
  });
  
  // Create loan payments table
  db.run(`CREATE TABLE IF NOT EXISTS loan_payments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    loan_id INTEGER NOT NULL,
    amount REAL NOT NULL,
    payment_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    description TEXT,
    FOREIGN KEY (loan_id) REFERENCES loans (id) ON DELETE CASCADE
  )`, (err) => {
    if (err) {
      console.error('Error creating loan_payments table:', err.message);
    } else {
      console.log('Loan payments table created or already exists');
    }
  });

  // Create default admin user for testing if not exists
  const checkAdminExists = () => {
    return new Promise((resolve, reject) => {
      db.get("SELECT * FROM users WHERE email = ?", ["admin@smartwallet.com"], (err, row) => {
        if (err) {
          reject(err);
        } else {
          resolve(row);
        }
      });
    });
  };

  const createDefaultAdmin = async () => {
    try {
      const adminExists = await checkAdminExists();
      
      if (!adminExists) {
        // Hash the password
        const hashedPassword = await bcrypt.hash("admin123", 10);
        
        // Insert admin user
        db.run(
          "INSERT INTO users (name, email, password) VALUES (?, ?, ?)",
          ["Admin", "admin@smartwallet.com", hashedPassword],
          function(err) {
            if (err) {
              console.error('Error creating default admin:', err.message);
            } else {
              console.log('Default admin created with ID:', this.lastID);
              
              // Add some sample data for the admin user
              const adminId = this.lastID;
              
              // Sample income
              db.run("INSERT INTO income (user_id, source, amount, icon, description) VALUES (?, ?, ?, ?, ?)",
                [adminId, "Salary", 5000, "briefcase", "Monthly salary"],
                (err) => err && console.error('Error adding sample income:', err.message));
              
              db.run("INSERT INTO income (user_id, source, amount, icon, description) VALUES (?, ?, ?, ?, ?)",
                [adminId, "Freelance", 1200, "laptop", "Web development project"],
                (err) => err && console.error('Error adding sample income:', err.message));
              
              // Sample expenses
              db.run("INSERT INTO expenses (user_id, category, amount, icon, description) VALUES (?, ?, ?, ?, ?)",
                [adminId, "Rent", 1500, "home", "Monthly rent payment"],
                (err) => err && console.error('Error adding sample expense:', err.message));
              
              db.run("INSERT INTO expenses (user_id, category, amount, icon, description) VALUES (?, ?, ?, ?, ?)",
                [adminId, "Groceries", 350, "shopping-basket", "Weekly groceries"],
                (err) => err && console.error('Error adding sample expense:', err.message));
              
              db.run("INSERT INTO expenses (user_id, category, amount, icon, description) VALUES (?, ?, ?, ?, ?)",
                [adminId, "Utilities", 200, "bolt", "Electricity and water"],
                (err) => err && console.error('Error adding sample expense:', err.message));
              
              // Sample savings
              db.run("INSERT INTO savings (user_id, name, target_amount, current_amount, target_date, icon, description) VALUES (?, ?, ?, ?, ?, ?, ?)",
                [adminId, "Emergency Fund", 10000, 3500, "2023-12-31", "shield-alt", "Emergency savings fund"],
                (err) => err && console.error('Error adding sample savings:', err.message));
              
              db.run("INSERT INTO savings (user_id, name, target_amount, current_amount, target_date, icon, description) VALUES (?, ?, ?, ?, ?, ?, ?)",
                [adminId, "New Car", 25000, 5000, "2024-06-30", "car", "Saving for new car purchase"],
                (err) => err && console.error('Error adding sample savings:', err.message));
              
              // Sample loans
              db.run("INSERT INTO loans (user_id, name, total_amount, remaining_amount, interest_rate, due_date, icon, description, type) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
                [adminId, "Personal Loan", 5000, 3000, 5.5, "2024-01-15", "university", "Education loan", "borrowed"],
                (err) => err && console.error('Error adding sample loan:', err.message));
              
              db.run("INSERT INTO loans (user_id, name, total_amount, remaining_amount, interest_rate, due_date, icon, description, type) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
                [adminId, "Friend Loan", 1000, 500, 0, "2023-11-30", "user-friends", "Loan to friend", "lent"],
                (err) => err && console.error('Error adding sample loan:', err.message));
            }
          }
        );
      }
    } catch (err) {
      console.error('Error checking for admin user:', err.message);
    }
  };

  createDefaultAdmin();
};

module.exports = {
  db,
  initializeDatabase
}; 
const express = require('express');
const bodyParser = require('body-parser');
const sql = require('mssql/msnodesqlv8');
const path = require('path');

const app = express();
const port = 3000;

// Database configuration
const config = {
  database: 'Uni',
  server: 'DESKTOP-UJF92EC',
  driver: 'msnodesqlv8',
  connectionString: 'Driver={SQL Server};Server=DESKTOP-UJF92EC;Database=Uni;Trusted_Connection=Yes;'
};

// Middleware 
app.use(bodyParser.urlencoded({ extended: true }))
//static files
app.use(express.static(path.join(__dirname, 'public')));

// Connect to the MSSQL database
sql.connect(config)
  .then(() => console.log('Connected to MSSQL database'))
  .catch(err => console.error('Error connecting to database:', err));

  // Handle GET requests for the root URL '/'
app.get('/index.js', (req, res) => {
  // Serve the 'index.html' file
  res.sendFile('/public/index.html');
});
// Handle POST requests to execute SQL commands
app.post('/index.js', async (req, res) => {
  const { query, valueToInsert, table, table1, table2, condition, colsToShow } = req.body;
  console.log(req.body)
  try {
    let result;
    if (table1 && table2 && colsToShow && condition) {
      let action = `
          SELECT ${colsToShow}
          FROM ${table1} INNER JOIN ${table2}
          ON ${condition};
          `;
      const pool = await sql.connect(config);
      result = await pool.request().query(action);
      console.log(result.recordset)
      // Send the query results back to the client
      res.send(result.recordset);
      return;
      }
    switch (query.toLowerCase()) {
      case 'insert':
        action = `INSERT INTO ${table} VALUES (${valueToInsert})`;
        break;
      case 'delete':
        action = `DELETE FROM ${table} WHERE ${valueToInsert}`; // Replace 'condition' with your actual condition
        break;
      case 'select':
        action = `SELECT ${valueToInsert} FROM ${table} `; // Replace 'condition' with your actual condition
        break;
      case 'update':
        action = `UPDATE ${table} SET ${valueToInsert}`
        break;
      default:
        res.status(400).send('Unsupported action');

        return;
    }
    
    // Execute the constructed SQL query
    const pool = await sql.connect(config);
    result = await pool.request().query(action);
    console.log(result.recordset)
    // Send the query results back to the client
    res.send(result.recordset);
  } catch (error) {
    console.error('Error executing query:', error);
    res.status(500).send('Error executing query');
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});

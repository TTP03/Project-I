const sql = require('msnodesqlv8');

const connectionString = "server=DESKTOP-B5NV01M;Database=TourData;Trusted_Connection=Yes;Driver={ODBC Driver 17 for SQL Server}";

const homeController = {
  getAllTour (req, res) {
    sql.open(connectionString, (err, conn) => {
      if (err) {
        console.error('Error opening connection to SQL Server', err);
        res.status(500).send('Internal Server Error');
        return;
      }
      // const query = 'SELECT * FROM TOUR WHERE COUNTRY = N\'Hàn Quốc\''; 
      const query = "SELECT * FROM TOUR";
      conn.queryRaw(query, (err, results) => {
        if (err) {
          console.error('Error executing query', err);
          res.status(500).send('Internal Server Error');
          return;
        }
        const data = results.rows; 
        res.render('home',{
          data: data,
        });
      });
    });
  },

  getTourBySearch (req, res) {
    const keyword = req.query.search;
    sql.open(connectionString, (err, conn) => {
      if (err) {
        console.error('Error opening connection to SQL Server', err);
        res.status(500).send('Internal Server Error');
        return;
      }
      const query = 'SELECT * FROM TOUR WHERE TITLE LIKE ?';
      conn.queryRaw(query,[`%${keyword}%`], (err, results) => {
        if (err) {
          console.error('Error executing query', err);
          res.status(500).send('Internal Server Error');
          return;
        }
        const data = results.rows; 
        res.render('home',{
          data: data,
        });
      });
    });
  },

  getTourByCountry (req, res) {
    const country = req.query.country;
    sql.open(connectionString, (err, conn) => {
      if (err) {
        console.error('Error opening connection to SQL Server', err);
        res.status(500).send('Internal Server Error');
        return;
      }
      const query = 'SELECT * FROM TOUR WHERE COUNTRY = ?';
      conn.queryRaw(query,[country], (err, results) => {
        if (err) {
          console.error('Error executing query', err);
          res.status(500).send('Internal Server Error');
          return;
        }
        const data = results.rows; 
        res.render('home',{
          data: data,
        });
      });
    });
  },

  getTourByTransport (req, res) {
    const transport = req.query.transport;
    sql.open(connectionString, (err, conn) => {
      if (err) {
        console.error('Error opening connection to SQL Server', err);
        res.status(500).send('Internal Server Error');
        return;
      }
      const query = 'SELECT * FROM TOUR WHERE VEHICLE LIKE ?';
      conn.queryRaw(query,[`%${transport}%`], (err, results) => {
        if (err) {
          console.error('Error executing query', err);
          res.status(500).send('Internal Server Error');
          return;
        }
        const data = results.rows; 
        res.render('home',{
          data: data,
        });
      });
    });
  },
};

module.exports = homeController;

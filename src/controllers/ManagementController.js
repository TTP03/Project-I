const sql = require('msnodesqlv8');

const connectionString = "server=DESKTOP-B5NV01M;Database=TourData;Trusted_Connection=Yes;Driver={ODBC Driver 17 for SQL Server}";

const ManagementController = {
  show (req, res) {
    sql.open(connectionString, (err, conn) => {
      if (err) {
        console.error('Error opening connection to SQL Server', err);
        res.status(500).send('Internal Server Error');
        return;
      }
      const query = "SELECT * FROM TOUR";
      conn.queryRaw(query, (err, results) => {
        if (err) {
          console.error('Error executing query', err);
          res.status(500).send('Internal Server Error');
          return;
        }
        const data = results.rows; 
        res.render('management/show',{
          data: data,
        });
      });
    });
  },
}

module.exports = ManagementController;
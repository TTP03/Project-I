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
      // const query = 'SELECT * FROM TOUR WHERE COUNTRY = N\'Hàn Quốc\''; 
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

  statics (req, res) {
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
        var totalTour = 0;
        var totalRevenue = 0;
        var totalQuantity = 0;
        for (let i=0; i < data.length; i++) {
          totalTour += 1;
          totalRevenue += data[i][5]*data[i][7];
          totalQuantity += data[i][7];
        }
        res.render('management/statics',{
          data: data,
          totalRevenue: totalRevenue,
          totalQuantity: totalQuantity,
          totalTour : totalTour,
        });
      });
    });
  },

  create (req, res) {
    res.render('management/create');
  },

  store (req, res) {
    const code = req.body.newCode;
    const country = req.body.newCountry;
    const title = req.body.newTitle;
    const url = req.body.newURL;
    const time = req.body.newTime;
    const price = req.body.newPrice;
    const vehicle = req.body.newVehicle;
    const rating = req.body.newRating;
    //quantity
    const p = price*1000000;
    console.log(req.body);
    console.log(p);
    sql.open(connectionString, (err, conn) => {
      if (err) {
        console.error('Error opening connection to SQL Server', err);
        res.status(500).send('Internal Server Error');
        return;
      }
      const query = "INSERT INTO TOUR (CODE, COUNTRY, TITLE, IMAGE, TIME, PRICE, VEHICLE, QUANTITY, RATING) VALUES (?,?,?,?,?,?,?,0,?)";
      conn.queryRaw(query, [code, country, title, url, time, p, vehicle, rating], (err, results) => {
          if (err) {
            console.error('Error executing query', err);
            res.status(500).send('Internal Server Error');
            return;
          }
          res.redirect('show');
      });
    });
  },

  delete (req, res) {
    const code = req.params.id;
    console.log(code);
    sql.open(connectionString, (err, conn) => {
      if (err) {
        console.error('Error opening connection to SQL Server', err);
        res.status(500).send('Internal Server Error');
        return;
      }
      const query1 = "DELETE FROM BOOKED WHERE CODE = ?";
      const query2 = "DELETE FROM TOUR WHERE CODE = ?";  
      conn.queryRaw(query1, [code], (err, results) => {
        if (err) {
          console.error('Error executing query', err);
          res.status(500).send('Internal Server Error');
          return;
        }
      });
      conn.queryRaw(query2, [code], (err, results) => {
        if (err) {
          console.error('Error executing query', err);
          res.status(500).send('Internal Server Error');
          return;
        }
        // res.send('<script>window.history.go(-2);</script>');
      });
    });
  },

  edit (req, res) {
    const code =req.params.id;
    sql.open(connectionString, (err, conn) => {
      if (err) {
        console.error('Error opening connection to SQL Server', err);
        res.status(500).send('Internal Server Error');
        return;
      }
      const query = "SELECT * FROM TOUR WHERE CODE = ?";
      conn.queryRaw(query, [code], (err, results) => {
        if (err) {
          console.error('Error executing query', err);
          res.status(500).send('Internal Server Error');
          return;
        }
        const tour = results.rows[0]; 
        res.render('management/edit',{
          tour: tour,
        });
      });
    });
  },

  update (req, res) {
    const code = req.body.newCode;
    const country = req.body.newCountry;
    const title = req.body.newTitle;
    const url = req.body.newURL;
    const time = req.body.newTime;
    const price = req.body.newPrice;
    const vehicle = req.body.newVehicle;
    const rating = req.body.newRating;
    //quantity
    const p = price*1000000;
    sql.open(connectionString, (err, conn) => {
      if (err) {
        console.error('Error opening connection to SQL Server', err);
        res.status(500).send('Internal Server Error');
        return;
      }
      const query = "UPDATE TOUR SET COUNTRY=?, TITLE=?, IMAGE=?, TIME=?, PRICE=?, VEHICLE=?, RATING=? WHERE CODE=?";
      conn.queryRaw(query, [country, title, url, time, p, vehicle, rating, code], (err, results) => {
          if (err) {
            console.error('Error executing query', err);
            res.status(500).send('Internal Server Error');
            return;
          }
          res.redirect('show');
      });
    });
  },
  client (req, res) {
    sql.open(connectionString, (err, conn) => {
      if (err) {
        console.error('Error opening connection to SQL Server', err);
        res.status(500).send('Internal Server Error');
        return;
      } 
      const query1 = "SELECT COUNT(*) FROM CLIENT";
      const query2 = "SELECT * FROM CLIENT";
      const query3 = "SELECT ID, SUM(QUANTITY), SUM(TOTAL) FROM (SELECT ID ,BOOKED.QUANTITY, PRICE, BOOKED.QUANTITY * PRICE AS TOTAL  from BOOKED, TOUR WHERE BOOKED.CODE = TOUR.CODE) AS SUB_TABLE GROUP BY ID";
      var clientNumber, client, booked;
      conn.queryRaw(query1, (err, results1) => {
        if (err) {
          console.error('Error executing query', err);
          res.status(500).send('Internal Server Error');
          return;
        }
        clientNumber = results1.rows; 
        conn.queryRaw(query2, (err, results2) => {
          if (err) {
            console.error('Error executing query', err);
            res.status(500).send('Internal Server Error');
            return;
          }
          client = results2.rows;
          conn.queryRaw(query3, (err, results3) => {
            if (err) {
              console.error('Error executing query', err);
              res.status(500).send('Internal Server Error');
              return;
            }
            booked = results3.rows;
            console.log(booked);
            console.log(client);
            console.log(clientNumber);
            res.render('management/client',{
              client: client,
              clientNumber: clientNumber,
              booked : booked,
            });
          });
        });
      });
    });
  },
}

module.exports = ManagementController;
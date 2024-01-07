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

  getHint (req, res) {
    const budget = req.query.budget*1000000;
    const timeFund = req.query.timeFund;
    const budgetWeight = req.query.budgetWeight;
    const timeFundWeight = req.query.timeFundWeight;
    const ratingWeight = req.query.ratingWeight;
    sql.open(connectionString, (err, conn) => {
      if (err) {
        console.error('Error opening connection to SQL Server', err);
        res.status(500).send('Internal Server Error');
        return;
      } 
      var query = "SELECT * FROM TOUR WHERE TOUR.PRICE <= ? AND TOUR.TIME <= ?"
      if (!timeFund && !budget) query = "SELECT * FROM TOUR";
      else if (!timeFund) query = "SELECT * FROM TOUR WHERE TOUR.PRICE <= ?";
      else if (!budget) query = "SELECT * FROM TOUR WHERE ?=0 AND TOUR.TIME <= ?";
      conn.queryRaw(query, [budget, timeFund], (err, results) => {
        if (err) {
          console.error('Error executing query', err);
          res.status(500).send('Internal Server Error');
          return;
        }
        const data = results.rows; 
        
        // TOPSIS Method
        const price = [], time = [], rating = [], hintMatrix = [], positiveMatrix = [], negativeMatrix = [], similarity = [];
        for (let i = 0; i < data.length; i++) {
          if (!timeFund) time.push(1);
          else time.push(data[i][4]);
          if (!budget) price.push(1);
          else price.push(data[i][5]);
          rating.push(data[i][8]);
        }

        hintMatrix.push(time);
        hintMatrix.push(price);
        hintMatrix.push(rating);
        
        // vector normalzation
        let SvTime = 0, SvPrice = 0, SvRating = 0;

        for (let i = 0; i < hintMatrix[0].length; i++){
          SvTime += hintMatrix[0][i]**2;
          SvPrice += hintMatrix[1][i]**2;
          SvRating += hintMatrix[2][i]**2;
        }
        
        // chưa thêm hệ số
        for (let i = 0; i < hintMatrix[0].length; i++){
          hintMatrix[0][i] = hintMatrix[0][i] / Math.sqrt(SvTime) * timeFundWeight;
          hintMatrix[1][i] = hintMatrix[1][i] / Math.sqrt(SvPrice) * budgetWeight;
          hintMatrix[2][i] = hintMatrix[2][i] / Math.sqrt(SvRating) * ratingWeight;
        }

        positiveMatrix.push(Math.max.apply(null, hintMatrix[0]));
        positiveMatrix.push(Math.max.apply(null, hintMatrix[1]));
        positiveMatrix.push(Math.max.apply(null, hintMatrix[2]));

        negativeMatrix.push(Math.min.apply(null, hintMatrix[0]));
        negativeMatrix.push(Math.min.apply(null, hintMatrix[1]));
        negativeMatrix.push(Math.min.apply(null, hintMatrix[2]));

        for (let i = 0; i < hintMatrix[0].length; i++) {
          let tmp0 = 0, tmp1 = 0;
          for (let j = 0; j < 3; j++) {
            tmp0 += (hintMatrix[j][i] - positiveMatrix[j])**2;
            tmp1 += (hintMatrix[j][i] - negativeMatrix[j])**2;
          }
          tmp0 = Math.sqrt(tmp0);
          tmp1 = Math.sqrt(tmp1);
          similarity[i] = tmp1 / (tmp0 + tmp1);
        }

        // sort 
        for (let i = 1; i < similarity.length; i++) {
          const last = similarity[i];
          let tmp = data[i];
          let j = i;
      
          while (j >= 1 && similarity[j - 1] < last) {
            similarity[j] = similarity[j - 1];
            data[j] = data[j - 1];
            similarity[j - 1] = last;
            data[j - 1] = tmp;
            j--;
          }
        }
        console.log(similarity);
        res.render('home',{
          data: data,
        });
      });
    });
  },
  
  booking (req, res) {
    sql.open(connectionString, (err, conn) => {
        if (err) {
          console.error('Error opening connection to SQL Server', err);
          res.status(500).send('Internal Server Error1');
          return;
        }
        const id = req.query.id;
        const code = req.query.code;
        const name = req.query.name;
        const phone = req.query.phone;
        const quantity = req.query.quantity;
        var countID, countCodeID;

        const clientQuery_check = 'SELECT COUNT(*) FROM CLIENT WHERE ID = ?';
        const bookedQuery_check = 'SELECT COUNT(*) FROM BOOKED WHERE CODE = ? AND ID = ?';
        
        var tourQuery = 'UPDATE TOUR SET TOUR.QUANTITY = (SELECT SUM(BOOKED.QUANTITY) FROM BOOKED WHERE BOOKED.CODE = TOUR.CODE) WHERE EXISTS (SELECT 1 FROM BOOKED WHERE BOOKED.CODE = TOUR.CODE)';
        var clientQuery = 'INSERT INTO CLIENT (NAME, PHONE_NUMBER, ID) VALUES (?, ?, ?)';
        var bookedQuery = 'INSERT INTO BOOKED (QUANTITY, ID, CODE) VALUES(?, ?, ?) ';

        conn.queryRaw(clientQuery_check, [id], (err, results1) => {
            if (err) {
              console.error('Error executing query', err);
              res.status(500).send('Internal Server Error2');
              return;
            }
            countID = results1.rows;    
            conn.queryRaw(bookedQuery_check, [code, id], (err, results2) => {
              if (err) {
                console.error('Error executing query', err);
                res.status(500).send('Internal Server Error3');
                return;
              }
              countCodeID = results2.rows;
              if (countID[0][0] > 0) {
                clientQuery = 'UPDATE CLIENT SET NAME = ?, PHONE_NUMBER = ? WHERE ID = ?';
                if (countCodeID[0][0] > 0) {
                    bookedQuery = 'UPDATE BOOKED SET QUANTITY = QUANTITY + ? WHERE  ID = ? AND CODE = ? ';
                }
              }
              conn.queryRaw(clientQuery, [name, phone, id], (err) => {
                if (err) {
                  console.error('Error executing query', err);
                  res.status(500).send('Internal Server Error4');
                  return;
                }
            });
    
            conn.queryRaw(bookedQuery, [quantity, id, code], (err) => {
                if (err) {
                  console.error('Error executing query', err);
                  res.status(500).send('Internal Server Error5');
                  return;
                }
                conn.queryRaw(tourQuery, (err, results) => {
                    if (err) {
                      console.error('Error executing query', err);
                      res.status(500).send('Internal Server Error6');
                      return;
                    }
                    res.redirect('back');
                });
            });
          });
        });
    });
  },
};

module.exports = homeController;

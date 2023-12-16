// const sql = require('msnodesqlv8');

// const connectionString = "server=DESKTOP-B5NV01M;Database=TourData;Trusted_Connection=Yes;Driver={ODBC Driver 17 for SQL Server}";

// module.exports = async function getLoginDetails() {
//   try {
//     sql.query(connectionString, 'select * from BOOKED', (err, rows) => {
//       if (err) {
//         console.error('Lỗi truy vấn:', err);
//       } else {
//         console.log('Kết quả truy vấn:', rows);
//       }
//     });
//   } catch (error) {
//     console.log(error);
//   }
// };
const sql = require('msnodesqlv8');

const connectionString = "server=DESKTOP-B5NV01M;Database=TourData;Trusted_Connection=Yes;Driver={ODBC Driver 17 for SQL Server}";

module.exports = async function connectToDatabase() {
  try {
    const connection = sql.open(connectionString, (err) => {
      if (err) {
        console.error('Lỗi kết nối:', err);
      } else {
        console.log('Kết nối thành công!');
      }
    });
  } catch (error) {
    console.error('Lỗi:', error);
  }
};


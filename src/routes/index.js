const homeRouter = require('./home');
const managementRouter = require('./management');
function route(app) {
    
    app.use('/', homeRouter);
    app.use('/management', managementRouter);
}

module.exports = route;
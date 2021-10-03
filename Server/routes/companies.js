var express = require('express');
var router = express.Router();
/**
 * Route: GET /companies
 * Description: This route returns all companies
 * Parameters: None
 **/
router.get('/', (req, res) => {
    const route = `GET /companies`;
    console.log(route);

    var sql = `SELECT * FROM Companies`;
    res.locals.connection.query(sql, function(err, result) {
        if (err) {
            global.handleError(err, res);
        }
        else {
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(result));
        }
    });
    res.locals.connection.end();
});

module.exports = router;

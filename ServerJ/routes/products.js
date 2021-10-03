var express = require('express');
var router = express.Router();

/**
 * Route: GET /alexa/products
 * Description: This route returns the list of Alexa products that are currently supported
 * Parameters: None
 **/
router.get('/json', function(req, res) {
    const route = `GET /products/json`;
    console.log('GET /products/json');
    var sql = `SELECT product_id AS id, product_name, CONCAT(company_name, ' ', product_name) AS name FROM Products JOIN Companies ON Companies.company_id = Products.company_id;`;
    res.locals.connection.query(sql, function(err, rows, fields) {
        if (err) {
            global.handleError(err, res);
        }
        else {
            res.writeHead(200, { 'Content-Type': 'application/json' });
            var products = [];
            for (var i = 0; i < rows.length; i++) {
                var row = rows[i];
                let id = row.id;
                let name = row.name;
                let synonym = row.product_name;
                let product = {
                    "id": id,
                    "name": {
                        "value": name,
                        "synonyms": [synonym]
                    }
                };
                products.push(product);
            }
            res.end(JSON.stringify(products));
        }
    });
    res.locals.connection.end();
});


/**
 * Route: GET /products
 * Description: This route returns all existing products
 * Parameters: None
 **/
router.get('/', (req, res) => {
    const route = `GET /products`;
    console.log(route);

    var sql = `SELECT product_id, company_name, product_name, product_is_alexa_compatible  FROM Products INNER JOIN Companies WHERE Products.company_id = Companies.company_id ORDER BY company_name, product_name`;
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

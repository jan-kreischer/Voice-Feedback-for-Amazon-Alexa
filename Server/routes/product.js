var express = require('express')
var router = express.Router()

//========== PRODUCTS ==========
//---------- PRODUCTS > CREATE ----------


//---------- PRODUCTS > READ ----------
/**
 * Route: POST /feedback
 * Description: This route can be used to insert new feedback entities
 * Parameters: A feedback entity to insert
 **/
router.get('/:product_id', function(req, res) {
    const product_id = req.params.product_id;
    console.log(`GET > /product/${product_id}`)

    //var sql = `SELECT * FROM Products WHERE product_id = ${product_id}`;
    var sql = `SELECT * FROM Products JOIN Companies ON Products.company_id = Companies.company_id WHERE Products.product_id=${product_id}`;
    console.log(sql)
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

/**
 * Route: GET /product/:product_id/feedback
 * Description: This route returns all feedback for a product.
 * Parameters: feedback_id of the requested feedback entity.
 **/
router.get('/:product_id/feedback', function(req, res) {
    var product_id = req.params.product_id
    console.log(`GET > /product/${product_id}/feedback`)

    var sql = `SELECT * FROM Feedback JOIN FeedbackTypes ON Feedback.feedback_type_id = FeedbackTypes.feedback_type_id JOIN Products ON Feedback.product_id = Products.product_id JOIN Companies ON Products.company_id = Companies.company_id JOIN Feedbacker ON Feedback.feedbacker_id = Feedbacker.feedbacker_id WHERE Feedback.product_id=${product_id};`
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



//---------- PRODUCTS > UPDATE ----------


//---------- PRODUCTS > DELETE ----------


module.exports = router;
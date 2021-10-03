var express = require('express');
var router = express.Router();

/**
 * 
 **/
router.get('/:feedbacker_id/product/:product_id/replies', (req, res) => {
    let feedbacker_id = req.params.feedbacker_id;
    let product_id = req.params.product_id;
    console.log(`GET > /feedbacker/${feedbacker_id}/product/${product_id}/replies`);

    const sql = `SELECT * FROM Feedback 
                JOIN FeedbackTypes ON Feedback.feedback_type_id = FeedbackTypes.feedback_type_id
                JOIN Products ON Feedback.product_id = Products.product_id 
                JOIN Companies ON Companies.company_id = Products.company_id
                WHERE reply_content IS NOT NULL 
                AND Feedback.feedbacker_id = 2 
                AND !Feedback.reply_is_acknowledged 
                AND Feedback.product_id = 1
                ORDER BY Feedback.feedback_id DESC
                LIMIT 1`;
    res.locals.connection.query(sql, function(err, result) {
        if (err) {
            global.handleError(err, res);
        }
        else {
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(result));
        }
        res.locals.connection.end();
    });
});

/**
 * 
 **/
router.put('/', (req, res) => {
    console.log("PUT > /feedbacker")

    let feedbacker_name = req.body.feedbacker_name;
    let feedbacker_email_address = req.body.feedbacker_email_address;

    var sql_write = `INSERT INTO Feedbacker(feedbacker_name, feedbacker_email)
    SELECT * FROM(SELECT '${feedbacker_name}', '${feedbacker_email_address}') AS tmp
    WHERE NOT EXISTS(
        SELECT * FROM Feedbacker WHERE feedbacker_email = '${feedbacker_email_address}'
    ) LIMIT 1`;

    var sql_read = `SELECT * FROM Feedbacker WHERE feedbacker_email = '${feedbacker_email_address}'`;

    //var sql = `INSERT INTO Feedbacker (feedbacker_name, feedbacker_email) VALUES ('${feedbacker_name}', '${feedbacker_email_address}')`;
    res.locals.connection.query(sql_write, function(err, result) {
        if (err) {
            global.handleError(err, res);
        }
        else {
            res.locals.connection.query(sql_read, function(err, result) {
                if (err) {
                    global.handleError(err, res);
                }
                else {
                    res.writeHead(200, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify(result));
                }
            });

        }
        res.locals.connection.end();
    });
});

/**
 * Route: GET /feedbacker/:feedbacker_id/replies
 * Description: This returns the unacknowledged replies to given feedback for a certain user
 * Parameters: feedbacker_id of the corresponding user
 **/
router.get('/:feedbacker_id/replies', function(req, res) {
    const feedbacker_id = req.params.feedbacker_id;
    const route = `GET /feedbacker/${feedbacker_id}/replies`;
    console.log(route);
    
    var sql = `SELECT Feedback.feedback_id, Feedback.feedback_content, Feedback.reply_content, Products.product_name, Companies.company_name FROM Feedback JOIN Products ON Feedback.product_id = Products.product_id JOIN Companies ON Companies.company_id  = Products.company_id  WHERE Feedback.reply_content IS NOT NULL AND !Feedback.reply_is_acknowledged AND feedbacker_id = ${feedbacker_id};`
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

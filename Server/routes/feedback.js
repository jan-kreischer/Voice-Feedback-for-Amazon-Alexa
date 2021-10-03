var express = require('express');
var router = express.Router();
var multer = require('multer');
var upload = multer();
var mysql = require("mysql");
var cors = require('cors');
var app = express();

app.use(cors());

//========== FEEDBACK ==========
//---------- FEEDBACK > CREATE ----------
/**
 * Route: POST /feedback
 * Description: This route can be used to insert new feedback entities
 * Parameters: A feedback entity to insert
 **/
router.post('/', upload.none(), function(req, res) {
    const route = 'POST /feedback';
    console.log(route);
    console.log(req.body);

    let keys = Object.keys(req.body).join(', ');
    let values = Object.values(req.body).map(e => `${mysql.escape(e)}`).join(', ');
    let sql = `INSERT INTO Feedback (` + keys + `) VALUES (` + values + `)`;
    res.locals.connection.query(sql, function(err, result) {
        if (err) {
            global.handleError(err, res);
        }
        else {
            res.writeHead(200, { 'Content-Type': 'text/plain' });
            res.end(`${route} > Okay`);
        }
        res.locals.connection.end();
    });
});



//---------- FEEDBACK > READ ----------
/**
 * Route: GET /feedback
 * Description: This route can returns all currently existing feedback entities
 * Parameters: None
 **/
router.get('/', (req, res) => {
    const route = `GET /feedback`;
    console.log(route);

    const sql = `SELECT * FROM Feedback JOIN FeedbackTypes ON Feedback.feedback_type_id = FeedbackTypes.feedback_type_id JOIN Feedbacker ON Feedback.feedbacker_id = Feedbacker.feedbacker_id JOIN Products ON Products.product_id = Feedback.product_id JOIN Companies ON Companies.company_id = Products.company_id ORDER BY Feedback.feedback_id DESC`;
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
 * Route: POST /feedback/:feedback_id
 * Description: This route returns the feedback entity with the correpsonding id
 * Parameters: feedback_id of the requested entity
 **/
router.get('/:feedback_id', function(req, res) {
    const feedback_id = req.params.feedback_id;
    const route = `GET /feedback/${feedback_id}`;
    console.log(route);

    let sql = `SELECT * FROM Feedback JOIN FeedbackTypes ON Feedback.feedback_type_id = FeedbackTypes.feedback_type_id JOIN Feedbacker ON Feedback.feedbacker_id = Feedbacker.feedbacker_id JOIN Products ON Products.product_id = Feedback.product_id JOIN Companies ON Companies.company_id = Products.company_id WHERE feedback_id = ${feedback_id}`;
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



//---------- FEEDBACK > UPDATE ----------
/**
 * Route: PATCH /feedback/:feedback_id/process
 * Description: Sets the status of the specified feedback entity to processed.
 * Parameters: feedback_id of the desired entity
 **/
router.patch('/:feedback_id/process', function(req, res) {
    const feedback_id = req.params.feedback_id;
    const route = `PATCH /feedback/${feedback_id}/process`;
    console.log(route);

    var sql = `UPDATE Feedback SET feedback_is_processed = TRUE WHERE feedback_id = ${feedback_id}`;
    res.locals.connection.query(sql, function(err, result) {
        if (err) {
            global.handleError(err, res);
        }
        else {
            const sql = `SELECT * FROM Feedback JOIN FeedbackTypes ON Feedback.feedback_type_id = FeedbackTypes.feedback_type_id JOIN Feedbacker ON Feedback.feedbacker_id = Feedbacker.feedbacker_id JOIN Products ON Products.product_id = Feedback.product_id JOIN Companies ON Companies.company_id = Products.company_id WHERE feedback_id = ${feedback_id}`;
            res.locals.connection.query(sql, function(err, result) {
                if (err) {
                    global.handleError(err, res);
                }
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify(result));
            });
        }
        res.locals.connection.end();
    });
});

/**
 * Route: PATCH /feedback/:feedback_id/reply
 * Description: Sets the status of the specified feedback entity to processed.
 * Parameters: feedback_id of the desired entity and reply_content to insert.
 **/
router.patch('/:feedback_id/reply', function(req, res) {
    const feedback_id = req.params.feedback_id;
    const reply_content = req.body.reply_content;
    const route = `PATCH /feedback/${feedback_id}/reply`;
    console.log(route);

    var sql = `UPDATE Feedback SET reply_content = '${reply_content}' WHERE feedback_id = ${feedback_id};`;
    res.locals.connection.query(sql, function(err, result) {
        if (err) {
            global.handleError(err, res);
        }
        else {
            var sql = `SELECT * FROM Feedback WHERE feedback_id = ${feedback_id}`;
            res.locals.connection.query(sql, function(err, result) {
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
 * Route: PATCH /feedback/:feedback_id/reply/acknowledge
 * Description: Changes the status of the feedback reply to acknowledged.
 * Parameters: feedback_id of the desired entity.
 **/
router.patch('/:feedback_id/reply/acknowledge', function(req, res) {
    const feedback_id = req.params.feedback_id;
    const route = `PATCH /feedback/${feedback_id}/reply/acknowledge`;
    console.log(route);

    var sql = `UPDATE Feedback SET reply_is_acknowledged = TRUE WHERE feedback_id = ${feedback_id}`;
    res.locals.connection.query(sql, function(err, result) {
        if (err) {
            global.handleError(err, res);
        }
        else {
            var sql = `SELECT * FROM Feedback WHERE feedback_id = ${feedback_id}`;
            res.locals.connection.query(sql, function(err, result) {
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



//---------- FEEDBACK > DELETE ----------
/**
 * Route: DELETE /feedback/:feedback_id
 * Description: Deletes the specified feedback entity.
 * Parameters: feedback_id of the entity to delete.
 **/
router.delete('/:feedback_id', function(req, res) {
    const feedback_id = req.params.feedback_id;
    const route = `DELETE /feedback/${feedback_id}`;
    console.log(route);

    var sql = `DELETE FROM Feedback WHERE feedback_id = ${feedback_id}`;
    res.locals.connection.query(sql, function(err, result) {
        if (err) {
            global.handleError(err, res);
        }
        else {
            res.writeHead(200, { 'Content-Type': 'text/plain' });
            res.end(`${route} > Okay`);
        }
        res.locals.connection.end();
    });

});

module.exports = router;

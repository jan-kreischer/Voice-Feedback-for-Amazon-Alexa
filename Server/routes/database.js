var express = require('express');
var router = express.Router();

/**
 * 
 **/
router.put('/recreate', function(req, res) {
    const route = `PUT /database/recreate`;
    console.log(route);

    createDatabase(res);
    provisionDatabase(res);
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end(`${route} > Okay`);
});

//========== CREATE TABLES =========
const create_companies_table =
    `CREATE TABLE Companies (
        company_id INT AUTO_INCREMENT NOT NULL,
        company_name VARCHAR (255) NOT NULL UNIQUE,
        PRIMARY KEY (company_id)
    )`;

const create_products_table =
    `CREATE TABLE Products (
        product_id INT AUTO_INCREMENT NOT NULL,
        company_id INT NOT NULL DEFAULT 1,
        product_name VARCHAR (255) NOT NULL UNIQUE,
        product_is_alexa_compatible BOOL NOT NULL DEFAULT 0,
        PRIMARY KEY (product_id),
        FOREIGN KEY (company_id) REFERENCES Companies(company_id)
    )`;

const create_feedback_types_table =
    `CREATE TABLE FeedbackTypes (
        feedback_type_id INT AUTO_INCREMENT,
        feedback_type_name VARCHAR (255),
        PRIMARY KEY (feedback_type_id)
    )`;

const create_feedbacker_table =
    `CREATE TABLE Feedbacker (
        feedbacker_id INT AUTO_INCREMENT NOT NULL,
        feedbacker_name VARCHAR (255),
        feedbacker_email VARCHAR (255) DEFAULT NULL UNIQUE,
        feedbacker_telephone_number VARCHAR (255) DEFAULT NULL,
        PRIMARY KEY (feedbacker_id)
    )`;

const create_feedback_table =
    `CREATE TABLE Feedback (
        feedback_id INT AUTO_INCREMENT NOT NULL,
        feedbacker_id INT NOT NULL DEFAULT 1,
        product_id INT NOT NULL DEFAULT 1,
        feedback_type_id INT NOT NULL DEFAULT 1,
        
        feedback_is_processed BOOL NOT NULL DEFAULT 0,
        feedback_receiving_time DATETIME DEFAULT NOW(),
        
        feedback_content VARCHAR (1024) NOT NULL,
        feedback_context VARCHAR (1024) DEFAULT NULL,
        feedback_problem VARCHAR (1024) DEFAULT NULL,
        feedback_solution VARCHAR (1024) DEFAULT NULL,
        feedback_steps_to_reproduce VARCHAR (1024) DEFAULT NULL,

        feedback_criticality INT DEFAULT NULL CHECK(feedback_criticality BETWEEN 1 AND 5),
        feedback_importance INT DEFAULT NULL CHECK(feedback_criticality BETWEEN 1 AND 5),
        feedback_star_rating INT DEFAULT NULL CHECK(feedback_star_rating BETWEEN 1 AND 5),
        
        reply_content VARCHAR (1024) DEFAULT NULL,
        reply_is_acknowledged BOOL DEFAULT 0,

        PRIMARY KEY (feedback_id),
        FOREIGN KEY (feedbacker_id) REFERENCES Feedbacker(feedbacker_id),
        FOREIGN KEY (product_id) REFERENCES Products(product_id),
        FOREIGN KEY (feedback_type_id) REFERENCES FeedbackTypes(feedback_type_id)
    )`;

const table_creation_statements = [
    create_companies_table,
    create_products_table,
    create_feedback_types_table,
    create_feedbacker_table,
    create_feedback_table
];


/**
 * 
 **/
function createDatabase(res) {
    var tables = [
        'Feedback',

        'FeedbackTypes',
        'Feedbacker',
        'Products',
        'Companies'
    ];

    tables.forEach((table, index, array) => {
        let sql = `DROP TABLE IF EXISTS ${table}`;
        run_sql_statement(res, sql);
    });

    table_creation_statements.forEach((table_creation_statement, index, array) => {
        run_sql_statement(res, table_creation_statement);
    });

}



//========== PROVISION TABLES =========
const products = [
    { company_id: 1, company_name: 'Amazon', product_name: 'Echo' },
    { company_id: 1, company_name: 'Amazon', product_name: 'Echo Plus' },
    { company_id: 1, company_name: 'Amazon', product_name: 'Echo Dot' },
    { company_id: 1, company_name: 'Amazon', product_name: 'Echo Look' },
    { company_id: 1, company_name: 'Amazon', product_name: 'Echo Show' },
    { company_id: 1, company_name: 'Amazon', product_name: 'Echo Spot' },
    { company_id: 1, company_name: 'Amazon', product_name: 'Fire TV' },
    { company_id: 1, company_name: 'Amazon', product_name: 'Fire TV Stick' },
    { company_id: 1, company_name: 'Amazon', product_name: 'Fire TV Cube' },
    { company_id: 1, company_name: 'Amazon', product_name: 'Fire' },
    { company_id: 1, company_name: 'Amazon', product_name: 'Fire HD' },

    { company_id: 2, company_name: 'Philips', product_name: 'Hue Light' },

    { company_id: 3, company_name: 'August', product_name: 'Smart Lock' },

    { company_id: 4, company_name: 'Sonos', product_name: 'SimpliSafe' },
    { company_id: 4, company_name: 'Sonos', product_name: 'One' },

    { company_id: 5, company_name: 'Samsung', product_name: 'Smart TV' },

    { company_id: 6, company_name: 'LG', product_name: 'InstaView smart refrigerator' },

    { company_id: 7, company_name: 'Omate', product_name: 'Yumi' },

    { company_id: 8, company_name: 'Ecobee', product_name: 'Smart Thermostat' },
    { company_id: 8, company_name: 'Ecobee', product_name: 'Switch Plus' },

    { company_id: 9, company_name: 'iDevices', product_name: 'Instinct Light Switch' },

    { company_id: 10, company_name: 'Netgear', product_name: ' Orbi Voice' },
    { company_id: 11, company_name: 'Onelink', product_name: 'Safe And Sound' },

    { company_id: 12, company_name: 'Microsoft', product_name: 'Xbox one' },

];

const feedbacks = [
    { feedbacker_id: 2, feedback_type_id: 1, feedback_content: 'I encountered an error. The device suddenly started to show a flickering screen. After some time the image looks normal again, but it is tottaly unpredictable when it happens again.', feedback_context: 'The device is plugged into the HDMI port TV in my living room and is supposed to stream videos', feedback_steps_to_reproduce: 'I basically turn on the TV and wait for an unpredictable amount of time and suddenly the described behaviour occurs.', feedback_criticality: 5 },
    { feedbacker_id: 1, feedback_type_id: 2, feedback_content: 'Please add an auto update feature to the smart device', feedback_context: 'Context', feedback_problem: 'Problem', feedback_solution: 'Solution' },
    { feedbacker_id: 3, feedback_type_id: 3, feedback_content: 'I would like to sync my settings with my other device. Therefore, I need to enable the cloud sync functionality. Sadly I dont know how to enable it.', feedback_importance: 3 },
    { feedbacker_id: 2, feedback_type_id: 4, feedback_content: 'I love your product. It helped me to become more active.', reply_content: 'Thank you very much for your positive feedback.', feedback_star_rating: 5 },
    { feedbacker_id: 1, feedback_type_id: 5, feedback_content: 'Your product is pretty good. However, the usabillity could be better.', reply_content: 'Thank you very much for your positive feedback.' }
];

const feedbackers = [
    { feedbacker_id: 1, feedbacker_name: 'Anonymous', feedbacker_email: '-', feedbacker_telephone_number: '-' },
    { feedbacker_id: 2, feedbacker_name: 'Frank Bauer', feedbacker_email: 'frank.bauer@gmail.com', feedbacker_telephone_number: '+4917681590441' },
    { feedbacker_id: 3, feedbacker_name: 'Jan Bauer', feedbacker_email: '"feedbacker@kreischers.com"', feedbacker_telephone_number: '+4917681590441' },
];

const feedback_types = [
    { feedback_type_id: 1, feedback_type_name: 'Bug report' },
    { feedback_type_id: 2, feedback_type_name: 'Feature request' },
    { feedback_type_id: 3, feedback_type_name: 'Question' },
    { feedback_type_id: 4, feedback_type_name: 'Praise and criticism' },
    { feedback_type_id: 5, feedback_type_name: 'General feedback' },
];

/**
 * 
 **/
function provisionDatabase(res) {
    provisionCompaniesTable(res);
    provisionProductsTable(res);
    provisionFeedbackTypesTable(res);
    provisionFeedbackerTable(res);

    provisionFeedbackTable(res);
}

function provisionCompaniesTable(res) {
    products.forEach((product, index, array) => {
        let { company_id, product_name, company_name } = product;
        const companies_table_properties = { company_id, company_name };
        let keys = Object.keys(companies_table_properties).join(', ');
        let values = Object.values(companies_table_properties).map(e => `'${e}'`).join(', ');

        let sql = `INSERT INTO Companies(${keys})
        SELECT * FROM(SELECT ${values}) AS tmp
        WHERE NOT EXISTS(
            SELECT * FROM Companies WHERE company_name = '${company_name}'
        ) LIMIT 1`;

        run_sql_statement(res, sql);
    });
}

function provisionProductsTable(res) {
    products.forEach((product, index, array) => {
        const { product_name, company_id, company_name } = product;
        const product_table_properties = { product_name, company_id };

        let keys = Object.keys(product_table_properties).join(', ');
        let values = Object.values(product_table_properties).map(e => `'${e}'`).join(', ');
        let sql = `INSERT INTO Products (` + keys + `) VALUES (` + values + `)`;

        run_sql_statement(res, sql);
    });
}


function provisionFeedbackTypesTable(res) {
    feedback_types.forEach((feedback_type, index, array) => {
        let keys = Object.keys(feedback_type).join(', ');
        let values = Object.values(feedback_type).map(e => `'${e}'`).join(', ');
        let sql = `INSERT INTO FeedbackTypes (` + keys + `) VALUES (` + values + `)`;

        run_sql_statement(res, sql);
    });
}

function provisionFeedbackerTable(res) {
    feedbackers.forEach((feedbacker, index, array) => {
        let keys = Object.keys(feedbacker).join(', ');
        let values = Object.values(feedbacker).map(e => `'${e}'`).join(', ');
        let sql = `INSERT INTO Feedbacker (` + keys + `) VALUES (` + values + `)`;

        run_sql_statement(res, sql);
    });


}

function provisionFeedbackTable(res) {
    products.forEach((product, product_index, array) => {
        feedbacks.forEach((feedback, feedback_index, array) => {
            let keys = Object.keys(feedback).join(', ');
            let values = Object.values(feedback).map(e => `'${e}'`).join(', ');
            let product_id = product_index + 1;
            let sql = `INSERT INTO Feedback (product_id, ` + keys + `) VALUES (${product_id}, ` + values + `)`;

            run_sql_statement(res, sql);
        });
    });
}

function run_sql_statement(res, sql) {
    const result = res.locals.connection.query(sql, function(err, result) {
        if (err) {
            global.handleError(err, res);
            res.status(500).end();

        }
        else {
            res.status(200).end();
        }
    });
    return result;
}

module.exports = router;

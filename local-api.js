const express = require("express");
const router = express.Router();
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const request = require('request-promise');

router.use(cookieParser());
router.use(bodyParser.json());

router.use(function(req, res, next) {
    console.log(req.method, req.url);
    console.log(req.cookies);
    console.log(req.body);
    next();
});


router.get('/token', function(req, res) {
    const tokenPayload = {
        username: 'myprofile@test.com.au',
        expiresInSecs: 600,
        roles: ['Dealer Tender', 'Honda', 'Casual Buyer']
    };

    const options = {
        method: 'POST',
        // developmain
        uri: 'http://192.168.1.84:3000/authorisationtokens/v1/getToken',
        body: {
            requestOrigin:'WAP',
            username: tokenPayload.username
        },
        json: true
    };
/*
    request(options)
        .then(function (data) {
            // Handle the response
            console.log('data: ');
            console.log(data);
            res.cookie('JWTToken', data.token, { httpOnly: true });
            res.json(tokenPayload);
        })
        .catch(function (error) {
            // Deal with the error
            console.log('Error from token manager: ')
            console.log(error)
        });
*/
    res.cookie('JWTToken', 'blahblahblahblahblah', { httpOnly: true });
    res.json(tokenPayload);

});

const statusTable = {
    "dashboard": 'complete',
    "profile": 'complete',
    "billing": 'incomplete',
    "verify-sms": 'complete',
    "driver-licence": 'incomplete'
};

router.get('/profile/status/:username', function(req, res) {

    setTimeout(function() {
        res.json({
            completionStatus: statusTable['profile']
        });
    }, 300);
});

router.get('/billing/status/:username', function(req, res) {

    setTimeout(function() {
        res.json({
            completionStatus: statusTable['billing']
        });
    }, 400);
});

router.get('/verify/status/:username', function(req, res) {

    setTimeout(function() {
        res.json({
            completionStatus: statusTable['verify-sms']
        });
    }, 600);
});

router.get('/driver-licence/status/:username', function(req, res) {

    res.json({
        completionStatus: statusTable['driver-licence']
    });

});


const userProfile = {
    id: 1024,
    name: 'georgej01',
    email: 'george.jiang@ecompany.com.au',
    title: 'Mr',
    givenName: 'George',
    surname: 'Jiang',
    //dob: '18/08/1988',
    gender: null,
    homePhone: '0299998888',
    fax: '0288885555',
    addressLine1: 'Lot 25',
    addressLine2: '10 Linda Street',
    suburb: 'Hornsby',
    city: '',
    state: 'NSW',
    postcode: '2077',
    country: 'Australia',
    motorDealer: '',
    organisation: '',
    //driversLicence: '1234567'
};

router.get('/profile/:username', function(req, res) {
    console.log('Request Cookie: ');
    console.log(req.cookies['JWTToken']);

    res.json(userProfile);
});

router.put('/profile/:username', function(req, res) {
    res.send({
        status: 'success'
    });
});

// if we get here, we need to send a 404 response

router.use(function(req, res) {
    res.sendStatus(404);
});


module.exports = router;

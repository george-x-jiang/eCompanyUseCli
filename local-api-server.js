const express = require('express');
const app = express();
const path = require('path');
const localApi = require("./local-api");
const url = require('url');
const proxy = require('express-http-proxy');

app.set('port', (process.env.PORT || 3001));

app.use('/delegate/secured/jwt-token', localApi);

app.use('/useradmin-service/profile/queryPostcode',
    proxy('localhost:3002', {
        forwardPath: function(req, res) {
            const newpath = '/v1/postcodes' + url.parse(req.url).path;
            console.log(newpath);
            return newpath;
        }
    })
);

app.use('/useradmin-service', localApi)


app.listen(app.get('port'), function() {
  console.log('eCompany SPA running on port', app.get('port'));
});

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

app.use(express.static(path.join(__dirname, 'dist')));

app.get('/*', function(req, res) {
    res.sendFile(__dirname + '/dist/index.html');
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handler
app.use(function(err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

app.listen(app.get('port'), function() {
    console.log('eCompany SPA running on port', app.get('port'));
});

const express = require('express'),
	app = express(),
	bodyParser = require('body-parser'),
	cookieParser = require('cookie-parser'),
	methodOverride = require('method-override'),
	path = require('path'),
	env = (process.env.NODE_ENV === 'development') ? 'development' : 'production',
	helmet = require('helmet'),
	compression = require('compression');

// for all dates
process.env.TZ = 'America/New_York';

// express config
app.use(compression());
app.use(helmet());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(methodOverride());
app.use(cookieParser());
app.set('port', process.env.PORT || 8000);
app.use(express.static(__dirname + '/dist'));

// Security Settings
app.use(helmet.referrerPolicy())		// Sets "Referrer-Policy: no-referrer".

// Content Security Policy
app.use(helmet.contentSecurityPolicy({
	directives: {
		defaultSrc: [ "'self'" ],
		scriptSrc: [
			"'self'",
			"'unsafe-eval'",
			"'unsafe-inline'",
			'ajax.googleapis.com',
			'www.google-analytics.com'
		],
		styleSrc: [
			"'self'",
			"'unsafe-inline'",
			'fonts.googleapis.com'
		],
		fontSrc: [
			"'self'",
			'fonts.googleapis.com',
			'fonts.gstatic.com'
		],
		imgSrc: [
			"'self'",
			'data:',
			'www.google-analytics.com',
			'a1.espncdn.com'
		],
		mediaSrc: [ "'self'" ],
		connectSrc: [ // limit the origins (via XHR, WebSockets, and EventSource)
			"'self'",
		],
		objectSrc: [ "'none'" ],// allows control over Flash and other plugins
		frameSrc: [ 'www.youtube.com' ], // origins that can be embedded as frames
		sandbox: [ 'allow-same-origin', 'allow-forms', 'allow-scripts', 'allow-popups', 'allow-presentation']
		//reportUri: '/report-violation' // error reporting
	}
}))

// Need to allow cross-domain requests in development since dev runs on webpack-dev-server
if (env === 'development') {
	app.use(function(req, res, next) {
	  res.header("Access-Control-Allow-Origin", "*");
	  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, bucedup");
	  next();
	});
}

//call api routes
const apiRoutes = require('./server/api-routes')

// register api routes
app.use('/api', apiRoutes);

// load index.html for all routes
app.get('/', (req, res) => {
	res.sendFile('index')
})

// start server
app.listen(app.get('port'), function () {
  console.log("Server started on port", app.get('port'));
});

let enviroment = process.env.NODE_ENV,
  path = require('path'),
	express = require('express'),
	parser = require('body-parser'),
  logger = require('morgan'),
  https = require('https'),
  fs = require('fs');

global.App = {
	started: false,
	app: express(),
	httpPort: process.env.HTTP_PORT,
  httpsPort: process.env.HTTPS_PORT,
  cucm: process.env.CUCM_HOST,
	root: path.join(__dirname,'..'),
	appPath: function(path){return this.root + "/" + path;},
	require: function(path){return require(this.appPath(path));},
	env: enviroment,
	start: function() {
		if (!this.started) {
      this.started = true;
      this.app.listen(this.httpPort,()=> {
        console.log("Custom TAPS app, http port " + this.httpPort);
      });
      https.createServer({
        key: fs.readFileSync(this.require('certs/server-key.pem')),
        cert: fs.readFileSync(this.require('certs/server-crt.pem')),
        ca: fs.readFileSync(this.require('certs/ca-crt.pem'))
      }, this.app).listen(this.httpsPort, ()=> {
        console.log("Custom TAPS app (limited urls), https port " + this.httpsPort);
      });
		} else {
			console.log("TAPS app is already running");
		}
	}
};

App.app.use(parser.json());
App.app.use(logger("common"));

let routes = App.require('routes/routes.js'),
    handler = App.require('handlers/handler.js'),
    router = express.Router();
App.app.use(router);

routes.routes(router,handler);

let enviroment = process.env.NODE_ENV,
  path = require('path'),
	express = require('express'),
	parser = require('body-parser'),
  logger = require('morgan'),
  https = require('https'),
  prompt = require('prompt');

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
      let schema = {
        properties: {
          ["API User"]: {
            pattern: /^[a-zA-Z\s\-]+$/,
            message: 'Name must be only letters, spaces, or dashes',
            required: true
          },
          ["Password"]: {
            hidden: true
          }
        }
      };
      prompt.start();
      prompt.get(schema, (err,result)=> {
        if (err) {
          console.log(err.message);
          process.exit(1);
        }
        process.env.AUTH_HASH = 'Basic ' + Buffer
        .from(result["API User"]+":"+result.Password).toString('base64');
        this.started = true;
        this.app.listen(this.httpPort,()=> {
          console.log("Custom TAPS app, http port " + this.httpPort);
        });
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

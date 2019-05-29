let enviroment = process.env.NODE_ENV,
  path = require('path'),
	express = require('express'),
	parser = require('body-parser'),
  prompt = require('prompt');

global.App = {
	started: false,
	app: express(),
	httpPort: process.env.HTTP_PORT,
  cucm: process.env.CUCM_HOST,
	root: path.join(__dirname,'..'),
	appPath: function(path){return this.root + "/" + path;},
	require: function(path){return require(this.appPath(path));},
	env: enviroment,
	start: function() {
		if (!this.started) {
      let promptAttr = [
        {
          name: 'CUCM_API_User',
          validator: /^[a-zA-Z\-]+$/,
          warning: 'Username is not valid, can only contain letters and dashes'
        },
        {
          name: 'Password',
          hidden: true
        }
      ];
      prompt.start();
      prompt.get(promptAttr,(err,res)=> {
        if(err) {
          console.error(err);
        } else {
          process.env.CUCM_API_User = res.CUCM_API_User;
          process.env.PASSWD = res.Password;
          this.started = true;
    			this.app.listen(this.httpPort);
    			console.log("Custom TAPS app, http port " + this.httpPort);
        }
      });
		} else {
			console.log("TAPS app is already running");
		}
	}
};

App.app.use(parser.json());

let routes = App.require('routes/routes.js'),
    handler = App.require('handlers/handler.js'),
    router = express.Router();
App.app.use(router);

routes.routes(router,handler);

import { pinus } from 'pinus';
import { preload } from './preload';

import { LogFilter } from './app/filters/log';

var httpPlugin = require('pomelo-http-plugin');
const componentsPath = httpPlugin.components
httpPlugin.components = [require(componentsPath+'/http')]
const eventsPath = httpPlugin.events
httpPlugin.events = [require(eventsPath+'/http')]
httpPlugin.name = 'pomelo-http-plugin'

var path = require('path');

/**
 *  替换全局Promise
 *  自动解析sourcemap
 *  捕获全局错误
 */
preload();

/**
 * Init app for client.
 */
let app = pinus.createApp();
app.set('name', 'xue_server');

// app configuration
app.configure('production|development', 'connector', function () {
    app.set('connectorConfig',
        {
            connector: pinus.connectors.hybridconnector,
            heartbeat: 30,
            useDict: true,
            useProtobuf: true
        });
});

app.configure('production|development', 'gate', function () {
    app.set('connectorConfig',
        {
            connector: pinus.connectors.hybridconnector,
            // useProtobuf: true
        });
});

app.configure('production|development', 'web_api', function() {
	app.loadConfig('httpConfig', path.join(app.getBase(), 'config/http.json'));
	app.use(httpPlugin,app.get('httpConfig').gamehttp);
	// app.use(httpPlugin,app.get('httpConfig').gamehttps);

    // httpPlugin.filter(new LogFilter());
    httpPlugin.beforeFilter(function (req, res, next) {
        console.log("before start http:");
        next();
    });
	httpPlugin.afterFilter(function(req, res) {
		res.send(res.get('resp'));
	});
});


// app.configure('production|development', 'web_api|admin_api|connector|mary_slot', function() {
// });

// start app
app.start();


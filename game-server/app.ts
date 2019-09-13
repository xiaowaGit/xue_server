import { pinus } from 'pinus';
import { preload } from './preload';

import { LogFilter } from './app/filters/log';
import { VerifyToken } from './app/util/token';
import { s_http } from './app/util/tool';

import {createGlobalChannelStatusPlugin} from 'pinus-global-channel-status';

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
    
    app.use(createGlobalChannelStatusPlugin(),{
        family   : 4,           // 4 (IPv4) or 6 (IPv6)
        options  : {},
        host     : '127.0.0.1',
        password : null,
        port     : 6379,
        db       : 9,      // optinal, from 0 to 15 with default redis configure
        // optional
        cleanOnStartUp:app.getServerType() == 'connector',
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
    // let filters = ["/register","/login"];
    // httpPlugin.beforeFilter(function (req, res, next) {
    //     console.log("before start http: req.path:",req.path);
    //     if (filters.indexOf(req.path) != -1) {
    //         return next();
    //     }else{
    //         let {uid,token} = req.body;
    //         let {ok} = VerifyToken(uid, token);
    //         if (ok == false) {
    //             return s_http(403,"token验证不通过",res);
    //         }
    //         return next();
    //     }
    // });
	// httpPlugin.afterFilter(function(req, res) {
	// 	// res.send(res.get('resp'));
	// });
});


app.configure('production|development', 'web_api|admin_api|mary_slot', function() {
    
    app.use(createGlobalChannelStatusPlugin(),{
        family   : 4,           // 4 (IPv4) or 6 (IPv6)
        options  : {},
        host     : '127.0.0.1',
        password : null,
        port     : 6379,
        db       : 15,      // optinal, from 0 to 15 with default redis configure
        // optional
        cleanOnStartUp:app.getServerType() == 'connector',
    });

});

// start app
app.start();


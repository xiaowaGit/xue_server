'use strict';

import {User_MG} from '../../../entity/User_MG';
import { getConnection } from 'typeorm';

module.exports = function(app, http, plugin) {

	const xue_game = getConnection('xue_game');
	const xue_log = getConnection('xue_log');

	if (plugin.useSSL) {

		http.get('/testHttps', function(req, res, next) {
			// console.log(req.body);
			res.set('resp', 'https success');
			next();
		});
	} else {

		http.get('/testHttp', function(req, res, next) {
			// console.log(req.body);
			res.set('resp', 'http success');
			next();
		});

		http.post('/register',async function(req, res, next) {
			console.log("req.body:",req.body);
			let {account,password} = req.body;
			const user = new User_MG();
			user.firstName = account;
			user.lastName = password;
			user.age = 25;
			await xue_game.manager.save(user);
			res.set('resp', 'register success');
			next();
		});

		http.post('/login', function(req, res, next) {
			console.log(req.body);
			res.set('resp', 'http success');
			next();
		});
	}
};
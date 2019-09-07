'use strict';

import {User_MOG} from '../../../entity/User_MOG';
import { getConnection } from 'typeorm';
import { Account_MOG } from '../../../entity/Account_MOG';

import { utils } from 'xmcommon';
import { get_random_int } from '../../../util/tool';
import { NewToken } from '../../../util/token';

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
			// console.log("req.body:",req.body);
			let {account,password,name,sex} = req.body;
			async function new_account():Promise<Account_MOG> {
				let uid:number = get_random_int(100000,999999);
				// let accountRepository = xue_game.getRepository(Account_MOG);
				// await accountRepository.findOne({uid});
				let account_m = await xue_game.manager.findOne(Account_MOG,{uid});
				if (account_m) return await new_account();
				account_m = await xue_game.manager.findOne(Account_MOG,{account});
				if (account_m) return null;
				const account_obj = new Account_MOG();
				account_obj.account = account;
				account_obj.password = password;
				account_obj.uid = uid;
				return account_obj as Account_MOG;
			}
			const account_m = await new_account();
			if (account_m == null) {
				res.set('resp', 'register fail, account already exists');
				next();
				return;
			}
			const user = new User_MOG();
			user.name = name;
			user.sex = sex;
			user.avatar = 1;
			user.uid = account_m.uid;
			user.coin = 10000;
			await xue_game.manager.save(user);
			await xue_game.manager.save(account_m);

			// let account_copy = await xue_game.manager.findOne(Account_MOG,{uid:user.uid});
			// console.log("account_copy : ",account_copy);
			res.set('resp', JSON.stringify({code:0,data:'register success'}));
			next();
		});

		http.post('/login',async function(req, res, next) {
			console.log("req.body:",req.body);
			let {account,password} = req.body;
			let account_m = await xue_game.manager.findOne(Account_MOG,{account});
			if (account_m == null) {
				res.set('resp', JSON.stringify({code:403,data:"账号不存在."}));
				next();
				return;
			}
			if (account_m.password != password) {
				res.set('resp', JSON.stringify({code:403,data:"密码不匹配."}));
				next();
				return;
			}
			let token:string = NewToken(account_m.uid,{name:null,avatar:null});
			res.set('resp', JSON.stringify({code:0,data:{uid:account_m.uid,token}}));
			next();
		});

		
		http.post('/get_info',async function(req, res, next) {
			console.log("req.body:",req.body);
			let {uid} = req.body;
			let user = await xue_game.manager.findOne(User_MOG,{uid});
			if (user == null) {
				res.set('resp', JSON.stringify({code:403,data:"玩家不存在."}));
				next();
				return;
			}
			res.set('resp', JSON.stringify({code:0,
				data:{uid:user.uid,name:user.name,sex:user.sex,avatar:user.avatar,coin:user.coin}
			}));
			next();
		});
	}
};
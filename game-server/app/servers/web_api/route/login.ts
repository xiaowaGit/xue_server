'use strict';

import {User_MOG} from '../../../entity/User_MOG';
import { getConnection } from 'typeorm';
import { Account_MOG } from '../../../entity/Account_MOG';

import { utils } from 'xmcommon';
import { get_random_int, s_http, is_enable_token } from '../../../util/tool';
import { NewToken } from '../../../util/token';

module.exports = function(app, http, plugin) {

	const xue_game = getConnection('xue_game');
	const xue_log = getConnection('xue_log');

	if (plugin.useSSL) {

		http.get('/testHttps', function(req, res, next) {
			return s_http(0,"https success",res);
		});
	} else {

		http.get('/testHttp', function(req, res, next) {
			return s_http(0,"http success",res);
		});

		http.post('/register',async function(req, res, next) {
			// console.log("req.body:",req.body);
			let {account,password,name,sex} = req.body;
			if (account == null || password == null || name == null || sex == null) {
				return s_http(402,'注册失败,参数错误',res);
			}
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
				return s_http(403,'register fail, account already exists',res);
			}
			const user = new User_MOG();
			user.name = name;
			user.sex = sex;
			user.avatar = 1;
			user.uid = account_m.uid;
			user.coin = 10000;
			await xue_game.manager.save(user);
			await xue_game.manager.save(account_m);

			return s_http(0,'register success',res);
		});

		http.post('/login',async function(req, res, next) {
			console.log("req.body:",req.body);
			let {account,password} = req.body;
			let account_m = await xue_game.manager.findOne(Account_MOG,{account});
			if (account_m == null) {
				return s_http(403,'账号不存在.',res);
			}
			if (account_m.password != password) {
				return s_http(404,'密码不匹配.',res);
			}
			let token:string = NewToken(account_m.uid,{name:null,avatar:null});
			return s_http(0,{uid:account_m.uid,token},res);
		});

		
		http.post('/get_info',async function(req, res, next) {
			console.log("req.body:",req.body);
			if (is_enable_token(req) == false) return s_http(402,'token校验不通过.',res);
			let {uid} = req.body;
			let user = await xue_game.manager.findOne(User_MOG,{uid});
			if (user == null) {
				return s_http(403,'玩家不存在.',res);
			}
			return s_http(0,{uid:user.uid,name:user.name,sex:user.sex,avatar:user.avatar,coin:user.coin},res);
		});
	}
};
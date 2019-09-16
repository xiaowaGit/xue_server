import {ILifeCycle ,Application} from "pinus";
import {events} from "pinus";

import "reflect-metadata";
import {createConnection, createConnections} from "typeorm";
import {Recharge_Log_SQL} from "../../entity/Recharge_Log_SQL";
import { User_MOG } from "../../entity/User_MOG";
import { Account_MOG } from "../../entity/Account_MOG";

var redis = require('redis');
var path = require('path');

export default function () {
    return new Lifecycle();
}

class Lifecycle implements ILifeCycle {

    beforeStartup(app:Application,next:()=>void) {

        createConnections([{
            name: 'xue_game', // 给这个连接起个名字，如果是用户库，则可以起名 account
            type: 'mongodb',
            host: 'localhost',
            port: 27017,
            username: '',
            password: '',
            database: 'xue_game',
            entities: [
                User_MOG,
                Account_MOG,
             ], // 用此连接的实体
            logging: true, // 开启所有数据库信息打印
            logger: 'advanced-console', // 高亮字体的打印信息
            extra: {
              connectionLimit:  10, // 连接池最大连接数量, 查阅资料 建议是  core number  * 2 + n 
              useNewUrlParser: true,
              useUnifiedTopology: true,
              useCreateIndex: true,
            },
            // cache: {
            //   type: 'redis',
            //   options: {
            //      host: 'localhost',
            //      port: 6379,
            //      username: '',
            //     //  password:'',
            //      db: 0, // 这个任君选择，0～15库都可以选
            //    }
            // }, // 如果对cache没有需求，设置`cache:false`或者干脆不填此个参数也是可以的
          },{
            name: 'xue_log', // 给这个连接起个名字，如果是用户库，则可以起名 account
            type: 'mysql',
            host: 'localhost',
            port: 3306,
            username: 'root',
            password: '123456',
            database: 'xue_log',
            entities: [
                Recharge_Log_SQL,
             ], // 用此连接的实体
            synchronize: true,
            logging: true, // 开启所有数据库信息打印
            logger: 'advanced-console', // 高亮字体的打印信息
            extra: {
              connectionLimit:  10, // 连接池最大连接数量, 查阅资料 建议是  core number  * 2 + n 
            },
            // cache: {
            //   type: 'redis',
            //   options: {
            //      host: 'localhost',
            //      port: 6379,
            //      username: '',
            //     //  password:'',
            //      db: 1, // 这个任君选择，0～15库都可以选
            //    }
            // }, // 如果对cache没有需求，设置`cache:false`或者干脆不填此个参数也是可以的
          },
        ]).then(async connections => {
            var client = redis.createClient('6379', '127.0.0.1');
            client.on('connect', function () {
                global["REDIS"] = client;
                global['REDIS_ON'] = client.on.bind(client);

                global['REDIS_DEL'] = client.del.bind(client);
                global['REDIS_GET'] = client.get.bind(client);
                global['REDIS_DECR'] = client.decr.bind(client);
                global['REDIS_DECRBY'] = client.decrby.bind(client);
                global['REDIS_INCR'] = client.incr.bind(client);
                global['REDIS_INCRBY'] = client.incrby.bind(client);
                global['REDIS_INCRBYFLOAT'] = client.incrbyfloat.bind(client);
                global['REDIS_MGET'] = client.mget.bind(client);
                global['REDIS_MSET'] = client.mset.bind(client);
                global['REDIS_MSETNX'] = client.msetnx.bind(client);
                global['REDIS_PSETEX'] = client.psetex.bind(client);
                global['REDIS_SET'] = client.set.bind(client);
                global['REDIS_SETEX'] = client.setex.bind(client);
                global['REDIS_SETNX'] = client.setnx.bind(client);
                global['REDIS_SETRANGE'] = client.setrange.bind(client);
                global['REDIS_STRLEN'] = client.strlen.bind(client);

                global['REDIS_HDEL'] = client.hdel.bind(client);
                global['REDIS_HEXISTS'] = client.hexists.bind(client);
                global['REDIS_HGET'] = client.hget.bind(client);
                global['REDIS_HGETALL'] = client.hgetall.bind(client);
                global['REDIS_HINCRBY'] = client.hincrby.bind(client);
                global['REDIS_HINCRBYFLOAT'] = client.hincrbybyfloat.bind(client);
                global['REDIS_HKEYS'] = client.hkeys.bind(client);
                global['REDIS_HLEN'] = client.hlen.bind(client);
                global['REDIS_HMGET'] = client.hmget.bind(client);
                global['REDIS_HMSET'] = client.hmset.bind(client);
                global['REDIS_HSCAN'] = client.hscan.bind(client);
                global['REDIS_HSET'] = client.hset.bind(client);
                global['REDIS_HSETNX'] = client.hsetnx.bind(client);
                global['REDIS_HSTRLEN'] = client.hstrlen.bind(client);
                global['REDIS_HVALS'] = client.hvals.bind(client);
                
                next();
            });
        }).catch(error => console.log(error));
    }

    afterStartAll(app:Application):void {
        console.log("------------------初始化web_api-------------------");
	    app.loadConfig('HappyFruit_1', path.join(app.getBase(), 'config/mary_slot/HappyFruit_1.json'));
	    app.loadConfig('HappyFruit_2', path.join(app.getBase(), 'config/mary_slot/HappyFruit_2.json'));
	    app.loadConfig('HappyFruit_3', path.join(app.getBase(), 'config/mary_slot/HappyFruit_3.json'));
	    app.loadConfig('HappyFruit_4', path.join(app.getBase(), 'config/mary_slot/HappyFruit_4.json'));
    }

    beforeShutdown(app:Application):void {
        console.log("------------------clear web_api-------------------");
    }
}
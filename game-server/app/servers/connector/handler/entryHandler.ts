import { Application, FrontendSession } from 'pinus';
import { is_enable_token } from '../../../util/tool';
import { GlobalChannelServiceStatus } from 'pinus-global-channel-status';

export default function (app: Application) {
    return new Handler(app);
}

export class Handler {

    constructor(private app: Application) {

    }

    /**
     * New client entry.
     *
     * @param  {Object}   msg     request message
     * @param  {Object}   session current session object
     * @return {Void}
     */
    async entry(msg: {uid:number,token:string}, session: FrontendSession) {
        
        let self = this;
        let uid:string = "" + msg.uid;
        let sessionService = self.app.get('sessionService');

        if (is_enable_token(msg) == false) {
            return {
                code: 501,
                error: true
            };
        }
        // duplicate log in
        if (!!sessionService.getByUid(uid)) {
            return {
                code: 500,
                error: true
            };
        }

        await session.abind(uid);

        const globalChannelStatus: GlobalChannelServiceStatus = this.app.get(GlobalChannelServiceStatus.PLUGIN_NAME);
        globalChannelStatus.addStatus(session.uid, this.app.getServerId());
        session.on('closed', this.onUserLeave.bind(this));

        return {code:0};
    }
    
    /**
     * User log out handler
     *
     * @param {Object} app current application
     * @param {Object} session current session object
     *
     */
    onUserLeave(session: FrontendSession) {
        if (!session || !session.uid) {
            return;
        }
        const globalChannelStatus: GlobalChannelServiceStatus = this.app.get(GlobalChannelServiceStatus.PLUGIN_NAME);
        globalChannelStatus.leaveStatus(session.uid, this.app.getServerId());

        /// 通知 所在游戏服务 踢出这人TODO:
    }

}
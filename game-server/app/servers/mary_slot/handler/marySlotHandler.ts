import { Application, FrontendSession, BackendSession } from 'pinus';

export default function (app: Application) {
    return new marySlotHandler(app);
}

export class marySlotHandler {
    constructor(private app: Application) {

    }

    /**
     * New client entry.
     *
     * @param  {Object}   msg     request message
     * @param  {Object}   session current session object
     * @return {Void}
     */
    async entry(msg: any, session: BackendSession) {
        let uid:number = ~~session.uid;
        
    }

    /**
     * New client entry.
     *
     * @param  {Object}   msg     request message
     * @param  {Object}   session current session object
     * @return {Void}
     */
    async leave(msg: any, session: BackendSession) {
        let uid:number = ~~session.uid;

    }
}
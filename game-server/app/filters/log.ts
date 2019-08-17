import { RouteRecord, FrontendOrBackendSession, HandlerCallback } from "pinus";



export class LogFilter {
	constructor() {
    }

    before(routeRecord: RouteRecord, msg: any, session: FrontendOrBackendSession, next: HandlerCallback) {
		console.log('[http request]:',msg );
        next(null);
    }

    after(err: Error, routeRecord: RouteRecord, msg: any, session: FrontendOrBackendSession, resp: any, next: HandlerCallback) {
		console.log('[http request]:',msg );
		next(err);
    }
}
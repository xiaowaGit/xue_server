import {ILifeCycle ,Application} from "pinus";
import {events} from "pinus";

export default function () {
    return new Lifecycle();
}

class Lifecycle implements ILifeCycle {

    afterStartAll(app:Application):void {
        console.log("------------------初始化mary_slot-------------------");
    }

    beforeShutdown(app:Application):void {
        console.log("------------------clear mary_slot-------------------");
    }
}
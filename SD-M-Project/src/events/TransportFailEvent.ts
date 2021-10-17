import {Event} from "./event";
import {Location} from "../location";

export class TransportFailEvent extends Event{

    constructor(source:Location, destination:Location,day:number) {
        super(day,`Transport from ${source.getName()} to ${destination.getName()} failed.`);
    }
}
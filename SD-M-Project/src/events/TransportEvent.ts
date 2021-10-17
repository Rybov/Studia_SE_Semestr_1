import {Event} from "./event";
import {Location} from "../location";

export class TransportEvent extends Event{

    constructor(source:Location, destination:Location,day:number) {
        super(day,`Begin Transport from ${source.getName()} to ${destination.getName()}.`);
    }
}
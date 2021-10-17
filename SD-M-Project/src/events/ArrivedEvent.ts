import {Event} from "./event";
import {Location} from "../location";

export class ArrivedEvent extends Event{

    constructor(destination:Location,day:number) {
        super(day,`Arrived to ${destination.getName()}.`);
    }
}
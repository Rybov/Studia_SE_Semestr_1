import {Event} from "./event";
import {Location} from "../location";

export class RegisterEvent extends Event{
    constructor(day:number) {
        super(day,`Parcel Registered.`);
    }
}
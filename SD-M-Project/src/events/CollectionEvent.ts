import { Event } from "./event";

export class CollectionEvent extends Event {
    constructor(day: number) {
        super(day, `Parcel has been collected`)
    }
}
import {Parcel} from "../parcel/parcel";

export class Event{
    private readonly id: number;
    private readonly day: number;
    private readonly comment: string;
    private static lastId = 0;

    constructor(day: number, comment:string ) {
        this.id=++Event.lastId;
        this.day = day;
        this.comment = comment
    }

    public getComment(): string{
        return this.comment;
    }

    public getId(): number{
        return this.id
    }

    public getDay(): number{
        return this.day;
    }
}
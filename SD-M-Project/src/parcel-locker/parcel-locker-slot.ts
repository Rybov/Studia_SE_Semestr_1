import {Size} from "../size";
import {Parcel} from "../parcel/parcel";
import {ParcelHolder} from "../parcel-holder";

export class ParcelLockerSlot implements ParcelHolder{
    private static lastId = 0;
    private parcel?: Parcel;
    private id: number;
    private readonly size: Size;

    constructor(size: Size) {
        this.id = ++ParcelLockerSlot.lastId;
        this.size = size;
        this.parcel = undefined;
    }

    addParcel(parcel: Parcel): boolean {
        if(this.parcel == undefined && parcel.getSize() == this.size){
            this.parcel = parcel;
            return true;
        }
        return false;
    }

    containParcel(parcel: Parcel): boolean {
        return this.parcel == parcel;
    }

    removeParcel(parcel: Parcel): boolean {
        if(this.containParcel(parcel)){
            this.parcel = undefined;
            return true;
        }
        return false;
    }

    getAllSlots(): ParcelLockerSlot[] {
        return [this];
    }

    getSize(): Size {
        return this.size;
    }

    getParcel() {
        return this.parcel;
    }
}
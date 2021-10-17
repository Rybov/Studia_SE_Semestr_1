import {Parcel} from "./parcel/parcel";
import {ParcelLockerSlot} from "./parcel-locker/parcel-locker-slot";

export interface ParcelHolder {

    addParcel(parcel: Parcel): boolean

    removeParcel(parcel: Parcel): boolean

    containParcel(parcel: Parcel): boolean

    getAllSlots() : ParcelLockerSlot[]
}
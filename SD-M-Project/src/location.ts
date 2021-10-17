import {Parcel} from "./parcel/parcel";
import {ParcelHolder} from "./parcel-holder";

export interface Location {
    receiveParcel(parcel: Parcel): boolean;
    sendParcel(parcel:Parcel, destination: Location): boolean;

    removeParcel(parcel: Parcel) : boolean
    getName(): string;
}
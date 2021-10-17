import { Parcel } from "../parcel/parcel";
import { Location } from "../location";
import { TransportEvent } from "../events/TransportEvent";
import { ArrivedEvent } from "../events/ArrivedEvent";
import {TransportFailEvent} from "../events/TransportFailEvent";

export abstract class Store implements Location {
    listOfParcels: Parcel[] = []

    receiveParcel(parcel: Parcel): boolean {
        parcel.resetDaysInCurrentLocation();
        parcel.addEvent(new ArrivedEvent(this, parcel.getTotalDays()));
        parcel.currentLocation = this;
        this.setReceiveStatus(parcel);
        this.listOfParcels.push(parcel);
        return true;
    }

    sendParcel(parcel: Parcel, destination: Location): boolean {
        if (!this.listOfParcels.find(x => x === parcel)) {
            throw new Error("Parcel Not Found :<");
        }
        parcel.addEvent(new TransportEvent(this, destination, parcel.getTotalDays()))
        if (!destination.receiveParcel(parcel)) {
            parcel.addEvent(new TransportFailEvent(this, destination, parcel.getTotalDays()))
            return false;
        }
        this.listOfParcels = this.listOfParcels.filter(x => x != parcel);
        return true;
    }

    removeParcel(parcel: Parcel): boolean {
        const currentSlot = this.listOfParcels.find(x => x == parcel);
        if (!currentSlot) {
            console.error(`Parcel not found in ${this.getName()}`);
            return false;
        }
        this.listOfParcels = this.listOfParcels.filter(e => e != parcel);
        return true;
    }

    abstract getName(): string

    abstract setReceiveStatus(parcel : Parcel): void
}
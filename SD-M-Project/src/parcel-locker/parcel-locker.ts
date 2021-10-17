import { ParcelLockerSlot } from "./parcel-locker-slot";
import { Parcel } from "../parcel/parcel";
import { Location } from "../location";
import { Status } from "../status";
import { ArrivedEvent } from "../events/ArrivedEvent";
import { Visitable } from "../visitor/visitable";
import { Visitor } from "../visitor/visitor";
import {ParcelHolder} from "../parcel-holder";
import {TransportEvent} from "../events/TransportEvent";
import {TransportFailEvent} from "../events/TransportFailEvent";

export class ParcelLocker implements ParcelHolder, Location, Visitable {
    private id: number;
    private static lastId = 0;
    private holders: ParcelHolder[]

    constructor(holders: ParcelHolder[]) {
        if (holders.length <= 0) {
            throw Error(`Parcel Locker need to contain at least one slot`)
        }
        this.holders = holders;
        this.id = ++ParcelLocker.lastId;
    }

    accept(v: Visitor) {
        v.doForLocker(this);
    }

    removeParcel(parcel: Parcel): boolean {
        for (const holder of this.holders) {
            if (holder.removeParcel(parcel)) {
                return true;
            }
        }
        return false;
    }

    containParcel(parcel: Parcel): boolean {
        for (const holder of this.holders) {
            if (holder.containParcel(parcel)) {
                return true;
            }
        }
        return false;
    }

    addParcel(parcel: Parcel): boolean {
        for (const holder of this.holders) {
            if (holder.addParcel(parcel)) {
                return true;
            }
        }
        return false;
    }

    receiveParcel(parcel: Parcel): boolean {
        if(this.addParcel(parcel)){
            if (parcel.sourceParcelLocker == this) {
                parcel.setStatus(Status.IN_SOURCE_PARCEL_LOCKER);
            }
            if (parcel.destinationParcelLocker == this) {
                parcel.setStatus(Status.IN_DESTINATION_PARCEL_LOCKER);
            }
            parcel.currentLocation = this;
            parcel.addEvent(new ArrivedEvent(this, parcel.getTotalDays()));
            parcel.resetDaysInCurrentLocation();
            return true;
        }else{
            console.error(`Cannot recevie this parcel`);
            return false;
        }
    }

    sendParcel(parcel: Parcel, destination: Location): boolean {
        if(!this.containParcel(parcel)){
            console.error(`Parcel not found in parcel-locker`);
            return false;
        }
        parcel.addEvent(new TransportEvent(this, destination, parcel.getTotalDays()));
        if (destination.receiveParcel(parcel)) {
            this.removeParcel(parcel);
            return true;
        }
        parcel.addEvent(new TransportFailEvent(this, destination, parcel.getTotalDays()));
        return false;
    }

    getHolders() : ParcelHolder[]{
        return this.holders;
    }

    getId() : number {
        return this.id;
    }

    getName(): string {
        return `Parcel Locker ID=${this.id}`;
    }

    getAllSlots(): ParcelLockerSlot[] {
        return this.holders.flatMap( x => x.getAllSlots());
    }
}
import { ParcelLocker } from "../parcel-locker/parcel-locker";
import { Size } from "../size";
import { Status } from "../status";
import { Event } from "../events/event";
import { Location } from "../location";
import { PaymentEvent } from "../events/PaymentEvent";
import { CollectionEvent } from "../events/CollectionEvent";
import { Visitable } from "../visitor/visitable";
import { Visitor } from "../visitor/visitor";

export class Parcel implements Visitable {
    static lastId = 0;
    private id: number;
    private size: Size;
    private status: Status;
    private totalDays = 0;
    private daysInCurrentLocation = 0;
    private isPaid = false;
    private readonly events: Event[];

    sourceParcelLocker: ParcelLocker;
    currentLocation: Location;
    destinationParcelLocker: ParcelLocker;

    constructor(source: ParcelLocker, destination: ParcelLocker, size: Size, status: Status) {
        this.id = ++Parcel.lastId;
        this.sourceParcelLocker = source;
        this.currentLocation = source;
        this.destinationParcelLocker = destination;
        this.size = size;
        this.status = status;
        this.events = [];
    }

    accept(v: Visitor) {
        v.doForParcel(this);
    }

    addEvent(event: Event): void {
        this.events.push(event);
    }

    getAllEvents(): Event[] {
        return this.events;
    }

    pay(price: number) {
        this.isPaid = true;
        this.events.push(new PaymentEvent(this.totalDays, price));
    }

    getId(): number {
        return this.id;
    }

    getStatus(): Status {
        return this.status;
    }

    setStatus(status: Status): Parcel {
        this.status = status;
        return this;
    }

    getSize(): Size {
        return this.size;
    }

    getTotalDays(): number {
        return this.totalDays;
    }

    setTotalDays(days: number) {
        this.totalDays = days;
    }

    resetDaysInCurrentLocation(): Parcel {
        this.daysInCurrentLocation = 0;
        return this;
    }

    getDaysInCurrentLocation(): number {
        return this.daysInCurrentLocation;
    }

    tryToDeliver(): boolean {
        const delivered = this.currentLocation.sendParcel(this, this.destinationParcelLocker);
        if (!delivered) {
            return false; 
        }
        this.status = Status.IN_DESTINATION_PARCEL_LOCKER;
        return true;
    }

    getPaymentStatus(): boolean {
        return this.isPaid;
    }

    collect() {
        if (this.isPaid) {
            this.currentLocation.removeParcel(this);
            this.setStatus(Status.DELIVERED);
            this.addEvent(new CollectionEvent(this.getTotalDays()));
        } else {
            console.error('No payment registered for this parcel.')
        }
    }
}
import { ParcelLockerSlot } from "../parcel-locker/parcel-locker-slot";
import { InternalStore } from "../store/internal-store";
import { ExternalStore } from "../store/external-store";
import { RegisterEvent } from "../events/RegisterEvent";
import { ParcelLocker } from "../parcel-locker/parcel-locker";
import { UserAccount } from "./user-account";
import { Parcel } from "../parcel/parcel";
import { Status } from "../status";
import { Size } from "../size";
import { Visitable } from "../visitor/visitable";
import { Visitor } from "../visitor/visitor";

export class UserPortal implements Visitable {
    users: UserAccount[] = [];
    registry: Parcel[] = [];
    parcelLockers: ParcelLocker[] = [
        new ParcelLocker([
            new ParcelLockerSlot(Size.BIG),
            new ParcelLockerSlot(Size.MEDIUM),
            new ParcelLockerSlot(Size.SMALL),
        ]),
        new ParcelLocker([
            new ParcelLockerSlot(Size.BIG),
            new ParcelLockerSlot(Size.MEDIUM),
            new ParcelLockerSlot(Size.SMALL),
        ])
    ]

    internalStore: InternalStore = new InternalStore();
    externalStore: ExternalStore = new ExternalStore();

    accept(v: Visitor) {
        v.doForPortal(this);
    }

    login(userName: string): UserAccount {
        const user = this.users.find(x => x.userName == userName)
        if (user) {
            return user;
        }
        return this.createNewUser(userName);
    }

    registerParcel(sourceID: number, destinationID: number, size: Size): Parcel {
        const source = this.findParcelLocker(sourceID);
        const destination = this.findParcelLocker(destinationID);
        const parcel = new Parcel(source, destination, size, Status.REGISTERED);
        parcel.addEvent(new RegisterEvent(parcel.getTotalDays()));
        this.registry.push(parcel);
        return parcel;
    }

    distributeParcels() {
        this.registry.forEach(parcel => {
            const delivered = parcel.tryToDeliver();
            if (!delivered) {
                if (parcel.currentLocation != this.internalStore) {
                    parcel.currentLocation.sendParcel(parcel, this.internalStore);
                }
            }
        });
    }

    payForParcel(parcelId: number, amount: number) {
        const parcel = this.registry.find(parcel => parcel.getId() == parcelId);
        if (!parcel) {
            console.error(`Parcel with id ${parcelId} has not been found in registry`);
            return;
        }

        if (parcel.getPaymentStatus()) {
            console.log(`Parcel with id ${parcelId} has been already paid for`);
            return;
        }
        parcel.pay(amount);
    }

    getInfoAboutParcel(parcelId: number) {
        const parcel = this.registry.find(x => x.getId() == parcelId);
        if (parcel) {
            return parcel.getAllEvents();
        }
        throw new Error("Parcel not found in registry");
    }

    collectParcel(parcelId: number) {
        const parcel = this.registry.find(x => x.getId() == parcelId);
        if (!parcel) {
            console.error(`Parcel not found in registry`);
            return;
        }

        parcel.collect();
    }

    private createNewUser(userName: string): UserAccount {
        const newUser = new UserAccount(userName, this);
        this.users.push(newUser)
        return newUser;
    }

    private findParcelLocker(lockerId: number): ParcelLocker {
        const parcelLocker = this.parcelLockers.find(x => x.getId() == lockerId);
        if (parcelLocker) {
            return parcelLocker;
        }
        throw new Error("Parcel Locker not found.");
    }
}
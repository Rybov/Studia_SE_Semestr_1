import {Store} from "./store";
import {Parcel} from "../parcel/parcel";
import {Status} from "../status";

export class InternalStore extends Store {
    getName(): string {
        return "INTERNAL STORE";
    }

    setReceiveStatus(parcel: Parcel): void {
        parcel.setStatus(Status.IN_TRANSIT);
    }
}
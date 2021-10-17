import {Store} from "./store";
import {Parcel} from "../parcel/parcel";
import {Status} from "../status";
export class ExternalStore extends Store {
    getName(): string {
        return "EXTERNAL STORE";
    }

    setReceiveStatus(parcel: Parcel): void {
        parcel.setStatus(Status.UNCOLLECTED)
    }
}
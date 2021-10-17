import { ParcelLocker } from "../parcel-locker/parcel-locker";
import { UserPortal } from "../user-portal/user-portal";
import { Parcel } from "../parcel/parcel";

export interface Visitor {
    doForParcel: (p: Parcel) => void;
    doForLocker: (p: ParcelLocker) => void;
    doForPortal: (p: UserPortal) => void;
}
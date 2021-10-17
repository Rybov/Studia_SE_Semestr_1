import {UserPortal} from "./user-portal";
import {Size} from "../size";
import {Parcel} from "../parcel/parcel";

export class UserAccount {
    userPortal: UserPortal;
    userName: string;
    parcelsIds: number[] = []

    constructor(userName: string , userPortal: UserPortal) {
        this.userName = userName;
        this.userPortal = userPortal;
    }

    registerParcel(sourceID : number, destinationID : number, size : Size) : Parcel{
        const newParcel = this.userPortal.registerParcel(sourceID, destinationID, size);
        this.parcelsIds.push(newParcel.getId());
        return newParcel;
    }

    sendParcel(parcel: Parcel){
        return parcel.sourceParcelLocker.receiveParcel(parcel);
    }

    getInfoAboutParcel(parcelId: number){
        if(this.parcelsIds.includes(parcelId)){
           return this.userPortal.getInfoAboutParcel(parcelId);
        }
    }
}
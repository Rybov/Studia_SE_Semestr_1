import { UserPortal } from "../user-portal/user-portal";
import { Command } from "./command";

export class ParcelPaymentCommand implements Command {
    private userPortal: UserPortal;
    private innerCommand: Command | undefined;
    private amount: number;
    private parcelId: number;

    constructor(userPortal: UserPortal, parcelId: number, amount: number, innerCommand?: Command) {
        this.userPortal = userPortal;
        this.innerCommand = innerCommand;
        this.amount = amount;
        this.parcelId = parcelId;
    }
    
    execute() {
        this.innerCommand?.execute();
        this.userPortal.payForParcel(this.parcelId, this.amount);
        console.log(`$${this.amount} payment received for parcel ${this.parcelId}`);
    }
    
    setInnerCommand(innerCommand?: Command) {
        this.innerCommand = innerCommand;
    }
}
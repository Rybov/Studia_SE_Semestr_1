import { UserPortal } from "../user-portal/user-portal";
import { Command } from "./command";

export class CollectParcelCommand implements Command{
    private userPortal: UserPortal;
    private parcelId: number;
    private innerCommand: Command | undefined;

    constructor(userPortal: UserPortal, parcelId: number, innerCommand ?: Command) {
        this.userPortal = userPortal;
        this.parcelId = parcelId;
        this.innerCommand = innerCommand;
    }
    
    execute() {
        this.innerCommand?.execute();
        this.userPortal.collectParcel(this.parcelId);
    }

    setInnerCommand(innerCommand?: Command) {
        this.innerCommand = innerCommand;
    }
}
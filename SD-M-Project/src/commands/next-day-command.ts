import { UserPortal } from "../user-portal/user-portal";
import { Command } from "./command";

export class NextDayCommand implements Command {
    private userPortal: UserPortal;
    private innerCommand: Command | undefined;

    constructor(userPortal: UserPortal, innerCommand?: Command) {
        this.userPortal = userPortal;
        this.innerCommand = innerCommand;
    }

    execute() {
        this.innerCommand?.execute();
        this.userPortal.distributeParcels();
        console.log("Parcels distributed");
        this.userPortal.registry.forEach(parcel => parcel.setTotalDays(parcel.getTotalDays() + 1));
        console.log(`A new dawn has arrived!`)
    }
    
    setInnerCommand(innerCommand?: Command) {
        this.innerCommand = innerCommand;
    }
}
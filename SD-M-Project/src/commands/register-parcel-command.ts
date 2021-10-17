import { Size } from "../size";
import { UserPortal } from "../user-portal/user-portal";
import { Command } from "./command";

export class RegisterParcelCommand implements Command {
    private destinationID: number;
    private userPortal: UserPortal;
    private sourceID: number;
    private size: Size;
    private innerCommand: Command | undefined;
    
    constructor(userPortal: UserPortal, sourceID: number, destinationID: number, size: Size, command?: Command) {
        this.destinationID = destinationID;
        this.innerCommand = command;
        this.userPortal = userPortal;
        this.sourceID = sourceID;
        this.size = size;
    }

    public execute() {
        this.innerCommand?.execute();
        try {
            this.userPortal.registerParcel(this.sourceID, this.destinationID, this.size);
            console.log('Parcel issued');
        } catch(err) {
            console.log(err.message);
        };
    }
    
    setInnerCommand(innerCommand?: Command) {
        this.innerCommand = innerCommand;
    }
}
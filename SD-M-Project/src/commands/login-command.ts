import { UserPortal } from "../user-portal/user-portal";
import { Command } from "./command";

export class LoginCommand implements Command {
    userPortal: UserPortal;
    username: string;
    innerCommand: Command | undefined;

    constructor(userPortal: UserPortal, username: string, innerCommand?: Command) {
        this.userPortal = userPortal;
        this.username = username;
        this.innerCommand = innerCommand;
    }

    execute() {
        this.innerCommand?.execute();
        this.userPortal.login(this.username);
        console.log(`${this.username} logged in`);
    }
    
    setInnerCommand(innerCommand?: Command) {
        this.innerCommand = innerCommand;
    }
}
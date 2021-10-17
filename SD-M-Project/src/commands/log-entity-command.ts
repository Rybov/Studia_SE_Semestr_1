import { loggingVisitor } from "../visitor/logging-visitor";
import { Visitable } from "../visitor/visitable";
import { Command } from "./command";

export class LogEntityStateCommand implements Command {
    private searchFunc: () => Visitable | undefined;
    private innerCommand: Command | undefined;
    
    constructor(searchFunc: () => Visitable | undefined, innerCommand?: Command) {
        this.searchFunc = searchFunc;
        this.innerCommand = innerCommand; 
    }
    
    execute() {
        this.innerCommand?.execute();
        const entity = this.searchFunc();
        try {
            if (entity) {
                entity.accept(loggingVisitor);
            } else {
                console.log("Entity has not been found");
            }
        } catch (error) {
            console.error(`\n${error.message}\n`);
        }
    }
    
    setInnerCommand(innerCommand?: Command) {
        this.innerCommand = innerCommand;
    }
}
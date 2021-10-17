export interface Command {
    execute: () => void;
    setInnerCommand: (command?: Command) => void;
}
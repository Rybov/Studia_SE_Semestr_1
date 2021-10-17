import { CollectParcelCommand } from "./commands/collect-parcel-command";
import { Command } from "./commands/command";
import { LogEntityStateCommand } from "./commands/log-entity-command";
import { LoginCommand } from "./commands/login-command";
import { NextDayCommand } from "./commands/next-day-command";
import { ParcelPaymentCommand } from "./commands/parcel-payment-command";
import { RegisterParcelCommand } from "./commands/register-parcel-command";
import { UserPortal } from "./user-portal/user-portal";
import { removeIndent } from "./utils";

const prompt = require('prompt-sync')({ sigint: true });

export class App {
    private userPortal: UserPortal;
    private commands: Command[];
    private scheduledCommands: Command[];
    private newScheduledCommand: Command | undefined;
    private isSchedulingCommand = false;

    constructor() {
        this.userPortal = new UserPortal();
        this.commands = [];
        this.scheduledCommands = [];
        this.newScheduledCommand = undefined;
    }

    launch() {
        console.log('Welcome to the Pracel Locker Manager v1.0.0.');
        while (true) {
            console.log(removeIndent(`
                What do you want to do?
                1) Log in
                2) Issue a parcel
                3) Get a info from the system
                4) Advance to the next day
                5) Pay for a parcel
                6) Collect a parcel
                ${this.isSchedulingCommand
                    ? `7) Finish creating scheduled command`
                    : `7) Create a scheduled command`
                }
                8) Execute scheduled commands
                9) Quit
                Your action:
            `));
            const commandId = parseInt(prompt(''), 0);
            if (commandId === 9) break;
            this.processCommand(commandId);
        }
        console.log("Shutting down the app...");
    }

    private processCommand(commandId: number) {
        switch (commandId) {
            case 1:
                this.processLogin();
                break;
            case 2:
                this.issueParcel();
                break;
            case 3:
                this.getEntityInfo();
                break;
            case 4:
                this.goToNextDay();
                break;
            case 5:
                this.payForParcel();
                break;
            case 6:
                this.collectParcel();
                break;
            case 7:
                this.swapCommandCreationState();
                break;
            case 8:
                this.executeScheduledCommands();
                break;
        }
    }

    private processLogin() {
        const nickname = prompt('Enter username: ');
        const command = new LoginCommand(this.userPortal, nickname);
        this.manageCommand(command);
    }

    private issueParcel() {
        const sourceParcelLocker = parseInt(prompt('Enter source locker ID: '));
        const destinationParcelLocker = parseInt(prompt('Enter destination locker ID: '));
        const size = parseInt(prompt('Enter parcel size (0: small, 1: medium, 2: large): '));
        const command = new RegisterParcelCommand(this.userPortal, sourceParcelLocker, destinationParcelLocker, size);
        this.manageCommand(command);
    }

    private getEntityInfo() {
        console.log(removeIndent(`
            Which type of entity are you looking for?
            1) Portal
            2) Parcel
            3) Parcel Locker
            4) Return to main menu
        `));

        const entityType = parseInt(prompt(''), 0);
        let command: Command | undefined = undefined;

        switch (entityType) {
            case 1:
                command = new LogEntityStateCommand(() => this.userPortal);
                break;
            case 2:
                const parcelId = parseInt(prompt('Enter parcel ID: '), 0);
                command = new LogEntityStateCommand(() => this.userPortal.registry.find(parcel => parcel.getId() == parcelId));
                break;

            case 3:
                const lockerId = parseInt(prompt('Enter locker ID: '));
                command = new LogEntityStateCommand(() => this.userPortal.parcelLockers.find(locker => locker.getId() == lockerId));
                break;
            default:
                return;
        }

        if (command) {
            this.manageCommand(command);
        }
    }

    private executeScheduledCommands() {
        if (this.scheduledCommands.length == 0) {
            console.log("There are no commands scheduled");
            return;
        }
        console.log("Executing scheduled commands");
        this.scheduledCommands.forEach(command => command.execute());
        this.commands.push(...this.scheduledCommands);
        this.scheduledCommands = [];
    }

    private goToNextDay() {
        const command = new NextDayCommand(this.userPortal);
        this.manageCommand(command);
    }

    private payForParcel() {
        const parcelId = parseInt(prompt('Enter parcel ID: '));
        const amount = parseFloat(prompt('Enter amount: '));
        const command = new ParcelPaymentCommand(this.userPortal, parcelId, amount);
        this.manageCommand(command);
    }

    private collectParcel() {
        const parcelId = parseInt(prompt('Enter parcel ID: '));
        const command = new CollectParcelCommand(this.userPortal, parcelId);
        this.manageCommand(command);
    }

    private manageCommand(command: Command) {
        if (this.isSchedulingCommand) {
            command.setInnerCommand(this.newScheduledCommand);
            this.newScheduledCommand = command;
        } else {
            this.commands.push(command);
            command.execute();
        }
    }

    private swapCommandCreationState() {
        this.isSchedulingCommand = !this.isSchedulingCommand;
        if (this.isSchedulingCommand) {
            this.newScheduledCommand = undefined;
            console.log("Started creating a new scheduled command");
        } else {
            if (this.newScheduledCommand) {
                this.scheduledCommands.push(this.newScheduledCommand);
                console.log("Created a new scheduled command");
            } else {
                console.log("No command has been created");
            }
        }
    }
}
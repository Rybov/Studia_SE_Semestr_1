import { ParcelLocker } from "../parcel-locker/parcel-locker";
import { Parcel } from "../parcel/parcel";
import { Size } from "../size";
import { UserPortal } from "../user-portal/user-portal";
import { getEnumKey, removeIndent } from "../utils";
import { Visitor } from "./visitor";

class LoggingVisitor implements Visitor {
    doForParcel(parcel: Parcel) {
        console.log(removeIndent(`
            Displaying info about Parcel no.${parcel.getId()}
            Size: ${getEnumKey(Size, parcel.getSize()).toLowerCase()}        
            Paid: ${parcel.getPaymentStatus()}
            Source Locker: ${parcel.sourceParcelLocker.getName()}
            Destination Locker: ${parcel.destinationParcelLocker.getName()}
            Currently In: ${parcel.currentLocation.getName()}
            History:\n`) +
            `${parcel.getAllEvents().map(event => `${event.getId()}) Day ${event.getDay()}: ${event.getComment()}`).join('\n')}`
        );
    };

    doForLocker(locker: ParcelLocker) {
        console.log(removeIndent(`
            Displaying info about ${locker.getName()}
            Slots: ${locker.getAllSlots().length}
            Big slots: ${locker.getAllSlots().filter(slot => slot.getSize() == Size.BIG).length}
            Medium slots: ${locker.getAllSlots().filter(slot => slot.getSize() == Size.MEDIUM).length}
            Small slots: ${locker.getAllSlots().filter(slot => slot.getSize() == Size.SMALL).length}
            Parcels stored: ${locker.getAllSlots().filter(slot => slot.getParcel() !== undefined).length}
        `));
    };

    doForPortal(portal: UserPortal) {
        console.log(removeIndent(`
            Displaying portal info
            Parcels registered: ${portal.registry.length}
            Lockers available: ${portal.parcelLockers.length}
            Users registered: ${portal.users.length}
        `));
    };
}

export const loggingVisitor = new LoggingVisitor();
import {ParcelLocker} from "./parcel-locker";
import {Parcel} from "../parcel/parcel";
import {ParcelLockerSlot} from "./parcel-locker-slot";
import {Size} from "../size";
import {Status} from "../status";

describe(`Parcel Locker Tests`, () => {

    it(`should create Parcel Locker`, () => {
        //  Given
        const parcelLockerSlots = [new ParcelLockerSlot(Size.BIG)];

        //  When
        const parcelLocker = new ParcelLocker(parcelLockerSlots);

        //  Then
        expect(parcelLocker).toBeDefined();
        expect(parcelLocker.getHolders()).toEqual(parcelLockerSlots);
        expect(parcelLocker.getId()).toEqual(1);

    });

    it(`should not create Parcel Locker - no slots`, () => {
        //  Given
        const emptyList: ParcelLockerSlot[] = [];

        //  When
        const result = () => new ParcelLocker(emptyList);

        //  Then
        expect(result).toThrowError(`Parcel Locker need to contain at least one slot`);
    });

    it(`should send Parcel`, () => {
        //  Given
        const parcelLockerSlot = new ParcelLockerSlot(Size.BIG);
        const destinationParcelLockerMock = jasmine.createSpyObj(`ParcelLocker`, [`receiveParcel`, `getName`]);
        destinationParcelLockerMock.receiveParcel.and.returnValue(true);
        destinationParcelLockerMock.getName.and.returnValue(`Destination Parcel`);
        const parcelLocker = new ParcelLocker([parcelLockerSlot]);
        const parcel = new Parcel(parcelLocker, destinationParcelLockerMock, Size.BIG, Status.IN_TRANSIT);
        parcelLockerSlot.addParcel(parcel);

        //  When
        parcelLocker.sendParcel(parcel, destinationParcelLockerMock);


        //  Then
        expect(destinationParcelLockerMock.receiveParcel).toHaveBeenCalled();
        expect(parcelLocker.getHolders()[0].containParcel(parcel)).toBeFalse();
        expect(parcel.getAllEvents().map(x => x.getComment())).toEqual(['Begin Transport from Parcel Locker ID=2 to Destination Parcel.' ]);
    });

    it(`should not send Parcel - parcel not found `, () => {
        //  Given
        const parcelLockerSlot = new ParcelLockerSlot(Size.BIG);
        const destinationParcelLockerMock = jasmine.createSpyObj(`ParcelLocker`, [`receiveParcel`, `getName`]);
        const parcelLocker = new ParcelLocker([parcelLockerSlot]);
        const parcel = new Parcel(parcelLocker, destinationParcelLockerMock, Size.BIG, Status.IN_TRANSIT);
        spyOn(console, 'error');

        //  When
        const result = parcelLocker.sendParcel(parcel, destinationParcelLockerMock);


        //  Then
        expect(result).toBeFalse();
        expect(console.error).toHaveBeenCalledWith("Parcel not found in parcel-locker");
    });

    it(`should receive Pracel - destination ParcelLocker`, () => {
        //  Given
        const parcelLockerSlot = new ParcelLockerSlot(Size.BIG);
        const parcelLockerMock = jasmine.createSpyObj(`ParcelLocker`, [`receiveParcel`]);
        const parcelLocker = new ParcelLocker([parcelLockerSlot]);
        const parcel = new Parcel(parcelLockerMock, parcelLocker, Size.BIG, Status.IN_TRANSIT);

        //  When
        const result = parcelLocker.receiveParcel(parcel);


        //  Then
        expect(parcel.getStatus()).toEqual(Status.IN_DESTINATION_PARCEL_LOCKER)
        expect(parcelLocker.getHolders()[0].containParcel(parcel)).toBeTrue();
        expect(result).toEqual(true);
    });

    it(`should receive Pracel - source ParcelLocker`, () => {
        //  Given
        const parcelLockerSlot = new ParcelLockerSlot(Size.BIG);
        const parcelLockerMock = jasmine.createSpyObj(`ParcelLocker`, [`receiveParcel`]);
        const parcelLocker = new ParcelLocker([parcelLockerSlot]);
        const parcel = new Parcel(parcelLocker, parcelLockerMock, Size.BIG, Status.IN_TRANSIT);

        //  When
        const result = parcelLocker.receiveParcel(parcel);


        //  Then
        expect(parcel.getStatus()).toEqual(Status.IN_SOURCE_PARCEL_LOCKER)
        expect(parcelLocker.getHolders()[0].containParcel(parcel)).toBeTrue();
        expect(result).toEqual(true);
    });

    it(`should not receive Pracel - not avalible parcel slot - wrong size`, () => {
        //  Given
        const parcelLockerSlot = new ParcelLockerSlot(Size.MEDIUM);
        const parcelLockerMock = jasmine.createSpyObj(`ParcelLocker`, [`receiveParcel`]);
        const parcelLocker = new ParcelLocker([parcelLockerSlot]);
        const parcel = new Parcel(parcelLocker, parcelLockerMock, Size.BIG, Status.IN_TRANSIT);
        spyOn(console, 'error');

        //  When
        const result = parcelLocker.receiveParcel(parcel);


        //  Then
        expect(result).toEqual(false);
        expect(console.error).toHaveBeenCalledWith("Cannot recevie this parcel");
    });

    it(`should not receive Pracel - not avalible parcel slot - not empty`, () => {
        //  Given
        const parcelLockerSlot = new ParcelLockerSlot(Size.BIG);
        const parcelLockerMock = jasmine.createSpyObj(`ParcelLocker`, [`receiveParcel`]);
        const parcelLocker = new ParcelLocker([parcelLockerSlot]);
        const parcel = new Parcel(parcelLocker, parcelLockerMock, Size.BIG, Status.IN_TRANSIT);
        parcelLockerSlot.addParcel(parcel);
        spyOn(console, 'error');

        //  When
        const result = parcelLocker.receiveParcel(parcel);


        //  Then
        expect(result).toEqual(false);
        expect(console.error).toHaveBeenCalledWith("Cannot recevie this parcel");
    });

});
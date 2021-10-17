import {Parcel} from "../parcel/parcel";
import {Size} from "../size";
import {Status} from "../status";
import {ExternalStore} from "./external-store";

describe(`Internal-Store tests`, () => {

    it(`should send parcel`,() => {
        //  Given
        const destinationMock = jasmine.createSpyObj(`Location`,[`receiveParcel`,`getName`]);
        destinationMock.receiveParcel.and.returnValue(true);
        destinationMock.getName.and.returnValue(`Destination Location`);
        const parcel = new Parcel(destinationMock,destinationMock,Size.BIG,Status.IN_TRANSIT);
        const store = new ExternalStore();
        store.listOfParcels = [parcel]

        //  When
        store.sendParcel(parcel,destinationMock);


        //  Then
        expect(destinationMock.receiveParcel).toHaveBeenCalled();
        expect(store.listOfParcels).toEqual([]);
        expect(parcel.getAllEvents()[0].getComment()).toEqual(`Begin Transport from EXTERNAL STORE to Destination Location.`);
        expect(parcel.getAllEvents().length).toEqual(1);
    })

    it(`should not send parcel - destination response false`,() => {
        //  Given
        const destinationMock = jasmine.createSpyObj(`Location`,[`receiveParcel`,`getName`]);
        destinationMock.receiveParcel.and.returnValue(false);
        const parcel = new Parcel(destinationMock,destinationMock,Size.BIG,Status.IN_TRANSIT);
        const store = new ExternalStore();
        store.listOfParcels = [parcel]

        //  When
        store.sendParcel(parcel,destinationMock);


        //  Then
        expect(store.listOfParcels).toEqual([parcel]);
        expect(parcel.getAllEvents().map( x => x.getComment())).toEqual( [ 'Begin Transport from EXTERNAL STORE to undefined.', 'Transport from EXTERNAL STORE to undefined failed.' ]);
    })

    it(`should not send parcel - parcel not found`,() => {
        //  Given
        const destinationMock = jasmine.createSpyObj(`Location`,[`receiveParcel`,`getName`]);
        destinationMock.receiveParcel.and.returnValue(true);
        destinationMock.getName.and.returnValue(`Destination Location`);
        const parcel = new Parcel(destinationMock,destinationMock,Size.BIG,Status.IN_TRANSIT);
        const store = new ExternalStore();

        //  When
        const result = () => {store.sendParcel(parcel,destinationMock)};


        //  Then
        expect(result).toThrowError(`Parcel Not Found :<`)
    })

    it(`should receive parcel`,() => {
        //  Given
        const destinationMock = jasmine.createSpyObj(`Location`,[`receiveParcel`,`getName`]);
        const parcel = new Parcel(destinationMock,destinationMock,Size.BIG,Status.IN_TRANSIT);
        const store = new ExternalStore();

        //  When
        store.receiveParcel(parcel);


        //  Then
        expect(store.listOfParcels).toEqual([parcel]);
        expect(parcel.getAllEvents()[0].getComment()).toEqual(`Arrived to EXTERNAL STORE.`);
        expect(parcel.getAllEvents().length).toEqual(1);
        expect(parcel.getDaysInCurrentLocation()).toEqual(0);
    })

})
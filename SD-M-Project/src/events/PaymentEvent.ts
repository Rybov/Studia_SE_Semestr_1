import { Event } from "./event";
import { Payment } from "./Payment";

export class PaymentEvent extends Event {
    payment: Payment;

    constructor(day: number, price: number) {
        super(day, `Parcel Paid ${price}.`);
        this.payment = new Payment(price);
    }
}
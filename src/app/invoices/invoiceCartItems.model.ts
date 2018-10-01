
export class InvoiceCartItems {

    constructor(
        public productId: string,
        public productName: string,
        public quantity: number,
        public price: number,
        public totalPrice: number
    ) { }
}
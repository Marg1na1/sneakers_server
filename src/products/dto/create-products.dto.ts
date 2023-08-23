export class CreateProductDto {
    readonly title: string;
    readonly description: string;
    readonly count: number;
    readonly price: number;
    readonly isHide: boolean;
    readonly discountAmount: number;
    readonly sellerId: string;
}

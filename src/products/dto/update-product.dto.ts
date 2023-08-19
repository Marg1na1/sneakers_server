export class UpdateProductDto {
    readonly id: string;
    readonly title: string;
    readonly description: string;
    readonly count: number;
    readonly price: number;
    readonly photo: string;
    readonly isHide: boolean;
    readonly discountAmount: number;
    readonly sellerId: string;
}

export class OperationWasteModel {
  constructor(
    public id?: number,
    public performedVolume?: number,
    public transferredVolume?: number,
    public endBalance?: number,
    public kindOperationBalanceId?: string,
    public dicWasteId?: number,
    public wasteName?: string,
    public dicKindOperationId?: number,
    public dicKindOperationName?: string,
    public reportId?: number
  ) {}
}

export class OperationWasteSenderModel {
  constructor(
    public id?: number,
    public transferredVolume?: number,
    public binTransferred?: string,
    public nameTransferred?: string,
    public operationWasteId?: number
  ) {}
}

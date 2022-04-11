export interface ReceivingWasteModel {
  id: number;
  binTransferred: string;
  nameTransferred: string;
  binReceiving: string;
  nameReceiving: string;
  binRemaining: string;
  nameRemaining: string;
  receivingVolume: number;
  transactionalVolume: number;
  transferredVolume: number;
  generatedVolume: number;
  reoperationVolume: number;
  dicKindOperationId: number;
  dicKindOperationName: string;
  afterKindOperationId: number;
  dicKindOperation: number;
  dicWasteId: number;
  dicWaste: number;
  wasteName: string;
  afterDicWasteId: number;
  afterWasteName: string;
  afterKindOperationName: string;
  reportId: number;
}

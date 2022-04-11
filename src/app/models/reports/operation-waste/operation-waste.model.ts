export interface OperationWasteModel {
  id?: number;
  performedVolume: number;
  transferredVolume: number;
  endBalance: number;
  kindOperationBalanceId: string;
  dicWasteId: number;
  wasteName: string;
  dicKindOperationId: number;
  dicKindOperationName: string;
  reportId: number;
}

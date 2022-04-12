export interface WasteAfterOperationModel {
  id: number;
  dicWasteId: number;
  dicWasteName: string;
  generatedVolume: number;
  reoperationVolume: number;
  dicKindOperationId: number;
  dicKindOperationName: string;
  receivingWasteId: number;
}

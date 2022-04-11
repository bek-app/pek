export interface AccumulationWasteModel {
  id?:number;
  storageLimit: number,
  beginBalance: number,
  generatedVolume: number
  actualVolume: number,
  operationVolume: number,
  endBalance: number,
  
  measurementValue: number,
  dicFreqMeasurementId: number,
  dicWasteId: number,
  wasteName: string,
  reportId: number,
  measurementName: string,
  measurementFullName: string
}

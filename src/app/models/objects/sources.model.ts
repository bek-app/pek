 export interface SourceEmission {
  id?: number,
  sourceName: string,
  discriminator: string,
  measurementName: string,
  sourceNumber: number,
  projectCapacity: string,
  materials: string,
  lat: number,
  lng: number,
  measurementValue: number,
  areaEmissionId: number,
  dicFreqMeasurementId: number,
  wastes: Array<any>,
  wasteList: Array<any>

}


export class WasteWaterModel {
  constructor(
    public id?: number,
    public measurementProc?: string,
    public sourceName?: string,
    public lat?: number,
    public lng?: number,
    public pekObjectId?: number,
    public measurementValue?: number,
    public dicFreqMeasurementId?: number,
    public measurementName?: string,
    public coords?: string,
    public wastes?: Array<any>,
    public wasteList?: Array<any>
  ) {}
}

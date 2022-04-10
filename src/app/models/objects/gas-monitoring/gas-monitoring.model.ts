export class GasMonitoringModel {
  constructor(
    public id?: number,
    public pekObjectId?: number,
    public polygonName?: string,
    public polygonFile?: string,
    public countPoint?: number
  ) {}
}

export class GazMonitoringPointModel {
  constructor(
    public id?: number,
    public pointNumber?: string,
    public observableParam?: string,
    public lat?: number,
    public lng?: number,
    public measurementValue?: number,
    public gazMonitoringId?: number,
    public dicFreqMeasurementId?: number,
    public measurementName?: string,
    public measurementFullName?: string,
    public coords?: string
  ) {}
}

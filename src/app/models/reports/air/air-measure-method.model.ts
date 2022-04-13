export interface AirMeasureMethodModel {
  id: number;
  areaName: string;
  source: Source;
}
export interface Source {
  id: number;
  sourceName: string;
  sourceNumber: string;
  projectCapacity: string;
  pollutants: Pollutants;
}
export interface Pollutants {
  id: number;
  standartLimitGS: number;
  standartLimitTons: number;
  actualVoumeGS: number;
  actualVoumeTons: number;
  withoutPurification: number;
  capturedVolumeAll: number;
  capturedVolumeReclaimed: number;
  aboveVoumeGS: number;
  aboveVoumeTons: number;
  comparison: number;
  reason: string;
  dicPollutantId: number;
  dicPollutantName: string;
}

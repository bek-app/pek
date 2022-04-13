export interface RadiationModel {
  id: number;
  sourceName: string;
  standartLimit: number;
  actualVolume: number;
  exceedingVolume: number;
  correctiveMeasures: string;
  eliminationDeadline: Date;
  reportId: number;
}

export interface AirSourceWasteModel {
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
  dicWasteId: number;
  dicWasteName: string;
  airSourceId: number;
}

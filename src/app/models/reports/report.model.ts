export class ReportModel {
  modelId: any;
  constructor(
    public id?: number,
    public userId?: number,
    public firstSendDate?: Date,
    public reportYear?: number,
    public kvartal?: number,
    public isSign?: boolean,
    public regNumber?: string,
    public projectCapacity?: string,
    public actualCapacity?: string,
    public productionMonitoring?: string,
    public statusId?: number,
    public pekObjectId?: number,
    public oblastName?: string,
    public regionName?: string,
    public address?: string
  ) {}
}

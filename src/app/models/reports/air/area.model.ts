export class Area {
  id: number;
  pekObjectId: number;
  areaName: string;
  countSource: number;

  constructor(id: number,
              pekObjectId: number,
              areaName: string,
              countSource: number) {
    this.id = id;
    this.pekObjectId = pekObjectId;
    this.areaName = areaName;
    this.countSource = countSource;
  }
}

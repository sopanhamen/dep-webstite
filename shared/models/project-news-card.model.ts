import { MClassification } from './classification.model';
import { MLocale, MLocaleParent } from './common.model';

export class ProjectNewsCardModel {
  className?: string;
  description: string;
  imageUrl: string;
  id?: string;
  lastUpdate: string;
  lineClamp: number;
  readMore: boolean;
  tag: string;
  title: string;
  pillar: Partial<MClassification>;
  status: string;
  name: string;
  locale: MLocaleParent;
  sectors?: MLocale;

  constructor(data: any) {
    this.className = data.className;
    this.description = data.description;
    this.imageUrl = data.imageUrl;
    this.lastUpdate = data.lastUpdate;
    this.lineClamp = data.lineClamp;
    this.readMore = data.readMore;
    this.tag = data.tag;
    this.title = data.title;
    this.pillar = data.pillar;
    this.status = data.status;
    this.name = data.name;
    this.locale = new MLocaleParent(data.locale);
    this.sectors = data.sectors;
  }
}

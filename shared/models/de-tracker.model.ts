import { EChartDataType, EChartType } from '@shared/enum';
import { MFileImport, MLocaleParent, MSelectOptionCode } from './common.model';

export class MDETracker {
  description: string;
  createdAt: string;
  id: string;
  locale: MLocaleParent;
  pillar: MSelectOptionCode;
  status: string;
  title: string;
  updatedAt: string;
  publishedAt: string;
  iconUrl: string;
  name?: string;

  constructor(data: any) {
    this.description = data.description;
    this.createdAt = data.createdAt;
    this.id = data.id;
    this.locale = new MLocaleParent(data.locale);
    this.pillar = new MSelectOptionCode(data?.pillar);
    this.status = data.status;
    this.title = data.title;
    this.updatedAt = data.updatedAt;
    this.publishedAt = data.publishedAt;
    this.iconUrl = data.iconUrl;
    this.name = data?.name;
  }
}

export interface IPillarAPIBody {
  name?: string;
  description?: string;
  locale?: MLocaleParent;
  graph?: any[];
  alias?: string;
  parentId?: string;
  sequence?: string;
  imageId?: string;
  files?: [];
}

export class MPillarForm {
  descriptionEn?: string;
  descriptionKh?: string;
  publishedAt?: Date;
  pillar?: string;
  graph?: any[];

  constructor(data: IDEPillarsDetail) {
    this.descriptionEn = data?.description;
    this.descriptionKh = data?.locale?.km?.description;
    this.publishedAt = data?.publishedAt
      ? new Date(data?.publishedAt)
      : undefined;
    this.pillar = data?.code;
    this.graph = data?.graph;
  }
}

export interface IDEPillarsDetail {
  description?: string;
  createdAt?: string;
  id?: string;
  locale?: MLocaleParent;
  pillar?: MSelectOptionCode;
  status?: string;
  title?: string;
  updatedAt?: string;
  publishedAt?: string;
  iconUrl?: string;
  name?: string;
  deTrackers?: any[];
  code?: string;
  graph?: any[];
}

// add tracker
export interface IChartMenuItem {
  title: string;
  src: string;
  type: EChartType;
}

export interface IFormArrayChartTypesBody {
  chartType: EChartType;
  index: number;
}

export interface IChartTrackerBody<T> {
  index: number;
  body: T;
}

export interface ITrackerGetChartDataBody {
  name?: string;
  chartType?: EChartType;
  dataType?: EChartDataType;
}

import { IChild } from '@shared/interfaces';
import { MLocaleParent, MSelectOptionCode } from './common.model';

export class MNews {
  description: string;
  createdAt: string;
  id: string;
  locale: MLocaleParent;
  pillar: MSelectOptionCode;
  status: string;
  title: string;
  updatedAt: string;
  publishedAt: string;

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
  }
}

export class MNewsForm {
  titleEn?: string;
  titleKh?: string;
  descriptionEn?: string;
  descriptionKh?: string;
  sourceLinkEn?: string;
  sourceLinkKh?: string;
  publishedAt?: Date;
  pillar?: string;

  constructor(data: INewsDetail) {
    this.titleEn = data?.locale?.en?.title;
    this.titleKh = data?.locale?.km?.title;
    this.descriptionEn = data?.locale?.en?.description;
    this.descriptionKh = data?.locale?.km?.description;
    this.sourceLinkEn = data?.locale?.en?.sourceOrg;
    this.sourceLinkKh = data?.locale?.km?.sourceOrg;
    this.publishedAt = data?.publishedAt
      ? new Date(data?.publishedAt)
      : undefined;
    this.pillar = data?.pillar?.code;
  }
}

export interface INewsAPIBody {
  title?: string;
  description?: string;
  sourceOrg?: string;
  pillar?: string;
  publishedAt?: string;
  locale?: MLocaleParent;
}

export interface INewsDetail {
  id?: string;
  approvedAt?: string;
  approvedBy?: IChild.IChildActioner;
  createdAt?: string;
  createdBy?: IChild.IChildActioner;
  description?: string;
  files?: any[];
  iconId: string;
  locale: MLocaleParent;
  metadata?: any;
  pillar?: IChild.IChildPillar;
  publishedAt?: string;
  reason?: any;
  rejectedAt?: any;
  rejectedBy?: any;
  sourceOrg?: any;
  status?: string;
  summary?: string;
  title?: string;
  updatedAt?: string;
  updatedBy?: IChild.IChildActioner;
}

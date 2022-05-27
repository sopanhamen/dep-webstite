import { IChild } from '@shared/interfaces';
import { MLocale } from './common.model';
import { MLanguage } from './language.model';

export class ResourceHubCardModel {
  id?: string;
  className?: string;
  description: string;
  imageUrl: string;
  lastUpdate: string;
  lineClamp: number;
  tag: string;
  title: string;
  languages: MLanguage[];
  extensions: string[];
  resourceOrg: any;
  readMore: boolean;
  updatedAt: string;
  tagIconUrl: string;
  publishedAt: string;
  locale?: {
    en?: MLocale;
    km?: MLocale;
  };
  pillar: IChild.IChildPillar[];

  constructor(data: any) {
    this.id = data.id;
    this.className = data.className;
    this.description = data.description;
    this.imageUrl = data.imageUrl;
    this.lastUpdate = data.lastUpdate;
    this.lineClamp = data.lineClamp;
    this.tag = data.tag;
    this.title = data.title || '';
    this.languages = data.languages;
    this.extensions = data.extensions;
    this.resourceOrg = data?.resourceOrg || '';
    this.readMore = data.readMore;
    this.updatedAt = data.updatedAt;
    this.tagIconUrl = data.tagIconUrl;
    this.publishedAt = data?.publishedAt || '';
    this.locale = {
      en: new MLocale(data.locale?.en),
      km: new MLocale(data.locale?.km),
    };
    this.pillar = data.pillar;
  }
}

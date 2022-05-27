import { IChild, IClassification } from '@shared/interfaces';
import { MClassification } from '@shared/models/classification.model';
import { MLanguage } from '@shared/models/language.model';
import { MLocaleParent } from './common.model';
import { ResourceHubCardModel } from './resource-hub-card.model';

export class MResourceHub {
  id: string;
  titleInKhmer: string;
  titleInEnglish: string;
  pillar: string;
  types: MClassification[];
  extensions: string[];
  languages: MLanguage[];
  publishedAt: string;
  resourceOrg: string;
  status: string;

  constructor(resource: any) {
    this.id = resource?.id || '';
    this.titleInKhmer = resource?.locale?.km?.title || '';
    this.titleInEnglish = resource?.locale?.en?.title || '';
    this.pillar = resource?.pillar?.name || '';
    this.types =
      resource?.types?.map((type: MClassification) => type?.name)?.join(', ') ||
      '';
    this.extensions = resource?.extensions || [];
    this.languages =
      resource?.languages?.map(
        (language: MLanguage) => new MLanguage(language),
      ) || [];
    this.publishedAt = resource?.publishedAt;
    this.resourceOrg = resource?.resourceOrg?.name || '';
    this.status = resource?.status || '';
  }
}

export interface IFileTypes {
  id: string;
  code: string;
  name: string;
  files: any[];
  locale: any[];
}

export interface IResourceHubDetail {
  description?: string;
  title?: string;
  approvedAt?: string;
  createdAt?: string;
  createdBy?: IChild.IChildActioner;
  publishedBy?: MClassification;
  languages?: MLanguage[];
  duration?: string;
  files?: any[];
  locale?: MLocaleParent;
  fileTypes?: IFileTypes[];
  types?: MClassification[];
  extensions?: string[];
  metadata?: any;
  pillar?: IChild.IChildPillar;
  publishedAt?: string;
  reason?: string;
  rejectedAt?: string;
  rejectedBy?: string;
  resourceOrg?: string;
  sectors?: IChild.IChildSector[];
  stakeholders?: IClassification[];
  status?: string;
  summary?: string;
  relatedResourceHubs?: ResourceHubCardModel[];
}

export interface IDownloadFile {
  id?: string;
  referenceId?: string;
  downloading?: boolean;
  resourceHubId?: string;
}

import { IChild } from '@shared/interfaces';
import {
  MLocaleParent,
  MSelectOption,
  MSelectOptionCode,
} from './common.model';

export class Project {
  description: string;
  createdAt: string;
  duration: string;
  endDate: string | Date;
  id: string;
  imageId: string;
  imageUrl: string;
  locale: MLocaleParent;
  name: string;
  owners: MSelectOptionCode[];
  partners: MSelectOptionCode[];
  pillar: MSelectOptionCode;
  projectStatus: MSelectOptionCode;
  sectors: MSelectOptionCode[];
  startDate: string | Date;
  status: string;
  tagIconId: string;
  tagIconUrl: string;
  updatedAt: string;

  constructor(data: any) {
    this.description = data.description;
    this.createdAt = data.createdAt;
    this.duration = data.duration;
    this.endDate = data.endDate;
    this.id = data.id;
    this.imageId = data.imageId ?? '';
    this.imageUrl = data.imageUrl ?? '';
    this.locale = new MLocaleParent(data.locale);
    this.name = data.name;
    this.owners = data.owners?.map((e: any) => new MSelectOptionCode(e));
    this.partners = data.partners?.map((e: any) => new MSelectOptionCode(e));
    this.pillar = new MSelectOptionCode(data?.pillar);
    this.projectStatus = new MSelectOptionCode(data.projectStatus);
    this.sectors = data.sectors?.map((e: any) => new MSelectOptionCode(e));
    this.startDate = data.createdAt;
    this.status = data.status;
    this.tagIconId = data.tagIconId ?? '';
    this.tagIconUrl = data.tagIconUrl ?? '';
    this.updatedAt = data.updatedAt;
  }
}

export interface IProjectForm {
  description?: string;
  createdAt?: string;
  duration?: string;
  endDate?: string | Date;
  id?: string;
  imageId?: string;
  imageUrl?: string;
  locale?: MLocaleParent;
  name?: string;
  owners?: MSelectOptionCode[];
  partners?: MSelectOptionCode[];
  pillar?: MSelectOptionCode;
  projectStatus?: MSelectOptionCode;
  sectors?: MSelectOptionCode[];
  startDate?: string | Date;
  status?: string;
  tagIconId?: string;
  tagIconUrl?: string;
  updatedAt?: string;
}

export interface IProjectPayload {
  createDate?: string;
  descriptionEng?: string;
  descriptionKh?: string;
  duration?: string;
  endDate?: string;
  imageUrl?: string;
  implementationPartners?: string;
  lastUpdate?: string;
  pillars?: MSelectOption[] | null;
  projectNameEng?: string;
  projectNameKh?: string;
  projectStatus: MSelectOption[] | null;
  sectors: MSelectOption[] | null;
  setIconValue: string;
  setImageValue: string;
  stakeholder?: string;
  startDate?: string;
  status: string;
  tagsIcon?: string;
}

export interface IProjectCard {
  name?: string;
  title?: string;
  id?: string;
  description?: string;
  imageUrl?: string;
  lastUpdate: string;
  lineClamp: number;
  readMore: boolean;
  tag: string;
  pillar: string;
  status: string;
  languages: any[];
  extensions: any[];
  resourceOrg: any;
  updatedAt: string;
  tagIconUrl: string;
  locale: MLocaleParent;
  sectors?: IChild.IChildSector[];
  publishedAt?: string;
}

export interface IProjectDetail {
  approvedAt?: string;
  approvedBy?: IChild.IChildActioner;
  createdAt?: string;
  createdBy?: IChild.IChildActioner;
  description?: string;
  duration?: string;
  endDate?: string;
  files?: any[];
  iconId: string;
  imageId?: string;
  imageUrl?: string;
  locale: MLocaleParent;
  metadata?: any;
  name?: string;
  owners?: IChild.IChildOwner[];
  partners?: IChild.IChildPartner[];
  pillar?: IChild.IChildPillar;
  projectStatus?: IChild.IChildProjectStatus;
  publishedAt?: string;
  reason?: any;
  rejectedAt?: any;
  rejectedBy?: any;
  resourceOrg?: any;
  sectors?: IChild.IChildSector[];
  stakeholders?: IChild.IChildStakeholder[];
  startDate?: string;
  status?: string;
  summary?: string;
  tagIconId?: string;
  tagIconUrl?: string;
  title: string;
  updatedAt?: string;
  updatedBy?: IChild.IChildActioner;
  updatedOn: string;
  relatedProjects?: any[];
  relatedNews?: any[];
  relatedResourceHubs?: IProjectCard[];
}

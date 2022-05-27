import { IChild } from '@shared/interfaces';
import { MLocaleParent } from './common.model';

export interface TestCMSProject {
  id?: string;
  name?: string;
  summary?: string;
  description?: string;
  imageId?: string;
  imageUrl?: string;
  tagIconId?: string;
  tagIconUrl?: string;
  duration?: string;
  startDate?: string;
  endDate?: string;
  resourceOrg?: any;
  pillar?: IChild.IChildPillar;
  projectStatus?: IChild.IChildProjectStatus;
  publishedAt?: string;
  metadata?: any;
  status?: string;
  approvedBy?: IChild.IChildActioner;
  approvedAt?: string;
  rejectedBy?: any;
  rejectedAt?: any;
  reason?: any;
  createdAt?: string;
  updatedAt?: string;
  createdBy?: IChild.IChildActioner;
  updatedBy?: IChild.IChildActioner;
  sectors?: IChild.IChildSector[];
  stakeholders?: IChild.IChildStakeholder[];
  owners?: IChild.IChildOwner[];
  partners?: IChild.IChildPartner[];
  files?: any[];
  locale?: MLocaleParent;
}

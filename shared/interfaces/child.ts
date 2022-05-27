import { MLocale } from '@shared/models/common.model';

export interface IChildLocale {
  en: MLocale;
  km: MLocale;
}

export interface IChildClassification {
  id?: string;
  code?: string;
  name?: string;
  type?: string;
  locale?: Locale;
}

export interface IChildPillar extends IChildClassification {}
export interface IChildProjectStatus extends IChildClassification {}
export interface IChildSector extends IChildClassification {}

export interface IChildProfile {
  fullName?: string;
  country?: any;
  profileImage?: any;
}

export interface IChildActioner {
  id?: string;
  positionId?: any;
  email?: string;
  phone?: any;
  profile?: IChildProfile;
}

export interface IChild {
  title?: string;
  description?: string;
  imageUrl?: string;
  lastUpdate: string;
  lineClamp: number;
  readMore: boolean;
  tag: string;
}

export interface IChildOrganization extends IChildClassification {
  pillar?: any;
  phone?: any;
  email?: any;
  website?: any;
  description?: any;
  purpose?: any;
  imageId?: string;
  imageUrl?: string;
  status?: string;
  metadata?: any;
  address?: any;
  location?: any;
  latitude?: any;
  longitude?: any;
  isShow?: number;
  search?: string;
}

export interface IChildStakeholder extends IChildOrganization {}
export interface IChildOwner extends IChildOrganization {}
export interface IChildPartner extends IChildOrganization {}

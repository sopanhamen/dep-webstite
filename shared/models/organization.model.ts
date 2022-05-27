import { MLocaleParent } from './common.model';

export interface IOrganization {
  address?: string;
  code?: string;
  createdBy?: string;
  description?: string;
  email?: string;
  id?: string;
  isShow?: number;
  locale?: string;
  name?: string;
  phone?: string;
  pillar?: IClassification;
  purpose?: string;
  search?: string;
  sectors?: IClassification[];
  status?: string;
  type?: IClassification;
  updatedBy?: string;
  value?: string;
  website?: string;
}

export interface IClassification {
  code?: string;
  id?: string;
  locale?: MLocaleParent;
  name?: string;
}

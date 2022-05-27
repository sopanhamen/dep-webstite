import { MLocaleParent } from '@shared/models/common.model';
import { IClassification } from '@shared/models/organization.model';

export interface IResourceHub {
  id?: string;
  title?: string;
  description?: string;
  summary?: string;
  pillar?: IClassification;
  resourceOrg?: IClassification;
  publishedAt?: string;
  publishedBy?: IClassification;
  languages?: ILanguage[];
  isPrivate?: number;
  status?: string;
  approvedBy?: string;
  approvedAt?: string;
  rejectedBy?: string;
  rejectedAt?: string;
  reason?: string;
  createdBy?: string;
  updatedBy?: string;
  createdAt?: string;
  updatedAt?: string;
  locale?: MLocaleParent;
  types?: IClassification[];
  extensions?: string[];
  sectors?: IClassification[];
  stakeholders?: IClassification[];
  fileTypes?: IFileType[];
  files?: IFileUpload[];
  imageId?: string;
  imageUrl?: string;
  metadata?: {
    additionalInfos: IResourceMetadata[];
  };
}

export interface IResourceMetadata {
  field: string;
  value: string;
  locale: {
    en: {
      field: string;
      value: string;
    };
    km: {
      field: string;
      value: string;
    };
  };
}

export interface IFile {
  fileId?: string;
  fileUrl?: string;
  isPreview?: number;
  referenceFileId?: string;
  extension?: string;
  fileName?: string;
  name?: string;
}

export interface IFileUpload extends IFile {
  extension: string;
  id: string;
  name: string;
  referenceFileTypes: string[];
  referenceId: string;
}

export interface ILanguage extends IType {
  imageUrl?: string;
}

export interface IType {
  id?: string;
  code?: string;
  name?: string;
  locale?: MLocaleParent;
}

export interface IFileType extends IType {
  files?: IFile[];
}

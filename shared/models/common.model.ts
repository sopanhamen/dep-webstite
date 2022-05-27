import { EChartDataType, EChartType } from '@shared/enum';

export interface ISelectOption {
  label: string;
  value: string;
  __isNew__?: boolean;
}

export class MRole {
  code: string;
  createdAt: string;
  createdBy: string;
  description: string;
  id: string;
  name: string;
  search: string;
  sequence: number;
  status: string;
  updatedAt: string;
  updatedBy: string;
  value: string;
  label: string;

  constructor(role: MRole) {
    // defined these fields for select
    this.value = role?.code;
    this.label = role?.name;
    this.code = role?.code;
    this.createdAt = role?.createdAt;
    this.createdBy = role?.createdBy;
    this.description = role?.description;
    this.id = role?.id;
    this.name = role?.name;
    this.search = role?.search;
    this.sequence = role?.sequence;
    this.status = role?.status;
    this.updatedAt = role?.updatedAt;
    this.updatedBy = role?.updatedBy;
  }
}

export class MSelectOption {
  value: string;
  label: string;

  constructor(option: any) {
    this.label = option?.name;
    this.value = option?.id;
  }
}

export class MSelectOptionCode {
  value: string;
  label: string;

  constructor(option: any) {
    this.label = option?.name;
    this.value = option?.code;
  }
}

export interface IUpdate<T> {
  id: string;
  body: T;
}

export class MLocale {
  description?: string;
  name?: string;
  title?: string;
  sourceOrg?: string;
  summary?: string;
  alias?: string;

  constructor(data: any) {
    this.description = data?.description;
    this.name = data?.name;
    this.title = data?.title;
    this.sourceOrg = data?.sourceOrg;
    this.summary = data?.summary;
    this.alias = data?.alias;
  }
}

export class MLocaleParent {
  en: MLocale;
  km: MLocale;

  constructor(data: any) {
    this.en = new MLocale(data?.en);
    this.km = new MLocale(data?.km);
  }
}

export class Dataset {
  label: string;
  data: number[];
  backgroundColor: string;
  borderColor: string;
  borderWidth: number;

  constructor(data: any) {
    this.label = data.label;
    this.data = data.data;
    this.backgroundColor = data.backgroundColor;
    this.borderWidth = 1;
    this.borderColor = data.borderColor;
  }
}

export class MFileImport {
  extension?: string;
  id?: string;
  isDownloadable?: string;
  name?: string;
  originalName?: string;
  size?: string;
  status?: string;
  type?: string;
  url?: string;

  constructor(value: MFileImport) {
    this.extension = value?.extension || '';
    this.id = value?.id || '';
    this.isDownloadable = value?.isDownloadable || '';
    this.name = value?.name || '';
    this.originalName = value?.originalName || '';
    this.size = value?.size || '';
    this.status = value?.status || '';
    this.type = value?.type || '';
    this.url = value?.url || '';
  }
}

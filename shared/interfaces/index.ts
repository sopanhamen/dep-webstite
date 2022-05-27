import { EPillar, EStatus, ETextColor } from '@shared/enum';
import { MLocaleParent } from '@shared/models/common.model';
import React from 'react';
import * as IChild from './child';

export { IChild };

export interface INavigation {
  translateTitle: string;
  link: string;
}

export interface IHomepagePillars extends Icon<number> {
  source: string;
  animation: string;
}

export interface Icon<T> {
  height: T;
  width: T;
}

export interface IPaginationMetadata {
  page: number;
  limit: number;
  totalItem: number;
}

export interface IContactUsInfo extends Icon<number> {
  caption: string;
  logo: string;
}

export interface IProjectNewsCardCommon {
  isLoading?: boolean;
  showImage?: boolean;
}

export interface ITableHeader {
  name?: string;
  class?: string;
  style?: Object;
}

export interface IMetadata {
  limit: number;
  offset: number;
  total: number;
}

export interface ICommonQueries extends Partial<IMetadata> {
  current?: string;
  search?: string;
  status?: EStatus;
  statuses?: string | string[];
  token?: string;
}

export interface ISharedCommonQueries extends Partial<ICommonQueries> {
  dateType?: string | null;
  startStartDate?: string | Date | null;
  endStartDate?: string | Date | null;
  startCreatedAt?: string | Date | null;
  endCreatedAt?: string | Date | null;
  startPublishedAt?: string | Date | null;
  endPublishedAt?: string | Date | null;
  orders?: string | string[] | null;
  page?: number;
  pillars?: string | string[];
  pillar?: string;
  sectors?: string | string[];
  owners?: string | string[];
  partners?: string | string[];
  regoin?: string | string[];
  province?: string | string[];
  projectDetail?: string[] | null;
  fileTypes?: string | string[];
  extensions?: string | string[];
  roles?: string | string[];
}

export interface ICommonResponse<T> {
  data: T[];
  metadata: IMetadata;
  message: string;
}

export interface ISingleCommonResponse<T> {
  data: T;
  message: string;
}

export interface IMessage {
  message: string;
}

export interface ICommonElementProps {
  forAdmin?: boolean;
  className?: string;
  style?: Object;
  children?: React.ReactNode;
}

export interface ICommonFilter extends ICommonQueries {
  page?: number;
  groupBy?: string;
  roleId?: string;
  roleIds?: string[];
  orders?: string | string[];
}

interface Api<T> {
  [key: string]: T[];
}

type dataApi<T> = Api<T> & {
  metadata: IMetadata;
  currentSelectedValue: T | null;
};

export interface IReducerAction<T> {
  type: string;
  data: dataApi<T>;
}

export interface IAdminPaginationData {
  activePage: number;
  limit: number;
  totalPage: number;
}

export interface IAdminPaginationProps {
  activePage: number;
  limit: number;
  totalItem: number;
  onChange?: (data: IAdminPaginationData) => void;
}

export interface ISelectFilterOptions {
  label: string | string[] | JSX.Element | React.ReactNode;
  value: any;
  locale?: MLocaleParent;
  active?: boolean;
}

export interface IToggle {
  status: EStatus;
}

export interface IAction {
  name: string;
  color: ETextColor;
}

export interface BannerQuery {
  page: EPillar;
  pillar?: 'DIGITAL-GOVERNMENT';
  status: EStatus;
}

export interface KeyOfT<T> {
  [key: string]: T;
}

interface IFiles {
  fileId: string;
  referenceFileType: string;
  isPreview: boolean;
  sequence: number;
}

export interface IUploadPayload {
  description: string;
  files?: IFiles[];
  imageId?: string;
  locale?: MLocaleParent;
  name?: string;
  page?: string;
  pillar?: string;
  position?: string;
}

export interface IMessagePayload {
  note?: string;
  reason?: string;
}
export interface IClassification extends ICodeId {
  imageUrl: string;
  name: string;
}

export interface ICodeId {
  code: string;
  id: string;
}

export interface IClientSummaryCardData extends Partial<IDefaultForm> {
  id?: string;
  imageUrl?: string;
  titleLinkEn?: string;
  titleLinkKh?: string;
  linkTarget?: string;
  pillarCode?: string;
  pillarLabel?: string;
  statusCode?: string;
  statusLabel?: string;
  date?: string;
  dateLabel?: string;
}

export interface IClientSummaryCardProps {
  data?: IClientSummaryCardData;
  isLoading?: boolean;
  showImage?: boolean;
  showPillar?: boolean;
  showStatus?: boolean;
  showDate?: boolean;
  showBreakline?: boolean;
}

export interface IDefaultForm {
  titleEn?: string;
  titleKh: string;
  descriptionEn: string;
  descriptionKh: string;
}

export interface NavCommon {
  href: string;
  permission?: string;
  title?: string;
}

export interface ISidebarNav extends NavCommon {
  icon: string;
  items?: NavCommon[];
  isActive?: boolean;
  isSubNavOpen?: boolean;
}

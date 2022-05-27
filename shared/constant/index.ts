import { IMetadata, ISidebarNav, ITableHeader } from '@shared/interfaces';
import { ISelectOption } from '@shared/models/common.model';

export const metadataConstant: IMetadata = {
  limit: 10,
  offset: 0,
  total: 0,
};

export const organizationHeader: ITableHeader[] = [
  { name: 'ID' },
  { name: 'Organization Icon' },
  { name: 'Organization Name' },
  { name: 'Organization Type' },
  { name: 'Organization Pillar' },
  { name: 'Organization Sector' },
  { name: 'Link to Website' },
  { name: 'Description' },
  { name: 'Status' },
  { name: '' },
];

export const clientResourceHubHeader: ITableHeader[] = [
  { name: 'Field' },
  { name: 'Value' },
];

export const userRoleHeader: ITableHeader[] = [
  { name: 'User Role' },
  { name: 'Description' },
];

export const userVerificationHeader: ITableHeader[] = [
  { name: 'Full Name' },
  { name: 'Email' },
  { name: 'Phone Number' },
  { name: 'User Roles' },
  { name: 'Project Owner' },
  { name: 'Organization icon' },
  { name: 'Organization Name' },
  { name: 'Organization Type' },
  { name: 'Organization Pillar' },
  { name: 'Organization Sector' },
  { name: 'Link to Website' },
  { name: 'Description' },
  { name: 'Status' },
  { name: '' },
];

export const userPermissionHeader: ITableHeader[] = [
  { name: 'Section' },
  { name: 'Permission' },
  { name: 'Admin' },
  { name: 'Moderator' },
  { name: 'Project Owner' },
];

export const bannerHeader = (
  isHome: boolean,
  isCRUDPermitted: boolean,
): ITableHeader[] => {
  let headers: ITableHeader[] = [];
  if (!isHome) {
    headers = [
      { name: 'Banner' },
      { name: 'Title In English' },
      { name: 'Title In Khmer' },
      { name: '' },
    ];
  } else {
    headers = [{ name: 'Banner' }, { name: '' }];
  }

  if (!isCRUDPermitted) {
    headers.pop();

    return headers;
  }

  return headers;
};

export const statusConstant: ISelectOption[] = [
  {
    label: 'Active',
    value: 'ACTIVE',
  },
  {
    label: 'Inactive',
    value: 'INACTIVE',
  },
];

export const languageConstant: ISelectOption[] = [
  {
    label: 'English',
    value: 'EN',
  },
  {
    label: 'Khmer',
    value: 'KM',
  },
];

export const eventsHeader: ITableHeader[] = [
  { name: 'Event Title' },
  { name: 'Start Date' },
  { name: 'End Date' },
  { name: 'Status' },
  { name: '' },
];

export const companyBackgroundHeader: ITableHeader[] = [
  { name: 'Company Photo' },
  { name: 'Company Background Title Kh' },
  { name: 'Company Background Title En' },
  { name: 'Description Kh' },
  { name: 'Description En' },
];

export const activityHeader: ITableHeader[] = [
  { name: 'Name' },
  { name: 'Role' },
  { name: 'Activities' },
  { name: 'Date' },
];

export const projectHeaders: ITableHeader[] = [
  { name: 'Title English' },
  { name: 'Title Khmer' },
  { name: 'Pillar' },
  { name: 'Sector' },
  { name: 'Project Status' },
  { name: 'Description' },
  { name: 'Status' },
  { name: 'Updated On' },
  { name: 'Created On' },
  { name: '' },
];

export const ICON_URL = {
  SORT: '/assets/admin/icon/sort.png',
  GROUP: '/assets/admin/icon/group.png',
  ROLLBACK: '/assets/admin/icon/rollback.png',
  FILTER: '/assets/admin/icon/filter.png',
  BROKEN: '/assets/admin/icon/broken.png',
  FLAG_KM: '/assets/flags/cambodia.png',
  FLAG_EN: '/assets/flags/usa.png',
  BROKEN_RECTANGLE: '/assets/admin/icon/broken-rectangle.png',
  ANNOUNCEMENT: '/assets/icons/announcement.svg',
  KM_FLAG: '/assets/flags/cambodia.webp',
  EN_FLAG: '/assets/flags/usa.webp',
  BTN_ADD: '/assets/admin/icon/add.svg',
  PIE_CHART: '/assets/admin/icon/pie-chart.svg',
  MAP_CHART: '/assets/admin/icon/map-chart.svg',
  LINE_CHART: '/assets/admin/icon/line-chart.svg',
  BAR_CHART: '/assets/admin/icon/bar-chart.svg',
  DOUGHNUT_CHART: '/assets/admin/icon/doughnut-chart.svg',
  SCATTER_CHART: '/assets/admin/icon/scatter-chart.svg',
  FILE: '/assets/icons/file.svg',
};

export const ALERT_MESSAGE = {
  ACTIVATE_SUCCESS: 'Activated Successfully',
  CREATE_SUCCESS: 'Create Successfully',
  DEACTIVATE_SUCCESS: 'Deactivated Successfully',
  DELETE_SUCCESS: 'Delete Successful',
  UNKNOWN_ERROR_RETRY: 'Unknown Error, Please Try again',
  UNKNOWN_ERROR: 'Unknown Error',
  UPDATE_SUCCESS: 'Update Successfully',
  DOWNLOAD_SUCCESS: 'Download Successfully',
};

export const resourceHubTableHeaders: ITableHeader[] = [
  { name: 'Resource Title Kh' },
  { name: 'Resource Title Eng' },
  { name: 'Pillar' },
  { name: 'Type' },
  { name: 'File Download' },
  { name: 'Language Download' },
  { name: 'Publish Date' },
  { name: 'References' },
  { name: 'Status' },
  { name: '' },
];

export const userTableHeaders: ITableHeader[] = [
  { name: 'Name' },
  { name: 'User Role' },
  { name: 'Email' },
  { name: 'Create Date' },
  { name: 'Status' },
  { name: 'Action' },
];

export const newsHeaders: ITableHeader[] = [
  { name: 'Title English' },
  { name: 'Title Khmer' },
  { name: 'Pillar' },
  { name: 'Description' },
  { name: 'Published On' },
  { name: 'Status' },
  { name: 'Updated On' },
  { name: 'Created On' },
  { name: '' },
];

export const deTrackerGaneralHeaders: ITableHeader[] = [
  { name: 'Ganeral Description Kh' },
  { name: 'General Description Eng' },
  { name: 'Status' },
  { name: '' },
];

export const deTrackerHeaders: ITableHeader[] = [
  { name: 'Tracker icon' },
  { name: 'Tracker Title Kh' },
  { name: 'Tracker Title Eng' },
  { name: 'Tacker Background' },
  { name: 'Status' },
  { name: '' },
];

export const PATTERNS = {
  EMAIL: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
  DATE_FORM_WITH_TIME: 'dd MMM, yyyy h:mm aa',
  DATE_FORM_NO_TIME: 'dd MMM, yyyy',
  DATE_LIST_WITH_TIME: 'dd MMM, yyyy h:mm aa',
  DATE_LIST_NO_TIME: 'dd MMM, yyyy',
};

export const navigations = (): ISidebarNav[] => {
  return [
    {
      href: '/admin/dashboard',
      icon: '/assets/admin/icon/dashboard.svg',
      isActive: false,
      title: ' Dashboard',
    },
    {
      href: '#',
      icon: '/assets/admin/icon/de-progress-tracker.svg',
      isActive: false,
      isSubNavOpen: false,
      items: [],
      permission: 'WEB-DE-TRACKER-READ',
      title: 'DE Progress Tracker',
    },
    {
      href: '/admin/projects',
      icon: '/assets/admin/icon/projects.svg',
      isActive: false,
      permission: 'WEB-PROJECT-READ',
      title: 'Projects',
    },
    {
      href: '/admin/resource-hub',
      icon: '/assets/admin/icon/resource-hub.svg',
      isActive: false,
      permission: 'WEB-RESOURCE-HUB-READ',
      title: 'Resource Hub',
    },
    {
      href: '/admin/news',
      icon: '/assets/admin/icon/news.svg',
      isActive: false,
      permission: 'WEB-NEWS-READ',
      title: 'News',
    },
    {
      href: '#',
      icon: '/assets/admin/icon/about-us.svg',
      isActive: false,
      isSubNavOpen: false,
      title: 'About Us',
      items: [
        {
          href: '/admin/about-us/company-background',
          title: 'Company Background',
          permission: 'WEB-CONTENT-READ',
        },
        {
          href: '/admin/about-us/about-teams',
          title: 'About Teams',
        },
      ],
    },
    {
      href: '#',
      icon: '/assets/admin/icon/user-management.svg',
      isActive: false,
      isSubNavOpen: false,
      permission: 'WEB-USER-READ',
      title: 'Management',
      items: [
        {
          href: '/admin/user-management/user-roles',
          title: 'User Roles',
        },
        {
          href: '/admin/user-management/users',
          title: 'Users',
        },
        {
          href: '/admin/user-management/user-permissions',
          title: 'User Permissions',
        },
        {
          href: '/admin/user-management/user-verification',
          title: 'User Verification',
        },
        {
          href: '/admin/user-management/organizations',
          title: 'Organization',
        },
        {
          href: '/admin/user-management/events',
          title: 'Events',
        },
        {
          href: '/admin/user-management/activity',
          title: 'Activity Stream',
        },
      ],
    },
    {
      href: '/admin/banners',
      icon: '/assets/admin/icon/banner.svg',
      isActive: false,
      permission: 'WEB-BANNER-READ',
      title: 'Banners',
    },
  ];
};

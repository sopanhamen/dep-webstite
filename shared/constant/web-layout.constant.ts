import {
  IContactUsInfo,
  IHomepagePillars,
  INavigation,
} from '@shared/interfaces';

export const navigations: INavigation[] = [
  {
    translateTitle: 'home',
    link: '/',
  },
  {
    translateTitle: 'de',
    link: 'de-trackers',
  },
  {
    translateTitle: 'projects',
    link: 'projects',
  },
  {
    translateTitle: 'resource',
    link: 'resource-hub',
  },
  {
    translateTitle: 'news',
    link: 'news',
  },
  {
    translateTitle: 'about',
    link: 'about',
  },
];

export const socialMedias: string[] = [
  'fa-facebook',
  'fa-youtube-play',
  'fa-twitter',
];

export const homepagePillars: IHomepagePillars[] = [
  {
    height: 90,
    width: 120.9,
    source: 'government',
    animation: 'bounceInDown',
  },
  {
    height: 95,
    width: 67,
    source: 'citizen',
    animation: 'bounceInLeft',
  },
  {
    height: 94,
    width: 103,
    source: 'business',
    animation: 'bounceInRight',
  },
];

export const contactUsInfo: IContactUsInfo[] = [
  {
    caption: '43 Samdach Chakrei Ponn St. (208), Phnom Penh',
    logo: 'location',
    height: 21.51,
    width: 17.5,
  },
  {
    caption: '+85523224782',
    logo: 'phone-ringing',
    height: 21.53,
    width: 21.4,
  },
  {
    caption: 'info@digitaleconomy',
    logo: 'envelope',
    height: 21.5,
    width: 19.5,
  },
];

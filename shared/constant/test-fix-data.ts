import { ITableHeader } from '@shared/interfaces';

export const testUsers: any[] = Array(50).fill({
  id: '001',
  image:
    'https://images.sftcdn.net/images/t_app-cover-l,f_auto/p/befbcde0-9b36-11e6-95b9-00163ed833e7/260663710/the-test-fun-for-friends-screenshot.jpg',
  titleKh: 'គម្រោងទី១',
  titleEn: 'Project 1',
  startedAt: '2021-11-24T03:36:43.405Z',
  endedAt: '2021-11-24T03:36:43.405Z',
  duration: '1 day',
  sector: 'Education',
  projectStatus: 'On going',
  stackholder: 'Ministry of Education',
  implementPartners: 'United Nations Development',
  pillar: 'Digital Citizen',
  tagsIcon:
    'https://images.sftcdn.net/images/t_app-cover-l,f_auto/p/befbcde0-9b36-11e6-95b9-00163ed833e7/260663710/the-test-fun-for-friends-screenshot.jpg',
  descKh: 'នេះគឺជាគម្រោងទី​១',
  descEn: 'This is project 1.',
  createdAt: '2021-11-24T03:36:43.405Z',
  updatedAt: '2021-11-24T03:36:43.405Z',
  status: 'active',
});

export const testTableHeaders: ITableHeader[] = [
  { name: 'Title English' },
  { name: 'Title Khmer' },
  { name: 'Pillar' },
  { name: 'Sector' },
  { name: 'Process Status' },
  { name: 'Description' },
  { name: 'Status' },
  { name: 'Updated On' },
  { name: 'Created On' },
  { name: '' },
];

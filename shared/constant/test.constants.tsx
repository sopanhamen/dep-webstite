import { IChartData } from '@shared/components/charts/custom-chart';
import { ProjectNewsCardModel } from '@shared/models/project-news-card.model';

export const samplePorjectNewsCard: Partial<ProjectNewsCardModel>[] = [
  {
    className: 'm-r-20',
    description:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed doeiusmod tempor incididunt ut labore et dolore magna aliqua. Utenim ad minim veniam, quis nostrud exercitation ullamco laborisnisi ut aliquip ex ea commodo consequat. Duis aute irure dolorin reprehenderit in voluptate velit esse cillum dolore eu fugiatnulla pariatur. Excepteur sint occaecat cupidatat non proident,sunt in culpa qui officia deserunt mollit anim id est laborum.Curabitur pretium tincidunt lacus. Nulla gravida orci a odio.Nullam varius, turpis et commodo pharetra, est eros bibendumelit, nec luctus magna felis sollicitudin mauris. Integer inmauris eu nibh euismod gravida.',
    imageUrl: '/images/testing.png',
    lastUpdate: '20 October 2021',
    lineClamp: 2,
    readMore: false,
    tag: 'Digital Citizen',
    title: 'Graduation Based Social Protection',
  },
  {
    className: 'm-r-20',
    description:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed doeiusmod tempor incididunt ut labore et dolore magna aliqua. Utenim ad minim veniam, quis nostrud exercitation ullamco laborisnisi ut aliquip ex ea commodo consequat. Duis aute irure dolorin reprehenderit in voluptate velit esse cillum dolore eu fugiatnulla pariatur. Excepteur sint occaecat cupidatat non proident,sunt in culpa qui officia deserunt mollit anim id est laborum.Curabitur pretium tincidunt lacus. Nulla gravida orci a odio.Nullam varius, turpis et commodo pharetra, est eros bibendumelit, nec luctus magna felis sollicitudin mauris. Integer inmauris eu nibh euismod gravida.',
    imageUrl: '/images/testing.png',
    lastUpdate: '20 October 2021',
    lineClamp: 2,
    readMore: false,
    tag: 'Digital Government',
    title: 'Graduation Based Social Protection',
  },
  {
    className: 'm-r-20',
    description:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed doeiusmod tempor incididunt ut labore et dolore magna aliqua. Utenim ad minim veniam, quis nostrud exercitation ullamco laborisnisi ut aliquip ex ea commodo consequat. Duis aute irure dolorin reprehenderit in voluptate velit esse cillum dolore eu fugiatnulla pariatur. Excepteur sint occaecat cupidatat non proident,sunt in culpa qui officia deserunt mollit anim id est laborum.Curabitur pretium tincidunt lacus. Nulla gravida orci a odio.Nullam varius, turpis et commodo pharetra, est eros bibendumelit, nec luctus magna felis sollicitudin mauris. Integer inmauris eu nibh euismod gravida.',
    imageUrl: '/images/testing.png',
    lastUpdate: '20 October 2021',
    lineClamp: 2,
    readMore: false,
    tag: 'Digital Business',
    title: 'Graduation Based Social Protection',
  },
];

export const sampleChart: IChartData = {
  labels: [
    'New York, New York',
    'Los Angeles, California',
    'Chicago, Illinois',
    'Houston, Texas',
    'Phoenix, Arizona',
    'Philadelphia, Pennsylvania',
    'San Antonio, Texas',
    'San Diego, California',
    'Dallas, Texas',
    'San Jose, California',
    'Austin, Texas',
    'Jacksonville, Florida',
    'Fort Worth, Texas',
    'Columbus, Ohio',
    'Charlotte, North Carolina',
    'San Francisco, California',
    'Indianapolis, Indiana',
    'Seattle, Washington',
    'Denver, Colorado',
  ],
  datasets: [
    {
      label: 'Population2010',
      data: [
        8175133, 3792621, 2695598, 2099451, 1445632, 1526006, 1327407, 1307402,
        1197816, 945942, 790390, 821784, 741206, 787033, 731424, 805235, 820445,
        608660, 600158,
      ],
      borderColor: 'rgba(255, 99, 132, 1)',
      backgroundColor: 'rgba(255, 99, 132, 1)',
      borderWidth: 1,
    },
    {
      label: 'PopEstimate2019',
      data: [
        8336817, 3979576, 2693976, 2320268, 1680992, 1584064, 1547253, 1423851,
        1343573, 1021795, 978908, 911507, 909585, 898553, 885708, 881549,
        876384, 753675, 727211,
      ],
      borderColor: 'rgba(100, 99, 132, 1)',
      backgroundColor: 'rgba(100, 99, 132, 1)',
      borderWidth: 1,
    },
    {
      label: 'PctChange2010-19',
      data: [
        -5336817, -4000000.93, -100006, -100000.52, -160000.28, 3.8, -160000.56,
        -80000.91, -120000.17, -80000.02, -230000.85, -100000.92, -220000.72,
        -140000.17, -210000.09, -90000.48, -6.82, -230000.83, -210000.17,
      ],
      borderColor: 'rgba(150, 99, 132, 1)',
      backgroundColor: 'rgba(150, 99, 132, 1)',
      borderWidth: 1,
    },
  ],
};

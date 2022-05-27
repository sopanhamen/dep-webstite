export const deTrackerActionType = {
  SET_LOADING_LIST: '[DE Tracker] fetching processing',
  SET_LOADING_SUBMIT: '[DE Tracker] submiting processing',

  GET_PILLAR_TRACKER_LIST: '[GET_PILLAR_TRACKER_LIST] set pillar tracker list',
  SET_PILLAR_DETAIL: '[SET_PILLAR_DETAIL] set pillars details',

  SET_DE_TRACKER_QUERIES: '[DE Tracker] set DE Tracker list queries',
  RESET_DE_TRACKER_QUERIES: '[DE Tracker] reset DE Tracker list queries',
  GET_DE_TRACKER_LIST: '[DE Tracker] set DE Tracker list',

  SET_CURRENT_CHART_TYPE:
    '[DE Tracker] set add tracker chart type (form array)',
  SET_IMPORTED_FILES: '[DE Tracker] set add tracker import file (form array)',
  SET_CHARTS_DATA: '[DE Tracker] set add tracker chart data (form array)',
  SET_TRACKER_BY_PILLARS_LOCAL_STATES:
    '[SET_TRACKER_BY_PILLARS_LOCAL_STATES] set pillars de-tracker local states',
  SET_TRACKER_BY_PILLARS_QUERIES: '[DE Tracker] set DE Tracker list queries',
  RESET_TRACKER_BY_PILLARS_QUERIES:
    '[DE Tracker] reset DE Tracker list queries',
  GET_TRACKER_BY_PILLARS_LIST: '[DE Tracker] set DE Tracker list',
};

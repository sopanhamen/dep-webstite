export const projectActionType = {
  /*========== Loading ==========*/
  SET_LOADING_LIST: '[PROJECT] fetching processing',
  SET_LOADING_SUBMIT: '[PROJECT] submiting processing',

  /*========== List ==========*/
  SET_PROJECT_LOCAL_STATES: '[PROJECT] set project list local states',
  SET_PROJECT_QUERIES: '[PROJECT] set project list queries',
  RESET_PROJECT_QUERIES: '[PROJECT] reset project list queries',
  GET_PROJECT_LIST: '[PROJECT] get project list success',
  RESET_PROJECTS: '[reset project modal]',

  /*========== Create ==========*/
  CREATE_PROJECTS_REQUEST: '[create project] request',
  CREATE_PROJECTS_SUCCESS: '[create project] success',
  CREATE_PROJECTS_FAILED: '[create project] failed',

  /*========== Details CMS ==========*/
  GET_PROJECTS_CMS_REQUEST: '[get project cms] request',
  GET_PROJECTS_CMS_SUCCESS: '[get project cms] success',
  GET_PROJECTS_CMS_FAILED: '[get project cms] failed',

  /*========== Detail ==========*/
  GET_PROJECT_DETAIL: '[project detail] request',
};

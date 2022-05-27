import { dateGroupFilterValue } from '@shared/components/filters/date-group-filter';
import { metadataConstant } from '@shared/constant';
import { ISharedCommonQueries } from '@shared/interfaces';
import { IProjectDetail, Project } from '@shared/models/project.model';
import { projectActionType } from './project.action-types';

export interface ProjectState {
  data: Project[];
  isCreateDone?: boolean;
  isFetching: boolean;
  isSubmitting: boolean;
  localStates: ISharedCommonQueries;
  queries: ISharedCommonQueries;
  projectDetail: IProjectDetail | null;
  projectInfoCMS: Project;
}

const initialQueries: ISharedCommonQueries = {
  ...metadataConstant,
  search: '',
  page: 1,
  dateType: dateGroupFilterValue.CUSTOM.dateType,
  startCreatedAt: dateGroupFilterValue.CUSTOM.startDate,
  endCreatedAt: dateGroupFilterValue.CUSTOM.endDate,
  statuses: ['ACTIVE'],
  pillars: [],
  sectors: [],
  owners: [],
  partners: [],
};

export const projectInitialStates: ProjectState = {
  data: [],
  isCreateDone: false,
  isFetching: false,
  isSubmitting: false,
  queries: { ...initialQueries },
  localStates: { page: 1, total: 0 },
  projectDetail: null,
  projectInfoCMS: new Project({}),
};

const ProjectReducer = (state = projectInitialStates, action: any) => {
  switch (action.type) {
    /*========== Loading ==========*/
    case projectActionType.SET_LOADING_LIST:
      return { ...state, isFetching: action.payload };

    case projectActionType.SET_LOADING_SUBMIT:
      return { ...state, isSubmitting: action.payload };

    /*========== List ==========*/
    case projectActionType.SET_PROJECT_LOCAL_STATES:
      return {
        ...state,
        localStates: { ...state.localStates, ...action.payload },
      };

    // Start of Insert Created Project
    case projectActionType.CREATE_PROJECTS_REQUEST:
      return { ...state, isCreateDone: false, isSubmitting: true };

    case projectActionType.CREATE_PROJECTS_SUCCESS:
      return {
        ...state,
        data: [...action.data.projects],
        isCreateDone: true,
        isSubmitting: false,
      };

    case projectActionType.GET_PROJECTS_CMS_FAILED:
      return { ...state, isCreateDone: true, isSubmitting: false };
    // End of Insert Created Project

    // Start of Reset Project
    case projectActionType.RESET_PROJECTS:
      return { ...state, isCreateDone: false, isSubmitting: false };
    // End of Reset Project

    // Start of Insert Created Project
    case projectActionType.GET_PROJECTS_CMS_REQUEST:
      return { ...state, isFetching: false, projectInfoCMS: new Project({}) };

    case projectActionType.GET_PROJECTS_CMS_SUCCESS:
      return {
        ...state,
        isFetching: false,
        projectInfoCMS: action.data.project,
      };

    case projectActionType.GET_PROJECTS_CMS_FAILED:
      return { ...state, isFetching: false };

    // End of Insert Created Project

    case projectActionType.SET_PROJECT_QUERIES:
      return { ...state, queries: { ...state.queries, ...action.payload } };

    case projectActionType.RESET_PROJECT_QUERIES:
      return { ...state, queries: initialQueries };

    case projectActionType.GET_PROJECT_LIST:
      return {
        ...state,
        data: action.payload,
      };

    case projectActionType.GET_PROJECT_DETAIL:
      return { ...state, projectDetail: action.data as any };
    default:
      return state;
  }
};

export default ProjectReducer;

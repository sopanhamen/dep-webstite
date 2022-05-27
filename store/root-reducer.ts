import { MClassification } from '@shared/models/classification.model';
import { combineReducers } from 'redux';
import ClassificationReducer, {
  ClassificationStates,
} from 'store/admin/classification/classification.reducer';
import ResourceHubReducer, {
  ResourceHubState,
} from 'store/admin/resource-hub/resource-hub.reducer';
import aboutUsReducer, {
  AboutUsState,
} from './admin/about-us/about-us.reducers';
import BannerReducer, { BannerState } from './admin/banners/banner.reducers';
import DETrackerReducer, {
  DETrackerState,
} from './admin/de-trackers/de-trackers.reducers';
import FilterReducer, { AllFilterState } from './admin/filter/filter.reducers';
import NewsReducer, { NewsState } from './admin/news/news.reducers';
import ProjectReducer, { ProjectState } from './admin/project/project.reducers';
import userManagementReducer, {
  UserManagementState,
} from './admin/user-management/user-management.reducers';
import AuthReducer, { AuthState } from './auth/auth.reducer';
import ContactsReducer, {
  ContactState,
} from './client/reducers/contacts.reducer';
import TestCMSReducer, {
  TestCMSState,
} from './test-app/test-cms/test-cms.reducers';

export interface StoreState {
  auth: AuthState;
  contactsReducer: ContactState;
  project: ProjectState;
  news: NewsState;
  userManagement: UserManagementState;
  banner: BannerState;
  classification: ClassificationStates<MClassification>;
  testCMS: TestCMSState;
  filter: AllFilterState;
  resourceHub: ResourceHubState;
  deTrackers: DETrackerState;
  aboutUs: AboutUsState;
}

const rootReducer = combineReducers<StoreState>({
  auth: AuthReducer,
  contactsReducer: ContactsReducer,
  project: ProjectReducer,
  news: NewsReducer,
  userManagement: userManagementReducer,
  banner: BannerReducer,
  classification: ClassificationReducer,
  testCMS: TestCMSReducer,
  filter: FilterReducer,
  resourceHub: ResourceHubReducer,
  deTrackers: DETrackerReducer,
  aboutUs: aboutUsReducer,
});

export default rootReducer;

export type RootState = ReturnType<typeof rootReducer>;

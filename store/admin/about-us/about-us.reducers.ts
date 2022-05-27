import { combineReducers } from 'redux';
import AboutTeamReducer, {
  AboutTeamState,
} from './about-teams/about-team.reducers';
import CompanyBackgroundReducer, {
  CompanyBackgroundState,
} from './company-background/company-background.reducers';

export interface AboutUsState {
  companyBackground: CompanyBackgroundState;
  aboutTeams: AboutTeamState;
}

const aboutUsReducer = combineReducers<AboutUsState>({
  companyBackground: CompanyBackgroundReducer,
  aboutTeams: AboutTeamReducer,
});

export default aboutUsReducer;

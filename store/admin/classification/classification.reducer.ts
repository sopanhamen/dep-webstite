import { MClassification } from '@shared/models/classification.model';
import { classificationTypes } from 'store/admin/classification/classification.action-type';

export interface ClassificationStates<T> {
  sectors: T[];
  pillars: T[];
  organizations: T[];
  projectStatus: T[];
  referenceFileTypes: T[];
}

const initialStates: ClassificationStates<MClassification> = {
  sectors: [],
  pillars: [],
  organizations: [],
  projectStatus: [],
  referenceFileTypes: [],
};

const ClassificationReducer = (states = initialStates, action: any) => {
  switch (action.type) {
    case classificationTypes.GET_SECTORS:
      return { ...states, sectors: action.payload };
    case classificationTypes.GET_PILLARS:
      return { ...states, pillars: action.payload };
    case classificationTypes.GET_ORGANIZATIONS:
      return { ...states, organizations: action.payload };
    case classificationTypes.GET_PROJECT_STATUS:
      return { ...states, projectStatus: action.payload };
    case classificationTypes.GET_REFERENCE_FILE_TYPES:
      return { ...states, referenceFileTypes: action.payload };

    default:
      return states;
  }
};

export default ClassificationReducer;

import { IEventBody } from '@components/admin/user-management/events/add-event';
import { metadataConstant } from '@shared/constant';
import { IMetadata, IReducerAction } from '@shared/interfaces';
import { MEvent } from '@shared/models/user-management/event.model';
import { eventTypes } from './event.action-types';

export interface EventState {
  events: MEvent[];
  isFetching: boolean;
  metadata: IMetadata;
  currentEvent: MEvent | null;
  eventDetail: IEventBody;
}

const initialStates: EventState = {
  events: [],
  isFetching: false,
  metadata: metadataConstant,
  currentEvent: null,
  eventDetail: {},
};

const EventsReducer = (
  state = initialStates,
  action: IReducerAction<MEvent>,
) => {
  switch (action.type) {
    case eventTypes.GET_EVENTS_REQUEST:
      return { ...state, isFetching: true };
    case eventTypes.GET_EVENTS_SUCCESS:
      return {
        ...state,
        events: action.data.events,
        isFetching: false,
        metadata: action.data.metadata,
      };
    case eventTypes.GET_EVENTS_FAILED:
      return { ...state, isFetching: false };
    case eventTypes.TOGGLE_EVENTS_REQUEST:
    case eventTypes.TOGGLE_EVENTS_FAILED:
      return { ...state };
    case eventTypes.TOGGLE_EVENTS_SUCCESS:
      return {
        ...state,
        events: [...action.data.events],
      };

    case eventTypes.GET_EVENT_REQUEST:
      return { ...state, isFetching: false };
    case eventTypes.GET_EVENT_SUCCESS:
      return {
        ...state,
        currentEvent: { ...action.data.events[0] },
      };
    case eventTypes.GET_EVENT_FAILED:
      return { ...state };
    case eventTypes.GET_EVENT_DETAIL:
      return { ...state, eventDetail: action.data as any };
    default:
      return state;
  }
};

export default EventsReducer;

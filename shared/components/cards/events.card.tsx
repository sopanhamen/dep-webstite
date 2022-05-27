import { ICON_URL } from '@shared/constant';
import { formatISODate } from '@shared/custom-function/conversion';
import { ELanguage } from '@shared/enum';
import { ICommonQueries } from '@shared/interfaces';
import * as _ from 'lodash';
import moment from 'moment';
import useTranslation from 'next-translate/useTranslation';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { IEvents } from 'pages/admin/user-management/events';
import { useEffect, useState } from 'react';
import { Collapse } from 'react-bootstrap';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import eventActions from 'store/admin/user-management/events/event.actions';
import AuthAction from 'store/auth/auth.action';
import { StoreState } from 'store/root-reducer';

type IEventsCard = Pick<
  IEvents,
  'currentEvent' | 'getEventList' | 'getAuthorization' | 'getPublicToken'
>;

function EventsCard({
  currentEvent,
  getEventList,
  getAuthorization,
  getPublicToken,
}: IEventsCard) {
  let { t } = useTranslation();

  const router = useRouter();

  const [showMoreLess, setshowMoreLess] = useState(false);

  const [showEvents, setShowEvents] = useState(true);

  useEffect(() => {
    const payload: ICommonQueries = {
      limit: 1,
      current: moment().startOf('day').toISOString(),
    };
    getAuthorization().then(() => {
      getPublicToken().then(() => {
        getEventList(payload, router.locale as ELanguage);
      });
    });
  }, [router?.locale]);

  useEffect(() => {
    setShowEvents(!_.isEmpty(currentEvent));
  }, [currentEvent]);

  return (
    <article className="event-card wow bounceInRight" data-wow-delay=".5s">
      {showEvents && (
        <>
          <section className="event-card__top position-relative">
            <div className="d-flex">
              <Image
                src={ICON_URL.ANNOUNCEMENT}
                height={114}
                width={108.19}
                alt="Announcement Icon"
              />
            </div>
            <div className="event-card__top__info">
              <>
                <h5>
                  <b>{currentEvent?.title}</b>
                </h5>
                <p
                  dangerouslySetInnerHTML={{
                    __html: String(currentEvent?.description),
                  }}
                />
              </>
              <div>
                <button
                  className="admin-btn-add"
                  onClick={() => setshowMoreLess(!showMoreLess)}
                >
                  {showMoreLess
                    ? t('common:event.showLess')
                    : t('common:event.showMore')}
                </button>
              </div>
            </div>
            <div className="d-flex">
              <Image
                src={currentEvent?.imageUrl ?? ICON_URL.BROKEN}
                height={109}
                width={109}
                alt="Announcement"
              />
            </div>
            <p
              className="event-card__close color-blue cursor-pointer"
              onClick={() => setShowEvents(false)}
            >
              x
            </p>
          </section>

          <Collapse in={showMoreLess}>
            <section className="event-card__bottom">
              <div className="event-card__bottom__wrapper">
                <div className="calendar-container d-flex">
                  <div className="calendar">
                    <div className="calendar__header center position-relative">
                      <span>
                        {formatISODate(
                          String(currentEvent?.startDate),
                          'MMMM',
                        ).substring(0, 3)}
                      </span>
                    </div>
                    <div className="calendar__body center">
                      <span className="center">
                        {formatISODate(String(currentEvent?.startDate), 'dddd')}
                      </span>
                      <hr />
                      <span>
                        {formatISODate(String(currentEvent?.startDate), 'Do')}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="width-70-p">
                  <h5 className="mb-3">
                    <b>{currentEvent?.title}</b>
                  </h5>
                  <div className="event-card__bottom__info">
                    <div className="event-card__bottom__info__left">
                      <div className="details-container">
                        <i className="fa fa-map-marker" aria-hidden="true" />
                        <span>
                          <p>{t('common:event.location')}</p>
                          {currentEvent?.locationLink}
                        </span>
                      </div>
                      <div className="details-container">
                        <i className="fa fa-video-camera" aria-hidden="true" />
                        <span>
                          <p>{t('common:event.zoom')}</p>
                          {currentEvent?.meetingLink}
                        </span>
                      </div>
                    </div>
                    <div className="event-card__bottom__info__right">
                      <div className="details-container">
                        <i className="fa fa-calendar" aria-hidden="true" />
                        <span>
                          <p>{t('common:event.start')}</p>
                          <p>
                            {formatISODate(String(currentEvent?.startDate))} -
                            {moment().format('HH:mm')}
                          </p>
                        </span>
                      </div>
                      <div className="details-container">
                        <i className="fa fa-calendar" aria-hidden="true" />
                        <span>
                          <p>{t('common:event.ends')}</p>
                          <p>
                            {formatISODate(String(currentEvent?.endDate))} -
                            {moment().format('HH:mm')}
                          </p>
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </Collapse>
        </>
      )}
    </article>
  );
}

const mapStateToProps = (store: StoreState) => {
  const { currentEvent, isFetching } = store.userManagement.event;

  return { currentEvent, isFetching };
};

const mapDispatchToProps = (dispatch: Dispatch) => {
  const { getEventHomepage } = eventActions;
  const { getAuthorization, getPublicToken } = AuthAction;

  return {
    getEventList: (payload: ICommonQueries, language: ELanguage) =>
      dispatch(getEventHomepage(payload, language) as any),
    getAuthorization: () => dispatch(getAuthorization() as any),
    getPublicToken: () => dispatch(getPublicToken() as any),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(EventsCard);

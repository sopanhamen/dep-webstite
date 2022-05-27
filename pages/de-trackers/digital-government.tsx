import Index from './index';
import Sector from '@components/de-trackers/sector';
import useTranslation from 'next-translate/useTranslation';

function DigitalGovernment(): JSX.Element {
  let { t } = useTranslation();

  return (
    <Index>
      <div>
        <Sector />
        <div className="container">
          <div className="blk-chart text-center mt-5 mb-3">
            <img
              src="/assets/de-trackers/Screen Shot 2021-10-27 at 6.56 1.png"
              alt="image"
            />
          </div>

          <h6 className="color-blue fw-bold my-3">Digital Government</h6>
          <p>
            The 2030 Agenda for Sustainable Development and the Sustainable
            Development Goals (SDGs) have embraced the spread of Information and
            Communication Technologies (ICTs) and global interconnectedness as
            having great potential to accelerate human progress, to bridge the
            digital divide and to develop knowledge societies. Governments
            worldwide are now cognizant of the power of ICTs and digital
            government for the advancement and transformation of public
            institutions, and the public-sector landscape more broadly, and
            their service delivery capabilities. Digital government can play a
            role in building effective, inclusive and accountable institutions
            to support policy making and service delivery for the SDGs. Our
            Division supports digital government development for responsive,
            efficient, effective and equitable delivery of public service to all
            people, building public trust and ensuring transparency,
            participation and collaboration in the development process. In the
            context of the rapid pace and change in technologies relevant to
            digital government, this work is essential. ICTs are constantly
            evolving and are dramatically transforming societies, cultures and
            economies. The world has seen rapid advancements and changes of
            technologies in the ICT ecosystem such as social media, big data and
            the Internet of Things. Mobile technologies and broadband
            connectivity, already common in developed countries, are now also
            extending rapidly in developing countries and emerging markets.
            Social networks have made profound changes and impacts on the ways
            people interact with one another and with their governments. Open
            government data and cloud computing, coupled with the use of mobile
            devices, have further enriched the ICT ecosystem.
          </p>
          <div className="row g-3 my-3">
            <div className="col-12 col-md-6">
              <div className="box-list position-relative w-full">
                <img
                  className="img-fluid h-100 w-100"
                  src="/assets/de-trackers/Rectangle 1180.png"
                  alt="photo"
                />
                <div className="position-absolute top-0 start-0 h-100 w-100 bg-gradient-light-blue">
                  <p className="text-white center h-100 fs-3 fw-bold">
                    {t('common:de_government.e_goverment')}
                  </p>
                </div>
              </div>
            </div>
            <div className="col-12 col-md-6">
              <div className="box-list position-relative">
                <img
                  className="img-fluid h-100 w-100"
                  src="/assets/de-trackers/Rectangle 1180 (1).png"
                  alt="photo"
                />
                <div className="position-absolute top-0 start-0 h-100 w-100 bg-gradient-light-green">
                  <p className="text-white center h-100 fs-3 fw-bold">
                    {t('common:de_government.open_government_data')}
                  </p>
                </div>
              </div>
            </div>
            <div className="col-12 col-md-6">
              <div className="box-list position-relative">
                <img
                  className="img-fluid h-100 w-100"
                  src="/assets/de-trackers/Rectangle 1180 (2).png"
                  alt="photo"
                />
                <div className="position-absolute top-0 start-0 h-100 w-100 bg-gradient-light-orange">
                  <p className="text-white center h-100 fs-3 fw-bold">
                    {t('common:de_government.WSIS')}
                  </p>
                </div>
              </div>
            </div>
            <div className="col-12 col-md-6">
              <div className="box-list position-relative">
                <img
                  className="h-100 w-100"
                  src="/assets/de-trackers/Rectangle 1180 (3).png"
                  alt="photo"
                />
                <div className="position-absolute top-0 start-0 h-100 w-100 bg-gradient-light-gray">
                  <p className="text-white center h-100 fs-3 fw-bold">
                    {t('common:de_government.good_practices')}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Index>
  );
}
export default DigitalGovernment;

import useTranslation from 'next-translate/useTranslation';
import Image from 'next/image';

function DigitalEconomyHelp(): JSX.Element {
  let { t } = useTranslation();

  return (
    <section className="dep-help">
      <div className="dep-help__container">
        <div className="center wow fadeIn" data-wow-delay="1s">
          <Image
            src="/assets/images/dep-help.webp"
            width={389}
            height={345}
            alt="DEP help"
          />
        </div>
        <div className="dep-help__container__info">
          <div className="dep-help__container__info__top text-center">
            <h1>{t('common:dep_help.title')}</h1>
            <p>{t('common:dep_help.description')}</p>
          </div>
          <div className="dep-help__container__info__bottom">
            <div className="objective wow fadeInRight" data-wow-delay=".40s">
              <Image
                src="/assets/icons/triangle-red.svg"
                width={34}
                height={34}
                alt="Red Triangle"
              />
              <p>{t('common:dep_help.objective_one')}</p>
            </div>
            <div className="objective wow fadeInRight" data-wow-delay=".60s">
              <Image
                src="/assets/icons/triangle-red.svg"
                width={34}
                height={34}
                alt="Red Triangle"
              />
              <p>{t('common:dep_help.objective_two')}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default DigitalEconomyHelp;

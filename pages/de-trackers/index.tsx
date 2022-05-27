import Pillar from '@components/de-trackers/pillar';
import Hero from '@shared/components/web-layout/hero';
import { EWebLayout } from '@shared/enum';
interface IWebLayout {
  children: React.ReactNode;
}

function Index({ children }: IWebLayout): JSX.Element {
  return (
    <>
      <Hero
        backgroundImage="/assets/backgrounds/homepage.png"
        titleToTranslate={EWebLayout.DE_TRACKER}
      />

      <Pillar />
      {children}
    </>
  );
}
export default Index;

import Footer from '@shared/components/web-layout/footer';
import Header from '@shared/components/web-layout/header';
import WOW from '@shared/components/wow/wow';

interface IWebLayout {
  children: React.ReactNode;
}

function WebLayout({ children }: IWebLayout): JSX.Element {
  return (
    <>
      <Header />
      <WOW />
      <div className="p-t-80">{children}</div>
      <Footer />
    </>
  );
}

export default WebLayout;

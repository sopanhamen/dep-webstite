import { useEffect } from 'react';

function WOW(): JSX.Element {
  // DOCS: https://blog.micaelrobles.com/using-wow-js-with-next-js/
  useEffect(() => {
    const isServer = typeof window === 'undefined';
    const WOW = !isServer ? require('wow.js') : null;

    new WOW().init();
  }, []);

  return <></>;
}

export default WOW;

import Image from 'next/image';

export default function Custom404() {
  return (
    <section className="center h-100-vh">
      <Image
        src="/assets/backgrounds/404.svg"
        alt="404"
        height={806}
        width={554}
      />
    </section>
  );
}

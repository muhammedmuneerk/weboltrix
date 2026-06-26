export default function PageHero({ eyebrow, title, children }) {
  return (
    <section className="hero-mesh relative isolate overflow-hidden pt-36">
      <div className="fine-grid absolute inset-0 -z-10" />
      <div className="container-premium pb-20 pt-12 sm:pb-24 lg:pb-28">
        {eyebrow && <p className="hero-kicker eyebrow">{eyebrow}</p>}
        <h1 className="hero-title mt-5 max-w-5xl text-4xl font-black leading-[0.98] tracking-tight text-balance sm:text-7xl sm:leading-[0.92] lg:text-8xl">
          {title}
        </h1>
        {children && <div className="hero-copy mt-8 max-w-3xl text-lg leading-8 text-white/62 sm:text-xl">{children}</div>}
      </div>
    </section>
  );
}

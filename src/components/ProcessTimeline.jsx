export default function ProcessTimeline({ steps }) {
  return (
    <div className="relative mt-14">
      <div className="absolute left-8 top-0 h-full w-px bg-white/10 md:hidden" />
      <div className="absolute left-0 right-0 top-8 hidden h-px bg-gradient-to-r from-transparent via-white/25 to-transparent md:block" />
      <div className="stagger-grid grid gap-5 md:grid-cols-4">
        {steps.map((step, index) => (
          <div
            key={step}
            className="relative rounded-[1.7rem] border border-white/10 bg-white/[0.045] p-6 transition duration-500 hover:-translate-y-2 hover:border-white/25"
          >
            <span className="relative z-10 flex h-16 w-16 items-center justify-center rounded-full border border-white/15 bg-ink text-sm font-black text-white shadow-glow">
              0{index + 1}
            </span>
            <h3 className="mt-10 text-2xl font-black">{step}</h3>
            <p className="mt-4 text-sm leading-7 text-white/52">
              {[
                "We learn your business, audience, offer, and customer journey.",
                "We shape a premium layout with clear hierarchy and strong spacing.",
                "We build the responsive React site with fast, clean Tailwind UI.",
                "We polish, test, and prepare the website for real customer enquiries.",
              ][index]}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function ProcessTimeline({ steps }) {
  const stepText = [
    "We learn your business, audience, offer, and customer journey.",
    "We shape a premium layout with clear hierarchy and strong spacing.",
    "We build the responsive React site with fast, clean Tailwind UI.",
    "We polish, test, and prepare the website for real customer enquiries.",
  ];

  return (
    <div className="relative mt-14">
      {/* Mobile — vertical connected stepper, hidden at md+ */}
      <div className="relative md:hidden">
        <div className="absolute left-[1.375rem] top-6 bottom-6 w-px bg-white/10" />
        <div className="flex flex-col gap-5">
          {steps.map((step, index) => (
            <div key={step} className="relative flex items-start gap-4">
              <span className="relative z-10 flex h-11 w-11 flex-none items-center justify-center rounded-full border border-white/15 bg-ink text-xs font-black text-white shadow-glow">
                0{index + 1}
              </span>
              <div className="flex-1 rounded-[1.5rem] border border-white/10 bg-white/[0.045] p-5 transition duration-500">
                <h3 className="text-xl font-black">{step}</h3>
                <p className="mt-3 text-sm leading-7 text-white/52">{stepText[index]}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Desktop — untouched, hidden below md */}
      <div className="hidden md:block">
        <div className="absolute left-0 right-0 top-14 grid grid-cols-4 gap-5">
          {steps.map((_, index) => (
            <div key={index} className="relative h-px">
              {index < steps.length - 1 && (
                <div className="absolute -right-5 top-0 h-px w-5 bg-white/40" />
              )}
            </div>
          ))}
        </div>

        <div className="stagger-grid grid grid-cols-4 gap-5">
          {steps.map((step, index) => (
            <div
              key={step}
              className="relative rounded-[1.7rem] border border-white/10 bg-white/[0.045] p-6 transition duration-500 hover:-translate-y-2 hover:border-white/25"
            >
              <span className="relative z-10 flex h-16 w-16 items-center justify-center rounded-full border border-white/15 bg-ink text-sm font-black text-white shadow-glow">
                0{index + 1}
              </span>
              <h3 className="mt-10 text-2xl font-black">{step}</h3>
              <p className="mt-4 text-sm leading-7 text-white/52">{stepText[index]}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
export default function SectionHeading({ eyebrow, title, text, align = "left" }) {
  return (
    <div className={align === "center" ? "mx-auto max-w-4xl text-center" : "max-w-4xl"}>
      {eyebrow && <p className="eyebrow">{eyebrow}</p>}
      <h2 className="mt-5 text-4xl font-black leading-tight tracking-tight text-balance sm:text-6xl sm:leading-[0.98] lg:text-7xl">
        {title}
      </h2>
      {text && <p className="mt-7 text-lg leading-9 text-white/58 sm:text-xl sm:leading-10">{text}</p>}
    </div>
  );
}

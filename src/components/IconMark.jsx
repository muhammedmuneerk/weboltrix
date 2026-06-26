export default function IconMark({ label, index = 0 }) {
  const icons = [
    <span key="cinematic" className="h-4 w-4 rounded-sm border border-current" />,
    <span key="mobile" className="h-5 w-3 rounded-sm border border-current" />,
    <span key="fast" className="h-px w-5 bg-current before:block before:h-px before:w-3 before:-translate-y-2 before:bg-current after:block after:h-px after:w-3 after:translate-y-2 after:bg-current" />,
    <span key="conversion" className="h-4 w-4 rotate-45 border border-current" />,
    <span key="whatsapp" className="h-4 w-4 rounded-full border border-current after:mt-3 after:block after:h-2 after:w-2 after:rounded-sm after:border-b after:border-l after:border-current" />,
  ];

  return (
    <span
      aria-hidden="true"
      className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-white/15 bg-white/[0.06] text-bone shadow-glow"
      title={label}
    >
      {icons[index % icons.length]}
    </span>
  );
}

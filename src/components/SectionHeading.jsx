/**
 * SectionHeading
 *
 * layout="stack" (DEFAULT) -> eyebrow / title / text stacked. Honors `align`.
 *                             This is the original behavior used site-wide.
 * layout="split"           -> eyebrow + title on the left, text on the right
 *                             (stacks on mobile, side by side from lg).
 *
 * To add a new layout, add a case to renderLayout() below. Existing
 * pages never pass `layout`, so they always get "stack".
 *
 * Optional per-use overrides: className (wrapper), titleClassName, textClassName.
 */

const cx = (...parts) => parts.filter(Boolean).join(" ");

const TITLE_BASE =
  "mt-5 text-4xl font-black leading-tight tracking-tight text-balance sm:text-6xl sm:leading-[0.98] lg:text-7xl";

export default function SectionHeading({
  eyebrow,
  title,
  text,
  align = "left",
  layout = "stack",
  className = "",
  titleClassName = "",
  textClassName = "",
}) {
  if (layout === "split") {
    return (
      <div
        className={cx(
          "grid gap-6 lg:grid-cols-[1.1fr_0.9fr] lg:items-end lg:gap-16",
          className
        )}
      >
        <div>
          {eyebrow && <p className="eyebrow">{eyebrow}</p>}
          <h2 className={cx(TITLE_BASE, titleClassName)}>{title}</h2>
        </div>
        {text && (
          <p
            className={cx(
              "text-lg leading-9 text-white/58 sm:text-xl sm:leading-10",
              textClassName
            )}
          >
            {text}
          </p>
        )}
      </div>
    );
  }

  // Default: "stack" (original layout, unchanged)
  return (
    <div
      className={cx(
        align === "center" ? "mx-auto max-w-4xl text-center" : "max-w-4xl",
        className
      )}
    >
      {eyebrow && <p className="eyebrow">{eyebrow}</p>}
      <h2 className={cx(TITLE_BASE, titleClassName)}>{title}</h2>
      {text && (
        <p
          className={cx(
            "mt-7 text-lg leading-9 text-white/58 sm:text-xl sm:leading-10",
            textClassName
          )}
        >
          {text}
        </p>
      )}
    </div>
  );
}
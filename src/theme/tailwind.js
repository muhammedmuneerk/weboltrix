// Integration only: all color decisions live in the two portable CSS files.
import defaultTheme from "tailwindcss/defaultTheme.js";
const roles = ["focus-outline","focus-ring","content","heading","on-emphasis","on-emphasis-soft","line","contrast-line","layer","recess","canvas","emphasis","emphasis-panel","signal","action","action-bright","action-foreground","inverse-action","inverse-action-alt","inverse-foreground","inverse-heading","inverse-hover","selection","on-selection","scrim","glow","shadow","media-content","media-heading","editorial-content","editorial-accent","surface-editorial","surface-sidebar","on-selection-alt","surface-recessed","surface-media-frame","surface-hero-mid","surface-panel","surface-control-idle","surface-raised","surface-control-active","muted-solid","ambient","object-base","object-edge","subtle-solid"];
const floors = {"focus-ring":"focus-ring","content":"content","on-emphasis-soft":"contrast","line":"line","contrast-line":"line","media-content":"media","editorial-content":"content"};
// Keep shadow-glow exclusively a shadow geometry utility, not a shadow color.
export const colors = Object.fromEntries(roles.filter(role => role !== "glow").map(role => [role,
  floors[role]
    ? ({ opacityValue = "1" }) => `rgba(var(--${role}-rgb), max(${opacityValue}, var(--${floors[role]}-alpha-floor)))`
    : `rgba(var(--${role}-rgb), <alpha-value>)`
]));
colors["inverse-foreground"] = ({opacityValue = "1"}) => `rgba(var(--inverse-foreground-rgb), max(${opacityValue}, var(--content-alpha-floor)))`;
export const boxShadow = {
  ...Object.fromEntries(Object.entries(defaultTheme.boxShadow).map(([k,v]) => [k, v.replace(/rgb\(0 0 0 \/ ([\d.]+)\)/g, "rgba(var(--shadow-rgb), $1)")])),
  premium: "0 24px 90px var(--shadow-a018)",
  glow: "0 0 70px var(--glow-a015)",
};
// Original framework defaults stay configurable through the portable palette.
export const frameworkColors = { gray: {200:"rgba(var(--rgb-rgb-229-231-235), <alpha-value>)",400:"rgba(var(--rgb-rgb-156-163-175), <alpha-value>)"} };
export const ringColor = { DEFAULT: ({opacityValue}) => `rgba(var(--focus-default-rgb), ${opacityValue})` };
export const ringOffsetColor = { DEFAULT: "var(--focus-offset)" };

// Background scrims may become more opaque; gradient endpoints keep exact RGBA.
export const backgroundColor = {
  scrim: ({opacityValue = "1"}) => `rgba(var(--scrim-rgb), max(${opacityValue}, var(--scrim-alpha-floor)))`,
  layer: ({opacityValue = "1"}) => `rgba(var(--layer-rgb), max(${opacityValue}, var(--layer-alpha-floor)))`,
};

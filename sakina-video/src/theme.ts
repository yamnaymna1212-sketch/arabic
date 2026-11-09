import { loadFont } from "@remotion/fonts";
import { Easing, interpolate, staticFile } from "remotion";

// Fonts ship with the project (public/fonts) so rendering works offline.
const font = (family: string, file: string, weight: string) =>
  loadFont({ family, url: staticFile(`fonts/${file}`), weight });

font("SakinaKufi", "ReemKufi-700.woff2", "700");
font("SakinaKufiLatin", "ReemKufi-latin-700.woff2", "700");
font("SakinaAmiri", "Amiri-400.woff2", "400");
font("SakinaAmiri", "Amiri-700.woff2", "700");
font("SakinaPlex", "Plex-500.woff2", "500");
font("SakinaPlexLatin", "Plex-latin-500.woff2", "500");

export const KUFI = "SakinaKufi, SakinaKufiLatin, sans-serif";
export const AMIRI = "SakinaAmiri, serif";
export const PLEX = "SakinaPlex, SakinaPlexLatin, sans-serif";

// Sakina palette: dawn night, emerald, brass gold, sand, clay
export const C = {
  night: "#0B1C22",
  night2: "#132C34",
  emerald: "#2E6B5C",
  gold: "#D9B25F",
  goldDeep: "#B88B3A",
  sand: "#EFE4CF",
  clay: "#A8644A",
  skin: "#C99A76",
  skinShade: "#B5845F",
  hair: "#1E1A17",
  jacket: "#4E5B3A",
  jacketShade: "#3E4A2E",
  shirt: "#EFE4CF",
  trousers: "#262B2F",
};

export const FPS = 30;
// Narration starts this many seconds into the video
export const VO_OFFSET = 0.5;

export const EASE = Easing.bezier(0.16, 1, 0.3, 1);
export const INOUT = Easing.bezier(0.65, 0, 0.35, 1);

/** Clamped interpolate over seconds. */
export const at = (
  t: number,
  input: number[],
  output: number[],
  easing: (n: number) => number = EASE,
) =>
  interpolate(t, input, output, {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing,
  });

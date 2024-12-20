export const ASCII_CHARS = {
  dark: "@#8&WM",
  medium: "$%0?*+",
  light: "=;:,-",
  veryLight: ".... ",
};

export const calculateAspectRatio = (
  width: number,
  height: number,
  targetWidth: number
): { width: number; height: number } => {
  const ratio = height / width;
  // ASCII characters are taller than they are wide, so we compensate
  const charAspectRatio = 0.5;
  return {
    width: targetWidth,
    height: Math.floor(targetWidth * ratio * charAspectRatio),
  };
};

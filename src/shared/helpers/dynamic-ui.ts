const blur = (element: HTMLElement | null, strength: number): void => {
  if (!element) {
    return;
  }

  element.style.filter = `blur(${strength}px)`;
};

export const blurApp = (strength: number = 5): void => {
  // const appElement: HTMLElement | null = document.querySelector(".App");
  const elements = document.querySelectorAll(
    ".App > * > * > *:not(.background-dimm)"
  );

  elements.forEach((element: any) => blur(element, strength));
  // blur(appElement, strength);
};

export const unBlurApp = (): void => {
  const elements = document.querySelectorAll(
    ".App > * > * > *:not(.background-dimm)"
  );

  elements.forEach((element: any) => blur(element, 0));
};

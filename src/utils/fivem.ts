// https://forum.cfx.re/t/typescript-vs-lua-questions/612483/11
export const Delay = (ms: number): Promise<void> =>
  new Promise((resolve) => setTimeout(resolve, ms));

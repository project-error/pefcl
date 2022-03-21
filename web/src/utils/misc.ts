import { resourceDefaultName } from './constants';

declare global {
  interface Window {
    invokeNative(): void;
    GetParentResourceName?: () => string;
  }
}

// and not CEF
export const isEnvBrowser = (): boolean => !window.invokeNative;
export const getResourceName = () => window.GetParentResourceName?.() ?? resourceDefaultName;

// Basic no operation function
export const noop = () => {};

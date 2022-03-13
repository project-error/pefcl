// Will return whether the current environment is in a regular browser

import { resourceDefaultName } from './constants';

// and not CEF
export const isEnvBrowser = (): boolean => !(window as any).invokeNative;

export const getResourceName = () =>
  (window as any).GetParentResourceName
    ? (window as any)?.GetParentResourceName()
    : resourceDefaultName;

// Basic no operation function
export const noop = () => {};

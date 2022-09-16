export type DeepPartial<T> = T extends object
  ? {
      [P in keyof T]?: DeepPartial<T[P]>;
    }
  : T;

export type IdentifierType = 'license' | 'xbox' | 'discord' | 'steam';

export interface PolyZone {
  position: {
    x: number;
    y: number;
    z: number;
  };
  length: number;
  width: number;
  heading: number;
  minZ: number;
  maxZ: number;
}

interface BlipCoords {
  x: number;
  y: number;
  z: number;
}
export interface ResourceConfig {
  general: {
    language: string;
    currency: string;
    identifierType: string;
  };
  frameworkIntegration: {
    enabled: boolean;
    resource: string;
    syncInitialBankBalance: boolean;
  };
  database: {
    profileQueries: boolean;
    shouldSync?: boolean;
  };
  prices: {
    newAccount: number;
  };
  accounts: {
    firstAccountStartBalance: number;
    otherAccountStartBalance: number;
    clearingNumber: string | number;
    maximumNumberOfAccounts: number;
  };
  cash: {
    startAmount: number;
  };
  atms: {
    distance: number;
    props: number[];
    withdrawOptions: number[];
  };
  bankBlips: {
    enabled: boolean;
    name: string;
    colour: number;
    icon: number;
    scale: number;
    display: number;
    shortRange: boolean;
    coords: BlipCoords[];
  };
  atmBlips: {
    enabled: boolean;
    name: string;
    colour: number;
    icon: number;
    scale: number;
    display: number;
    shortRange: boolean;
    coords: BlipCoords[];
  };
  target: {
    enabled: boolean;
    bankZones: PolyZone[];
    type: string;
    debug: boolean;
  };
  debug: {
    level: string;
    mockLicenses: boolean;
  };
}

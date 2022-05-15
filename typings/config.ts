export type DeepPartial<T> = T extends object
  ? {
      [P in keyof T]?: DeepPartial<T[P]>;
    }
  : T;

export type IdentifierType = 'license' | 'xbox' | 'discord' | 'steam';
export interface ResourceConfig {
  general: {
    language: string;
    currency: string;
    identifierType: IdentifierType;
  };
  frameworkIntegration: {
    enabled: boolean;
    resource: string;
  };
  database: {
    profileQueries: boolean;
    shouldSync: boolean;
  };
  prices: {
    newAccount: number;
  };
  accounts: {
    startAmount: number;
    clearingNumber: string | number;
  };
  cash: {
    startAmount: number;
  };
  atms: {
    distance: number;
    props: number[];
    withdrawOptions: number[];
  };
  debug: {
    level: string;
    mockLicenses: boolean;
  };
}

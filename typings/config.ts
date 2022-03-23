export type DeepPartial<T> = T extends object
  ? {
      [P in keyof T]?: DeepPartial<T[P]>;
    }
  : T;
export interface ResourceConfig {
  exports: {
    resourceName: string;
  };
  general: {
    useFrameworkIntegration: boolean;
  };
  database: {
    profileQueries: boolean;
    shouldSync: boolean;
  };

  prices: {
    newAccount: number;
  };
  accounts: {
    defaultAmount: number;
    clearingNumber: string | number;
  };
  transactions: {
    defaultLimit: number;
  };
  cash: {
    defaultAmount: number;
  };
  language: string;
  currency: string;
  debug: {
    level: string;
    mockLicenses: boolean;
  };
}

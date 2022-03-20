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
  debug: {
    level: string;
  };
  prices: {
    newAccount: number;
  };
  accounts: {
    defaultAmount: number;
    clearingNumber: string | number;
  };
  cash: {
    defaultAmount: number;
  };
  language: string;
  currency: string;
}

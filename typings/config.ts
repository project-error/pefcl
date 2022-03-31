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
    language: string;
    currency: string;
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

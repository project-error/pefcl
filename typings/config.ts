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
    defaultName: string;
    defaultAmount: number;
  };
  cash: {
    defaultAmount: number;
  };
  language: string;
  currency: string;
}

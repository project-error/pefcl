export interface ResourceConfig {
  exports: {
    resourceName: string;
  };
  general: {
    useFrameworkIntegration: boolean;
  };
  database: {
    profileQueries: boolean;
  };
  debug: {
    level: string;
  };
  locale: string;
}

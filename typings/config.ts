export interface ResourceConfig {
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

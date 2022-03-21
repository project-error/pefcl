// Setup and export config loaded at runtime
import { DeepPartial, ResourceConfig } from '@typings/config';

export const config: DeepPartial<ResourceConfig> = JSON.parse(
  LoadResourceFile(GetCurrentResourceName(), 'config.json'),
);

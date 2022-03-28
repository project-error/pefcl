import { DeepPartial, ResourceConfig } from '@typings/config';

export default JSON.parse(
  LoadResourceFile(GetCurrentResourceName(), 'config.json'),
) as DeepPartial<ResourceConfig>;

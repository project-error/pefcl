import { config } from '@utils/server-config';
import path from 'path';
import winston from 'winston';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const { createLogger, transports, format } = require('./logform');

// Needed to manually apply a color to componenent property of log
const manualColorize = (strToColor: string): string => `[\x1b[35m${strToColor}\x1b[0m]`;

// Format handler passed to winston
const formatLogs = (log: any): string => {
  if (log.module)
    return `${log.label} ${manualColorize(log.module)} [${log.level}]: ${log.message}`;

  return `${log.label} [${log.level}]: ${log.message}`;
};

const findLogPath = () => `${path.join(GetResourcePath(GetCurrentResourceName()), 'sv_pefcl.log')}`;

export const mainLogger: winston.Logger = createLogger({
  level: config?.debug?.level,
  transports: [
    new transports.File({
      filename: findLogPath(),
      format: format.combine(format.errors({ stack: true }), format.timestamp(), format.json()),
    }),
    new transports.Console({
      format: format.combine(
        format.label({ label: '[PEFCL]' }),
        format.colorize({ all: true }),
        format.printf(formatLogs),
      ),
    }),
  ],
});

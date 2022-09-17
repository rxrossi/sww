import winston from "winston";

const myFormat = winston.format.printf(
  ({ level, message, service, ...rest }) => {
    const date = new Date();
    return `${service} ${date
      .toISOString()
      .substring(11, 19)} ${level} ${message} - data: ${JSON.stringify(rest)}`;
  }
);

export const buildLogger = (serviceName: string) =>
  winston.createLogger({
    format: myFormat,
    defaultMeta: { service: serviceName },
    transports: [new winston.transports.Console()],
  });

export const logger = buildLogger("ws-server");

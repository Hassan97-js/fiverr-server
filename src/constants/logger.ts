import { createLogger, format, transports } from "winston";
import winston from "winston/lib/winston/transports";

export const logger = createLogger({
  level: "info",
  defaultMeta: { service: "" },
  transports: [
    new winston.Console({
      format: format.combine(
        format.timestamp({
          format: "YYYY-MM-DD HH:mm:ss"
        }),
        format.errors({ stack: true }),
        format.splat(),
        format.json()
      )
    })
  ]
});

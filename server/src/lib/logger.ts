import winston from "winston";

export const logger = winston.createLogger({
	level: "info",
	defaultMeta: { service: "everybody-eats" },
	format: winston.format.combine(
		winston.format.timestamp({
			format: "YYYY-MM-DD HH:mm:ss",
		}),
		winston.format.errors({ stack: true }),
		winston.format.splat(),
		winston.format.json(),
	),
	transports: [
		new winston.transports.Console({
			format: winston.format.combine(
				winston.format((info) => {
					info.level = info.level.toUpperCase();
					return info;
				})(),
				winston.format.colorize(),
				winston.format.simple(),
			),
		}),
	],
});

logger.info("Logger initialized");

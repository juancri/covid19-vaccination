
import winston from 'winston';

const alignColorsAndTime = winston.format.combine(
	winston.format.colorize({ all: true }),
	winston.format.timestamp({ format: 'YY-MM-DD HH:MM:SS' }),
	winston.format.printf(
		info => `[${info.level}] ${info.timestamp}: ${info.message}`
	)
);

const logger = winston.createLogger({
	level: 'debug',
	transports: [
		new (winston.transports.Console)({
			format: winston.format.combine(
				winston.format.colorize(),
				alignColorsAndTime)
		})
	],
});

export default logger;

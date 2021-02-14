
import winston from 'winston';

const container = new winston.Container();
const transports = [ new winston.transports.Console({ level: 'silly' }) ];
const baseFormat = winston.format.combine(
	winston.format.colorize({ all: true }),
	winston.format.timestamp({ format: 'YY-MM-DD HH:MM:SS' }),
	winston.format.printf(
		info => `[${info.level}] ${info.timestamp} ${info.label}: ${info.message}`
	)
);

export default {
	get(name: string): winston.Logger
	{
		container.add(name, {
			format: winston.format.combine(
				winston.format.label({ label: name }),
				baseFormat,
			),
			transports
		});
		return container.get(name);
	}
};

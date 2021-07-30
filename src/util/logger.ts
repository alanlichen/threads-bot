import winston from 'winston';
const { createLogger, format, transports } = winston

const logger = createLogger({
	level: 'info',
	format: format.combine(
		format.timestamp({
			format: 'YYYY-MM-DD HH:mm:ss',
		}),
		format.errors({ stack: true }),
		format.splat(),
		format.json()
	),
	defaultMeta: { service: 'bot' },
	transports: [
		new transports.File({
			filename: 'error.log',
			level: 'error',
		}),
		new transports.File({ filename: 'logs.log' }),
	],
});

if (process.env.NODE_ENV !== 'PRODUCTION') {
	logger.add(new transports.Console());
}

export default logger;

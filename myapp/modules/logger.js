const winston = require('winston');
const winstonDaily = require('winston-daily-rotate-file');
const process = require('process');

const { combine, timestamp, label, printf } = winston.format;
/** 로그 파일 저장 경로 -> 루트 경로/logs 폴더 */
const logDir = `${process.cwd()}/logs`;
/** 로그 출력 포맷 리턴 함수  */
const logFormat = printf(({ level, message, label, timestamp }) => {
    return `[${level}]:[${timestamp}] ► [${label}] ▷ [${message}]`
});
/** 로그 출력 형식 정의 */
const logger = winston.createLogger({
    format: combine(
        timestamp({ format: ' YYYY-MM-DD HH:mm:ss ' }),
        label({ label: '중고책 거래 사이트' }),
        logFormat,
    ),
    transports: [
        new winstonDaily({
            level: 'info',
            datePattern: 'YYYY-MM-DD',
            dirname: logDir,
            filename: `%DATE%.log`,
            /** 최근 30일치 로그 파일을 남김 */
            maxFiles: 30,
            /** 아카이브된 로그 파일을 gzip으로 압출할지 여부 */
            zippedArchive: true,
        }),

        new winstonDaily({
            level: 'error',
            datePattern: 'YYYY-MM-DD',
            dirname: logDir + '/error',
            filename: `%DATE%.error.log`,
            /** 최근 30일치 로그 파일을 남김 */
            maxFiles: 30,
            /** 아카이브된 로그 파일을 gzip으로 압출할지 여부 */
            zippedArchive: true,
        }),
    ],
    exceptionHandlers: [
        new winstonDaily({
            level: 'error',
            datePattern: 'YYYY-MM-DD',
            dirname: logDir,
            filename: `%DATE%.exception.log`,
            maxFiles: 30,
            zippedArchive: true,
        }),
    ],
});
/** Production 환경이 아닌, 개발 환경일 경우 파일들어가서 확인하지 않고 화면에 출력할 수 있게 설정 */
if (process.env.NODE_ENV != 'production') {
    logger.add(
        new winston.transports.Console({
            format: winston.format.combine(
                winston.format.colorize(),  // log level별로 색상 적용하기
                logFormat,
            ),
        }),
    );
}

module.exports = {logger};

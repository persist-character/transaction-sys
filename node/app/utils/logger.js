//日志工具
const {createLogger,format,transports}=require('winston');

const myFormat=format.printf(log=>{
    return `${log.timestamp} ${log.level}:${log.message}`;
})

//日志输出级别：info<warn<error
const logger=createLogger({
    level:'info',
    format:format.combine(
        format.timestamp({format:'YYYY-MM-DD HH:mm:ss'}),
        myFormat
    ),
    transports:[  //输出日志的地方
        new transports.Console(),
        new transports.File({filename:'./logs/applog.log'})
    ]
})
export default logger
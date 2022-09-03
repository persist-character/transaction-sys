//导入myexpress模块--函数
import express from './config/myexpress'
import config from './config/config'

//logger
import logger from './app/utils/logger'

const server=express();

server.listenAsync(config.port).then(function(){
    // console.log("服务已启动，端口："+config.port);
    logger.info("服务已启动，端口："+config.port);
    // logger.warn("服务已启动，端口："+config.port);
    // logger.error("服务已启动，端口："+config.port);

})

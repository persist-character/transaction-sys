import logger from "../app/utils/logger";
import fs from "fs"; //node提供的
import express from "express";
// import bodyParser from "body-parser";
import util from "util";
import path from "path";

/**
 * 1、导入express、导入body-parser
 * 2、初始化express，设置跨域、拦截器、写接口
 * 3、设置监听端口及服务启动时的方法
 */
export default function () {
  var app = express();
  app.listenAsync = util.promisify(app.listen);
  //设置跨域
  app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "*");
    res.setHeader("Access-Control-Allow-Headers", "*");
    next();
  });
  //解析json数据
  app.use(express.json());
  //解析表单数据
  app.use(express.urlencoded({extended:false}));
  app.use(express.static(path.join(__dirname,'../'))); //设置静态资源
  // console.log(path.join(__dirname,'../public/images'));  
  // app.use(bodyParser.json()); 弃用
  // app.use(bodyParser.urlencoded({ extended: false }));弃用
  // app.get('/',(req,res)=>{
  //     res.status(200).send("This is a test");
  // });

  //动态加载路由 要找到routes目录下面所有的文件 动态加载
  var currentDir = process.cwd();
  // logger.info("currentDir: "+currentDir);
  var routeDir = currentDir + "/app/routers";
  //同步读取目录下文件
  fs.readdirSync(routeDir).forEach((file) => {
    //拼接文件路径
    var filePath = path.join(routeDir, file);
    // logger.info("filePath:"+filePath);
    //加载并执行
    require(filePath)(app);
  });
  return app;
}

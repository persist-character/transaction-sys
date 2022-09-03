const config={
    //vuecli---多环境 process.env.development
    //先从环境变量中查找PORT，若没有则使用默认端口3300
    port:process.env.PORT||3300,
    db:{
        database:'transaction_system',
        username:'root',
        password:'root',
        host:'127.0.0.1',
        port:3306,
        timezone:'+08:00',
        dialect:'mysql',
        define:{
            timestamps:false
        }
    }
}
export default config
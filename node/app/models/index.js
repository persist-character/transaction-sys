import fs from 'fs'
import path from 'path'
import logger from '../utils/logger'
import Sequelize from 'sequelize'
import config from '../../config/config'

const db = config.db;
let sequelize;
try {
    logger.info("数据库连接开始");
    sequelize = new Sequelize(db.database, db.username, db.password, db);
    logger.info("数据库连接成功^_^");
} catch (e) {
    logger.error(e);     //e.getMessage(), 
}

//__dirname：当前文件所在目录
fs.readdirSync(__dirname).filter(file => file != 'index.js' && file != 'init-models.js')
.forEach(file => {
    // logger.info('file：' + file); 
    //拿到文件的绝对路径
    var f=path.join(__dirname,file);
    require(f)(sequelize,Sequelize.DataTypes);
});
module.exports=sequelize;

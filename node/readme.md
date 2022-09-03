## mysql
    usr：root
    pwd：root

## 操作mysql工具
naticat
在工具中点“连接”按钮--选择mysq--填写账号密码--添加mysql连接

双击连接打开mysql数据库连接，查看所有的数据库。

创建自己的数据库
在连接上右击--选择运行sql文件--选择quark_sql.sql文件创建信贷数据库

## 后端服务的分层
路由--将请求跳转到对应的控制层
控制层--对参数进行检查校验，不合格直接返回错误
服务层--拿参数进行业务处理，查询，统计等
ORM数据访问层/sql--去数据库取数据
    数据访问的方式：
       ORM--通过js对象的方式访问数据,不需要写sql
       sql--通过写脚本的方式查询数据
数据库

## ORM数据访问框架-sequelize
需要数据模型对象去访问数据
数据模型对象--数据库表 一一对应

## 创建模型对象
可以通过脚本的方式自动生成所有的数据模型对象
脚本里面需要配置数据库的连接
127.0.0.1--本机
localhost--本机
npm install -g sequelize-cli
npm install -g sequelize
npm install -g sequelize-auto mysql2
win: cmder/git bash  sh sequelize-model.sh
mac: sh sequelize-model.sh
注意：若脚本文件是从win机器上创建的，在mac上执行会有问题 dos2unix *.sh


## 加载模型对象
在models下创建index.js 用于加载所有模型文件
其它模块需要使用模型时，只需引入index
cnpm i -S sequelize mysql mysql2

## 创建服务层
使用模型对象访问数据

## 创建控制层
使用服务层对象访问数据

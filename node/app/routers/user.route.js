//用户路由
import express from 'express'
import jwt from 'jsonwebtoken';
import Constant from '../utils/constant'
import userCtrl from '../controls/user.ctrl'
import permCtrl from '../controls/perm.ctrl';
const router=express.Router();
export default function(app){
    router.route('/api/user/login').post(userCtrl.login);  //登录
    router.route('/api/user/register').post(userCtrl.createUser);  //创建用户

    router.route('/api/get/portrait').get(userCtrl.getPortrait);  //获取用户头像
    router.route('/api/change/portrait').post(userCtrl.changePortrait);  //更换头像
    router.route('/api/get/userInfo').get(userCtrl.getUserInfo);  //获取用户信息
    router.route('/api/edit/userInfo').post(userCtrl.updateUserInfo); //编辑用户信息

    router.route('/api/commodity/info').get(userCtrl.getCommInfo);  //获取商品信息
    router.route('/api/add/commodity').post(userCtrl.addComm);  //添加商品
    router.route('/api/delete/commodity').delete(userCtrl.deleteComm);  //删除商品
    router.route('/api/commodity/detail').get(userCtrl.getCommDetail);  //获取商品详情

    router.route('/api/get/sales').get(userCtrl.getSalesComm);//查询售出商品

    router.route('/api/get/purchase').get(userCtrl.queryPurchase);  //查询订单
    router.route('/api/purchase/commodity').post(userCtrl.purchaseComm);  //购买商品

    router.route('/api/get/comment').get(userCtrl.queryComment);  //查询评论
    router.route('/api/add/comment').post(userCtrl.insertComment);  //添加评论

    router.route('/api/commodity/type').get(userCtrl.getCommType);  //获取商品类型

    router.route('/api/motion').get(userCtrl.getMotion);  //查询动态
    router.route('/api/add/motion').post(userCtrl.addMotion);  //添加动态
    router.route('/api/delete/motion').delete(userCtrl.deleteMotion);  //删除动态

    router.route('/api/collect').get(userCtrl.getCollect);  //查询收藏
    router.route('/api/add/collect').get(userCtrl.addCollect);  //加入收藏
    router.route('/api/cancel/collect').delete(userCtrl.cancelCollect);  //取消收藏

    router.route('/api/get/shoppingCart').get(userCtrl.getShopCartInfo);  //查看购物车
    router.route('/api/add/shoppingCart').post(userCtrl.addShopCart);  //加入购物车
    router.route('/api/update/count').post(userCtrl.updateShopCount);  //修改购物车中商品数量
    router.route('/api/delete/shoppingCart').get(userCtrl.deleteShop);  //删除购物车中商品

    router.route('/api/query/address').get(userCtrl.queryAddress);  //查询地址
    router.route('/api/update/address').post(userCtrl.updateAddr);  //修改地址
    router.route('/api/delete/address').delete(userCtrl.deleteAddr);  //删除地址
    router.route('/api/insert/address').put(userCtrl.addAddr);  //添加地址

    router.route('/api/commodity/notcheck').get(userCtrl.checkComm);  //未审核商品
    router.route('/api/commodity/checked').get(userCtrl.checkComm);  //已审核商品
    router.route('/api/audit').post(userCtrl.auditComm);  //审核通过/不通过


    router.route('/api/role').get(permCtrl.getRole);//获取用户角色

    
    //jwt拦截器
    let checkLogin=(req,res,next)=>{
        console.log("checkLogin：",req.originalUrl);
        //跨域试探 预请求
        if(req.method==='OPTIONS'){
            res.send({});
        }else if(req.originalUrl ==='/api/user/login'||req.originalUrl ==='/api/user/register'){
            console.log('login or register');
            next();
        }else if(req.headers.hasOwnProperty("token")){
            jwt.verify(req.headers.token,Constant.secret,function(err,decode){
                if(err){
                    if(err.name==='JsonWebTokenError'){
                        res.send({ code: 400, msg : "token无效！请重新登录！"});
                    }
                    if(err.name==='TokenExpiredError'){
                        //res.send("token过期了！请重新登录！")
                        //若token刚过期且还在使用 需要重新生成新token
                        //过期时间（分钟）=现在时间-过期时间
                        let expiredTime=((new Date().getTime()-err.expiredAt.getTime())/(1000*60)).toFixed(2);
                        console.log(expiredTime);
                        //半小时过期 再操作时自动生成新token
                        if(expiredTime<=30){
                            //前端code==20002表示要更新token
                            let jwt=userCtrl.generateJwtToken(userCtrl.accountInfo);
                            res.send({msg:"生成新token，请客户端更新token",token:jwt});
                        }else{
                            res.send({ code: 400, msg: "token过期了！请重新登录！"});
                        }
                    }
                }else{
                    if(req.originalUrl ==='/user/logout'){
                        userCtrl.accountInfo={};
                        res.send("退出登录成功！")
                    }else{
                        //token有效
                        console.log("token有效");
                        next();
                    }
                }
            })
        }else{
            //无token
            res.send("token不存在，拒绝访问。");
        }
    }
    app.use(checkLogin);
    //给所有路由添加前缀
    app.use('/',router);
    //app.use('/api',router);
}

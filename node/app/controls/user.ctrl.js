import jwt from "jsonwebtoken";
import Constant from "../utils/constant";
import logger from "../utils/logger";
import * as userService from "../service/user.service";
import multiparty from "multiparty";
import config from "../../config/config";

/*
400	Bad Request	          客户端请求的语法错误，服务器无法理解
401	Unauthorized	        请求要求用户的身份认证
403	Forbidden	            服务器理解客户端的请求，但是拒绝执行此请求
404	Not Found	            服务器无法根据客户端的请求找到资源（网页）。通过此代码，网站设计人员可设置"您所请求的资源无法找到"的个性页面
500	Internal Server Error	服务器内部错误，无法完成请求
501	Not Implemented	      服务器不支持请求的功能，无法完成请求*/
//用户接口 控制器 业务逻辑

const userCtrl = {
  accountInfo: {},
  //生成jwt token
  generateJwtToken(data) {
    return jwt.sign(data, Constant.secret, {
      expiresIn: "1d" //单位 毫秒 1d-1天
    });
  },
  //request response   登录
  login: function (req, res) {
    logger.info("===登录开始===");
    let { name, password } = req.body;
    //判断account pwd为空
    logger.info(name + "：" + password);
    if (name && password) {
      userService
        .findUser(name)
        .then((data) => {
          // console.log(data);
          if(data[1].length==0){
            res.json({ code: 400, msg: "用户不存在ヽ（・＿・；)ノ" });
          }
          else if ( data[0][0].password == password) {
            //生成jwt
            let result = {
              id: data.id,
              name: data.name
            };
            userCtrl.accountInfo.id = data.id;
            userCtrl.accountInfo.name = data.name;
            let jwt = userCtrl.generateJwtToken(result);
            res.json({
              code: 200,
              msg: "登陆成功(๑•̀ㅂ•́)و✧",
              token: jwt,
              id: data[0][0].id
            });
            logger.info("===登录成功(๑>؂<๑）===");
          } else {
            res.json({ code: 404, msg: "用户名或密码错误" });
          }
        })
        .catch((err) => {
          logger.error(err);
          console.log(err);
        });
    } else {
      res.json({ code: 400, msg: "缺少必要参数ヽ（・＿・；)ノ" });
    }
  },
  //注册
  createUser: function (req, res) {
    let { name, password, role } = req.body;
    userService
      .createUser(name, password)
      .then((data) => {
        if (data) {
          userService
            .setUserRole(data[0], role)
            .then((cdata) => {
              res.json({ code: 200, msg: "注册成功(๑>؂<๑）可前往登录 " });
            })
            .catch((err) => {
              res.json({ code: 401, msg: "设置权限错误" });
              logger.error(err);
            });
        }
      })
      .catch((err) => {
        res.json({ code: 400, msg: "用户名重复" });
        logger.error(err);
      });
  },
  //获取用户头像
  getPortrait: function (req, res) {
    let id = req.query.userId;
    if (id) {
      userService
        .findPortrait(id)
        .then((data) => {
          res.json({ code: 200, img: data[0][0].portrait });
        })
        .catch((err) => {
          res.json({ code: 500, msg: "服务器错误 (｡•ˇ‸ˇ•｡)" });
          logger.error(err);
        });
    } else {
      res.json({ code: 400, msg: "缺少必要参数呦 ฺ(◣д◢)ฺ" });
    }
  },
  //更换头像
  changePortrait: function (req, res) {
    let form = new multiparty.Form({ uploadDir: "./public/images" }); //生成multiparty对象，并配置上传目标路径
    form.parse(req, (err, fields, files) => {
      let userId = fields.userId[0];
      let img = files.img[0].path;
      img = "http:\\\\localhost:" + config.port + "\\" + img;
      console.log(img);
      if (userId && img) {
        userService
          .changePortrait(userId, img)
          .then((data) => {
            res.json({ code: 200, img });
          })
          .catch((err) => {
            res.json({ code: 500, msg: "服务器错误 (눈_눈)" });
            logger.error(err);
          });
      } else {
        res.json({ code: 400, msg: "缺少必要参数呦 ฺ(◣д◢)ฺ" });
      }
    });
  },
  //获取用户信息
  getUserInfo: function (req, res) {
    let id = req.query.userId;
    if (id) {
      userService
        .findPortrait(id)
        .then((data) => {
          // let {name, real_name, telephone, identify}=data[0][0];
          res.json({ code: 200, data: data[0][0] });
        })
        .catch((err) => {
          res.json({ code: 500, msg: "服务器错误 (｡•ˇ‸ˇ•｡)" });
          logger.error(err);
        });
    } else {
      res.json({ code: 400, msg: "缺少必要参数呦 ฺ(◣д◢)ฺ" });
    }
  },
  //修改用户信息
  updateUserInfo: function (req, res) {
    let { name, password, real_name, telephone, identify, id } = req.body;
    if (name && password && real_name && telephone && identify && id) {
      userService
        .updateUserInfo(name, password, real_name, telephone, identify, id)
        .then((data) => {
          res.json({ code: 200, msg: "编辑成功(๑>؂<๑）" });
        })
        .catch((err) => {
          res.json({ code: 500, msg: err + " (｡•ˇ‸ˇ•｡)" });
          logger.error(err);
        });
    } else {
      res.json({ code: 400, msg: "缺少必要参数呦 ฺ(◣д◢)ฺ" });
    }
  },
  //按照类别、名称、上传人id获取商品信息
  getCommInfo: function (req, res) {
    // let { type, goodsName } = req.query;
    userService
      .queryCommodity(req.query)
      .then((data) => {
        res.json({ code: 200, data });
      })
      .catch((err) => {
        res.json({ code: 500, msg: err + " (｡•ˇ‸ˇ•｡)" });
        logger.error(err);
      });
  },
  //添加商品
  addComm: function (req, res) {
    let form = new multiparty.Form({ uploadDir: "./public/images" });
    form.parse(req, (err, fields, files) => {
      let { userId, goodsName, description, type, price, count } = fields;
      if (userId && goodsName && description && type && price && count) {
        userId = parseInt(userId);
        count = parseInt(count);
        price = parseFloat(price);
        let params = { userId, goodsName, description, type, price, count };
        params.goodsImg = [];
        console.log(fields);
        // console.log(files);
        for (let k in files) {
          let img =
            "http:\\\\localhost:" + config.port + "\\" + files[k][0].path;
          params.goodsImg.push(img);
        }
        let data = userService.addCommodity(params);
        if (data) {
          res.json({ code: 200, msg: "上传成功(๑>؂<๑）" });
        } else {
          res.json({ code: 500, msg: "服务器错误 (｡•ˇ‸ˇ•｡)" });
        }
      } else {
        res.json({ code: 200, msg: "缺少参数(｡•ˇ‸ˇ•｡)" });
      }
    });
  },
  // 删除商品
  deleteComm: function (req, res) {
    userService.deleteCommodity(req.body.goodsId).then((data) => {
      if (data) {
        res.json({ code: 200, msg: "删除成功(๑>؂<๑）" });
      } else {
        res.json({ code: 500, msg: "服务器错误 (｡•ˇ‸ˇ•｡)" });
      }
    });
  },
  // 获取商品详情
  getCommDetail: async function (req, res) {
    let data = await userService.getCommInfo(req.query.goodsId);
    if (data) {
      res.json({ code: 200, data });
    } else {
      res.json({ code: 500, msg: "服务器错误 (｡•ˇ‸ˇ•｡)" });
    }
  },
  //查询售出商品
  getSalesComm: async function (req, res) {
    let data = await userService.salesComm(req.query.userId);
    if (data) {
      res.json({ code: 200, data });
    } else {
      res.json({ code: 500, msg: "服务器错误 (｡•ˇ‸ˇ•｡)" });
    }
  },
  //查看购买商品
  queryPurchase: async function (req, res) {
    let data = await userService.queryPurchase(req.query.userId);
    if (data) {
      res.json({ code: 200, data });
    } else {
      res.json({ code: 500, msg: "服务器错误 (｡•ˇ‸ˇ•｡)" });
    }
  },
  // 购买商品
  purchaseComm: async function (req, res) {
    let data = await userService.purchaseComm(req.body);
    if (data) {
      res.json({ code: 200, msg: "购买成功(๑>؂<๑）" });
    } else {
      res.json({ code: 500, msg: "服务器错误 (｡•ˇ‸ˇ•｡)" });
    }
  },
  //查询评论
  queryComment: async function (req, res) {
    console.log(req.query);
    let { goodsId } = req.query;
    if (goodsId) {
      userService.queryComment(goodsId).then((data) => {
        if (data) {
          res.json({ code: 200, data:data[1] });
        } else {
          res.json({ code: 500, msg: "服务器错误 (｡•ˇ‸ˇ•｡)" });
        }
      });
    } else {
      res.json({ code: 400, msg: "缺少参数(｡•ˇ‸ˇ•｡)" });
    }
  },
  //添加评论
  insertComment: async function (req, res) {
    let { userId, goodsId, comment } = req.body;
    if (userId && goodsId && comment) {
      let data = await userService.insertComment(userId, goodsId, comment);
      if (data) {
        res.json({ code: 200, msg: "购买成功(๑>؂<๑）" });
      } else {
        res.json({ code: 500, msg: "服务器错误 (｡•ˇ‸ˇ•｡)" });
      }
    } else {
      res.json({ code: 400, msg: "缺少参数(｡•ˇ‸ˇ•｡)" });
    }
  },
  // 获取商品类型
  getCommType: function (req, res) {
    userService
      .queryType()
      .then((data) => {
        res.json({ code: 200, data: data[1] });
      })
      .catch((err) => {
        res.json({ code: 500, msg: "服务器错误 (｡•ˇ‸ˇ•｡)" });
        logger.error(err);
      });
  },
  // 查询动态
  getMotion: async function (req, res) {
    let data = await userService.queryMotion(req.query.userId);
    if (data) {
      res.json({ code: 200, data });
    } else {
      res.json({ code: 500, msg: "服务器错误 (｡•ˇ‸ˇ•｡)" });
    }
  },
  // 添加动态
  addMotion: function (req, res) {
    let form = new multiparty.Form({ uploadDir: "./public/images" });
    form.parse(req, (err, fields, files) => {
      let { userId, content } = fields;
      let params = { userId, content };
      params.img = [];
      for (let k in files) {
        let img = "http:\\\\localhost:" + config.port + "\\" + files[k][0].path;
        params.img.push(img);
      }
      let data = userService.insertMotion(params);
      if (data) {
        res.json({ code: 200, msg: "添加成功(๑>؂<๑）" });
      } else {
        res.json({ code: 500, msg: "服务器错误 (｡•ˇ‸ˇ•｡)" });
      }
    });
  },
  // 删除动态
  deleteMotion: async function (req, res) {
    let data = await userService.deleteMotion(req.body.id);
    if (data) {
      res.json({ code: 200, msg: "删除成功(๑>؂<๑） " });
    } else {
      res.json({ code: 500, msg: "服务器错误 (｡•ˇ‸ˇ•｡)" });
    }
  },
  // 查询收藏
  getCollect: function (req, res) {
    userService.queryCollect(req.query.userId).then((data) => {
      if (data) {
        res.json({ code: 200, data });
      } else {
        res.json({ code: 500, msg: "服务器错误 (｡•ˇ‸ˇ•｡)" });
      }
    });
  },
  //加入收藏
  addCollect: function (req,res){
    let {userId,goodsId}=req.query;
    if (userId&&goodsId) {
      userService.addCollect(userId,goodsId).then(data => {
        if (data) {
          res.json({ code: 200, msg:"已收藏(๑>؂<๑）" });
        } else {
          res.json({ code: 500, msg: "服务器错误 (｡•ˇ‸ˇ•｡)" });
        }
      });
    } else {
      res.json({ code: 400, msg: "缺少参数(｡•ˇ‸ˇ•｡)" });
    }
  },
  // 取消收藏
  cancelCollect: function (req, res) {
    userService
      .deleteCollect(req.body.userId, req.body.goodsId)
      .then((data) => {
        res.json({ code: 200, msg: "取消成功(๑>؂<๑）" });
      })
      .catch((err) => {
        res.json({ code: 500, msg: "服务器错误 (｡•ˇ‸ˇ•｡)" });
        logger.error(err);
      });
  },
  // 查看购物车
  getShopCartInfo: async function (req, res) {
    let data = await userService.queryShopCart(req.query.userId);
    if (data) {
      res.json({ code: 200, data });
    } else {
      res.json({ code: 500, msg: "服务器错误 (｡•ˇ‸ˇ•｡)" });
    }
  },
  //加入购物车
  addShopCart: function (req, res) {
    let { userId, goodsId } = req.body;
    if (userId && goodsId) {
      userService.insertShopCart(userId, goodsId).then((data) => {
        if (data) {
          res.json({ code: 200, msg:"已加入购物车(๑>؂<๑）" });
        } else {
          res.json({ code: 500, msg: "服务器错误 (｡•ˇ‸ˇ•｡)" });
        }
      });
    } else {
      res.json({ code: 400, msg: "缺少参数(｡•ˇ‸ˇ•｡)" });
    }
  },
  // 修改购物车中商品数量
  updateShopCount: function (req, res) {
    let { userId, goodsId, count } = req.body;
    userService
      .updateShopCount(userId, goodsId, count)
      .then((data) => {
        res.json({ code: 200, msg: "修改成功(๑>؂<๑）" });
      })
      .catch((err) => {
        res.json({ code: 500, msg: "服务器错误 (｡•ˇ‸ˇ•｡)" });
        logger.error(err);
      });
  },
  // 删除购物车中商品
  deleteShop: function (req, res) {
    let { userId, goodsId } = req.query;
    userService
      .deleteShop(userId, goodsId)
      .then((data) => {
        res.json({ code: 200, msg: "删除成功(๑>؂<๑）" });
      })
      .catch((err) => {
        res.json({ code: 500, msg: "服务器错误 (｡•ˇ‸ˇ•｡)" });
        logger.error(err);
      });
  },
  // 查询地址
  queryAddress: function (req, res) {
    userService
      .queryAddress(req.query.userId)
      .then((data) => {
        res.json({ code: 200, data: data[1] });
      })
      .catch((err) => {
        res.json({ code: 500, msg: "服务器错误 (｡•ˇ‸ˇ•｡)" });
        logger.error(err);
      });
  },
  // 删除地址
  deleteAddr: function (req, res) {
    userService
      .deleteAddress(req.body.id)
      .then((data) => {
        res.json({ code: 200, msg: "删除成功(๑>؂<๑）" });
      })
      .catch((err) => {
        res.json({ code: 500, msg: "服务器错误 (｡•ˇ‸ˇ•｡)" });
        logger.error(err);
      });
  },
  // 修改地址
  updateAddr: function (req, res) {
    let { id, name, address, telephone } = req.body;
    userService
      .updateAddress(id, name, address, telephone)
      .then((data) => {
        res.json({ code: 200, msg: "修改成功(๑>؂<๑）" });
      })
      .catch((err) => {
        res.json({ code: 500, msg: "服务器错误 (｡•ˇ‸ˇ•｡)" });
        logger.error(err);
      });
  },
  // 添加地址
  addAddr: function (req, res) {
    let { name, telephone, address, userId } = req.body;
    userService
      .insertAddress(name, telephone, address, userId)
      .then((data) => {
        res.json({ code: 200, msg: "修改成功(๑>؂<๑）" });
      })
      .catch((err) => {
        res.json({ code: 500, msg: "服务器错误 (｡•ˇ‸ˇ•｡)" });
        logger.error(err);
      });
  },
  // 审核商品
  checkComm: function (req, res) {
    //0：未审核；1：已审核
    let status=req.originalUrl=='/api/commodity/notcheck'?0:1;
    userService
      .checkComm(status)
      .then((data) => {
        res.json({ code: 200, data });
      })
      .catch((err) => {
        res.json({ code: 500, msg: "服务器错误 (｡•ˇ‸ˇ•｡)" });
        logger.error(err);
      });
  },
  //审核通过/不通过
  auditComm:function(req,res){
    let {goodsId,status,reason}=req.body;
    if(goodsId&&status){
      userService.audit(goodsId,status,reason).then(data=>{
        if(data){
          res.json({ code: 200, msg: "审核成功(๑>؂<๑）" });
        }else{
          res.json({ code: 400, msg: "传参错误 (｡•ˇ‸ˇ•｡)" });
        }
      })
    }else{
      res.json({ code: 400, msg: "缺少参数 (｡•ˇ‸ˇ•｡)" });
    }
    
  }
};
export default userCtrl;

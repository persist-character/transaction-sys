//用户 服务层
import sequelize from "../models";
const User = sequelize.models.user;
import logger from "../utils/logger";
// const Area = sequelize.models.jd_area_info;

/**
 * 通过账号查找用户
 */
export async function findUser(name) {
  return sequelize.query(`select * from user where name='${name}'`);
}

/**
 * 通过id查找用户头像
 */
export async function findPortrait(id) {
  return sequelize.query(`select * from user where id=${id};`);
}

/**
 * 通过id更换用户头像
 */

export async function changePortrait(id, img) {
  return sequelize.query(`update user set portrait=? where id=?;`, {
    replacements: [img, id]
  });
  // return User.update({ portrait: img }, {
  //   where: {
  //     id:id
  //   }
  // });
}

/**
 * 创建普通用户
 * @param {name,password}
 */
export async function createUser(name, pwd) {
  return sequelize.query(
    `INSERT INTO \`user\`(name,password) VALUES('${name}','${pwd}');`
  );
}

/**
 * 设置用户身份
 * @param {name,password}
 */
export async function setUserRole(userId, roleId) {
  return sequelize.query(
    `INSERT INTO user_role(userId,roleId) VALUES(${userId} ,  ${roleId});`
  );
}

/**
 * 修改用户信息
 * @param {name,password,real_name,telephone,identify, id}
 */
export async function updateUserInfo(
  name,
  password,
  real_name,
  telephone,
  identify,
  id
) {
  return sequelize.query(
    "update user set name=?,`password`=?,real_name=?,telephone=?,identify=? WHERE id=?;",
    { replacements: [name, password, real_name, telephone, identify, id] }
  );
}

/**
 * 按照类别、名称、上传人id获取商品信息
 * @param {type, name,userId}
 */
export async function queryCommodity(params) {
  let condition = []; //判断条件
  let i = 0;
  for (let k in params) {
    if (k != "goodsName"&&k!="type") {
      condition[i++] =
        k == "userId" ? `${k}=${params[k]}` : `${k}='${params[k]}'`;
    } else {
      condition[i++] = `${k} like '%${params[k]}%'`;
    }
  }
  let conState = condition.join(" and ");
  if (!params.userId && conState != "") {
    conState += " and `status`=1";
  } else if (!params.userId) {
    conState += "`status`=1";
  }
  let data = await sequelize.query(
    `SELECT * from commodity where ${conState};`
  );
  let comm = data[1];
  //获取一张商品图片
  for (let i = 0; i < comm.length; i++) {
    let data = await queryCommImg(comm[i].goodsId);
    comm[i].img = data[1];
  }
  return comm;
}

/**
 * 查询商品图片
 * @param {goodsId} info
 * @returns result
 */
export async function queryCommImg(goodsId) {
  return sequelize.query(
    `SELECT img from commodityimg where goodsId='${goodsId}';`
  );
}

/**
 * 添加商品
 * @param {userId,goodsName,goodsImg:[],description,type,price,count,surplusCount,status}
 */
export async function addCommodity(info) {
  let rlt;
  //插入商品信息到commodity表
  try {
    let data = await sequelize.query(
      `INSERT INTO commodity(userId,goodsName,description,type,price,count,surplusCount,\`status\`) 
    VALUES(?,?,?,?,?,?,?,0);`,
      {
        replacements: [
          info.userId,
          info.goodsName,
          info.description,
          info.type,
          info.price,
          info.count,
          info.count
        ]
      }
    );
    rlt = await addCommImg(info.goodsImg, data[0]);
  } catch (err) {
    logger.error(err);
  }
  return rlt;
}

/**
 * 添加商品图片
 * @param {id:商品id,img:[]}
 */
export async function addCommImg(img, id) {
  let rlt;
  try {
    // 插入图片到commodityImg表
    for (let i = 0; i < img.length; i++) {
      rlt = await sequelize.query(
        `INSERT INTO commodityimg(goodsId,img) values(?,?);`,
        { replacements: [id, img[i]] }
      );
    }
    return rlt;
  } catch (err) {
    logger.error(err);
  }
}

/**
 * 删除商品
 * @param {goodsId}
 */
export async function deleteCommodity(goodsId) {
  let rlt;
  try {
    rlt = await sequelize.query(
      `delete FROM commodity where goodsId=${goodsId};`
    );
    // 删除商品图片
    rlt = await sequelize.query(
      `delete FROM commodityImg where goodsId=${goodsId};`
    );
  } catch (err) {
    logger.error(err);
  }
  return rlt;
}

/**
 * 获取商品详情
 * @param {goodsId}
 */
export async function getCommInfo(goodsId) {
  let rlt;
  try {
    rlt = await sequelize.query(
      `SELECT * from commodity where goodsId=${goodsId};`
    );
    let data = await queryCommImg(goodsId);
    rlt[1][0].goodsImg = data[1];
  } catch (err) {
    logger.error(err);
  }
  return rlt[1][0];
}

/**
 * 查看售出商品
 * @param {*}
 * @returns
 */
export async function salesComm(userId) {
  try {
    let data = await sequelize.query(
      `select purchase.goodsId,goodsName,price,description, \`name\`,purchase.count as purchaseCount from \`user\`,purchase,commodity where purchase.goodsId=commodity.goodsId and commodity.userId=${userId} and purchase.userId=\`user\`.id;`
    );
    let temp = data[1];
    for (let i = 0; i < temp.length; i++) {
      let imgInfo = await queryCommImg(temp[i].goodsId);
      temp[i].img = imgInfo[1][0].img;
    }
    return temp;
  } catch (err) {
    console.log(err);
  }
}

/**
 * 查看购买商品
 * @param {*}
 * @returns
 */
export async function queryPurchase(userId) {
  try {
    let data = await sequelize.query(
      `select purchase.goodsId,goodsName,commodity.price,purchase.count,commentStatus,address from purchase,commodity,address where purchase.userId=${userId} and purchase.goodsId=commodity.goodsId and purchase.addressId=address.id`
    );
    let temp = data[1];
    for (let i = 0; i < temp.length; i++) {
      let imgInfo = await queryCommImg(temp[i].goodsId);
      temp[i].img = imgInfo[1][0].img;
    }
    return temp;
  } catch (err) {
    console.log(err);
  }
}

/**
 * 购买商品
 * @param {userId,goodsId,count,addressId}
 */
export async function purchaseComm(info) {
  try {
    await sequelize.query(
      `INSERT INTO purchase(userId,goodsId,count,addressId,commentStatus) VALUES(?,?,?,?,0)`,
      { replacements: [info.userId, info.goodsId, info.count, info.addressId] }
    );
    let surplus = await sequelize.query(
      `SELECT surplusCount from commodity where goodsId=${info.goodsId};`
    );
    let rlt = await sequelize.query(
      `UPDATE commodity SET surplusCount=${
        surplus[1][0].surplusCount - info.count
      } where goodsId=${info.goodsId};`
    );
    rlt = await deleteShop(info.userId, info.goodsId);
    return rlt;
  } catch (err) {
    logger.error(err);
  }
}

/**
 * 查询评论
 * @param {goodsId}
 * @returns
 */
export async function queryComment(goodsId) {
  return sequelize.query(
    "select userId, `comment` from `comment` where goodsId=?;",
    { replacements: [goodsId] }
  );
}

/**
 * 添加评论
 * @param {userId,goodsId,comment}
 * @returns
 */
export async function insertComment(userId, goodsId, comment) {
  try {
    let data = await sequelize.query(
      "insert into `comment`(userId,goodsId,`comment`) values(?,?,?);",
      { replacements: [userId, goodsId, comment] }
    );
    if (data) {
      let rlt = await sequelize.query(
        `UPDATE purchase set commentStatus=1 where userId=${userId} and goodsId=${goodsId};`
      );
      return rlt;
    }
  } catch (err) {
    console.log(err);
  }
}

/**
 * 获取商品类型
 * @param {}
 */
export async function queryType() {
  return sequelize.query(`select * from commoditytype;`);
}

/**
 * 查询动态
 * @param {userId?:number}
 */
export async function queryMotion(id) {
  let data;
  try {
    if (id) {
      data = await sequelize.query(`select * from motion where userId=${id};`);
    } else {
      data = await sequelize.query(`select * from motion;`);
    }
    if (data[1] && data[1].length > 0) {
      for (let i = 0; i < data[1].length; i++) {
        // 获取动态图片
        let rlt = await sequelize.query(
          `select img from motionimg where motionId=${data[1][i].id}`
        );
        data[1][i].img = [];
        data[1][i].img = rlt[1];
      }
    }
  } catch (err) {
    logger.error(err);
  }
  return data[1];
}

/**
 * 添加动态
 * @param {userId,content}
 */
export async function insertMotion(info) {
  let rlt;
  // insert into motion(userId,content) VALUES();
  // insert into motionimg(motionId,img) VALUES();
  try {
    let data = await sequelize.query(
      `insert into motion(userId,content,\`like\`) VALUES(?,?,0);`,
      { replacements: [info.userId, info.content] }
    );
    for (let i = 0; i < info.img.length; i++) {
      rlt = await sequelize.query(
        `insert into motionimg(motionId,img) VALUES(?,?);`,
        { replacements: [data[0], info.img[i]] }
      );
    }
  } catch (e) {
    console.log(e);
  }
  return rlt;
}

/**
 * 删除动态
 * @param {id}
 */
export async function deleteMotion(id) {
  try {
    await sequelize.query(`DELETE FROM motion where id=${id}`);
    let rlt = await sequelize.query(
      `DELETE FROM motionimg WHERE motionid=${id}`
    );
    return rlt;
  } catch (e) {
    console.log(e);
  }
}

/**
 * 查询收藏
 * @param {userId}
 */
export async function queryCollect(userId) {
  try {
    let data = await sequelize.query(
      `select commodity.goodsId,goodsName,price,description,surplusCount from commodity,collect where collect.userId=${userId} and commodity.goodsId=collect.goodsId;`
    );
    let temp = data[0];
    for (let i = 0; i < temp.length; i++) {
      let imgInfo = await queryCommImg(temp[i].goodsId);
      // console.log(imgInfo);
      temp[i].img = imgInfo[1][0].img;
    }
    return temp;
  } catch (err) {
    console.log(err);
  }
}

/**
 * 加入收藏
 * @param {userId,goodsId}
 */
export async function addCollect(userId, goodsId) {
  let rlt = await sequelize.query(
    `select * from collect where userId=${userId} and goodsId=${goodsId};`
  );
  console.log(rlt);
  if (!rlt[1][0]) {
    return sequelize.query(
      `insert into collect(userId,goodsId) values(${userId}, ${goodsId});`
    );
  } else {
    return "已收藏";
  }
}

/**
 * 取消收藏
 * @param {userId,goodsId}
 */
export async function deleteCollect(userId, goodsId) {
  return sequelize.query(
    `delete FROM collect where userId=${userId} and goodsId=${goodsId};`
  );
}

/**
 * 查看购物车
 * @param {userId}
 */
export async function queryShopCart(userId) {
  let rlt = [];
  try {
    let data = await sequelize.query(
      `select goodsId from shoppingcart where userId=${userId};`
    );
    console.log(data);
    if (data[1].length > 0) {
      for (let i = 0; i < data[1].length; i++) {
        let commInfo = await sequelize.query(
          `select * from commodity where goodsId=${data[1][i].goodsId};`
        );
        rlt.push(commInfo[1][0]);
        //获取一张商品图片
        for (let i = 0; i < rlt.length; i++) {
          let data = await queryCommImg(rlt[i].goodsId);
          rlt[i].img = data[1][0].img;
        }
      }
    }
  } catch (err) {
    console.log(err);
  }
  return rlt;
}

/**
 * 加入购物车
 * @param {userId ,goodsId,count}
 * @returns result
 */
export async function insertShopCart(userId, goodsId) {
  let data = await sequelize.query(
    `select * from shoppingcart where userId=${userId} and goodsId=${goodsId}`
  );
  if (data[1].length == 0) {
    return sequelize.query(
      `insert into shoppingcart(userId,goodsId,count) VALUES(${userId},${goodsId},1);`
    );
  } else {
    // return sequelize.query(
    //   `update shoppingcart set count=${
    //     data[1][0].count + 1
    //   } where userId=${userId} and goodsId=${goodsId};`
    // );
    return true;
  }
}

/**
 * 修改购物车中商品数量
 * @param {userId,goodsId,count}
 */
export async function updateShopCount(userId, goodsId, count) {
  return sequelize.query(
    `update shoppingcart set count=? where userId=? and goodsId=?`,
    { replacements: [count, userId, goodsId] }
  );
}

/**
 * 删除购物车中商品
 * @param {userId,goodsId}
 */
export async function deleteShop(userId, goodsId) {
  return sequelize.query(
    `delete FROM shoppingcart where userId=? and goodsId=?;`,
    { replacements: [userId, goodsId] }
  );
}

/**
 * 查询地址
 * @param {userId}
 */
export async function queryAddress(userId) {
  return sequelize.query(`select * from address where userId=${userId};`);
}

/**
 * 修改地址
 * @param {id,name,address,telephone}
 */
export async function updateAddress(id, name, address, telephone) {
  return sequelize.query(
    `update address set name=?,address=?,telephone=? where id=?`,
    {
      replacements: [name, address, telephone, id]
    }
  );
}

/**
 * 删除地址
 * @param {id}
 */
export async function deleteAddress(id) {
  return sequelize.query(`DELETE from address where id=${id}`);
}

/**
 * 添加地址
 * @param {name,telephone,address,userId}
 */
export async function insertAddress(name, telephone, address, userId) {
  return sequelize.query(
    `insert into address(name,telephone,address,userId) VALUES(?,?,?,?);`,
    { replacements: [name, telephone, address, userId] }
  );
}

/**
 * 获取审核商品
 * @param {status}
 */
export async function checkComm(status) {
  let data;
  //未审核
  if (status == 0) {
    data = await sequelize.query(`SELECT * from commodity where \`status\`=0;`);
  } else {
    data = await sequelize.query(
      `SELECT * from commodity where \`status\`!=0;`
    );
  }
  let temp = data[1];
  for (let i = 0; i < temp.length; i++) {
    let data = await queryCommImg(temp[i].goodsId);
    temp[i].img = data[1];
  }
  return temp;
}

// /**
//  * 已审核商品
//  * @param {}
//  */
// export async function checkComm() {
//   return sequelize.query(`SELECT * from commodity where \`status\`!=0;`);
// }

//审核通过/不通过
export async function audit(goodsId, status, reason) {
  if (status == 1) {
    return sequelize.query(
      `update commodity set status=1 where goodsId=${goodsId}; `
    );
  } else if (status == 2) {
    return sequelize.query(
      `update commodity set status=2,reason='${reason}' where goodsId=${goodsId}; `
    );
  } else {
    return null;
  }
}

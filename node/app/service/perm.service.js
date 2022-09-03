//权限 服务层
import sequelize from "../models";
/**
 * 查询用户角色
 * @param {userId}
 */
export async function getRole(userId) {
  return sequelize.query(
    `SELECT roleId from user_role where userId=${userId};`
  );
}

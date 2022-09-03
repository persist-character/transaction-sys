import * as permService from "../service/perm.service";

const permCtrl = {
  getRole: function (req, res) {
    permService
      .getRole(req.query.userId)
      .then((rlt) => {
        res.json({ code: 200, data:{role:rlt[1][0].roleId} });
      })
      .catch((err) => {
        res.json({ code: 500, msg: "服务器错误 T_T" });
        logger.error(err);
      });
  }
};
export default permCtrl
import request from '@/utils/request'
/**
 * 获取角色列表
 * @param {*} page  页码
 * @param {*} pagesize 每页条数
 * @returns
 */
export const reqGetRoleList = (page, pagesize = 10) => {
  return request({
    method: 'get',
    url: '/sys/role',
    params: {
      page,
      pagesize
    }
  })
}
/**
 * 根据id删除角色
 * @param {*} id
 * @returns
 */
export const reqDelRole = (id) => {
  return request({
    method: 'delete',
    url: '/sys/role/' + id
  })
}
/**
 * 添加角色
 * @param {*} form 表单数据
 * @returns
 */
export const reqAddRole = (form) => {
  return request({
    method: 'post',
    url: '/sys/role',
    data: form

  })
}

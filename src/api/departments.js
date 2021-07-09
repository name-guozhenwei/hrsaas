import request from '@/utils/request'
/**
 * 获取企业的部门列表
 * @returns
 */
export const reqGetDepartment = () => {
  return request({
    method: 'get',
    url: '/company/department'
  })
}
/**
 * 根据id删除部门
 * @param {*} id  部门id
 * @returns
 */
export const reqDelDepartments = (id) => {
  return request({
    method: 'delete',
    url: '/company/department/' + id
  })
}

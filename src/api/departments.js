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
/**
 * 获取新增部门
 * @param {*} data
 * @returns
 */
export const reqAddDepartments = (data) => {
  return request({
    method: 'post',
    url: '/company/department',
    data
  })
}
/**
 * 获取部门详情
 * @param {*} id 部门id
 * @returns
 */
export const reqGetDepartDetail = (id) => {
  return request({
    method: 'get',
    url: '/company/department/' + id

  })
}
/**
 * 根据id修改部门详情
 * @param {*} data
 * @returns
 */
export const reqUpdateDepartments = (form) => {
  return request({
    method: 'put',
    url: '/company/department/' + form.id,
    data: form
  })
}

import request from '@/utils/request'
/**
 * 获取所有权限
 * @returns
 */
export const reqGetPermissionList = () => {
  return request({
    method: 'get',
    url: '/sys/permission'
  })
}
/**
 * 新增权限
 * @param {*} data
 * @returns
 */
export const reqAddPermission = (data) => {
  return request({
    method: 'post',
    url: '/sys/permission',
    data
  })
}
/**
 * 更新权限
 * @param {*} data
 * @returns
 */
export const reqUpdatePermission = (data) => {
  return request({
    method: 'put',
    url: '/sys/permission/' + data.id,
    data
  })
}
/**
 * 根据id删除权限
 * @param {*} id
 * @returns
 */
export const reqDelPermission = (id) => {
  return request({
    method: 'delete',
    url: '/sys/permission/' + id
  })
}
/**
 * 根据ID获取权限点详情 (编辑回显)
 * @param {*} id
 * @returns
 */
export const reqGetPermissionDetail = (id) => {
  return request({
    method: 'get',
    url: '/sys/permission/' + id
  })
}

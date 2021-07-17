import request from '@/utils/request'
/**
 * 获取员工列表
 * @param {*} page  // 页码
 * @param {*} size  // 每页条数
 * @returns
 */
export const reqGetUserList = (page = 1, size = 5) => {
  return request({
    method: 'get',
    url: '/sys/user',
    params: {
      page,
      size
    }
  })
}
/**
 * 删除员工
 * @param {*} id
 * @returns
 */
export const reqDelEmployee = (id) => {
  return request({
    method: 'delete',
    url: '/sys/user/' + id
  })
}
/**
 *  新增员工
 * @param {*} formData
 * @returns
 */
export const reqAddEmployee = (formData) => {
  return request({
    method: 'post',
    url: '/sys/user',
    data: formData
  })
}
/**
 * 批量导入员工
 * @param {*} arr 员工数组
 * @returns
 */
export const reqImportEmployee = (arr) => {
  return request({
    method: 'post',
    url: '/sys/user/batch',
    data: arr
  })
}
/**
 * 获取员工基本信息 (包含头像)
 * @param {*} id
 * @returns
 */
export const reqGetUserDetailById = (id) => {
  return request({
    method: 'get',
    url: '/sys/user/' + id
  })
}
/**
 * 更新员工基本信息
 * @param {*} data
 * @returns
 */
export const reqSaveUserDetailById = (data) => {
  return request({
    method: 'put',
    url: '/sys/user/' + data.id,
    data
  })
}
/** *
 *  读取用户详情的基础信息 (个人详情-下面的接口)
 * **/
export function reqGetPersonalDetail(id) {
  return request({
    method: 'get',
    url: `/employees/${id}/personalInfo`
  })
}

/** *
 *  更新用户详情的基础信息 (个人详情-下面的接口)
 * **/
export function reqUpdatePersonal(data) {
  return request({
    method: 'put',
    url: `/employees/${data.userId}/personalInfo`,
    data
  })
}

/** **
 * 获取用户的岗位信息  (岗位信息)
 * ****/
export function reqGetJobDetail(id) {
  return request({
    method: 'get',
    url: `/employees/${id}/jobs`
  })
}

/**
 * 保存岗位信息  (岗位信息)
 * ****/
export function reqUpdateJob(data) {
  return request({
    method: 'put',
    url: `/employees/${data.userId}/jobs`,
    data
  })
}
/**
 * 给员工分配角色
 * @param {*} data
 * @returns
 */
export const reqAssignRoles = (data) => {
  return request({
    method: 'put',
    url: '/sys/user/assignRoles',
    data
  })
}

import request from '@/utils/request'
/**
 * 获取登入
 * @param {*} obj
 * @returns
 */
export const reqLogin = (obj) => {
  // console.log(11111, obj)
  return request({
    method: 'post',
    url: '/sys/login',
    data: obj
  })
}
/**
 * 获取用户基本资料
 * @returns
 */
export const reqGetUserInfo = () => {
  return request({
    method: 'post',
    url: '/sys/profile'
  })
}
/**
 * 获取用户基本资料(头像)
 * @param {*} id
 * @returns
 */
export const reqGetBaseInfo = (id) => {
  return request({
    method: 'get',
    url: '/sys/user/' + id
  })
}

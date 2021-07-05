import request from '@/utils/request'
/**
 * 获取登入
 * @param {*} obj
 * @returns
 */
export const reqLogin = (obj) => {
  return request({
    method: 'post',
    url: '/sys/login',
    data: obj
  })
}


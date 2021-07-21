import request from '@/utils/request'
/**
 * 公司信息
 * @param {*} id
 * @returns
 */
export const reqGetCompanyById = (id) => {
  return request({
    method: 'get',
    url: '/company/' + id
  })
}

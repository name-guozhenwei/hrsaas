// 过滤器
import moment from 'moment'
export function formatDate(value, str = 'YYYY年MM月DD日') {
  return moment().format(str)
}

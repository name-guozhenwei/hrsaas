<template>
  <UploadExcel :on-success="handleSuccess" />
</template>

<script>
import { reqImportEmployee } from '@/api/employees'
export default {
  name: 'Import',
  methods: {
    // 表头 内容
    handleSuccess({ header, results }) {
      // console.log(header, results)
      if (this.$route.query.type === 'user') {
      // 进行员工的批量导入
        this.handleEmployeeBatch(header, results)
        // console.log('员工的批量导入')
      }
      if (this.$route.query.type === 'money') {
        console.log('工资的批量导入')
      }
    },

    // 进行批量员工导入 , 发请求拿数据
    async handleEmployeeBatch(header, results) {
      // 处理数据 , header , results中的数据是中文的,但是提交后台的要的是英文的,需要处理
      const userRelations = {
        '入职日期': 'timeOfEntry',
        '手机号': 'mobile',
        '姓名': 'username',
        '转正日期': 'correctionTime',
        '工号': 'workNumber'
      }
      const arr = []
      results.forEach(item => {
        // 准备一个空对象 ,换掉键 , 保留值
        const obj = {}
        for (const key in item) {
          // 拿到中文对应的英文键名 key 姓名
          const englishKey = userRelations[key]
          if (['timeOfEntry', 'correctionTime'].includes(englishKey)) {
            // 需要处理值
            obj[englishKey] = this.formatExcelDate(item[key], ':')
          } else {
            obj[englishKey] = item[key]
          }
        }
        arr.push(obj)
        // console.log(arr)
      })
      await reqImportEmployee(arr)
      // console.log(res)
      this.$message.success('导入成功')
      this.$router.push('/employees')
    },
    // 处理日期格式
    formatExcelDate(numb, format) {
      const time = new Date((numb) * 24 * 3600000 + 1) // 毫秒
      time.setYear(time.getFullYear() - 70)
      const year = time.getFullYear() + ''
      const month = time.getMonth() + 1 + ''
      const date = time.getDate() - 1 + ''
      if (format && format.length === 1) {
        return year + format + (month < 10 ? '0' + month : month) + format + (date < 10 ? '0' + date : date)
      }
      return year + (month < 10 ? '0' + month : month) + (date < 10 ? '0' + date : date)
    }
  }
}
</script>

<style>

</style>

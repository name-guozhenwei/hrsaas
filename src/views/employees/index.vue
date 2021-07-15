<template>
  <div class="employees-container">
    <div class="app-container">
      <PageTools>
        <template #left>
          <span>总条数: 16条</span>
        </template>
        <template #right>
          <el-button type="primary" size="mini" @click="$router.push('/import?type=user')">excel导入</el-button>
          <el-button type="primary" size="mini" @click="handleExport">excel导出</el-button>
          <el-button type="primary" size="mini" @click="showDialog = true">新增员工</el-button>
        </template>
      </PageTools>
      <el-card>
        <!-- 表格 -->
        <el-table border :data="list">
          <el-table-column label="序号" sortable="" type="index" :index="indexMethod" />
          <el-table-column label="姓名" sortable="" prop="username" />
          <el-table-column label="手机号" sortable="" prop="mobile" />
          <el-table-column label="工号" sortable="" prop="workNumber" />
          <el-table-column label="聘用形式" sortable="" prop="formOfEmployment" :formatter="formatEmployment" />
          <el-table-column label="部门" sortable="" prop="departmentName" />
          <el-table-column label="入职时间" sortable="" prop="timeOfEntry">
            <template #default="{row}">
              {{ row.timeOfEntry | formatDate }}
            </template>
          </el-table-column>
          <el-table-column label="操作" sortable="" fixed="right" width="280">
            <template #default="{row}">
              <el-button type="text" size="small" @click="$router.push(`/employees/detail/${row.id}`)">查看</el-button>
              <el-button type="text" size="small">转正</el-button>
              <el-button type="text" size="small">调岗</el-button>
              <el-button type="text" size="small">离职</el-button>
              <el-button type="text" size="small">角色</el-button>
              <el-button type="text" size="small" @click="delEmployee(row.id)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>

        <!-- 分页组件 -->
        <!--
              @current-change="handleCurrentChange" -->
        <div style="height: 60px; margin-top: 10px">
          <el-pagination
            :current-page="page"
            :page-sizes="[1, 2, 3, 4, 5, 6, 7, 8, 9, 10]"
            :page-size="size"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total"
            background
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
          />
        </div>

      </el-card>
      <AddEmployee :show-dialog.sync="showDialog" @add-employee="getUserList" />
    </div>
  </div>
</template>

<script>
import { reqGetUserList, reqDelEmployee } from '@/api/employees'
import obj from '@/api/constant/employees'
const { hireType } = obj
import AddEmployee from '@/views/employees/components/add-employee.vue'
import moment from 'moment'
// console.log(obj)
export default {
  name: 'Employees',
  components: {
    AddEmployee
  },
  data() {
    return {
      page: 1,
      size: 5,
      total: 0,
      list: [],
      showDialog: false
    }
  },
  created() {
    this.getUserList()
  },
  methods: {
    // 获取员工列表
    async getUserList() {
      const { data: { rows, total }} = await reqGetUserList(this.page, this.size)
      this.list = rows
      // console.log(this.list)
      this.total = total
    },
    // 处理员工列表分页  每页条数
    handleSizeChange(val) {
      this.size = val
      this.page = 1
      this.getUserList()
    },
    // 处理员工列表分页  当前页更新
    handleCurrentChange(val) {
      this.page = val
      // 重新发请求 渲染页面
      this.getUserList()
    },
    // 处理分页序号
    indexMethod(index) {
      return (this.page - 1) * this.size + index + 1
    },
    // 格式化聘用形式
    formatEmployment(row, column, callValue, index) {
      const obj = hireType.find(item => item.id === +callValue)
      return obj ? obj.value : '未知'
    },
    // 删除员工
    delEmployee(id) {
      this.$confirm('确定要删除此员工吗,此操作不可恢复', '温馨提示').then(async() => {
        await reqDelEmployee(id)
        if (this.list.length === 1 && this.page > 1) {
          this.page--
        }
        // 提示用户删除成功
        this.$message.success('删除成功')
        // 重新发送请求,重新渲染
        this.getUserList()
      }).catch(error => {
        console.log(error)
      })
    },
    // 处理批量导出员工
    async handleExport() {
      // 表格列头
      const headersArr = ['姓名', '手机号', '入职日期', '聘用日期', '转正日期', '工号', '部门']
      // 中英文对照关系
      // 需要处理的数据
      const headersRelations = {
        '姓名': 'username',
        '手机号': 'mobile',
        '入职日期': 'timeOfEntry',
        '聘用形式': 'formOfEmployment',
        '转正日期': 'correctionTime',
        '工号': 'workNumber',
        '部门': 'departmentName'
      }
      // 拿到的所有数据
      const { data: { rows }} = await reqGetUserList(1, this.total)
      console.log(rows)
      // 需要一个二维数组
      const resultArr = this.formatFn(rows, headersArr, headersRelations)
      import('@/vendor/Export2Excel').then(excel => {
        excel.export_json_to_excel({
          header: headersArr, // excel表格的表头
          data: resultArr, // excel的主体数据(固定格式规范) 二维数组
          filename: '员工信息表',
          autoWidth: true, // 宽度是否自适应
          bookType: 'xlsx' // 文件类型
        })
      })
    },
    // 这个方法的作用,根据传入的数据 rows , headersArr表头,中英对照关系,
    // 返回一个二维数组,能够直接用于展示
    formatFn(rows, headersArr, headersRelations) {
      const resultArr = []
      // 遍历rows
      rows.forEach(item => {
        const arr = []
        // 遍历headersArr,决定arr中的每一项,key中文键,englishKey 英文键
        headersArr.forEach((key, index) => {
          const englishKey = headersRelations[key]
          let val = item[englishKey]
          if (['timeOfEntry', 'correctionTime'].includes(englishKey)) {
            // 处理的是日期
            val = moment(val).format('YYYY年MM月DD日')
          }
          if (englishKey === 'formOfEmployment') {
            // 处理的是聘用形式 根据val ==> 1 ,作为 id , 去数组中找到对应的项,得到正式
            const result = hireType.find(hireTypeItem => hireTypeItem.id === +val)
            val = result ? result.value : '未知'
          }
          arr.push(val)
        })
        resultArr.push(arr)
      })
      return resultArr
    }
  }
}
</script>

<style>

</style>


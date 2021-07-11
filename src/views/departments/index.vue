<template>
  <div class="departments-container">
    <div class="app-container">
      <el-card v-loading="loading" class="tree-card">
        <!-- 用了一个行列布局 -->
        <TreeTools
          :node-data="company"
          :is-root="true"
          @add-depts="handleAddDepts"
        />
        <!-- 放置一个el-tree组件 -->
        <el-tree
          :data="departs"
          :props="defaultProps"
          default-expand-all
          @add-depts="handleAddDepts"
        >
          <!-- 用了一个行列布局 -->
          <template #default="{ data }">
            <TreeTools
              :node-data="data"
              @add-depts="handleAddDepts"
              @del-depts="getDepartments"
              @edit-depts="handleEditDepts"
            />
          </template>
        </el-tree>
      </el-card>
      <AddDept
        ref="addDept"
        :show-dialog.sync="showDialog"
        :dept-list="deptList"
        :node-data="nodeData"
        @add-depts="getDepartments"
      />

    </div>
  </div>
</template>
<script>
import TreeTools from './components/tree-tools.vue'
import AddDept from './components/add-dept.vue'
import { reqGetDepartment } from '@/api/departments'
import { tranListToTreeData } from '@/utils/index'
export default {
  name: 'Departments',
  components: {
    TreeTools,
    AddDept
  },

  data() {
    return {
      // 树形的数据
      departs: [],
      // 列表式的数据
      deptList: [],
      defaultProps: {
        label: 'name',
        children: 'children'
      },
      company: { name: '江苏传智播客教育科技股份有限公司', manager: '负责人' },
      showDialog: false,
      nodeData: {}, // 正在操作的部门
      loading: false

    }
  },
  created() {
    this.getDepartments()
  },
  methods: {
    async getDepartments() {
      this.loading = true
      const { data } = await reqGetDepartment()
      // console.log(data)
      this.company = {
        name: data.companyName,
        manager: '负责人'
      }
      // 需要将其转换成树形结构
      this.departs = tranListToTreeData(data.depts, '')
      this.deptList = data.depts //
      this.loading = false
    },
    // handleClose(flag) {
    //   this.showDialog = flag
    // },
    // 新增子部门
    handleAddDepts(nodeData) {
      // console.log(11)
      this.showDialog = true
      this.nodeData = nodeData
      // console.log('index-this.departs:', this.departs, '')
      // console.log(nodeData)
      // this.$refs.addDept.getSimpleUserList()
    },
    // 编辑部门
    handleEditDepts(nodeData) {
      // 显示弹框
      this.showDialog = true
      //
      this.nodeData = nodeData
      this.$nextTick(() => {
      // 通过ref查找元素
        this.$refs.addDept.getEmployeeSimple()
        this.$refs.addDept.GetDepartDetail(nodeData.id)
      })
    }

  }

}
</script>

<style lang='scss' scoped>
.el-tree {
  ::v-deep {
    // 小三角的样式, 去掉默认的小三角的旋转效果
    .el-tree-node__expand-icon.expanded {
      -webkit-transform: rotate(0deg);
      transform: rotate(0deg);
    }
    // 有子节点 且未展开 +
    .el-icon-caret-right:before {
      background: url("~@/assets/common/add-circle.png") no-repeat 0 0;
      content: '';
      display: block;
      width: 16px;
      height: 16px;
      font-size: 16px;
      background-size: 16px;
    }
    // 有子节点 且已展开 -
    .el-tree-node__expand-icon.expanded.el-icon-caret-right:before{
      background: url("~@/assets/common/minus-circle.png") no-repeat 0 0;
      content: '';
      display: block;
      width: 16px;
      height: 16px;
      font-size: 16px;
      background-size: 16px;
    }
    // 没有子节点
    .el-tree-node__expand-icon.is-leaf::before  {
      background: url("~@/assets/common/user-filling.png") no-repeat 0 0;
      content: '';
      display: block;
      width: 16px;
      height: 16px;
      font-size: 16px;
      background-size: 16px;
    }
  }
}
</style>


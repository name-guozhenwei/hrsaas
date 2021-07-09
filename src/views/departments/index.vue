<template>
  <div class="departments-container">
    <div class="app-container">
      <el-card class="tree-card">
        <!-- 用了一个行列布局 -->
        <tree-tools :node-data="company" :is-root="true" />
        <!-- 放置一个el-tree组件 -->
        <el-tree
          :data="departs"
          :props="defaultProps"
          default-expand-all
        >
          <!-- 用了一个行列布局 -->
          <template #default="{ data }">
            <tree-tools :node-data="data" @del-depts="getDepartments" />
          </template>
        </el-tree>
      </el-card>

    </div>
  </div>
</template>
<script>
import TreeTools from './components/tree-tools.vue'
import { reqGetDepartment } from '@/api/departments'
import { tranListToTreeData } from '@/utils/index'
export default {
  name: 'Departments',
  components: {
    TreeTools
  },

  data() {
    return {
      departs: [
        // {
        //   name: '总裁办',
        //   manager: '曹操',
        //   children: [{ name: '董事会', manager: '曹丕' }]
        // },
        // { name: '行政部', manager: '刘备' },
        // { name: '人事部', manager: '孙权' }
      ],
      defaultProps: {
        label: 'name',
        children: 'children'
      },
      company: { }

    }
  },
  created() {
    this.getDepartments()
  },
  methods: {
    async getDepartments() {
      const { data } = await reqGetDepartment()
      // console.log(data)
      this.company = {
        name: data.companyName,
        manager: '负责人'
      }
      this.departs = tranListToTreeData(data.depts, '')
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


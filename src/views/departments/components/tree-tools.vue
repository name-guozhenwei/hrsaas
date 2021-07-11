<template>
  <el-row
    type="flex"
    justify="space-between"
    align="middle"
    style="height: 40px; width: 100%;"
  >
    <el-col :span="20">
      <span>{{ nodeData.name }}</span>
    </el-col>
    <el-col :span="4">
      <el-row type="flex" justify="end">
        <!-- 两个内容 -->
        <el-col>{{ nodeData.manager }}</el-col>
        <el-col>
          <!-- 下拉菜单 element -->
          <el-dropdown @command="handleCommand">
            <span> 操作<i class="el-icon-arrow-down" /> </span>
            <!-- 下拉菜单 -->
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command="add">添加子部门</el-dropdown-item>
              <el-dropdown-item v-if="!isRoot" command="edit">编辑部门</el-dropdown-item>
              <el-dropdown-item v-if="!isRoot" command="del">删除部门</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </el-col>
      </el-row>
    </el-col>
  </el-row>
</template>

<script>
import { reqDelDepartments } from '@/api/departments'
export default {
  props: {
    // 节点的内容展示
    nodeData: {
      type: Object,
      required: true
    },
    // 是否根节点
    isRoot: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    handleCommand(type) {
      if (type === 'add') {
        this.$emit('add-depts', this.nodeData) // 将来添加子部门的需要
        console.log('添加部门')
      }
      if (type === 'edit') {
        // console.log('编辑操作')
        this.$emit('edit-depts', this.nodeData)
      }
      // 实现删除部门  使用element ui框架
      if (type === 'del') {
        this.$confirm('您确定要删除此部门吗', '温馨提示').then(async() => {
          await reqDelDepartments(this.nodeData.id)
          //   console.log(res)
          // 添加删除成功的提示
          this.$message.success('删除成功')
          // 通知父组件更新
          this.$emit('del-depts')
        }).catch(error => {
          console.log(error)
        })
      }
    }
  }
}
</script>

<style>

</style>

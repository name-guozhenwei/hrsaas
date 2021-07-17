<template>
  <el-dialog class="assign-role" title="分配角色" :visible="showRoleDialog" @open="dialogOpen" @close="closeDialog">
    <!-- el-checkbox-group选中的是 当前用户所拥有的角色  需要绑定 当前用户拥有的角色-->

    <el-checkbox-group v-model="roleIds" v-loading="loading">
      <el-checkbox v-for="item in list" :key="item.id" :label="item.id">{{ item.name }}</el-checkbox>

      <!-- 选项 -->
    </el-checkbox-group>

    <template #footer>
      <div style="text-align: right">
        <el-button type="primary" @click="clickSubmit">确定</el-button>
        <el-button @click="closeDialog">取消</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script>
import { reqGetRoleList } from '@/api/setting'
import { reqGetUserDetailById, reqAssignRoles } from '@/api/employees'
export default {
  name: 'AssignRole',
  props: {
    showRoleDialog: {
      type: Boolean,
      default: false
    },
    // 用户的id,用来查询当前用户的角色信息
    userId: {
      type: String,
      default: null
    }
  },
  data() {
    return {
      list: [],
      roleIds: [],
      loading: false
    }
  },
  created() {
    // this.getRoleList()
    // this.getUserDetailById()
  },
  methods: {
    // 使用el-dialog方法的@open,点击打开时发送请求,渲染数据
    dialogOpen() {
      this.loading = true
      Promise.all([this.getRoleList(), this.getUserDetailById()].then(() => {
        this.loading = false
      }).catch(error => {
        console.log(error)
      })
      )
    },
    // 点击关闭分配角色的弹框
    closeDialog() {
      this.$emit('update:showRoleDialog', false)
    },
    // 发请求拿数据(角色列表)
    async getRoleList() {
      const { data: { rows }} = await reqGetRoleList(1, 100)
      this.list = rows
    },
    // 获取员工信息信息 进行回显
    async getUserDetailById(id) {
      id = id || this.userId
      const { data: { roleIds }} = await reqGetUserDetailById(id)
      this.roleIds = roleIds
    },
    // 给员工分配角色
    async clickSubmit() {
      await reqAssignRoles({
        id: this.userId,
        roleIds: this.roleIds
      })
      // 调用closeDialog()方法(关闭弹框与重新渲染页面)
      this.closeDialog()
      this.$message.success('分配权限成功')
    }

  }
}
</script>

<style lang="scss" scoped>
.assign-role {
  ::v-deep {
    .el-checkbox {
      font-size: 30px;
    }
  }
}
</style>

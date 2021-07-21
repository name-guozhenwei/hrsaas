<template>
  <div class="employees-detail-container">
    <div class="app-container">
      <el-card>
        <el-tabs>
          <el-tab-pane label="登录账号设置">
            <!-- 放置表单 -->
            <el-form ref="userForm" :rules="rules" label-width="120px" style="margin-left: 120px; margin-top:30px" :model="userInfo">
              <el-form-item label="姓名:" prop="username">
                <el-input v-model="userInfo.username" style="width:300px" />
              </el-form-item>
              <el-form-item label="密码:" prop="newPassword">
                <el-input v-model="userInfo.newPassword" style="width:300px" type="password" />
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="saveUser">更新</el-button>
              </el-form-item>
            </el-form>
          </el-tab-pane>
          <el-tab-pane label="个人详情">
            <el-tooltip class="tooltip-box" content="打印基本个人信息">
              <router-link :to="`/employees/print/${userId}?type=personal`">
                <i class="el-icon-printer" />
              </router-link>
            </el-tooltip>
            <UserInfo />
          </el-tab-pane>
          <el-tab-pane label="岗位信息">
            <!-- 内容 -->
            <el-tooltip class="tooltip-box" content="打印基本岗位信息">
              <router-link :to="`/employees/print/${userId}?type=job`">
                <i class="el-icon-printer" />
              </router-link>
            </el-tooltip>
            <JobInfo />
          </el-tab-pane>
        </el-tabs>
      </el-card>
    </div>
  </div>
</template>

<script>
import { reqGetUserDetailById, reqSaveUserDetailById } from '@/api/employees'
import UserInfo from '@/views/employees/components/UserInfo.vue'
import JobInfo from '@/views/employees/components/JobInfo.vue'

export default {
  name: 'EmployeesDetail',
  components: {
    UserInfo,
    JobInfo
  },
  data() {
    return {
      userInfo: {
        username: '',
        newPassword: ''
      },
      // 给表单做校验
      rules: {
        username: [
          { required: true, message: '姓名不能为空', trigger: ['blur', 'change'] }
        ],
        newPassword: [
          { message: '密码不能为空', trigger: ['blur', 'change'] },
          { min: 4, max: 10, message: '密码必须为4-10位', trigger: ['blur', 'change'] }
        ]
      }
    }
  },
  computed: {
    userId() {
      return this.$route.params.id
    }
  },
  // 发请求 拿数据进行回显
  async created() {
    const { data } = await reqGetUserDetailById(this.userId)
    // console.log(data)
    this.userInfo = data
  },
  methods: {
  // 点击更新按钮,更新员工信息
    saveUser() {
      this.$refs.userForm.validate(async flag => {
        // 校验不通过
        if (!flag) return
        // 校验通过
        await reqSaveUserDetailById({
          ...this.userInfo,
          password: this.userInfo.newPassword
        })
        // console.log(res)
        this.$message.success('更新成功')
      })
    }

  }
}
</script>
<style lang="scss" scoped>
.employees-detail-container {
  .el-tab-pane {
    padding-top: 10px;
  }
  .tooltip-box {
    position: absolute;
    right: 30px;
    top: 10px;
    z-index: 999;
  }
}
</style>

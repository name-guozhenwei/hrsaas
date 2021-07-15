<template>
  <div class="setting-container">
    <div class="app-container">
      <el-card v-loading="loading">
        <el-tabs>
          <!-- 左侧 -->
          <el-tab-pane label="角色管理">
            <el-button
              icon="el-icon-plus"
              size="small"
              type="primary"
              @click="showDialog = true"
            >
              新增角色</el-button>
            <!-- 表格 -->
            <el-table :data="list">
              <el-table-column :index="indexMethod" label="序号" width="120" type="index" />
              <el-table-column prop="name" label="角色名称" width="240" />
              <el-table-column prop="description" label="描述" width="300" />
              <el-table-column label="操作" width="400">
                <template #default="{row}">
                  <el-button size="small" type="success">分配权限</el-button>
                  <el-button size="small" type="primary" @click="edit(row.id)">编辑</el-button>
                  <el-button size="small" type="danger" @click="delRole(row.id)">删除</el-button>
                </template>

              </el-table-column>
            </el-table>
            <!-- 分页 -->
            <!--
              :current-page  当前页
              :page-sizes    可供选择的每页条数
              :page-size     当前默认生效的每页条数
              :total         总条数
              layout         布局控件,控制显示多少个控件
              background     背景色
              @size-change="handleSizeChange"         每页条数变化
              @current-change="handleCurrentChange"   当前页变化
            -->
            <el-pagination
              :current-page="page"
              :page-sizes="[1,2,3,4,5,]"
              :page-size="pagesize"
              :total="total"
              layout="total, sizes, prev, pager, next, jumper"
              background
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
            />
          </el-tab-pane>
          <!-- 公司信息 -->
          <el-tab-pane label="公司信息">
            <el-alert
              title="对公司名称、公司地址、营业执照、公司地区的更新，将使得公司资料被重新审核，请谨慎修改"
              type="info"
              show-icon
              :closable="false"
            />
            <!-- 表单 -->
            <el-form label-width="120px" style="margin-top:50px">
              <el-form-item label="公司名称">
                <el-input v-model="companyForm.name" disabled style="width:400px" />
              </el-form-item>
              <el-form-item label="公司地址">
                <el-input v-model="companyForm.companyAddress" disabled style="width:400px" />
              </el-form-item>
              <el-form-item label="邮箱">
                <el-input v-model="companyForm.mailbox" disabled style="width:400px" />
              </el-form-item>
              <el-form-item label="备注">
                <el-input v-model="companyForm.remarks" type="textarea" :rows="3" disabled style="width:400px" />
              </el-form-item>
            </el-form></el-tab-pane>
        </el-tabs>
      </el-card>
      <!-- 弹层 -->
      <el-dialog :title="showTitle" :visible="showDialog" @close="showDialog = false">
        <el-form ref="form" label-width="100px" :model="form" :rules="rules">
          <el-form-item label="添加角色" prop="name">
            <el-input v-model="form.name" placeholder="请输入角色名称" />
          </el-form-item>
          <el-form-item label="角色描述" prop="description">
            <el-input v-model="form.description" placeholder="请输入角色描述" />
          </el-form-item>
        </el-form>
        <template>
          <el-button type="primary" @click="clickSubmit">确认</el-button>
          <el-button @click="showDialog = false">取消</el-button>

        </template>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import { reqGetRoleList, reqDelRole, reqAddRole, reqGetRoleDetail, reqUpdateRole } from '@/api/setting'
import { reqGetCompanyById } from '@/api/company'
import { mapState } from 'vuex'
export default {
  name: 'Setting',
  data() {
    return {
      list: [],
      total: 0,
      page: 1, // 当前页
      pagesize: 3, // 每页总数
      Loading: false,
      showDialog: false,
      companyForm: {
        name: '',
        companyAddress: '',
        mailbox: '',
        remarks: ''
      },
      // 校验的表单
      form: {
        name: '', // 角色名字
        description: ''
      },
      // 检验的规则
      rules: {
        name: [
          { required: true, message: '角色名称不能为空', trigger: ['blur', 'change'] }
        ],
        description: [
          { required: true, message: '角色描述不能为空', trigger: ['blur', 'change'] }
        ]
      }

    }
  },
  computed: {
    showTitle() {
      return this.form.id ? '编辑角色' : '添加角色'
    },
    ...mapState('user', ['userInfo'])
  },
  created() {
    // 一进页面就调用角色列表
    this.getRoleList() // 获取角色列表
    this.getCompanyInfo() // 获取公司信息
  },
  methods: {
    // 角色管理
    async getRoleList() {
      this.loading = true

      const res = await reqGetRoleList(this.page, this.pagesize)
      this.list = res.data.rows
      this.total = res.data.total
      // console.log(this.list)
      // console.log(this.total)
      this.loading = false
    },
    // 分页之 每页条数
    handleSizeChange(val) {
      // 更新每页条数
      this.pagesize = val
      // 重置成第一页(规范) 每页条数变化后 当前页已经不是之前的当前页了,需要重置
      this.page = 1
      // 调用方法 重新渲染
      this.getRoleList()
    },
    // 分页 之当前页
    handleCurrentChange(val) {
      // 更新当前页
      this.page = val
      // 重新请求获取新的当前页的数据
      this.getRoleList()
    },
    // 处理分页
    indexMethod(index) {
      return (this.page - 1) * this.pagesize + index + 1
    },
    // 删除角色
    delRole(id) {
      this.$confirm('您确定要删此角色,此操作不可恢复', '温馨提示').then(async() => {
        await reqDelRole(id)
        // console.log(res)
        // 判断 如果仅剩最后一条,还删除成功了! 这个时候应该当前页 -1
        if (this.list.length === 1 && this.page > 1) {
          this.page--
        }
        // 提示用户 删除角色成功
        this.$message.success('删除角色成功')
        // 重新调用方法 , 渲染页面
        this.getRoleList()
      }).catch(error => {
        console.log(error)
      })
    },
    // 添加角色
    clickSubmit() {
      this.$refs.form.validate(async flag => {
        // 表单校验不通过 直接 return
        if (!flag) return
        if (this.form.id) {
          // 编辑操作
          await reqUpdateRole(this.form)
        } else {
          // 添加操作
          await reqAddRole(this.form)
        }
        // 检验通过 发请求拿数据
        // 添加之后关闭弹层
        this.showDialog = false
        // 提示用户添加成功
        this.$message.success('操作成功')
        // 调用数据,重新渲染
        this.getRoleList()
        // 添加成功后清空表单内容
        this.form = {
          name: '',
          description: ''
        }
        // 重置状态
        this.$refs.form.resetFields()
      })
    },
    // 编辑角色
    async edit(id) {
      const { data } = await reqGetRoleDetail(id)
      // console.log(res)
      this.form = data
      this.showDialog = true
      // this.$message.success('')
    },
    // 获取公司信息
    async getCompanyInfo() {
      const res = await reqGetCompanyById(this.userInfo.companyId)
      // console.log(res)
      this.companyForm = res.data
      // console.log(this.companyForm)
    }

  }

}
</script>

<style>

</style>


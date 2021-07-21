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
                  <el-button size="small" type="success" @click="clickShowAssignDialog(row.id)">分配权限</el-button>
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
      <!-- 分配权限弹框 -->
      <el-dialog
        title="分配权限"
        :visible="showAssignDialog"
        @close="closeAssignDialog"
        @open="openAssignDialog"
      >
        <el-tree
          ref="tree"
          v-loading="treeLoading"
          :data="permissionData"
          :props="{ label: 'name'}"
          :default-expand-all="true"
          :show-checkbox="true"
          :check-strictly="true"
          node-key="id"
        />
        <template #footer>
          <div style="text-align:right">
            <el-button @click="closeAssignDialog">取消</el-button>
            <el-button type="primary" @click="clickAssign">确定</el-button>
          </div>
        </template>
      </el-dialog>
      <!-- 树形控件显示 -->
      <!--
        show-checkbox 显示选择框
        default-expand-all默认展开
        check-strictly设置true,可以关闭父子关联
        -->

    </div>
  </div>
</template>

<script>
import { reqGetRoleList, reqDelRole, reqAddRole, reqGetRoleDetail, reqUpdateRole } from '@/api/setting'
import { reqGetCompanyById } from '@/api/company'
import { reqAssignPrem } from '@/api/setting'
import { reqGetPermissionList } from '@/api/permission'
import { tranListToTreeData } from '@/utils/index'
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
      showAssignDialog: false, // 控制分配权限弹层的显示与隐藏
      roleId: '', // 记录正在操作的角色
      permissionData: [], // 存储权限数据
      treeLoading: [], // 存储已选中的权限id列表
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
    },
    // 点击显示分配权限的弹层
    clickShowAssignDialog(id) {
      this.roleId = id
      this.showAssignDialog = true
    },
    // 点击关闭分配权限的弹层
    closeAssignDialog() {
      this.showAssignDialog = false
    },
    // 点击显示,发送请求,给弹层注册open事件,进行回显
    async openAssignDialog() {
      this.treeLoading = true
      // 发送请求 获取权限列表
      const { data: permissionData } = await reqGetPermissionList()
      this.permissionData = tranListToTreeData(permissionData, '0')
      // 发送请求, 获取已有权限
      const { data: roleDetail } = await reqGetRoleDetail(this.roleId)
      this.$refs.tree.setCheckedKeys(roleDetail.permIds)
      this.treeLoading = false
    },
    // 点击确定分配权限
    async clickAssign() {
      // 1. 拿到选中的所有权限
      const permIds = this.$refs.tree.getCheckedKeys()
      // 2. 发送请求
      await reqAssignPrem(this.roleId, permIds)
      // console.log(res)
      this.$message.success('分配权限成功')
      // 调用关闭弹框的方法,关闭弹框
      this.closeAssignDialog()
    }

  }

}
</script>

<style>

</style>


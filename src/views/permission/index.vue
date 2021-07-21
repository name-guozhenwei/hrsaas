<template>
  <div class="permission-container">
    <div class="app-container">
      <!-- 表格 -->
      <el-card>
        <div style="text-align: right; margin-bottom: 20px">
          <el-button type="primary" size="small" @click="clickAdd(1,'0')">添加权限</el-button>
        </div>
        <el-table border :data="list" row-key="id">
          <el-table-column label="名称" prop="name" />
          <el-table-column label="标识" prop="code" />
          <el-table-column label="描述" prop="description" />
          <el-table-column label="操作">
            <template #default="{row}">
              <el-button
                v-if="row.type === 1"
                size="small"
                type="text"
                @click="clickAdd(2,row.id)"
              >
                添加权限点
              </el-button>
              <el-button size="small" type="text" @click="clickEdit(row.id)">查看</el-button>
              <el-button size="small" type="text" @click="clickDel(row.id)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-card>
      <!-- 新增编辑的弹层 -->
      <el-dialog :visible="showDialog" :title="showTitle" @close="closeDialog">
        <!-- 表单内容 -->
        <el-form label-width="100px" :model="formData">
          <el-form-item label="权限名称" prop="name">
            <el-input v-model="formData.name" />
          </el-form-item>
          <el-form-item label="权限标识" prop="code">
            <el-input v-model="formData.code" />
          </el-form-item>
          <el-form-item label="权限描述" prop="description">
            <el-input v-model="formData.description" />
          </el-form-item>
          <el-form-item label="权限启用" prop="enVisible">
            <el-switch
              v-model="formData.enVisible"
              active-text="启用"
              active-value="1"
              inactive-text="不启用"
              inactive-value="0"
            />
          </el-form-item>
        </el-form>

        <template #footer>
          <div style="text-align: right;">
            <el-button @click="showDialog = false">取消</el-button>
            <el-button type="primary" @click="clickSubmit">确定</el-button>
          </div>
        </template>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import { reqGetPermissionList, reqAddPermission, reqDelPermission, reqGetPermissionDetail, reqUpdatePermission } from '@/api/permission'
import { tranListToTreeData } from '@/utils/index'
export default {
  name: 'Permission',
  data() {
    return {
      list: [],
      showDialog: false,
      formData: {
        enVisible: '0', // 启用禁用, 0禁用, 1启用
        name: '', // 名称
        code: '', // 权限标识
        description: '', // 描述
        type: '', // 类型标记了一级(页面访问权) 二级(按钮操作权)
        pid: '' // 添加到哪个节点下
      }
    }
  },
  computed: {
    showTitle() {
      return this.formData.id ? '编辑角色' : '添加权限'
    }
  },
  created() {
    this.getPermissionList()
  },

  methods: {
    clickAdd(type, pid) {
      this.showDialog = true
      this.formData.type = type
      this.formData.pid = pid
    },
    closeDialog() {
      this.showDialog = false
      this.formData = {
        enVisible: '0', // 启用禁用, 0禁用, 1启用
        name: '', // 规则名称
        code: '', // 权限标识（唯一，给将来判断用的）
        description: '', // 规则描述
        type: '', // 类型标记了一级(页面访问权) 二级(按钮操作权)
        pid: '' // 添加到哪个节点下
      }
    },
    // 获取权限列表
    async getPermissionList() {
      const { data } = await reqGetPermissionList()
      this.list = tranListToTreeData(data, '0')
      // console.log(this.list)
    },
    // 添加权限
    async clickSubmit() {
      // 表单非空校验
      if (this.formData.name === '' || this.formData.code === '') {
        this.$message.error('权限名称与权限表示不能为空')
        return
      }
      //  通过判断 formData 中有没有 id 如果有id 则是编辑角色
      if (this.formData.id) {
        // 编辑角色
        // 发请求,更新角色权限
        await reqUpdatePermission(this.formData)
        this.$message.success('编辑成功')
      } else {
      // 发请求
        await reqAddPermission(this.formData)
      }
      // 提示用户添加成功
      this.$message.success('添加成功')
      // 重新渲染页面
      this.getPermissionList()
      // 添加成功后关闭弹框
      this.showDialog = false
    },
    // 删除权限
    async clickDel(id) {
      // 提示用户是否删除
      this.$confirm('确定要删除该权限吗,此操作不可恢复', '温馨提示').then(async() => {
        // 发请求删除权限
        await reqDelPermission(id)
        // 重新渲染页面
        this.getPermissionList()
        // 提示用户删除成功
        this.$message.success('删除权限成功')
      }).catch(error => {
        console.log(error)
      })
    },
    // 编辑权限
    async clickEdit(id) {
      this.showDialog = true
      const { data } = await reqGetPermissionDetail(id)
      this.formData = data
      // this.showDialog = true
    }

  }
}
</script>

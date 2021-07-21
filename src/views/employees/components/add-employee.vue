<template>
  <el-dialog title="新增员工" :visible="showDialog" top="8vh" @close="closeDialog" @click.native="clickDialog">
    <!-- 表单 -->
    <el-form ref="addForm" label-width="120px" :model="formData" :rules="rules">
      <el-form-item label="姓名" prop="username">
        <el-input v-model="formData.username" style="width:50%" placeholder="请输入姓名" />
      </el-form-item>
      <el-form-item label="手机" prop="mobile">
        <el-input v-model="formData.mobile" style="width:50%" placeholder="请输入手机号" />
      </el-form-item>
      <el-form-item label="入职时间" prop="timeOfEntry">
        <el-date-picker v-model="formData.timeOfEntry" style="width:50%" placeholder="请选择入职时间" />
      </el-form-item>
      <el-form-item label="聘用形式" prop="formOfEmployment">
        <el-select v-model="formData.formOfEmployment" style="width:50%" placeholder="请选择">
          <el-option
            v-for="item in hireType"
            :key="item.id"
            :label="item.value"
            :value="item.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="工号" prop="workNumber">
        <el-input v-model="formData.workNumber" style="width:50%" placeholder="请输入工号" />
      </el-form-item>
      <el-form-item label="部门" prop="departmentName">
        <el-input
          v-model="formData.departmentName"
          disabled
          style="width:50%"
          placeholder="请选择部门"
          @click.native.stop="getDepartment"
        />
        <div v-if="isShowTree" class="tree-box">
          <el-tree
            v-loading="loading"
            :data="treeData"
            :props="{label:'name'}"
            @node-click="handleNodeClick"
          />
        </div>
      </el-form-item>
      <el-form-item label="转正时间" prop="correctionTime">
        <el-date-picker v-model="formData.correctionTime" style="width:50%" placeholder="请选择转正时间" />
      </el-form-item>
    </el-form>
    <!-- footer 插槽 -->
    <template #footer>
      <el-button @click="closeDialog">取消</el-button>
      <el-button type="primary" @click="clickSubmit">确定</el-button>
    </template>
  </el-dialog>
</template>

<script>
import { reqGetDepartment } from '@/api/departments'
import { reqAddEmployee } from '@/api/employees'
import { tranListToTreeData } from '@/utils/index'
import obj from '@/api/constant/employees'
const { hireType } = obj
export default {
  name: 'AddEmployee',
  props: {
    showDialog: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      formData: {
        username: '', // 用户名
        mobile: '', // 手机号
        formOfEmployment: '', // 聘用形式
        workNumber: '', // 工号
        departmentName: '', // 部门
        timeOfEntry: '', // 入职时间
        correctionTime: '' // 转正时间
      },
      rules: {
        username: [
          { required: true, message: '用户姓名不能为空', trigger: ['blur', 'change'] },
          { min: 1, max: 4, message: '用户姓名为1-4位', trigger: ['blur', 'change'] }
        ],
        mobile: [
          { required: true, message: '手机号不能为空', trigger: ['blur', 'change'] },
          { pattern: /^1[3-9]\d{9}$/, message: '手机号格式不正确', trigger: ['blur', 'change'] }
        ],
        formOfEmployment: [
          { required: true, message: '聘用形式不能为空', trigger: ['blur', 'change'] }
        ],
        workNumber: [
          { required: true, message: '工号不能为空', trigger: ['blur', 'change'] }
        ],
        departmentName: [
          { required: true, message: '部门不能为空', trigger: ['blur', 'change'] }
        ],
        timeOfEntry: [
          { required: true, message: '请选择入职时间', trigger: ['blur', 'change'] }
        ]
      },
      treeData: [], // 定义数组接收树形数据
      loading: false,
      isShowTree: false,
      hireType
    }
  },
  methods: {
    // 点击叉号与取消关闭弹层
    closeDialog() {
      // 重置原来的数据
      this.formData = {
        username: '',
        mobile: '',
        formOfEmployment: '',
        workNumber: '',
        departmentName: '',
        timeOfEntry: '',
        correctionTime: ''
      }
      this.$emit('update:showDialog', false)
      this.$refs.addForm.resetFields()
    },
    // 获取部门列表
    async getDepartment() {
      this.isShowTree = !this.isShowTree
      // 如果树形控件没有展示,直接return
      if (this.isShowTree === false) return
      // 发请求,获取部门列表数据
      this.loading = true
      const { data: { depts }} = await reqGetDepartment()
      const treeData = tranListToTreeData(depts, '')
      this.treeData = treeData
      this.loading = false
    },
    clickDialog() {
      this.isShowTree = false
    },
    // 给树的每个节点,都注册上了点击事件
    handleNodeClick(nodeData) {
      // 可供选择的应该是叶子节点,如果节点有children,不是叶子节点
      // 进行的是展开折叠操作
      if (nodeData.children && nodeData.children.length > 0) return
      // 将选择中的叶子节点赋值给表单
      this.formData.departmentName = nodeData.name
      // 隐藏tree
      this.isShowTree = false
    },
    // 点击确认添加员工
    clickSubmit() {
      this.$refs.addForm.validate(async flag => {
        // 校验不通过
        if (!flag) return
        // 校验通过 发送请求
        const res = await reqAddEmployee(this.formData)
        console.log(res)
        this.$message.success('添加成功')
        // 关闭弹窗 ,重新状态
        this.closeDialog()
        this.$emit('add-employee')
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.tree-box {
  position: absolute;
  width: 50%;
  min-height: 50px;
  left: 0;
  top: 45px;
  z-index: 100;
  border: 1px solid #ccc;
  border-radius: 4px;
  padding-right: 5px;
  overflow: hidden;
  background-color: #fff;
  max-height: 200px;
  overflow: auto;
  ::v-deep {
    .el-tree-node__content {
      height: auto;
    }
  }
}
</style>

<template>
  <!-- :model  :rules  prop v-modle-->
  <!-- 放置弹层组件 -->
  <el-dialog :title="showTitle" :visible="showDialog" @close="handleCloseDialog">
    <!-- 表单组件 el-form label-width设置label的宽度 -->
    <!-- 匿名插槽 -->
    <el-form ref="form" label-width="120px" :model="form" :rules="rules">
      <!-- 部门名称 -->
      <el-form-item label="部门名称" prop="name">
        <el-input v-model="form.name" style="width:100%" placeholder="1-10个字符" />
      </el-form-item>
      <!-- 部门编码 -->
      <el-form-item label="部门编码" prop="code">
        <el-input v-model="form.code" style="width:100%" placeholder="1-10个字符" />
      </el-form-item>
      <!-- 部门负责人吗 -->
      <el-form-item label="部门负责人" prop="manager">
        <el-select v-model="form.manager" style="width:80%" placeholder="请选择">
          <el-option v-for="item in userList" :key="item.id" :value="item.username" :label="item.username" />
        </el-select>
      </el-form-item>
      <!-- 部门介绍 -->
      <el-form-item label="部门介绍" prop="introduce">
        <el-input v-model="form.introduce" style="width:100%" placeholder="1-300个字符" type="textarea" :rows="3" />
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button type="primary" size="small" @click="clickSubmit">确定</el-button>
      <el-button size="small" @click="handleCloseDialog">取消</el-button>
    </template>
  </el-dialog>
</template>

<script>
import { reqGetEmployeeSimple } from '@/api/user'
import { reqAddDepartments, reqGetDepartDetail, reqUpdateDepartments } from '@/api/departments'
export default {
  // 需要传入一个props变量来控制 显示或者隐藏
  props: {
    showDialog: {
      type: Boolean,
      default: true
    },
    nodeData: {
      type: Object,
      required: true
    },
    deptList: {
      type: Array,
      required: true
    }
  },
  data() {
    const validateName = (rules, value, callback) => {
      let arr = []
      if (this.form.id) {
        if (this.nodeData.name === value) {
          callback()
          return
        }
        arr = this.deptList.filter(item => this.nodeData.pid === item.id

        )
      } else {
        arr = this.deptList.filter(item => this.nodeData.id === item.id)
      }
      // 2. 只要value和arr 中任意一个部门的name相同,就不同校验
      const isRepeat = arr.some(item => item.name === value)
      isRepeat ? callback(new Error('部门名称已经存在')) : callback()
    }
    const validateCode = (rules, value, callback) => {
      // 校验编辑操作,是可以和原来的自己的code重复的
      if (this.form.id && this.nodeData.code === value) {
        callback()
        return
      }
      // 校验code是否有重复项
      const isRepeat = this.deptList.some(item => item.code === value)
      // console.log(isRepeat)
      isRepeat ? callback(new Error('部门编号已经存在')) : callback()
    }
    return {
      // 需要数据结构
      form: {
        name: '', // 部门名称
        code: '', // 部门编码
        manager: '', // 部门管理者
        introduce: '' // 部门介绍
      },
      //   userList: [],
      // 定义校验规则
      rules: {
        name: [
          { required: true, message: '部门名称不能为空', trigger: ['blur', 'change'] },
          { min: 1, max: 10, message: '部门名称要求1-10个字符', trigger: ['blur', 'change'] },
          { validator: validateName, trigger: 'blur' }
        ],
        code: [
          { required: true, message: '部门编号不能为空', trigger: ['blur', 'change'] },
          { min: 1, max: 10, message: '部门编号要求1-10个字符', trigger: ['blur', 'change'] },
          { validator: validateCode, trigger: 'blur' }
        ],
        manager: [
          { required: true, message: '部门负责人不能为空', trigger: ['blur', 'change'] }
        ],
        introduce: [
          { required: true, message: '部门介绍不能为空', trigger: ['blur', 'change'] },
          { min: 1, max: 300, message: '部门介绍要求1-300个字符', trigger: ['blur', 'change'] }
        ]
      },
      userList: []
      // showTitle: null
    }
  },
  computed: {
    showTitle() {
      return this.form.id ? '编辑部门' : '新增部门'
    }
  },
  created() {
    this.getEmployeeSimple()
  },
  methods: {
    handleCloseDialog() {
      // 点击叉号,关闭弹窗
      this.$emit('update:showDialog', false)
      // 新增后清除表单数据
      this.$refs.form.resetFields()
    //   console.log(11)
    },
    // 获取员工简单列表
    async getEmployeeSimple() {
      // console.log('发送请求，获取员工简单列表')
      const { data } = await reqGetEmployeeSimple()
      // console.log(data)
      this.userList = data
      // console.log(this.userList)
    },
    // 获取部门列表,进行回显
    async GetDepartDetail(id) {
      const res = await reqGetDepartDetail(id)
      // console.log(res)
      this.form = res.data
      // console.log(res.data)
    },
    // 点击提交form表单
    clickSubmit() {
      this.$refs.form.validate(async flag => {
        // 判断如果没有通过校验 直接return
        if (!flag) return
        // 通过校验
        // 点击了确定,有可能编辑,也有可能是添加
        if (this.form.id) {
          // 编辑
          await reqUpdateDepartments(this.form)
          // console.log(res)
          this.$message.success('更新部门成功')
        } else {
          // 添加
          // 通过了校验
          await reqAddDepartments({ ...this.form, pid: this.nodeData.id })
          // 提示用户新增成功
          this.$message.success('新增部门成功')
        }
        // 关闭弹框
        this.handleCloseDialog()
        // 通知父组件,重新渲染
        this.$emit('add-depts')
        // console.log(res)
      })
    }

  }
}
</script>

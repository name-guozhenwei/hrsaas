<template>
  <!-- :model  :rules  prop v-modle-->
  <!-- 放置弹层组件 -->
  <el-dialog title="新增部门" :visible="showDialog" @close="handleCloseDialog">
    <!-- 表单组件 el-form label-width设置label的宽度 -->
    <!-- 匿名插槽 -->
    <el-form label-width="120px" :model="form" :rules="rules">
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
        <el-select v-model="form.manager" style="width:80%" placeholder="请选择" />
      </el-form-item>
      <!-- 部门介绍 -->
      <el-form-item label="部门介绍" prop="introduce">
        <el-input v-model="form.introduce" style="width:100%" placeholder="1-300个字符" type="textarea" :rows="3" />
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button type="primary" size="small">确定</el-button>
      <el-button size="small">取消</el-button>
    </template>
  </el-dialog>
</template>

<script>
// import { reqGetSimpleUserList } from '@/api/user'
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
      // 1.根据老父亲 nodeData.id 作为item.pid ,找所有兄弟
      // console.log(value, this.nodeData.id, this.deptList)
      console.log('this.deptList:', this.deptList)
      const arr = this.deptList.filter(item => item.pid === this.nodeData.id)
      console.log('arr:', arr)
      // 2. 只要value和arr 中任意一个部门的name相同,就不同校验
      const isRepeat = arr.some(item => item.name === value)
      console.log(isRepeat)

      isRepeat ? callback(new Error('部门名称已经存在')) : callback()
    }
    const validateCode = (rules, value, callback) => {
      const isRepeat = this.deptList.filter(item => item.code === value)
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
      }
    }
  },
  methods: {
    handleCloseDialog() {
      this.$emit('close-dialog', false)
    //   console.log(11)
    }
    // async getSimpleUserList() {
    //   // console.log('发送请求，获取员工简单列表')
    //   const { data } = await reqGetSimpleUserList()
    //   this.userList = data
    // }

  }
}
</script>

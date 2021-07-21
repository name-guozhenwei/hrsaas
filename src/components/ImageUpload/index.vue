<template>
  <div class="upload-box">
    <el-upload
      action="#"
      list-type="picture-card"
      :on-preview="preview"
      :file-list="fileList"
      :class="{disabled:fileComputed}"
      :limit="limit"
      :on-remove="handleRemove"
      :http-request="handleUpload"
      :on-change="handleChange"
      :before-upload="handleBeforeUpload"
    >
      <i class="el-icon-plus" />
    </el-upload>
    <el-dialog width="600px" top="8vh" title="图片预览" :visible.sync="showDialog">
      <img width="100%" :src="imgUrl" alt="">
    </el-dialog>
    <div v-if="showProgress">
      <div>上传进度: <el-progress style="width:180px" :percentage="percent" /></div>
    </div>
  </div>

</template>

<script>
import COS from 'cos-js-sdk-v5' // 导入腾讯云的包
const cos = new COS({
  SecretId: 'AKIDTlnY3GI3XkhOownNgiSw95k7E4ctue6H', // 身份识别ID
  SecretKey: 'xd2A0astd7KGuoSothEUS9akdFZdRyEE' // 身份秘钥
})
export default {
  name: 'ImageUpload',
  props: {
    limit: {
      type: Number,
      default: 1
    }
  },
  data() {
    return {
      fileList: [

      ],
      showDialog: false, // 控制显示弹层
      imgUrl: '',
      showProgress: false
    }
  },
  computed: {
    // 设定一个计算属性 判断是否已经上传完了一张
    fileComputed() {
      return this.fileList.length >= this.limit
    },
    isAllUploadSuccess() {
      // every 必须每个fileList中的项，status属性都要是success才返回true
      return this.fileList.every(item => item.status === 'success')
    }
  },
  methods: {
    // 预处理览功能
    preview(file) {
    //   console.log(file)
      this.imgUrl = file.url // 将预览功能内的file方法里的url给到imgUrl
      this.showDialog = true // 点击预览按钮弹出弹框
    },
    // 处理删除功能
    handleRemove(file, fileList) {
      // file文件
      // fileList删除后的文件列表(结构中的)
      // this.fileList 数据中的文件列表
    //   console.log(file, fileList)
      this.fileList = this.fileList.filter(item => item.uid !== file.uid) // 从data中移除对应项
    },
    // 处理选择确认文件前的校验
    handleBeforeUpload(file) {
      // 1.限制文件类型 file.type
      const isLt2M = file.size / 1024 / 1024 < 2
      // 判断如果文件大于2M,提示用户不能上传
      if (!isLt2M) {
        this.$message.error('图片不能超过2MB!,请选择小于2M的照片重新上传')
        return
      }
      // 检验通过
      return true
    },
    // 处理上传功能
    handleUpload(obj) {
      const uid = obj.file.uid
      const fileObj = this.fileList.find(item => item.uid === uid)
      // 更新status状态
      fileObj.status = 'uploading'
      cos.putObject({
        Bucket: 'hrsaas-1306537178', /* 必须 */
        Region: 'ap-shanghai', /* 存储桶所在地域，必须字段 */
        Key: obj.file.name, /* 文件名 */
        StorageClass: 'STANDARD', // 上传模式, 标准模式
        Body: obj.file, // 上传文件对象
        // 上传的进度, 上传的过程中实时触发onProgress,可以做进度条的展示
        onprogress: progressData => {
          // 上传图片的进度
          fileObj.percentage = parseInt(progressData.percent * 100)
        }
      }, (err, data) => {
        if (err) return
        if (data.statusCode === 200) {
          // 找到对应的上传这个file的项
          const fileObj = this.fileList.find(item => item.uid === obj.file.uid)
          // 更新状态
          fileObj.status = 'success'
          // 修改地址
          fileObj.url = 'https://' + data.Location
          // 设置上传图片延迟时间
          setTimeout(() => {
            this.showProgress = false
            this.percent = 0
          }, 500)
        }
      }
      )
    },
    // 添加文件,用户选了就应该新增文件预览
    // 文件状态改变时的钩子,添加文件,上传成功和上传失败时都会被调用
    handleChange(file, fileList) {
      this.fileList = [...fileList]
    }

  }
}
</script>

<style lang="scss" scoped>
.disabled {
  ::v-deep {
    .el-upload--picture-card {
      display: none
    }
  }
}
</style>

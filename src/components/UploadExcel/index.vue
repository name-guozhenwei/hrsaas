<template>
  <div class="upload-excel">
    <div class="btn-upload">
      <el-button :loading="loading" style="margin-left:16px;" size="mini" type="primary" @click="handleUpload">
        点击上传
      </el-button>
    </div>
    <input ref="excel-upload-input" class="excel-upload-input" type="file" accept=".xlsx, .xls" @change="handleClick">
    <div class="drop" @drop="handleDrop" @dragover="handleDragover" @dragenter="handleDragover">
      <i class="el-icon-upload">
        <span>将文件拖到此处</span>
      </i>
    </div>
  </div>
</template>

<script>
import XLSX from 'xlsx'

export default {
  props: {
    beforeUpload: Function, // eslint-disable-line
    onSuccess: Function// eslint-disable-line
  },
  data() {
    return {
      loading: false,
      excelData: {
        header: null,
        results: null
      }
    }
  },
  methods: {
    generateData({ header, results }) {
      this.excelData.header = header
      this.excelData.results = results
      this.onSuccess && this.onSuccess(this.excelData) // 将得到的结果,通过调用 success函数给到使用者
    },
    handleDrop(e) {
      e.stopPropagation() // 阻止冒泡
      e.preventDefault() // 阻止默认行为
      if (this.loading) return // 解决兼容
      // 获取拖拽过来的文件 => e.dataTransfer.files
      const files = e.dataTransfer.files // 阻止浏览器默认的下载效果
      // 如果拖拽过来的文件数量 不等于 1 个
      if (files.length !== 1) {
        this.$message.error('仅支持上传解析单个文件')
        return
      }
      const rawFile = files[0] // only use files[0]   只有一个文件
      // 文件格式校验
      if (!this.isExcel(rawFile)) {
        this.$message.error('仅支持上传 .xlsx, .xls, .csv 文件格式')
        return false
      }
      this.upload(rawFile) // 开始解析文件
      e.stopPropagation() // 阻止冒泡
      e.preventDefault() // 阻止默认行为
    },
    handleDragover(e) {
      e.stopPropagation() // 阻止冒泡
      e.preventDefault() // 阻止默认行为
      e.dataTransfer.dropEffect = 'copy' // 解决兼容问题
    },
    handleUpload() {
      this.$refs['excel-upload-input'].click() // 点击按钮 触发点击事件
    },
    handleClick(e) {
      const files = e.target.files
      const rawFile = files[0] // only use files[0]
      if (!rawFile) return
      this.upload(rawFile)
    },
    upload(rawFile) {
      // 文件已拿到,如果input:file框中有值,也可以清掉了
      this.$refs['excel-upload-input'].value = null // fix can't select the same excel
      // 有没有配置校验函数
      if (!this.beforeUpload) {
        // 不存在,说明不做文件校验
        // 开始解析解读文件
        this.readerData(rawFile)
        return
      }
      // 如果配置了校验函数
      // 使用beforeUpload进行校验 true 校验通过 false 不通过
      const before = this.beforeUpload(rawFile)
      if (before) {
        this.readerData(rawFile)
      }
    },
    // 解析解读文件,读文件是一个异步的操作,如果你希望在读完文件之后,做某件事,通过promise封装
    readerData(rawFile) {
      this.loading = true
      return new Promise((resolve, reject) => {
        // 1.创建 FileReader读取器,html5中新出的,可以用于读取文件的api
        const reader = new FileReader()
        // 2. 监听文件的读取,读取成了,会自动调用 onload
        reader.onload = e => {
          const data = e.target.result
          const workbook = XLSX.read(data, { type: 'array' })
          const firstSheetName = workbook.SheetNames[0]
          const worksheet = workbook.Sheets[firstSheetName]
          const header = this.getHeaderRow(worksheet)
          const results = XLSX.utils.sheet_to_json(worksheet)
          this.generateData({ header, results }) // 读完的结果 => header 和 results
          this.loading = false
          resolve()
        }
        reader.readAsArrayBuffer(rawFile) // 3.调用方法,开始读
      })
    },
    getHeaderRow(sheet) {
      const headers = []
      const range = XLSX.utils.decode_range(sheet['!ref'])
      let C
      const R = range.s.r
      /* start in the first row */
      for (C = range.s.c; C <= range.e.c; ++C) { /* walk every column in the range */
        const cell = sheet[XLSX.utils.encode_cell({ c: C, r: R })]
        /* find the cell in the first row */
        let hdr = 'UNKNOWN ' + C // <-- replace with your desired default
        if (cell && cell.t) hdr = XLSX.utils.format_cell(cell)
        headers.push(hdr)
      }
      return headers
    },
    // 封装了一个正则,校验文件的格式
    isExcel(file) {
      return /\.(xlsx|xls|csv)$/.test(file.name)
    }
  }
}
</script>

<style scoped lang="scss">
.upload-excel {
  display: flex;
  justify-content: center;
  margin-top: 100px;
  .excel-upload-input {
    display: none;
    z-index: -9999;
  }
  .btn-upload,
  .drop {
    border: 1px dashed #bbb;
    width: 350px;
    height: 160px;
    text-align: center;
    line-height: 160px;
  }
  .drop {
    padding-top: 20px;
    line-height: 80px;
    color: #bbb;
    i {
      font-size: 60px;
      display: block;
    }
  }
}
</style>

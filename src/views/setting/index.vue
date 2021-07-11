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
            >
              新增角色</el-button>
            <!-- 表格 -->
            <el-table :data="list">
              <el-table-column :index="indexMethod" label="序号" width="50" type="index" />
              <el-table-column prop="name" label="角色名称" width="120" />
              <el-table-column prop="description" label="描述" width="240" />
              <el-table-column label="操作" width="300">
                <template #default="{row}">
                  <el-button size="small" type="success">分配权限</el-button>
                  <el-button size="small" type="primary">编辑</el-button>
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
          <el-tab-pane label="公司信息">
            <!-- 公司信息 -->
          </el-tab-pane>
        </el-tabs>
      </el-card>
    </div>
  </div>
</template>

<script>
import { reqGetRoleList, reqDelRole } from '@/api/setting'
// import { Loading } from 'element-ui'
export default {
  name: 'Setting',
  data() {
    return {
      list: [],
      total: 0,
      page: 1, // 当前页
      pagesize: 3, // 每页总数
      Loading: false

    }
  },
  created() {
    // 一进页面就调用角色列表
    this.getRoleList()
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
    }
  }

}
</script>

<style>

</style>


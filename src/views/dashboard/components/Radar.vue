<template>
  <!-- 雷达图 图表必须给高和宽度 -->
  <div ref="myDiv" class="radar-echart" />
</template>

<script>
import * as echarts from 'echarts' // 引入主模块
import { RadarChart } from 'echarts/charts' // 引入雷达图
import { TitleComponent, LegendComponent } from 'echarts/components' // 引入提示框和标题组件
import { CanvasRenderer } from 'echarts/renderers' // 引入canvas渲染器
// 注册必须的组件
echarts.use(
  [TitleComponent, LegendComponent, RadarChart, CanvasRenderer]
)
export default {
  mounted() {
    const myChart = echarts.init(this.$refs.myDiv) // 得到图表实例
    myChart.setOption({
      title: {
        text: '基础雷达图'
      },
      legend: {
        data: ['平均水平', '个人价值']
      },
      radar: {
        // shape: 'circle',
        name: {
          textStyle: {
            color: '#fff',
            backgroundColor: '#999',
            borderRadius: 3,
            padding: [3, 5]
          }
        },
        indicator: [
          { name: '工作效率', max: 100 },
          { name: '考勤', max: 100 },
          { name: '积极性', max: 100 },
          { name: '帮助同事', max: 100 },
          { name: '自主学习', max: 100 },
          { name: '正确率', max: 100 }
        ]
      },
      series: [{
        name: '平均 vs 个人）',
        type: 'radar',
        data: [
          {
            value: [80, 80, 80, 80, 80, 80],
            name: '平均水平'
          },
          {
            value: [90, 75, 95, 90, 95, 90],
            name: '个人价值'
          }
        ]
      }]
    })
  }
}
</script>

<style>
.radar-echart {
    width: 500px;
    height: 400px;
}
</style>


<template>
  <div>
    <!-- 工作日历 , 年和月-->
    <div class="select-box">

      <el-select
        v-model="currentYear"
        size="small"
        style="width:120px;margin-right:10px"
      >
        <!-- 年份取给定年份的,前五年 + 后五年 -->
        <!-- 当前年份 -->
        <el-option
          v-for="item in yearList"
          :key="item"
          :label="item"
          :value="item"
        />
      </el-select>
      <!-- 当前月份 -->
      <el-select
        v-model="currentMonth"
        size="small"
        style="width:120px"
        @change="changeDate"
      >
        <el-option
          v-for="item in 12"
          :key="item"
          :label="item"
          :value="item"
        />
      </el-select>
    </div>
    <el-calendar v-model="currentDate">
      <template #dateCell="{ date, data }">
        <div class="date-content">
          <span class="text">{{ data.day | getDay }}</span>
          <span v-if="isWeek(date)" class="rest">休</span>
        </div>
      </template>
    </el-calendar>

  </div>
</template>

<script>
export default {
  name: 'WorkCalendar',
  filters: {
    getDay(value) {
      const day = value.split('-')[2] // 11, 02
      // console.log(day)
      // console.log(value)
      return day.startsWith('0') ? day.slice(1) : day
    }
  },
  props: {
    startDate: {
      type: Date,
      default: () => {
        return new Date()
      }
    }
  },
  data() {
    return {
      currentYear: '', // 当前年份
      currentMonth: '', // 点前月份
      // yearList: [], // 要遍历的年的数组
      currentDate: ''
      // getDay: ''

    }
  },
  computed: {
    yearList() {
      return Array.from(new Array(11), (item, index) => index + this.currentYear - 5)
    }

  },
  watch: {
    // watch 监视解决日历同步
    currentDate(newValue) {
      // console.log(newValue)
      this.currentYear = newValue.getFullYear()
      this.currentMonth = newValue.getMonth() + 1
    }
  },
  created() {
    this.currentYear = this.startDate.getFullYear() // 得到当前年份
    this.currentMonth = this.startDate.getMonth() + 1 // 当前月份
    this.changeDate()
  },
  methods: {
    // 生成新的日期
    changeDate() {
      this.currentDate = new Date(this.currentYear + '-' + this.currentMonth + '-1')
    },
    // 判断是否是周末  方式一
    isWeek(date) {
      // console.log(this.getDay)
      // 将日期赋值到Day
      const weekDay = date.getDay()
      return weekDay === 6 || weekDay === 0
    }
    // 判断是否是周末 方式 二
    // isWeek(data) {
    //   // console.log(this.getDay)
    //   // 将日期赋值到Day
    //   const Day = new Date(data.day).getDay()
    //   return Day === 6 || Day === 0
    // }

  }
}
</script>

<style lang="scss" scoped>
.select-box {
  display: flex;
  justify-content: flex-end;
}

::v-deep .el-calendar-day {
  height:  auto;
 }
::v-deep .el-calendar-table__row td::v-deep .el-calendar-table tr td:first-child, ::v-deep .el-calendar-table__row td.prev{
  border: none;
 }
.date-content {
  height: 40px;
  text-align: center;
  line-height: 40px;
  font-size: 14px;
}
.date-content .rest {
  color: #fff;
  border-radius: 50%;
  background: rgb(250, 124, 77);
  width: 20px;
  height: 20px;
  line-height: 20px;
  display: inline-block;
  font-size: 12px;
  // margin-left: 10px;
}
.date-content .text{
  width: 20px;
  height: 20px;
  line-height: 20px;
 display: inline-block;

}
::v-deep .el-calendar-table td.is-selected .text{
   background: #409eff;
   color: #fff;
   border-radius: 50%;
 }
::v-deep .el-calendar__header {
   display: none
}
</style>

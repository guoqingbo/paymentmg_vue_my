<template>
    <div class="houseCalendar">
        <span>{{activeDate}}</span>
        <div v-show="isShow" class="calendar-box">
            <div class="calendar-tools">
                <div class="calendar-prev" @click="prev">
                    <Icon type="md-arrow-dropleft" />
                </div>
                <div class="calendar-next" @click="next">
                    <Icon type="md-arrow-dropright" />
                </div>
                <div class="calendar-info">
                    <div class="mc-month">{{month}}月 {{year}}年</div>
                </div>
            </div>
            <div>
                <table class="calendar-table">
                    <thead>
                        <tr>
                            <th v-for="(item,index) in weekNames" :key="index">{{item}}</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(week,index) in daysArr" :key="index">
                            <td v-for="(day,dayIndex) in week" :key="dayIndex" @click="getDate(day)" :class="{'active':(selectDate==day.date)}">
                                <template>
                                    <div class="day">{{day.day}}</div>
                                </template>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
</template>

<script>
export default {
  props: {
    activeDate: {
      type: String,
      default: ""
    }
  },
  data() {
    return {
      selectDate: this.activeDate,
      month: "",
      year: "",
      isShow: false,
      monthList: [],
      weekNames: ["日", "一", "二", "三", "四", "五", "六"],
      daysArr: [],
      currentdate: "",
      monthIndex:0,
      monthText:'',
    };
  },
  created() {
    this.getCurDate();
    this.getMonth();
    this.init();
  },

  methods: {
    prev(e) {
        console.log(this.monthIndex)
        e && e.stopPropagation();
         if (this.monthIndex === 1) {
            this.oversliding = false;
            this.month = 11;
            this.year = parseInt(this.year) - 1;
            this.monthIndex = this.monthIndex - 1;
          } else if (this.monthIndex === 0) {
            this.oversliding = true;
            this.monthIndex = 12;
            setTimeout(() => this.prev(e), 50);
            return this.updateHeadMonth('custom');
          } else if (this.monthIndex === 13) {
            this.month = 11;
            this.year = parseInt(this.year) - 1;
            this.monthIndex = this.monthIndex - 1;
          } else {
            this.oversliding = false;
            this.month = parseInt(this.month) - 1;
            this.monthIndex = this.monthIndex - 1;
          }
          this.updateHeadMonth('custom');
        this.init(this.year,this.month)
    },
    next(e) {
        console.log(this.monthIndex)
         e && e.stopPropagation();
          if (this.monthIndex === 12) {
            this.oversliding = false;
            this.month = 0;
            this.year = parseInt(this.year) + 1;
            this.monthIndex = this.monthIndex + 1;
          } else if (this.monthIndex === 0 && this.month === 11) {
            this.oversliding = false;
            this.month = 0;
            this.year = parseInt(this.year) + 1;
            this.monthIndex = this.monthIndex + 1;
          } else if (this.monthIndex === 13) {
            this.oversliding = true;
            this.monthIndex = 1;
            setTimeout(() => this.next(e), 50);
            return this.updateHeadMonth('custom');
          } else {
            this.oversliding = false;
            this.month = parseInt(this.month) + 1;
            this.monthIndex = this.monthIndex + 1;
          }
          this.updateHeadMonth('custom');
          this.init(this.year, this.month);
    },
     updateHeadMonth(type) {
        if (!type) this.monthIndex = this.month + 1;
        this.monthText = this.month ;
      },
    getDate(day) {
      this.$emit("getDate", day);
      this.selectDate = day.date;
      setTimeout(() => {
        this.isShow = false;
      }, 400);
    },
    getCurDate() {
      var date = new Date();
      var seperator1 = "-";
      var year = date.getFullYear();
      var month = date.getMonth() + 1;
      var strDate = date.getDate();
      if (month >= 1 && month <= 9) {
        month = "0" + month;
      }
      if (strDate >= 0 && strDate <= 9) {
        strDate = "0" + strDate;
      }
      var currentdate = year + seperator1 + month + seperator1 + strDate;
      this.currentdate = currentdate;
    },
    getMonth() {
      let date = new Date();
      this.year = date.getFullYear();
      this.month = date.getMonth() + 1;

      //   let arr = [];
      //   arr.push({
      //     month,
      //     year
      //   });
      //   for (let i = 1; i < 12; i++) {
      //     month++;
      //     if (month > 12) {
      //       month = month - 12;
      //       year++;
      //     }
      //     arr.push({
      //       month,
      //       year
      //     });
      //   }
      //   this.monthList = arr;
      //   console.log(arr);
    },
    init(year, month) {
      var date = new Date();
      //当前是哪一年
      var year = year ? year : date.getFullYear();
      //当前是哪个月，注意这里的月是从0开始计数的
      var month = month ? month - 1 : date.getMonth();
    this.monthIndex = month + 1
      let daysArr = [];

      //当前月的第一天的日期
      var firstDay = new Date(year, month, 1);
      //第一天是星期几
      var weekday = firstDay.getDay();

      //求当前月一共有多少天
      //new Date(year,month+1,0) ： month+1是下一个月，day为0代表的是上一个月的最后一天，即我们所需的当前月的最后一天。
      //getDate（）则返回这个日期对象是一个月中的第几天，我们由最后一天得知这个月一共有多少天
      var days = new Date(year, month + 1, 0).getDate();

      var res = "";
      let arr = [];
      //输出第一天之前的空格
      for (var i = 0; i < weekday; i++) {
        arr.push({
          currentMonth: false //是否当前月
        });
        if (arr.length == 7) {
          daysArr.push(arr);
          arr = [];
        }
      }

      for (var j = 1; j <= days; j++) {
        let date =
          year +
          "-" +
          (month + 1 < 10 ? "0" + (month + 1) : month + 1) +
          "-" +
          (j < 10 ? "0" + j : j);

        arr.push({
          currentMonth: true, //是否当前月
          date: date, //年-月-日
          day: date == this.currentdate ? "今天" : j,

          isAfterToday:
            new Date(date).valueOf() >= new Date(this.currentdate).valueOf() //是否是今天之前包含今天
        });
        if (arr.length == 7) {
          daysArr.push(arr);
          arr = [];
        }
      }
      if (arr.length) {
        daysArr.push(arr);
      }
      this.daysArr = daysArr;
      console.log(this.daysArr);
    },
    show() {
      this.isShow = true;
    }
  }
};
</script>

<style lang="scss">
.houseCalendar {
  width: 100%;
  position: relative;
  .calendar-box {
    position: absolute;
    top: 30px;
    left: 15px;
    width: 250px;
    color: #5e7a88;
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.125);
    background-color: #fff;
    .calendar-tools {
      height: 40px;
      line-height: 40px;
      color: #5e7a88;
      box-shadow: 0px 4px 8px rgba(25, 47, 89, 0.1);
      border-top: 1px solid rgba(200, 200, 200, 0.1);
      cursor: pointer;
      .calendar-prev {
        width: 14.28571429%;
        float: left;
        text-align: center;
        font-size: 20px;
      }
      .calendar-next {
        width: 14.28571429%;
        float: right;
        text-align: center;
        font-size: 20px;
      }
      .calendar-info {
        padding-top: 3px;
        font-size: 14px;
        line-height: 2.5;
        text-align: center;
        margin: 0 auto;
      }
    }
    .calendar-table {
      width: 100%;
      background-color: #fff;
      thead {
        tr {
          th {
            padding: 8px 0;
            font-size: 15px;
            color: #413838;
            text-align: center;
          }
        }
      }
      tbody {
        tr {
          td {
            // padding: 6px 0;
            text-align: center;
            // width: 14.2%;
            cursor: pointer;
            .day {
              font-size: 14px;
              color: #413838;
              &.weekend {
                color: #149d34;
              }
            }
            &.active {
              background: #2988fb;
              .day {
                color: #fff;
              }
              .price {
                color: #fff;
              }
            }
            &.not-after-today {
              background: #ffffff;
              .day {
                color: #ccc;
              }
            }
          }
        }
      }
    }
  }
}
</style>



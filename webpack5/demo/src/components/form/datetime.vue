<!--
  function: datetime
  author  : wq
  update  : 2018/10/12 15:07
-->
<template>
  <div @click="chooseDateTime">
    <input type="text" :placeholder="placeholder" class="i-input i-disabled" disabled :value="value">
    <img src="http://cdn.ddjf.com/static/images/miniprogram/arrow-r-gray.png" alt="" class="i-img">
  </div>
</template>

<script>
export default {
  name: 'datetime',
  props: {
    value: {
      type: String,
      default: ''
    },
    placeholder: {
      type: String,
      default: ''
    },
    type: {
      type: String,
      default: 'datetime'
    }
  },
  methods: {
    chooseDateTime () {
      const type = this.type
      if (type === 'datetime') {
        this.openDatePicker((date) => {
          // this.$emit('input', date)
          this.openTimePicker((time) => {
            this.$emit('input', `${date} ${time}`)
          })
        })
      } else if (type === 'date') {
        this.openDatePicker((date) => {
          this.$emit('input', `${date}`)
        })
      } else if (type === 'time') {
        this.openTimePicker((time) => {
          this.$emit('input', `${time}`)
        })
      }
    },
    openDatePicker (func) {
      const now = new Date()
      const currentYear = now.getFullYear()
      const currentMonth = now.getMonth() + 1
      const currentDate = now.getDate()
      const getYearArray = (offset) => {
        let yearArr = []
        for (let i = currentYear; i <= currentYear + offset; i++) {
          yearArr.push(i)
        }
        return yearArr
      }
      const getDayArray = (year, month) => {
        let tday = new Date(year, month + 1, 0)
        let dayArr = []
        for (let i = 1; i <= tday.getDate(); i++) {
          dayArr.push(i)
        }
        return dayArr
      }
      this.$Picker({
        slots: [{
          type: 'data',
          flex: 1,
          values: getYearArray(6),
          textAlign: 'center',
          defaultValue: currentYear
        }, {
          type: 'divider',
          content: '-'
        }, {
          type: 'data',
          flex: 1,
          values: ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'].splice(currentMonth - 1),
          textAlign: 'center',
          defaultValue: currentMonth
        }, {
          type: 'divider',
          content: '-'
        }, {
          type: 'data',
          flex: 1,
          values: getDayArray(currentYear, currentMonth - 1).splice(currentDate - 1),
          textAlign: 'center',
          defaultValue: currentDate
        }],
        onShow: instance => {
          this.__proto__.__proto__.pickerInstance = instance
        },
        onConfirm: (instance, datas) => {
          let day = datas.slot4 + ''
          if (day.length <= 1) {
            day = '0' + day
          }
          func(`${datas.slot0}-${datas.slot2}-${day}`)
          instance.value = false
        },
        onChange: (instance, changeInfo) => {
          // 切换年份  更改月和日
          if (changeInfo.changedSlotIndex === 0) {
            if (changeInfo.val.slot0 === currentYear) {
              // 还是当前的年份，月份保留当前月
              instance.setSlotValues(2, ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'].splice(currentMonth - 1), changeInfo.val.slot2 - 1)
              instance.setSlotValues(4, getDayArray(currentYear, currentMonth - 1, 0), changeInfo.val.slot4 - 1)
            } else {
              // 非当前年份
              instance.setSlotValues(2, ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'], changeInfo.val.slot2 - 1)
              instance.setSlotValues(4, getDayArray(currentYear, currentMonth - 1, 0), changeInfo.val.slot4 - 1)
            }
          }

          // 切换月份  更改日
          if (changeInfo.changedSlotIndex === 2) {
            if (changeInfo.val.slot0 === currentYear && changeInfo.val.slot2 == currentMonth) {
              // 如果又切换到当前的月份
              instance.setSlotValues(4, getDayArray(changeInfo.val.slot0, changeInfo.val.slot2 - 1, 0).splice(currentDate-1), changeInfo.val.slot4 - 1)
            } else {
              instance.setSlotValues(4, getDayArray(changeInfo.val.slot0, changeInfo.val.slot2 - 1, 0), changeInfo.val.slot4 - 1)
            }
          }
        }
      })
    },
    openTimePicker(func) {
      const hour = ['06', '07', '08', '09', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24']
      const minute = ['00', '05', '10', '15', '20', '25', '30', '35', '40', '45', '50', '55']
      this.$Picker({
        slots: [{
          type: 'data',
          flex: 1,
          values: hour,
          textAlign: 'center',
          defaultValue: hour[3]
        }, {
          type: 'divider',
          content: '-'
        }, {
          type: 'data',
          flex: 1,
          values: minute,
          textAlign: 'center',
          defaultValue: minute[0]
        }],
        onShow: instance => {
          this.__proto__.__proto__.pickerInstance = instance
        },
        onConfirm: (instance, datas) => {
          var time = datas.slot0 + ':' + datas.slot2
          func && func(time)
          instance.value = false
        },
        onChange: (instance, changeInfo) => {
          // 切换年份  更改月和日
          if (changeInfo.changedSlotIndex === 0) {
            instance.setSlotValues(2, minute, minute[0])
          }
        },
        onCancel: (instance) => {
          func && func('09:00') // 设置默认值
          instance.value = false
        }
      })
    },
  }
}
</script>

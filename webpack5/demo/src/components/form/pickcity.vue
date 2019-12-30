<!--
  function: 选择城市
  author  : wq
  update  : 2018/10/12 15:07
-->
<template>
  <div @click.stop="chooseCity">
    <input type="text" :placeholder="placeholder" class="i-input i-disabled" disabled :value="text"> <img
     src="http://cdn.ddjf.com/static/images/miniprogram/arrow-r-gray.png" alt="" class="i-img">
  </div>
</template>

<script>
import { findItemByProp } from '@/util/util'

export default {
  name: 'pickCity',
  props: {
    value: {
      type: Object,
      default: () => ({})
    },
    placeholder: {
      type: String,
      default: '请选择城市'
    },
    type: {
      type: String,
      default: 'datetime'
    }
  },
  computed: {
    text() {
      const item = this.value || {}
      if (item.houseCityName && item.houseAreaName) {
        return `${item.houseCityName} ${item.houseAreaName}`
      }
      if (!item.houseAreaName) {
        return `${item.houseCityName} '_ _ 区`
      }
      return ''
    }
  },
  watch: {
    value: {
      handler () {
        const item = this.value || {}
        const fxtCityId = this.fxtCityId
        const storeCityFxtId = item.fxtCityId
        const houseProvinceName = item.houseProvinceName
        const houseCityName = item.houseCityName
        if (houseProvinceName && houseCityName) {
          if (fxtCityId === null && !storeCityFxtId) {
            this.getCityList().then(data => {
              const provinceObj = findItemByProp(this.allProvinceList, houseProvinceName, 'name') || {}
              const cityObj = findItemByProp(this.allCityList.filter(item => item.parentId === provinceObj.id), houseCityName, 'name') || {}
              this.fxtCityId = cityObj.fxtId || ''
              if (cityObj.fxtId || cityObj.fxtId === 0) {
                this.$emit('fxtCityId', cityObj.fxtId)
              }
            })
          }
        }
      },
      immediate: true
    }
  },
  data () {
    return {
      allProvinceList: [],
      allCityList: [],
      allAreaList: [],
      fxtCityId: null
    }
  },
  methods: {
    chooseCity () {
      this.getCityList().then(data => {
        this.openCity((provinceName, cityName, areaName) => {
          const provinceObj = findItemByProp(this.allProvinceList, provinceName, 'name') || {}
          const cityObj = findItemByProp(this.allCityList.filter(item => item.parentId === provinceObj.id), cityName, 'name') || {}
          const areaObj = findItemByProp(this.allAreaList.filter(item => item.parentId === cityObj.id), areaName, 'name') || {}
          this.$emit('input', {
            houseProvinceCode: provinceObj.id,
            houseProvinceName: provinceObj.name,
            houseCityCode: cityObj.id,
            houseCityName: cityObj.name,
            houseAreaCode: areaObj.id,
            houseAreaName: areaObj.name,
            fxtCityId: this.fxtCityId = cityObj.fxtId,
            areaFxtId: areaObj.fxtId
          })
        })
      })
    },
    // 获取城市信息
    getCityList () {
      const allProvinceList = this.allProvinceList || []
      if (allProvinceList.length > 0) {
        return new Promise(resolve => {
          resolve()
        })
      } else {
        const timePoint = localStorage.getItem('AddressTimePoint')
        const now = new Date()
        const date = `${now.getFullYear()}-${now.getMonth()}-${now.getDate()}`
        if (timePoint && timePoint === date) {
          const provinceList = localStorage.getItem('provinceList')
          const cityList = localStorage.getItem('cityList')
          const areaList = localStorage.getItem('areaList')
          if (!provinceList || !cityList || !areaList) {
            return this.requestCityList()
          } else {
            this.allProvinceList = JSON.parse(provinceList)
            this.allCityList = JSON.parse(cityList)
            this.allAreaList = JSON.parse(areaList)
            return new Promise(resolve => {
              resolve()
            })
          }
        }
        return this.requestCityList()
      }
    },

    // 请求城市列表
    requestCityList () {
      return this.$store.dispatch('requestCityList').then(data => {
        this.allProvinceList = data.provinceList
        this.allCityList = data.cityList
        this.allAreaList = data.areaList
        return data
      })
    },
    // 打开城市下拉框
    openCity (func) {
      const item = this.value || {}
      const provinceCode = item.houseProvinceCode || ''
      const cityCode = item.houseCityCode || ''
      const areaCode = item.houseAreaCode || ''
      // 省份
      const provinceList = this.allProvinceList
      let provinceObj
      if (!provinceCode) {
        provinceObj = provinceList[0]
      } else {
        provinceObj = findItemByProp(provinceList, provinceCode, 'id') || provinceList[0]
      }
      const provinceName = provinceObj['name']
      // 城市
      const cityList = this.allCityList.filter((item) => item.parentId === provinceObj.id)
      let cityObj
      if (!cityCode) {
        cityObj = cityList[0]
      } else {
        cityObj = findItemByProp(cityList, cityCode, 'id') || cityList[0]
      }
      const cityName = cityObj['name']
      // 区域
      const areaList = this.allAreaList.filter((item) => item.parentId === cityObj.id)
      let areaObj
      if (!areaCode) {
        areaObj = areaList[0]
      } else {
        areaObj = findItemByProp(areaList, areaCode, 'id') || areaList[0]
      }
      const areaName = areaObj['name']
      this.$Picker({
        slots: [
          {
            type: 'data',
            flex: 1,
            values: provinceList.map(item => item['name']),
            textAlign: 'center',
            defaultValue: provinceName
          },
          {
            type: 'divider',
            content: '-'
          },
          {
            type: 'data',
            flex: 1,
            values: cityList.map(item => item['name']),
            textAlign: 'center',
            defaultValue: cityName
          },
          {
            type: 'divider',
            content: '-'
          },
          {
            type: 'data',
            flex: 1,
            values: areaList.map(item => item['name']),
            textAlign: 'center',
            defaultValue: areaName
          }
        ],
        onShow: instance => {
          this.__proto__.__proto__.pickerInstance = instance          
        },
        onConfirm: (instance, datas) => {
          const provinceName = datas.slot0
          const cityName = datas.slot2
          const areaName = datas.slot4
          func && func(provinceName, cityName, areaName)
          instance.value = false
          this.__proto__.__proto__.pickerInstance = null
        },
        onChange: (instance, changeInfo) => {
          switch (changeInfo.changedSlotIndex) {
            case 0:
              const provinceName = changeInfo.newSlotValue
              const provinceObj = findItemByProp(this.allProvinceList, provinceName, 'name')
              const cityList = this.allCityList.filter(item => item.parentId === provinceObj.id).map(item => item['name'])
              instance.setSlotValues(2, cityList)
              break
            case 2:
              const cityName = changeInfo.newSlotValue
              const cityObj = findItemByProp(this.allCityList, cityName, 'name')
              const areaList = this.allAreaList.filter(item => item.parentId === cityObj.id).map(item => item['name'])
              instance.setSlotValues(4, areaList)
              break
            case 4:
              break
          }
        },
        onCancel: instance => {
          instance.value = false
          this.__proto__.__proto__.pickerInstance = null          
        }
      })
    }
  }
}
</script>

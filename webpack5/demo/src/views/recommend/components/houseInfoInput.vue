<!--
  function: 推荐信息
  author  : wq
  update  : 2018/10/11 17:44
-->
<template>
  <list-block-input title="补充房产信息">
    <wd-cell class="light-border">
      <p slot="left" class="l-label">房产区域<span class="must" v-if="mustRuler">*</span></p>
      <pick-city slot="right" class="r-value" :value="houseInfo" @input="doChangeHouseCityInfo" @fxtCityId="defaultCityFxtId"></pick-city>
    </wd-cell>
    <wd-cell class="light-border">
      <p slot="left" class="l-label">房产楼盘<span class="must" v-if="mustRuler">*</span></p>
      <div slot="right" @click="chooseProject" class="r-value" v-if="hasProject">
        <input type="text" slot="right" placeholder="请选择楼盘" class="i-input i-disabled" disabled
               v-model="houseInfo.projectName"> <img
         src="http://cdn.ddjf.com/static/images/miniprogram/arrow-r-gray.png" alt="" class="i-img">
      </div>
      <div slot="right" class="r-value" v-else>
        <input type="text" slot="right" placeholder="请选择楼盘" class="i-input i-disabled"
               v-model="houseInfo.projectName">
      </div>
    </wd-cell>
    <wd-cell class="light-border">
      <p slot="left" class="l-label">楼栋<span class="must" v-if="mustRuler">*</span></p>
      <div slot="right" @click="chooseBuilding" class="r-value" v-if="hasBuilding">
        <input type="text" slot="right" placeholder="请选择楼栋" class="i-input i-disabled" disabled
               v-model="houseInfo.buildingName"> <img
         src="http://cdn.ddjf.com/static/images/miniprogram/arrow-r-gray.png" alt="" class="i-img">
      </div>
      <div slot="right" class="r-value" v-else>
        <input type="text" slot="right" placeholder="请输入楼栋" @focus="checkHzBank" class="i-input i-disabled"
               v-model="houseInfo.buildingName">
      </div>
    </wd-cell>
    <wd-cell class="light-border">
      <p slot="left" class="l-label">楼层<span class="must" v-if="mustRuler">*</span></p>
      <div slot="right" @click="chooseFloor" class="r-value" v-if="hasFloor">
        <input type="text" slot="right" placeholder="请选择楼层" class="i-input i-disabled" disabled
               v-model="houseInfo.floor"> <img src="http://cdn.ddjf.com/static/images/miniprogram/arrow-r-gray.png"
                                               alt="" class="i-img">
      </div>
      <div slot="right" class="r-value" v-else>
        <input type="text" slot="right" placeholder="请输入楼层" @focus="checkHzBank" class="i-input i-disabled"
               v-model="houseInfo.floor">
      </div>
    </wd-cell>
    <wd-cell class="light-border">
      <p slot="left" class="l-label">房号<span class="must" v-if="mustRuler">*</span></p>
      <div slot="right" @click="chooseHouseName" class="r-value"
           v-if="hasFamilyNo">
        <input type="text" slot="right" placeholder="请选择房号" class="i-input i-disabled" disabled
               v-model="houseInfo.room"> <img
         src="http://cdn.ddjf.com/static/images/miniprogram/arrow-r-gray.png" alt="" class="i-img">
      </div>
      <div slot="right" class="r-value" v-else>
        <input type="text" slot="right" placeholder="请输入房号" @focus="checkHzBank" class="i-input i-disabled"
               v-model="houseInfo.room">
      </div>
    </wd-cell>
  </list-block-input>
</template>

<script>
import ListBlockInput from '@/components/inputListBlock'
import PickCity from '@/components/form/pickcity'
import { mapGetters } from 'vuex'
import { findItemByProp } from '@/util/util'

export default {
  name: 'recommendInfo',
  props: {
    mustRuler: Boolean
  },
  components: {
    ListBlockInput,
    PickCity
  },
  computed: {
    ...mapGetters({
      houseInfo: 'firstHouseInfo'
    }),
    orderDetail () {
      return this.$store.state.reOrderDetail || {}
    },
    productInfo () {
      return this.orderDetail.chooseProductInfo || {}
    },
    fixId () {
      const houseInfo = this.houseInfo || {}
      return houseInfo.fxtCityId
    },
    projectId () {
      return (this.houseInfo || {}).projectId
    },
    buildingId () {
      return (this.houseInfo || {}).buildingId
    },
    floor () {
      return (this.houseInfo || {}).floor
    },
    hasProject () {
      const fixId = this.fixId
      return !!fixId || fixId === 0
    }
  },
  data () {
    return {
      addressName: '',
      hasBuilding: false,
      hasFloor: false,
      hasFamilyNo: false
    }
  },
  watch: {
    fixId: (() => {
      let fixId = null
      return function (value) {
        if ((value || value === 0) && fixId !== value) {
          fixId = value
          const projectId = this.projectId
          if (projectId || projectId === 0) {
            this.listenHouseChoose('queryBuildings', 'hasBuilding', fixId, projectId)
          }
          const buildingId = this.buildingId
          if (buildingId || buildingId === 0) {
            this.listenHouseChoose('queryFloor', 'hasFloor', fixId, buildingId)
          }
          const floor = this.floor
          if ((buildingId || buildingId === 0) && (floor || floor === 0)) {
            this.listenHouseChoose('queryFamilyNo', 'hasFamilyNo', fixId, buildingId, floor)
          }
        }
      }
    })(),
    projectId: (() => {
      let projectId = null
      return function (value) {
        if ((value || value === 0) && projectId !== value) {
          projectId = value
          const fixId = this.fixId
          if (fixId || fixId === 0) {
            this.listenHouseChoose('queryBuildings', 'hasBuilding', fixId, projectId)
          }
        }
      }
    })(),
    buildingId: (() => {
      let buildingId = null
      return function (value) {
        if ((value || value === 0) && buildingId !== value) {
          buildingId = value
          const fixId = this.fixId
          if (fixId || fixId === 0) {
            this.listenHouseChoose('queryFloor', 'hasFloor', fixId, buildingId)
          }
          const floor = this.floor
          if ((fixId || fixId === 0) && (floor || floor === 0)) {
            this.listenHouseChoose('queryFamilyNo', 'hasFamilyNo', fixId, buildingId, floor)
          }
        }
      }
    })(),
    floor: (() => {
      let floor = null
      return function (value) {
        if ((value || value === 0) && floor !== value) {
          floor = value
          const fixId = this.fixId
          const buildingId = this.buildingId
          if ((fixId || fixId === 0) && (buildingId || buildingId === 0)&& (floor || floor === 0)) {
            this.listenHouseChoose('queryFamilyNo', 'hasFamilyNo', fixId, buildingId, floor)
          }
        }
      }
    })()
  },
  methods: {
    // watch 检测房讯通数据的变化请求
    listenHouseChoose: (() => {
      let fixId = null
      let projectId = null
      let buildingId = null
      let floor = null
      return function (request, chooseFlag, ...args) {
        if (request === 'queryBuildings') {
          if (fixId === args[0] && projectId === args[1]) {
            return false
          } else {
            fixId = args[0]
            projectId = args[1]
          }
        } else if (request === 'queryFloor') {
          if (fixId === args[0] && buildingId === args[1]) {
            return false
          } else {
            fixId = args[0]
            buildingId = args[1]
          }
        } else if (request === 'queryFamilyNo') {
          if (fixId === args[0] && buildingId === args[1] && floor === args[2]) {
            return false
          } else {
            fixId = args[0]
            buildingId = args[1]
            floor = args[2]
          }
        }
        this[request](...args).then(data => {
          if (Array.isArray(data) && data.length > 0) {
            this[chooseFlag] = true
          } else {
            this[chooseFlag] = false
          }
          return data
        }).catch(() => {
          this[chooseFlag] = false
        })
      }
    })(),
    defaultCityFxtId (fxtId) {
      this.$set(this.houseInfo, 'fxtCityId', fxtId)
    },
    // 改变vuex的城市数据
    doChangeHouseCityInfo (data) {
      this.$set(this.houseInfo, 'houseProvinceCode', data.houseProvinceCode)
      this.$set(this.houseInfo, 'houseProvinceName', data.houseProvinceName)
      this.$set(this.houseInfo, 'houseCityCode', data.houseCityCode)
      this.$set(this.houseInfo, 'houseCityName', data.houseCityName)
      this.$set(this.houseInfo, 'houseAreaCode', data.houseAreaCode)
      this.$set(this.houseInfo, 'houseAreaName', data.houseAreaName)
      this.$set(this.houseInfo, 'fxtCityId', data.fxtCityId)
      this.$set(this.houseInfo, 'fxtId', data.areaFxtId)
      this.doClearProject()
    },
    // 清空楼盘信息
    doClearProject () {
      this.$set(this.houseInfo, 'projectName', '')
      this.$set(this.houseInfo, 'projectId', '')
      this.doClearBuilding()
    },
    // 清空楼栋信息
    doClearBuilding () {
      this.$set(this.houseInfo, 'buildingName', '')
      this.$set(this.houseInfo, 'buildingId', '')
      this.doClearFloor()
    },
    // 清空楼层信息
    doClearFloor () {
      this.$set(this.houseInfo, 'floor', '')
      this.doClearFamilyNo()
    },
    // 清空房号信息
    doClearFamilyNo () {
      this.$set(this.houseInfo, 'room', '')
      this.$set(this.houseInfo, 'roomId', '')
    },
    // 选择楼盘
    chooseProject () {
      const fixId = this.fixId
      if (fixId || fixId === 0) {
        this.skipRouter({path: '/reProductList'})
      } else {
        this.$MessageBox.alert({
          title: '请先选择房产城市'
        })
      }
    },
    // 选择楼栋
    chooseBuilding () {
      const houseInfo = this.houseInfo || {}
      const projectId = this.projectId
      if (!projectId) {
        this.$MessageBox.alert({
          title: '请先选择房产楼盘'
        })
        return true
      }
      this.queryBuildings(this.fixId, projectId)
        .then((data) => {
          this.openGeneralPicker(data.map(item => item.buildingName), houseInfo.buildingName, (name) => {
            const buildObj = findItemByProp(data, name, 'buildingName')
            this.$set(this.houseInfo, 'buildingName', buildObj.buildingName)
            this.$set(this.houseInfo, 'buildingId', buildObj.buildingId)
            this.doClearFloor()
          })
        })
    },
    // 查询楼栋信息
    queryBuildings: (function() {
      let _buildList = null
      let _cityId = null
      let _projectId = null
      return function(cityId, projectId) {
        if (cityId === _cityId && projectId === _projectId && Array.isArray(_buildList) && _buildList.length > 0) {
          return new Promise(resolve => {
            resolve(_buildList)
          })
        } else {
          return this.$store.dispatch('requestBuildingInfo', {
            cityId,
            projectId
          }).then(data => {
            _cityId = cityId
            _projectId = projectId
            _buildList = data
            return data
          })
        }
      }
    }()),
    // 选择楼层
    chooseFloor () {
      const houseInfo = this.houseInfo || {}
      const buildingId = this.buildingId
      if (!buildingId) {
        this.$MessageBox.alert({
          title: '请先选择楼栋'
        })
        return true
      }
      this.queryFloor(this.fixId, buildingId)
        .then((data) => {
          this.openGeneralPicker(data.map(item => item.floor), houseInfo.floor, (name) => {
            const buildObj = findItemByProp(data, name, 'floor')
            this.$set(this.houseInfo, 'floor', buildObj.floor)
            this.doClearFamilyNo()
          })
        })
    },
    // 查询楼层信息
    queryFloor: (function() {
      let _floorList = null
      let _cityId = null
      let _buildingId = null
      return function(cityId, buildingId) {
        if (cityId === _cityId && buildingId === _buildingId && Array.isArray(_floorList) && _floorList.length > 0) {
          return new Promise(resolve => {
            resolve(_floorList)
          })
        } else {
          return this.$store.dispatch('requestFloorInfo', {
            cityId,
            buildingId
          }).then(data => {
            _cityId = cityId
            _buildingId = buildingId
            _floorList = data
            return data
          })
        }
      }
    }()),
    // 选择楼号
    chooseHouseName () {
      const houseInfo = this.houseInfo || {}
      const buildingId = this.buildingId
      const floor = this.floor
      if (!floor) {
        this.$MessageBox.alert({
          title: '请先选择楼栋'
        })
        return true
      }
      this.queryFamilyNo(this.fixId, buildingId, floor)
        .then((data) => {
          this.openGeneralPicker(data.map(item => item.houseName), houseInfo.room, (name) => {
            const buildObj = findItemByProp(data, name, 'houseName')
            this.$set(this.houseInfo, 'room', buildObj.houseName)
            this.$set(this.houseInfo, 'roomId', buildObj.houseId)
          })
        })
    },
    // 请求房间号，会进行缓存
    queryFamilyNo: (function() {
      let _familyNoList = null
      let _cityId = null
      let _buildingId = null
      let _floor = null
      return function(cityId, buildingId, floor) {
        if (cityId === _cityId && buildingId === _buildingId && floor === _floor && Array.isArray(_familyNoList) && _familyNoList.length > 0) {
          return new Promise(resolve => {
            resolve(_familyNoList)
          })
        } else {
          return this.$store.dispatch('requestFamilyNoInfo', {
            cityId,
            buildingId,
            floor
          }).then(data => {
            _cityId = cityId
            _buildingId = buildingId
            _floor = floor
            _familyNoList = data
            return data
          })
        }
      }
    }()),
    // 检查是否是杭州银行
    checkHzBank () {
      const loanOrgCode = (this.productInfo || {}).loanOrgCode
      if (loanOrgCode === 'hzbank') {
        this.$MessageBox.alert({
          title: '杭州银行业务准入要求',
          text:
            '该楼盘楼栋信息需要在房讯通中维护，请联系房抵贷事业部接口人完善楼盘信息后再操作。'
        })
      }
      return true
    },
    // 打开下拉框
    openGeneralPicker(list, item, func) {
      if (!list || !list.length) {
        return
      }
      this.$Picker({
        slots: [
          {
            type: 'data',
            flex: 1,
            values: list,
            textAlign: 'center',
            defaultValue: item
          }
        ],
        onShow: instance => {
          this.__proto__.__proto__.pickerInstance = instance          
        },
        onChange: (instance, changeInfo) => {
        },
        onConfirm: (instance, datas) => {
          func(datas.slot0)
          instance.value = false
          this.__proto__.__proto__.pickerInstance = null          
        }
      })
    }
  }
}
</script>

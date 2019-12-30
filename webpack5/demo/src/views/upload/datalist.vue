<template>
  <div class="data-detail-box">
    <ul :key="`tree-item-${treeItem.name}`" v-for="treeItem in listTree">
      <li :class="treeItem.showChildren && 'up'" @click='treeItem.showChildren=!treeItem.showChildren'>{{ treeItem.name }}</li>
      <template v-if="treeItem.showChildren">
        <li :key="`list-item-${treeItem.name}-${item.name}`" v-for="item in treeItem.children" @click="skipRouter({path: '/upload', query: { applyNo: $route.query.applyNo, objectNo: getObjNo(treeItem.type), typeNo: item.type, name: item.name, productIndex: $route.query.productIndex }})">{{ item.name }}</li>
      </template>
    </ul>
  </div>
</template>

<script>
export default {
  name: 'dataList',
  data() {
    return {
      listTree: [
        {
          name: '客户基础资料',
          type: 'M01',
          showChildren: false,
          children: [
            {
              name: '身份证',
              type: 'M01001'
            },
            {
              name: '婚姻证明',
              type: 'M01003'
            },
            {
              name: '个人征信',
              type: 'M01004'
            },
            {
              name: '公司征信',
              type: 'M01008'
            }
          ]
        },
        {
          name: '房产资料',
          type: 'M02',
          showChildren: false,
          children: [
            {
              name: '房地产证',
              type: 'M02004'
            }
          ]
        },
        {
          name: '原贷款资料',
          type: 'M03',
          showChildren: false,
          children: [
            {
              name: '原贷款合同',
              type: 'M03001'
            },
            {
              name: '原贷款还款记录',
              type: 'M03002'
            }
          ]
        },
        {
          name: '新贷款资料',
          type: 'M04',
          showChildren: false,
          children: [
            {
              name: '银行贷款承诺函',
              type: 'M04001'
            }
          ]
        },
        {
          name: '其他资料',
          type: 'M99',
          showChildren: false,
          children: [
            {
              name: '业务申请书及征信来源说明',
              type: 'M99003'
            }
          ]
        }
      ]
    }
  },

  methods: {
    getObjNo(type) {
      if (type === 'M01') {
        return this.$route.query.customerNo
      } else if (type === 'M02') {
        return this.$route.query.houseNo
      }
      return this.$route.query.applyNo
    }
  }
}
</script>
<style lang="scss" scoped>
  .data-detail-box {
    display: flex;
    flex-direction: column;
    background-color: #ffffff;
    & > ul {
      display: flex;
      flex-direction: column;
      line-height: 75px;
      transition: height 800ms;
      & > li {
        display: flex;
        flex-direction: row;
        justify-content: center;
        border-bottom: 1px solid #DDDDDD;
        background-color: #F7F7F7;
      }
      & > li:before {
        content: '>>';
        position: absolute;
        width: 40px;
        font-size: 55px;
        color: #CACACA;
        background-repeat: no-repeat;
        background-position-y: center;
        background-size: 100%;
        transform: scale(0.4, 1);
        right: 20px;
      }
      & > li:first-child {
        background-color: #ffffff;
      }
      & > li:first-child:before {
        content: '　';
        position: absolute;
        width: 16px;
        background-image: url(http://cdn.ddjf.com/static/images/miniprogram/arrow-r-gray.png);
        background-repeat: no-repeat;
        background-position-y: center;
        background-size: 100%;
        right: 20px;
        transform: rotate(0deg);
        transition: all 300ms;
      }
      & > li.up:first-child:before {
        transform: rotate(90deg);
      }
    }
  }
</style>

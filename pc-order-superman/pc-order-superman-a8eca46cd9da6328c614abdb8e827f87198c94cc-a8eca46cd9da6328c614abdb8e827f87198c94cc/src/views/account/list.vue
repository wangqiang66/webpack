<!--
  function: list
  author  : wq
  update  : 2018/9/26 17:16
-->
<template>
  <div class="column account-list-box">
    <search-list :items="searchList"></search-list>
    <btn-list :items="btnList"></btn-list>
    <el-table
      class="flex1"
      :data="tableData"
      style="width: 100%"
      :default-sort = "{prop: 'date', order: 'descending'}"
    >
      <el-table-column
        prop="date"
        label="日期"
        sortable
        width="180">
      </el-table-column>
      <el-table-column
        prop="name"
        label="姓名"
        sortable
        width="180">
      </el-table-column>
      <el-table-column
        prop="address"
        label="地址"
        :formatter="formatter">
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import SearchList from '@/components/searchList'
import BtnList from '@/components/btnList'
export default {
  name: 'list',
  components: {
    SearchList,
    BtnList
  },
  data () {
    return {
      searchList: [
        {
          label: '用户昵称',
          name: 'nickname',
          placeholder: '输入用户微信昵称',
          type: 'input'
        },
        {
          label: '性别',
          name: 'nickname',
          placeholder: '输入用户性别',
          list: [{
            label: '全部',
            value: '全部'
          }, {
            label: '男',
            value: '男'
          }, {
            label: '女',
            value: '女'
          }, {
            label: '未知',
            value: '未知'
          }],
          type: 'pick'
        },
        {
          label: '用户昵称',
          name: 'nickname',
          placeholder: '输入用户微信昵称',
          type: 'input'
        },
        {
          label: '用户状态',
          name: 'nickname',
          placeholder: '输入用户状态',
          list: [{
            label: '全部',
            value: '全部'
          }, {
            label: '正常',
            value: '正常'
          }, {
            label: '禁用',
            value: '禁用'
          }],
          type: 'pick'
        }
      ],
      btnList: [{
        name: '导出'
      }],
      tableData: [{
        date: '2016-05-02',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1518 弄'
      }, {
        date: '2016-05-04',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1517 弄'
      }, {
        date: '2016-05-01',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1519 弄'
      }, {
        date: '2016-05-03',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1516 弄'
      }]
    }
  },
  methods: {
    formatter(row, column) {
      return row.address
    }
  }
}
</script>

<style lang="scss">
  .account-list-box {
    height: 100%;
    .el-table {
      background-color: #2c3e50;
    }
    .el-table th, .el-table tr {
      background-color: #2c3e50;
    }

    .el-table td, .el-table th.is-leaf {
      border-bottom: 1px solid #243950;
    }

    .el-table--border::after, .el-table--group::after, .el-table::before {
      background-color: #243950;
    }
  }
</style>

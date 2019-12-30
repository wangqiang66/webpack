<template>
  <div class="org-choose-box">
    <wd-search
       v-model="searchName"
       @doSearch="doSearch"
       placeholder="机构名称"></wd-search>
    <div class="list-wrap">
      <scroll-view ref="scroll-view" :refresh="refresh" @pullDown="doRefreshList">
        <ul>
          <li v-for="(item, idx) in list" :key="`org_list_${item.code}_${idx}`" class="list-item"
              @click="doChooseOrg(item, idx)">
            {{item.name}}
          </li>
          <li class="list-empty" v-if="list.length === 0">当前查询数据为空</li>
        </ul>
        <div class="load-more" v-if="list && list.length">
          <div class="has-more" v-if="loadmore" @click="doNextList">加载更多</div>
          <div class="no-more" v-else>没有更多了</div>
      </div>
      </scroll-view>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import WdSearch from '../components/search';
import ScrollView from '@ddjf/scroll-view';

export default {
  components: {
    WdSearch,
    ScrollView
  },
  data () {
    return {
      refresh: true,
      loadmore: true,
      searchName: '',
      pageNo: 1,
      pageSize: 10
    }
  },
  beforeMount () {
    this.queryOrgList();
  },
  methods: {
    doSearch () {
      if (/input/i.test(document.activeElement.tagName)) {
        document.activeElement.blur();
        document.body.focus();
      }
      this.pageNo = 1 // init pageNo
      this.queryOrgList();
    },
    // 查询机构列表
    queryOrgList () {
      const cityCode = this.$route.query.cityCode
      return this.$store.dispatch('requestOrgList', {
        cityCode,
        orgName: this.searchName,
        pageNo: this.pageNo,
        pageSize: this.pageSize,
        orgType: this.houseInfo.mortgageOrg
      }).then(data => {
        this.loadmore = data.length >= this.pageSize
      })
    },
    // 选择机构
    doChooseOrg (item, idx) {
      if (this.$refs['scroll-view'].touchMoving) {
        return false;
      }
      this.$store.commit('setMortgageOrg', item)
      this.$router.back()
    },
    // 刷新列表
    doRefreshList (func) {
      this.pageNo = 1
      this.queryOrgList().then((data) => {
        func(true, data.length >= this.pageSize)
        return data
      }).catch(() => {
        func(false, true)
      })
    },
    // 下一页
    doNextList (func) {
      this.pageNo++
      this.queryOrgList().then((data) => {
        return data
      }).catch(() => {
        func(false, true)
      })
    },
  },
  computed: {
    ...mapGetters({
      list: 'oldOrgList',
      houseInfo: "firstHouseInfo"
    })
  },
}
</script>

<style lang="scss" scoped="scoped">
  .org-choose-box {
    display: flex;
    flex-direction: column;
    width: 100%;
    height: 100%;
  }

  .list-wrap {
    margin-top: 110px;
    background-color: #fff;
    display: flex;
    flex-direction: column;
    flex: 1;
    .list-item {
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: center;
      height: 88px;
      border-top: 1px solid #eee; /*no*/
    }

    .list-empty {
      padding-top: 80px;
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: center;
      height: 88px;
    }
  }
  .load-more {
    margin-top: 40px;
    height: 90px;
    line-height: 90px;
    text-align: center;
    font-size: 32px;
    color: #126ae4;
    .no-more {
      color: #888;
    }
  }
</style>

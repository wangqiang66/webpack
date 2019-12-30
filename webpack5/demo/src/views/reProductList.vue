<template>
  <div>
    <div class="search-wrap">
      <input type="search" class="search-input" v-model="inputValue" autofocus placeholder="请输入楼盘名称"
             @search="queryList">
    </div>
    <div class="tag-wrap" v-if="isShowHistory">
      <div class="tag-title">
        历史搜索
      </div>
      <div class="tag-content">
        <div v-for="(item, index) in tagList" :key="index" @click="chooseTag(item)" class="tag-item">{{item}}</div>
      </div>
    </div>
    <div class="result-content" v-if="hasSearch && searchList.length > 0">
      <div v-for="(item, index) in searchList" :key="index" @click="chooseProject(item)" class="result-item">
        <div class="i-title">
          {{item.projectName}}
        </div>
        <div class="i-text">
          {{item.address}}
        </div>
      </div>
    </div>
    <div class="result-content" v-if="hasSearch && searchList.length == 0">
      <div class="no-data">
        当前小区暂无数据，请联系房抵贷事业部接口人添加楼盘信息或重新输入!
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  data () {
    return {
      inputValue: '',
      tagList: [],
      isShowHistory: true,
      hasSearch: false,
      searchList: [],
      clock: null
    }
  },
  computed: {
    ...mapGetters({
      houseInfo: 'firstHouseInfo'
    }),
    fxtId () {
      const houseInfo = this.houseInfo || {}
      return houseInfo.fxtCityId
    }
  },
  mounted () {
    this.queryTags()
    if (!this.fxtId) {
      history.back()
    }
  },
  methods: {
    queryTags () {
      // 查询缓存中是否有projectTags
      var tags = localStorage.getItem('projectTags')
      if (tags) {
        this.tagList = JSON.parse(tags)
      }
    },
    initData () {
      this.inputValue = ''
      this.searchList = []
      this.hasSearch = false
      this.isShowHistory = true
    },
    chooseTag (item) {
      this.inputValue = item
      this.queryList()
    },
    queryList () {
      if (!this.inputValue) {
        this.initData()
        return true
      }
      this.isShowHistory = false
      this.$store.dispatch('requestProjectList', {
        'cityId': this.fxtId,
        'key': this.inputValue,
        'items': 15
      }).then(data => {
        this.searchList = data
        this.hasSearch = true
      })
    },
    chooseProject (item) {
      this.$set(this.houseInfo, 'projectName', item.projectName)
      this.$set(this.houseInfo, 'projectId', item.projectId)
      this.$set(this.houseInfo, 'buildingName', '')
      this.$set(this.houseInfo, 'buildingId', '')
      this.$set(this.houseInfo, 'floor', '')
      this.$set(this.houseInfo, 'room', '')
      this.$set(this.houseInfo, 'roomId', '')
      this.addTag()
      this.$router.back()
    },
    // 存放索搜历史
    addTag () {
      var tagList = this.tagList
      var tag = this.inputValue
      if (tagList.indexOf(tag) > -1) { // 有相同的
        tagList.splice(tagList.indexOf(tag), 1)
        tagList.unshift(tag)
      } else {
        tagList.unshift(tag)
      }
      if (tagList.length > 5) {
        tagList.pop()
      }
      localStorage.setItem('projectTags', JSON.stringify(tagList))
    }
  }
}
</script>

<style lang="scss">
  .search-wrap {
    padding: 10px 0;
    .search-input {
      width: 100%;
      height: 60px;
      padding: 0 10px;
      font-size: 30px;
      outline: none;
    }
  }

  .tag-wrap {
    .tag-title {
      padding: 20px;
      color: #353535;
    }
    .tag-content {
      display: flex;
      padding: 0 20px;
      .tag-item {
        margin: 0 10px;
        padding: 0 20px;
        height: 40px;
        min-width: 40px;
        line-height: 40px;
        background: #E5E5E5;
        border-radius: 20px;
      }
    }
  }

  .result-content {
    width: 100%;
    .no-data {
      margin-top: 200px;
      font-size: 32px;
      color: #888888;
      text-align: center;
    }
    .result-item {
      padding: 20px;
      border-bottom: 3px solid #eee;
      .i-title {
        height: 40px;
        line-height: 40px;
        font-size: 28px;
        color: #666666;
      }
      .i-text {
        margin-top: 10px;
        font-size: 24px;
        line-height: 33px;
        color: #B2B2B2;
      }
    }
  }
</style>

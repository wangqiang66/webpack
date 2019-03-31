<!--
  function: header
  author  : wq
  update  : 2018/9/18 17:54
-->
<template>
  <div class="row flex-middle layout-header-box">
    <div>
      <img :src="logo"/>
    </div>
    <div class="flex1 row flex-right flex-middle">
      <span class="user-wrap">您好，<router-link class="username" :to="{ name: path, params: { userId: 123 }}">{{ username }}</router-link></span>
      <el-button type="primary" plain>退出系统</el-button>
    </div>
  </div>
</template>

<script>
import { UserInfo } from '@/route/defined'

export default {
  name: 'layout-header',
  data () {
    return {
      path: UserInfo,
      logo: require('../../../images/logo.png')
    }
  },
  computed: {
    username () {
      return this.$store.state.user.name
    }
  }
}
</script>

<style lang="scss">
  .layout-header-box {
    padding: 20px;
  }

  .user-wrap {
    padding: 0 20px;
    color: #409EFF;
  }

  .username {
    color: #409EFF;
    text-decoration: none;
  }
</style>

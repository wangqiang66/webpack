<!--
  function: index
  author  : wq
  update  : 2018/9/18 18:40
-->
<template>
  <el-scrollbar :class="['layout-menu-wrap', isCollapse ? 'collapse' : '']" wrap-class="scrollbar-wrapper">
    <el-menu
      :show-timeout="200"
      :default-active="$route.path"
      :collapse="isCollapse"
      :unique-opened="true"
      mode="vertical"
      background-color="#304156"
      text-color="#bfcbd9"
      active-text-color="#409EFF">
      <menu-item v-for="route in routerMenu" :key="route.name" :item="route" :base-path="route.path"></menu-item>
    </el-menu>
    <div :class="['collapse-wrap', isCollapse ? 'collapse' : '']" @click="doClickCollapse">
      <i class="icon el-icon-arrow-left"></i>
    </div>
  </el-scrollbar>
</template>

<script>
import { mapGetters } from 'vuex'
import MenuItem from './menu'
export default {
  name: 'layout-menu',
  components: {
    MenuItem
  },
  computed: {
    ...mapGetters([
      'permission_routers',
      'sidebar'
    ]),
    routerMenu () {
      return this.permission_routers.filter(item => item.meta && item.meta.menu).sort((item1, item2) => item1.meta.sort - item2.meta.sort)
    },
    isCollapse () {
      return !this.sidebar.opened
    }
  },
  methods: {
    doClickCollapse() {
      const isCollapse = this.isCollapse
      this.$store.commit('TOGGLE_SIDEBAR', !isCollapse)
    }
  }
}
</script>

<style lang="scss">
  .layout-menu-wrap {
    font-size: 0;
    height: 100%;
    position: relative;
    transition: width .4s;
    width: 180px;
    overflow: hidden;
    background-color: #2c3e50;
  }

  .layout-menu-wrap.collapse {
    width: 64px;
  }
  .scrollbar-wrapper {
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    transition: width .28s;
    height: initial;
    z-index: 1001;
  }

  .collapse-wrap {
    position: absolute;
    top: 30%;
    right: 0;
    width: 30px;
    height: 60px;
    z-index: 1002;
    border-radius: 8px 0 0 8px;
    background-color: rgba(0,0,0,0.5);
  }

  i.icon {
    display: block;
    font-size: 30px;
  }

  .collapse-wrap i.icon {
    line-height: 2;
    text-align: center;
    color: #516e94
  }

  .collapse-wrap.collapse i.icon{
    transform: rotate(180deg);
  }
  .el-menu {
    border: 0;
    a {
      text-decoration: none;
      color: rgb(191, 203, 217);
    }
    a.router-link-exact-active {
      color: rgb(64, 158, 255);
    }
  }
</style>

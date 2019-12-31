<!--
  function: index
  author  : wq
  update  : 2018/9/18 17:49
-->
<template>
  <div class="layout-box">
    <layout-header></layout-header>
    <div class="row flex1">
      <layout-menu></layout-menu>
      <section class="app-main flex1">
        <transition name="fade-transform" mode="out-in">
          <keep-alive>
            <router-view :key="$route.fullPath"/>
          </keep-alive>
        </transition>
      </section>
    </div>
  </div>
</template>

<script>
import LayoutHeader from './components/header'
import LayoutMenu from './components/menu/index'
export default {
  name: 'layout',
  components: {
    LayoutHeader,
    LayoutMenu
  }
}
</script>

<style lang="scss">
  $bg:#2d3a4b;
  .layout-box {
    width: 1920px;
    max-width: 100%;
    height: 100%;
    min-height: 100%;
    margin: 0 auto;
    background-color: $bg;
    display: flex;
    flex-direction: column;
  }

  .app-main {
    padding: 20px;
  }
</style>

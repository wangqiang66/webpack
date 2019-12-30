<!--
  function: search.vue
  author  : wq
  update  : 2018/8/2 14:25
-->
<template>
  <div class="wd-search">
    <div class="wd-search-arrow" v-if="needBack" @click="doBack">
      <i class="wd-search-arrow-left"></i>
    </div>
    <div class="wd-search-input">
      <div class="wd-search-icon">
        <i class="wd-search-icon-search"></i>
      </div>
      <input type="search" :value="value" @input="(e) => this.$emit('input', e.target.value)" :placeholder="placeholder" @search="doSearch">
      <i class="wd-search-input-close" v-show="showClear" @click="clearValue">✕</i>
    </div>
    <div class="wd-search-button" @click="doSearch">搜索</div>
  </div>
</template>

<script>
  export default {
    name: "search",
    props: {
      needBack: {
        type: Boolean,
        default: false
      },
      placeholder: {
        type: String,
        default: ""
      },
      value: {
        type: String,
        default: ""
      }
    },
    computed: {
      showClear() {
        return this.value.length > 0;
      }
    },
    methods: {
      clearValue() {
        this.$emit("input", "");
      },
      doSearch() {
        this.$emit("doSearch");
      },
      doBack() {
        this.$emit("doBack");
      }
    }
  }
</script>

<style scoped>
  .wd-search {
    position: absolute;
    top: 0;
    width: 100%;
    height: 104px;
    display: flex;
    border-bottom: 1px solid #cacaca; /* no */
    padding: 16px;
    background: #fff
  }

  .wd-search, .wd-search .wd-search-arrow {
    box-sizing: border-box
  }

  .wd-search .wd-search-arrow {
    position: relative;
    width: 96px;
    height: 72px;
    padding: 12px 24px
  }

  .wd-search .wd-search-arrow .wd-search-arrow-left {
    width: 26px;
    height: 26px;
    display: inline-block;
    background: #cecece;
    position: absolute;
    transform: rotate(135deg);
    top: 22px;
    left: 38px;
  }

  .wd-search .wd-search-arrow .wd-search-arrow-left:after {
    content: "";
    position: absolute;
    top: -2px;
    left: -2px;
    width: 26px;
    height: 26px;
    background: #fff
  }

  .wd-search .wd-search-input {
    display: flex;
    flex: 1;
    height: 72px;
    box-sizing: border-box;
    background: #eee;
    border-radius: 4px;
    position: relative;
    padding: 18px 24px 18px 0;
    align-items: center;
  }

  .wd-search .wd-search-input .wd-search-icon {
    display: inline-block;
    width: 84px;
    height: 36px;
    padding: 0 24px;
    border-right: 1px solid #cacaca; /* no */
    box-sizing: border-box
  }

  .wd-search .wd-search-input .wd-search-icon .wd-search-icon-search {
    display: inline-block;
    width: 0.26rem;
    height: 0.26rem;
    top: 2px;
    background: #eee;
    border: 2px solid #737373;
    border-radius: 100%;
    position: relative
  }

  .wd-search .wd-search-input .wd-search-icon .wd-search-icon-search:after {
    content: "";
    display: block;
    position: absolute;
    width: 2px; /*px*/
    height: 12px;
    background-color: #737373;
    transform: rotate(-45deg);
    top: 16px;
    left: 22px;
  }

  .wd-search .wd-search-input input {
    flex: 1;
    background: #eee;
    height: 40px;
    -webkit-appearance: none;
    border: 0;
    box-sizing: border-box;
    outline: 0;
    font-size: 32px;
    color: #222;
    line-height: 36px;
    padding-left: 8px;
    margin-top: 0;
    outline-offset: 0;
  }

  .wd-search .wd-search-input ::-webkit-search-cancel-button, .wd-search .wd-search-input ::-webkit-search-results-button {
    -webkit-appearance: none
  }

  .wd-search .wd-search-input .wd-search-input-close {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 38px;
    height: 38px;
    padding: 4px;
    border-radius: 50%;
    box-sizing: border-box;
    background: rgba(0, 0, 0, .3);
    color: #fff;
    position: absolute;
    font-size: 26px;
    top: 18px;
    right: 24px;
    line-height: 30px
  }

  .wd-search .wd-search-button {
    width: 112px;
    height: 70px;
    margin: 0 16px;
    line-height: 72px;
    text-align: center;
    background: #c60a1e;
    border-radius: 4px;
    font-size: 28px;
    color: #fff
  }
</style>
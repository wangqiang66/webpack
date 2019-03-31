<!--
  function: menu
  author  : wq
  update  : 2018/9/18 18:04
-->
<script>
import { generateTitle } from '@/utils/i18n'
import Item from './item'

export default {
  name: 'layout-menu',
  components: {
    Item
  },
  props: {
    // route object
    item: {
      type: Object,
      required: true
    },
    isNest: {
      type: Boolean,
      default: false
    },
    basePath: {
      type: String,
      default: ''
    }
  },
  render (c) {
    return this.generateMenu(this.item)
  },

  methods: {
    generateMenu (item) {
      const list = []
      if (Array.isArray(item.children) && item.children.length > 0) {
        item.children.forEach(itm => {
          list.push(this.generateMenu(itm))
        })
      } else {
        return (
          <el-menu-item index={item.path}>
            <router-link class="router-link-wrap" to={item.path}>
              <Item icon={item.meta.icon} title={item.meta.title}></Item>
            </router-link>
          </el-menu-item>
        )
      }
      return (
        <el-submenu index={item.path}>
          <Item icon={item.meta.icon} title={item.meta.title} slot="title"></Item>
          {list}
        </el-submenu>
      )
    },
    generateTitle
  }
}
</script>

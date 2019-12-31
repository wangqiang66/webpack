<!--
  function: item
  author  : wq
  update  : 2018/9/19 10:09
-->
<script>
export default {
  name: 'layout-menu-item',
  functional: true,
  props: {
    icon: {
      type: String
    },
    title: {
      type: String
    }
  },
  render (h, context) {
    const vnodes = []
    const { icon, title } = context.props
    if (icon) {
      if (icon.indexOf('el-icon') === 0) {
        vnodes.push(<i class={icon}></i>)
      } else if (/.(?:png|jpg|jpeg|gif|svg|webp|bmp)$/i.test(icon)) {
        vnodes.push(<img src={icon}></img>)
      } else {
        vnodes.push(<svg-icon icon-class={icon}/>)
      }
    }
    if (title) {
      vnodes.push(<span>{title}</span>)
    }
    console.log()
    return vnodes
  }
}
</script>

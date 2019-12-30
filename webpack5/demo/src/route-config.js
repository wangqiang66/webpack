import Index from './views/index.vue'
// import Customer from './views/customer.vue'
// import Apply from './views/apply.vue'
// import Reapply from './views/reapply.vue'
// import Identity from './views/identity.vue'
import Recommend from './views/recommend/recommend.vue'
import RecommendApply from './views/recommend/recommendApply.vue'
import RecommendOrgApply from './views/recommend/recommendOrgApply.vue'
import RecommendDetail from './views/recommend/recommendDetail.vue'
import RecommendOrgDetail from './views/recommend/recommendOrgDetail.vue'
import ReProductList from './views/reProductList.vue'
import DataList from './views/upload/datalist.vue'
import DataUpload from './views/upload/upload.vue'
import OrgChoose from './views/orgChoose.vue'
import EvaluateRecommendDetail from './views/recommend/evaluateRecommendDetail.vue'

export default {
  scrollBehavior (to, from, savedPosition) {
    return {x: 0, y: 0}
  },
  routes: [
    {
      path: '/',
      name: 'Index',
      component: Index,
      meta: {
        title: '意向订单',
        keepAlive: true
      }
    },
    {
      path: '/org_choose',
      name: 'OrgChoose',
      component: OrgChoose,
      meta: {
        title: '机构选择'
      }
    },
    {
      path: '/recommend',
      name: 'Recommend',
      component: Recommend,
      meta: {
        title: '抵押贷款',
        keepAlive: true
      }
    },
    {
      path: '/evaluateRecommendDetail',
      name: 'EvaluateRecommendDetail',
      component: EvaluateRecommendDetail,
      meta: {
        title: '提放保'
      }
    },
    {
      path: '/recommendApply',
      name: 'recommendApply',
      component: RecommendApply,
      meta: {
        title: '抵押贷款',
        keepAlive: true
      }
    },
    {
      path: '/recommendOrgApply',
      name: 'recommendOrgApply',
      component: RecommendOrgApply,
      meta: {
        title: '抵押贷款',
        keepAlive: true
      }
    },
    {
      path: '/recommendDetail',
      name: 'recommendDetail',
      component: RecommendDetail,
      meta: {
        title: '推荐订单'
      }
    },
    {
      path: '/recommendOrgDetail',
      name: 'recommendOrgDetail',
      component: RecommendOrgDetail,
      meta: {
        title: '推荐订单'
      }
    },
    {
      path: '/reProductList',
      name: 'reProductList',
      component: ReProductList,
      meta: {
        title: '楼盘列表'
      }
    },
    {
      path: '/dataList',
      name: 'dataList',
      component: DataList,
      meta: {
        title: '资料上传'
      }
    },
    {
      path: '/upload',
      name: 'upload',
      component: DataUpload,
      meta: {
        title: '资料上传'
      }
    }
  ]
}

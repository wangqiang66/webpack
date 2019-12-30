<template>
  <div class="data-upload-box">
    <header class="header">
      <div class="back-wrap" @click="doBack">
        <img class="back-image" src="http://cdn.ddjf.com/static/images/miniprogram/arrow-r-gray.png" /> <span
         class="back">返回</span>
      </div>
      <span class="title">{{ title }}</span> <span v-if="!isDelete" :class="['btn', isSort ? 'btn-disabled' : '']"
                                                   @click="sortImageList">排序</span> <span v-if="!isSort"
                                                                                          :class="['btn', isDelete ? 'btn-disabled' : '']"
                                                                                          @click="deleteImageList">删除</span>
      <template v-if="isSort || isDelete">
        <span class="btn" @click="cancel">取消</span> <span class="btn" @click="finish">完成</span>
      </template>
    </header>
    <draggable v-model="list" :options="{draggable:'.image-item'}">
      <ul class="image-list">
        <li @click="openFile">
          <img :src="uploadImage" />
        </li>
        <li class="image-item" :key="`data-image-${item.path || item.fileUrl}`" v-for="item in list"
            v-dragging="{ item: item, list: sortList, group: 'image' }">
          <img :src="item.path || item.fileUrl" />
          <div v-if="isDelete" class="icon-select-wrap" @click="$set(item, 'choosed', !item.choosed)">
            <img class="icon-select" :src="item.choosed ? selectImage : unSelectImage" />
          </div>
          <div v-if="item.uploadStatus" class="progress-wrap">
            <div class="circle" :class="[item.uploadStatus === 3 ? 'error-circle': '']" @click="clickUpload(item)">
              <div class="track"></div>
              <div class="left transition-rotate"
                   :style="{transform: `rotate(${item.progress <= 50 ? (3.6 * item.progress || 0) : 180}deg)`}"></div>
              <div class="right transition-rotate"
                   :style="{transform: `rotate(${item.progress > 50 ? 3.6 * item.progress: 0}deg)`}"></div>
              <div class="mask" v-if="item.progress <= 50"></div>
              <span
                 :class="['progress-text', item.uploadStatus !== 2 ? 'progress-text-wait' : '']">{{ item.text }}</span><span
               class="percent" v-if="item.uploadStatus === 2">%</span>
            </div>
          </div>
        </li>
      </ul>
    </draggable>
  </div>
</template>

<script>
import draggable from 'vuedraggable'
import wx from 'wx'

export default {
  name: 'data-list',
  components: {
    draggable
  },
  data() {
    return {
      list: [],
      title: '',
      fileType: '',
      copyList: [], // 副本，方便还原
      sortList: [],
      uploadImage: require('../../../images/upload.png'),
      unSelectImage: require('../../../images/icon-press-select.png'),
      selectImage: require('../../../images/icon-press-selected.png'),
      isSort: false,
      isDelete: false,
      localList: [], // 等待上传的本地图片或者上传失败的本地图片
      uploadInfo: {
        isUploadNum: 0,
        waitUploadList: [],
        uploadList: [],
        maxUploadNum: 4,
        timeTick: 0
      },
      vueFile: null
    }
  },
  computed: {
    orderDetail() {
      return this.$store.state.reOrderDetail || {}
    },
    materialFileList() {
      const type = this.fileType
      return this.$store.getters['materialFileList'](type)
    }
  },
  watch: {
    materialFileList(value) {
      const localList = this.localList
      const serverList = value
      this.list = [...serverList, ...localList].sort((item1, item2) => {
        return item1.fileOrder - item2.fileOrder
      })
    },
    localList(value) {
      const localList = value
      const serverList = this.materialFileList
      this.list = [...serverList, ...localList].sort((item1, item2) => {
        return item1.fileOrder - item2.fileOrder
      })
    }
  },
  created() {
    const query = this.$route.query || {}
    this.title = query.name
    this.fileType = query.typeNo
    const applyNo = this.applyNo = query.applyNo
    const productIndex = query.productIndex
    const orderDetail = this.orderDetail || {}
    if (typeof orderDetail !== 'object' || Object.keys(orderDetail).length <= 0) {
      this.$store.dispatch('requestWillOrderDetail', {
        applyNo
      }).then(data => {
        const productInfo = (data.productInfo || [])[productIndex] || {}
        this.$store.commit('setChooseProductInfo', productInfo)
      })
    }
    // 重置createFile和createReaderFile
    this.vueFile = null
  },
  methods: {
    existUnloadImage() {
      const uploadInfo = this.uploadInfo
      return uploadInfo.waitUploadList.length > 0 || uploadInfo.isUploadNum > 0
    },
    existUploadErrorImage() {
      return this.list.filter(item => item.uploadStatus === 3).length > 0
    },
    // 保证只有一个file
    createFile() {
      const vueFile = this.vueFile
      if (vueFile !== null) {
        return vueFile
      }
      else {
        const file = document.createElement('input')
        file.type = 'file'
        file.accept = 'image/*'
        file.name = 'files'
        file.multiple = 'multiple'
        file.addEventListener('change', (ev) => {
          const target = ev.target
          const files = target.files
          let file
          let path
          for (let i in files) {
            if (isNaN(Number(i))) {
              continue
            }
            file = files[i]
            if (this.existFile(file)) {
              continue
            }
            const list = this.list
            const localList = this.localList
            path = this.getFileLocatePath(file)
            const sortNo = (list[list.length - 1] || {}).fileOrder || 0
            const item = {
              path: path,
              filePath: file.name,
              text: `等待\n上传`,
              uploadStatus: 1,
              progress: 0,
              sortNo: sortNo + 10 * i + 10,
              file: file
            }
            localList.push(item)
            this.uploadInfo.timeTick = new Date().getTime()
            this.uploadImageItem(item)
            // const reader = this.createReaderFile(false && !!vueFile)
            // reader.readAsDataURL(files[i])
          }
        })
        return (this.vueFile = file)
      }
    },
    // 获取文件对象，读取文件
    createReaderFile: (function () {
      let reader = null
      return function (single = true) {
        if (reader && single) {
          return reader
        }
        else if (!single) {
          const reader = new FileReader()
          reader.addEventListener('load', () => {
            const list = this.list
            list.push({
              path: reader.result,
              filePath: ''
            })
          }, false)
          return reader
        }
        else {
          reader = new FileReader()
          reader.addEventListener('load', () => {
            const list = this.list
            list.push({
              path: reader.result,
              filePath: ''
            })
          }, false)
          return reader
        }
      }
    }()),
    // 打开系统文件，选择图片
    openFile() {
      const file = this.createFile()
      file.value = ''
      // file.setAttribute('multiple', 'multiple')
      file.click()
    },
    // 查找文件是否存在
    existFile(file) {
      const list = this.list
      for (let i in list) {
        if (list[i].filePath === file.name) {
          return true
        }
      }
      return false
    },
    // 获取图片的本地路径
    getFileLocatePath(file) {
      if (typeof window.createObjectURL === 'function') {
        return window.URL.createObjectURL(file)
      }
      else if (window.webkitURL !== undefined) {
        return window.webkitURL.createObjectURL(file)
      }
      else if (window.URL !== undefined) {
        return window.URL.createObjectURL(file)
      }
      return null
    },
    // 事件处理
    deepCopy(data) {
      const tdata = data
      let obj
      if (typeof tdata !== 'object') {
        return tdata
      }
      if (tdata === null) {
        return tdata
      }
      if (Object.prototype.toString.call(tdata) === '[object Array]') {
        obj = []
        for (let i in tdata) {
          obj.push(this.deepCopy(tdata[i]))
        }
      }
      else {
        obj = {}
        for (let i in tdata) {
          if (tdata.hasOwnProperty(i)) {
            obj[i] = (this.deepCopy(tdata[i]))
          }
        }
      }
      return obj
    },
    // 重新上传
    clickUpload(item) {
      if (item.uploadStatus === 3) {
        this.uploadImageItem(item)
      }
    },
    // 上传图片
    uploadImageItem(item) {
      const uploadInfo = this.uploadInfo
      const file = item.file
      const waitUploadList = uploadInfo.waitUploadList
      if (uploadInfo.isUploadNum >= uploadInfo.maxUploadNum) {
        this.$set(item, 'uploadStatus', 1)
        this.$set(item, 'text', '等待上传')
        uploadInfo.waitUploadList.push(item)
      }
      else {
        uploadInfo.isUploadNum = uploadInfo.isUploadNum + 1
        uploadInfo.uploadList.push(item)
        // 开始上传
        this.$set(item, 'uploadStatus', 2)
        const progress = 0
        const $query = this.$route.query
        this.$set(item, 'text', progress)
        this.$set(item, 'progress', progress)
        this.$store.dispatch('uploadImage', {
          objectNo: $query.objectNo,
          typeNo: $query.typeNo,
          batchNo: this.uploadInfo.timeTick,
          fileOrder: item.sortNo,
          file: file,
          progress: (event) => {
            if (event.lengthComputable) {
              const percent = Math.floor(event.loaded / event.total * 100)
              // 设置进度显示
              this.$set(item, 'text', percent)
              this.$set(item, 'progress', percent)
            }
          }
        })
          .then((data) => {
            this.$set(item, 'uploadStatus', 0)
            this.uploadInfo.isUploadNum = this.uploadInfo.isUploadNum - 1
            // 更新服务器返回的数据
            Object.keys(data).forEach(itm => {
              item[itm] = data[itm]
            })
            // 更新list到materialFileList
            this.updateMarListToServer(item)
            if (waitUploadList.length) {
              const waitFile = waitUploadList.shift()
              this.uploadImageItem(waitFile)
            }
          })
          .catch(() => {
            this.uploadInfo.isUploadNum = this.uploadInfo.isUploadNum - 1
            this.$set(item, 'text', '重新上传')
            this.$set(item, 'uploadStatus', 3)
            if (waitUploadList.length) {
              const waitFile = waitUploadList.shift()
              this.uploadImageItem(waitFile)
            }
          })
      }
    },
    // 排序
    sortImageList() {
      if (this.existUnloadImage()) {
        wx.showToast({
          title: '存在还没有上传完成的图片',
          icon: 'none'
        })
        return false
      }
      if (this.existUploadErrorImage()) {
        wx.showToast({
          title: '存在上传失败的图片',
          icon: 'none'
        })
        return false
      }
      this.isSort = true
      this.copyList = this.deepCopy(this.list)
      this.sortList = this.list
    },
    sureSort() {
      // 重新上传到顺序到服务器
      const fileKeyMap = {}
      this.list.forEach((item, idx) => {
        fileKeyMap[item.fileKey] = {
          'fileOrder': idx * 10 + 10
        }
      })
      this.$store.dispatch('updateImage', {
        fileKeyMap
      })
        .then(() => {
          this.sortList = []
          this.$store.commit('updateMarListAll', {type: this.fileType, list: this.list.map((item, idx) => Object.assign({}, item, { fileOrder: 10 * idx + 10 }))})
          this.isSort = false
        })
    },
    cancelSort() {
      this.sortList = []
      this.$store.commit('updateMarListAll', {type: this.fileType, list: this.copyList})
      this.isSort = false
    },
    // 删除
    deleteImageList() {
      if (this.existUnloadImage()) {
        wx.showToast({
          title: '存在还没有上传完成的图片',
          icon: 'none'
        })
        return false
      }
      this.isDelete = true
    },
    sureDelete() {
      const list = this.list
      const deleteServerList = []
      list.filter(item => item.choosed).forEach((item, idx) => {
        if ([1, 2, 3].indexOf(item.uploadStatus) >= 0) {
        }
        else {
          deleteServerList.push(item)
        }
      })
      if (deleteServerList.length > 0) {
        this.$store.dispatch('deleteImage', {
          fileKeyList: deleteServerList.map(item => item.fileKey)
        })
          .then(() => {
            this.isDelete = false
            // 删除服务器中的对应图片
            this.$store.commit('updateMarListAll', {type: this.fileType, list: this.materialFileList.filter(item => !item.choosed)})
            // 删除对应的本地图片
            this.localList = this.localList.filter(item => !item.choosed)
          })
      }
      else {
        this.isDelete = false
        // 删除对应的本地图片
        this.localList = this.localList.filter(item => !item.choosed)
      }
    },
    cancelDelete() {
      const list = this.list
      list.filter(item => item.choosed).forEach((item, idx) => {
        item.choosed = false
      })
      this.isDelete = false
    },
    cancel() {
      if (this.isSort) {
        this.cancelSort()
      }
      else if (this.isDelete) {
        this.cancelDelete()
      }
    },
    finish() {
      if (this.isSort) {
        this.sureSort()
      }
      else if (this.isDelete) {
        this.sureDelete()
      }
    },
    doBack() {
      this.$router.back()
    },
    // 更新本地数据到服务器数据
    updateMarListToServer(item) {
      const localList = this.localList || []
      let index = -1
      localList.forEach((itm, idx) => {
        if (item.path === itm.path) {
          index = idx
        }
      })
      this.localList.splice(index, 1)
      this.$store.commit('updateMarList', item)
    }
  }
}
</script>

<style lang="scss" scoped>
  $progressWidth: 150;
  .data-upload-box {
    display: flex;
    flex-direction: column;
    ul.image-list {
      display: flex;
      flex-direction: row;
      flex-wrap: wrap;
      padding: 8px;
      & > li {
        position: relative;
        display: flex;
        flex-direction: row;
        justify-content: center;
        align-items: center;
        width: 229px;
        height: 229px;
        box-sizing: border-box;
        border: 1px dashed #02B3B4;
        margin: 7px;
        & > img {
          max-width: 100%;
          max-height: 100%;
        }
        .icon-select-wrap {
          position: absolute;
          top: 0;
          right: 0;
          width: 60px;
          height: 60px;
          padding: 10px;
          z-index: 1;
          box-sizing: border-box;
        }
        .icon-select {
          width: 40px;
          height: 40px;
        }
      }
    }
    .header {
      display: flex;
      flex-direction: row;
      padding: 0 20px;
      align-items: center;
      height: 75px;
      background-color: #ffffff;
      .back-wrap {
        display: flex;
        flex-direction: row;
        align-items: center;
      }
      .back-image {
        width: 15px;
        transform: rotate(180deg);
      }
      .back {
        padding-left: 8px;
      }
    }

    .title {
      flex: 1;
      font-size: 26px;
      text-align: left;
      padding-left: 40px;
    }

    .btn {
      color: #2599f2;
      padding: 0 15px;
    }

    .btn-disabled {
      color: #c2c2c2;
    }

    /* 进度条样式 */
    .progress-wrap {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: center;
      background-color: rgba(0, 0, 0, 0.6);
    }

    .circle {
      position: relative;
      width: $progressWidth + px;
      height: $progressWidth + px;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .circle .track, .circle .mask, .circle .left, .circle .right {
      width: $progressWidth + px;
      height: $progressWidth + px;
      position: absolute;
      top: 0;
      left: 0;
      border-radius: 50%;
      border: 20px #e7e7e7 solid;
      -webkit-box-sizing: border-box;
      -moz-box-sizing: border-box;
      box-sizing: border-box;
    }
    .circle .mask, .circle .left, .circle .right {
      clip: rect(0 $progressWidth / 2 + px $progressWidth + px 0);
    }
    .circle .left, .circle .right {
      border-color: #6FEC6F;
    }
    .error-circle .left, .error-circle .right {
      border-color: #f00;
    }

    .circle .right {
      opacity: 1;
      -webkit-transform: rotate(180deg);
      -moz-transform: rotate(180deg);
      -ms-transform: rotate(180deg);
      -o-transform: rotate(180deg);
      transform: rotate(180deg);
    }
    /* 进度显示文字样式 */
    .circle .progress-text {
      color: #ffffff;
      font-size: 48px;
      line-height: $progressWidth + px;
    }

    .circle .progress-text-wait {
      font-size: 30px;
      max-width: 60px;
      line-height: 1.3em;
      word-break: break-all;
    }

    .circle .percent {
      font-size: 20px;
      color: #999;
      margin-left: 5px;
    }
    .transition-rotate {
      transition: transform .1s ease-in-out;
    }
  }
</style>

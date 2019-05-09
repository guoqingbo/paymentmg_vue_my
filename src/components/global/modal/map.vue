<template>
  <div>
    <Modal v-model="modal" title="选择经纬度" width="75%">
      <baidu-map class="bm-view" ak="DE62ca2a357ccffe40770cf87cb63195" :center="center" @ready="handler" :zoom="zoom" @click="mapClick" :scroll-wheel-zoom="true">
        <label class="map-search">关键词：<input v-model="keyword"></label>
        <bm-view style="width: 100%; height:100%; flex: 1">
        </bm-view>
        <bm-local-search :keyword="keyword" style="position:absolute;right:20px;top:50px;" :auto-viewport="true" :panel="false"></bm-local-search>
      </baidu-map>
      <div slot="footer"></div>
    </Modal>
  </div>
</template>
<script>
import {BaiduMap, BmView, BmLocalSearch,BmMarker,BmScale} from 'vue-baidu-map'
export default {
  data () {
    return {
      modal: false,
      keyword: '',
      center: {lng: 0, lat: 0},
      zoom: 15
    }
  },
  components: {
    BaiduMap,
    BmView,
    BmLocalSearch,
    BmMarker,
    BmScale
  },
  mounted(){
  },
  methods: {
    showModal(){
      this.modal = true
    },
    handler ({BMap, map}) {
      // console.log(BMap, map)
      this.center.lng = 116.404
      this.center.lat = 39.915
    },
    mapClick (type, target, point, pixel, overlay) {
      this.modal = false
      this.$emit('getPoint', type.point)
    }
  }
}
</script>
<style>
.bm-view {
  width: 100%;
  height: 450px;
}
.map-search{ position: absolute; top:75px; left: 25px; z-index: 999; width: 240px; background-color: #fff; border: 1px solid #dcdcdc; padding: 10px; font-size: 14px;}
.map-search input{ border: none; height: 28px; line-height: 28px; width: 160px;}
</style>

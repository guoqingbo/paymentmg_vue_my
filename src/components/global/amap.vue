<template>
    <div class="box">
        <Modal v-model="modal" width=800 title="选择经纬度">
            <div id="container" ref="container">

            </div>
            <label class="map-search">关键词：<input id="input" @onfocus='this.value=""' placeholder="请输入关键字进行搜索"></label>
            <div slot="footer"></div>
        </Modal>
    </div>
</template>

<script>
var map;
var placeSearch;
export default {
  data() {
    return {
      modal: false,
      markers: [],
      keyword: ""
    };
  },
  props: ["mark"],
  mounted() {
    // this.init();
  },
  methods: {
    showModal() {
      this.modal = true;
      this.init();
    },
    init() {
      let _this = this;
      var map = new AMap.Map("container", {
        resizeEnable: true,
        center: _this.mark?_this.mark.split(','):[120.116747, 30.290213], //地图中心点
        zoom: 15 //地图显示的缩放级别
      }); //添加构造器
      AMap.plugin(
        [
          "AMap.Driving",
          "AMap.Transfer",
          "AMap.Walking",
          "AMap.Autocomplete",
          "AMap.ElasticMarker",
          "AMap.Marker",
          "AMap.PlaceSearch"
        ],
        function() {
          map.addControl(new AMap.Driving());
          map.addControl(new AMap.Transfer());
          map.addControl(new AMap.Walking());
          map.addControl(new AMap.ElasticMarker());
          map.addControl(new AMap.Marker());
          map.addControl(new AMap.PlaceSearch());
        }
      );
      // 构造点标记
      var marker = new AMap.Marker({
        icon: "https://webapi.amap.com/theme/v1.3/markers/n/mark_b.png",
        position: _this.mark?_this.mark.split(','):[120.116747, 30.290213],
        offset: new AMap.Pixel(-13, -30)
      });
      if (_this.mark)
      map.add(marker)
      //为地图注册click事件获取鼠标点击出的经纬度坐标
      var clickEventListener = map.on("click", function(e) {
        // let test = [];
        // test.push(e.lnglat.getLng() + "," + e.lnglat.getLat());
        // _this.markers = test;
        // map.add(marker);
        _this.$emit("getPoint", e.lnglat);
        _this.keyword = '';
        _this.modal = false;
      });

      placeSearch = new AMap.PlaceSearch({
        //构造地点查询类
        pageSize: 10,
        pageIndex: 1,
        city: "全国", //城市
        map: map,
        offset: new AMap.Pixel(-13, -30)
      });
        var auto = new AMap.Autocomplete({ input: "input" });
        AMap.event.addListener(auto, "select", select); //注册监听，当选中某条记录时会触发
        function select(e) {
          placeSearch.setCity(e.poi.adcode);
          placeSearch.search(e.poi.name)
        }
        AMap.event.addListener(placeSearch, "markerClick", function(e){
          _this.$emit("getPoint", e.data.location);
          _this.keyword = '';
          _this.modal = false;
        })
    }
  }
};
</script>

<style scoped>
.box {
  width: 100%;
  height: 400px;
}
#container {
  width: 100%;
  height: 400px;
}
.map-search {
  position: absolute;
  top: 75px;
  left: 25px;
  z-index: 9999;
  width: 240px;
  background-color: #fff;
  border: 1px solid #dcdcdc;
  padding: 5px;
  font-size: 14px;
}
.map-search input {
  border: none;
  outline: none;
  height: 28px;
  line-height: 28px;
  width: 160px;
}
</style>



<template>
  <div class="city-select">
    <Row>
        <Col class="city-list-item" span="7">
          <Select v-model="sheng" :disabled="disabled" @on-change="choseProvince" placeholder="省级地区">
            <Option
              v-for="item in province"
              :key="item.areaCode"
              :label="item.areaName"
              :value="item.areaCode"
              :selected="item.areaCode == sheng"
            ></Option>
          </Select>
        </Col>
        <Col class="city-list-item" span="7" offset="1">
          <Select v-model="shi" :disabled="disabled" @on-change="choseCity" placeholder="市级地区">
            <Option
              v-for="item in shi1"
              :key="item.areaCode"
              :label="item.areaName"
              :value="item.areaCode"
              :selected="item.areaCode == shi"
            ></Option>
          </Select>
        </Col>


        <Col class="city-list-item" span="7" offset="1">
          <Select v-model="qu" :disabled="disabled" @on-change="choseBlock" placeholder="区级地区">
            <Option
              v-for="item in qu1"
              :key="item.areaCode"
              :label="item.areaName"
              :value="item.areaCode"
              :selected="item.areaCode == qu"
            ></Option>
          </Select>
        </Col>
    </Row>
  </div>
</template>
<script>
export default {
  data() {
    return {
      province: "",
      sheng: "",
      shengName:"",
      shi: "",
      shiName: "",
      shi1: [],
      qu: "",
      quName: "",
      qu1: [],
      city: "",
      block: "",
      areaCode: "",
    };
  },
  props: {
    // addrCode: {
    //   type: String,
    // },
    value: {
      type: String,
    },
    fieldName:{
      type: String,
      default: "addressCode"
    },
    disabled:{
      type:Boolean ,
      default: false
    },
  },
  watch: {
    value:{
      handler(val, oldVal){
        console.log(val)
        console.log(oldVal)
        if(val!==oldVal){
          this.updateArea()
        }
      },
      immediate: true
    },
    // value
  },
  mounted() {
    // this.$nextTick(async () => {
    //   this.updateArea()
    // }, 200);
  },
  created() {

  },
  methods: {
    getCityData() {
      this.$store.dispatch("getCityData").then(res => {
        this.province = res.data;
      });
    },
    // 更新市或区
    updateArea(){
      if (this.value){
        console.log(123)
        let [sheng,shi,qu] = this.value.split("-")
        // if(sheng && shi && qu){
        //
        // }
        this.sheng = sheng;
        this.shi = shi;
        this.qu = qu;
        this.$store.dispatch("getCityData").then(res => {
          this.province = res.data;
          for (let index2 in this.province) {
            if (sheng === this.province[index2].areaCode) {
              this.shi1 =  this.province[index2].subList
              this.shengName = this.province[index2].areaName
              break;
            }
          }
          for (let index3 in this.shi1) {
            if (shi === this.shi1[index3].areaCode) {
              this.qu1 =  this.shi1[index3].subList
              this.shiName =  this.shi1[index3].areaName
              break;
            }
          }
          for (let index4 in this.qu1) {
            if (qu === this.qu1[index4].areaCode) {
              this.quName = this.qu1[index4].areaName
              break;
            }
          }
          this.emitArea()
        });
      }else{
        this.getCityData();
      }
    },
    // 选省
    choseProvince(e) {
      for (let index2 in this.province) {
        if (e === this.province[index2].areaCode) {
          // this.$emit("getProvince", this.province[index2].areaName, e);
          this.shi1 =  this.province[index2].subList
          this.shengName = this.province[index2].areaName

          this.shi = ''
          this.shiName = ''

          this.qu =  ''
          this.qu1 =  []
          this.quName = ''
          break;
        }
      }
      this.emitArea()
    },
    // 选市
    choseCity(e) {
      for (let index3 in this.shi1) {
        if (e === this.shi1[index3].areaCode) {
          // this.$emit("getProvince", this.province[index2].areaName, e);
          this.qu1 =  this.shi1[index3].subList
          this.shiName =  this.shi1[index3].areaName

          this.qu =  ''
          this.quName = ''

          break;
        }
      }
      this.emitArea()
      // let params = {
      //   parentCode:e
      // }
      // this.apiGet(this.url,params).then(
      //   res => {
      //     this.qu1 = res.data;
      //     this.qu = "";
      //     for (var index3 in this.shi1) {
      //       if (e === this.shi1[index3].areaCode) {
      //         this.$emit("getCity", this.shi1[index3].areaName, e);
      //       }
      //     }
      //   }
      // );
    },
    // 选区
    choseBlock(e) {
      for (let index4 in this.qu1) {
        if (e === this.qu1[index4].areaCode) {
          this.quName = this.qu1[index4].areaName
          break;
        }
      }
      // if(this.sheng && this.shi && this.qu){
      //   this.emitArea
      // }
      this.emitArea()
      // this.areaCode = this.sheng+"-"+this.shi+"-"+ this.qu;

    },
    // 暴露区域
    emitArea(){
      let area = [{
        value:this.sheng,
        label:this.shengName
      },{
        value:this.shi,
        label:this.shiName
      },{
        value:this.qu,
        label:this.quName
      }]
      this.$emit("getQu", area,this.fieldName)
    },
  }
};
</script>

<style lang="scss">
.city-select {
  .ivu-col.ivu-col-span-3 {
    margin-right: 8px;
  }
  .city-list-item{
    .ivu-form-item{
      margin-bottom: 0;
    }
  }
}
</style>



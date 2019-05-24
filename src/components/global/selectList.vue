<template>
  <div class="city-select">
    <Row>
        <Col class="city-list-item" span="8">
         <FormItem>
          <Select v-model="sheng" :disabled="disabled" @on-change="choseProvince" placeholder="省级地区">
            <Option
              v-for="item in province"
              :key="item.areaCode"
              :label="item.areaName"
              :value="item.areaCode"
            ></Option>
          </Select>
          </FormItem>
        </Col>


        <Col class="city-list-item" span="8">
         <FormItem>
          <Select v-model="shi" :disabled="disabled" @on-change="choseCity" placeholder="市级地区">
            <Option
              v-for="item in shi1"
              :key="item.areaCode"
              :label="item.areaName"
              :value="item.areaCode"
            ></Option>
          </Select>
           </FormItem>
        </Col>


        <Col class="city-list-item" span="8">
        <FormItem>
          <Select v-model="qu" :disabled="disabled" @on-change="choseBlock" placeholder="区级地区">
            <Option
              v-for="item in qu1"
              :key="item.areaCode"
              :label="item.areaName"
              :value="item.areaCode"
            ></Option>
          </Select>
           </FormItem>
        </Col>

    </Row>
  </div>
</template>
<script>
export default {
  props: ["addrCode"], // 1211-111-22
  data() {
    return {
      province: "",
      sheng: "",
      shi: "",
      shi1: [],
      qu: "",
      qu1: [],
      city: "",
      block: "",
      code: "",
      url:"/area/list"
    };
  },
  props: {
    formItems: {
      type: Array
    },
    disabled:{
      // 区分是详情，新增，编辑
      type:Boolean ,
      default: false
    },
  },
  watch: {
    // async addrCode(val, oldVal) {
    //   if (val){
    //     this.updateArea()
    //   } else {
    //     this.sheng = "";
    //     this.shi = "";
    //     this.qu = "";
    //     this.shi1 = [];
    //     this.qu1 = [];
    //   }
    // }
  },
  mounted() {
    this.$nextTick(async () => {
      this.updateArea()
    }, 200);
  },
  created() {
    this.getCityData();
  },
  methods: {
    getCityData() {
      this.apiGet(this.url).then(res => {
        this.province = res.data;
      });
    },
    // 选省
    choseProvince(e) {
      let params = {
        parentCode:e
      }
      this.apiGet(this.url,params).then(
        res => {
          this.shi1 = res.data;
          this.shi = "";
          this.qu = "";
          for (var index2 in this.province) {
            if (e === this.province[index2].areaCode) {
              this.$emit("getProvince", this.province[index2].areaName, e);
            }
          }
        }
      );
    },
    // 选市
    choseCity(e) {
      let params = {
        parentCode:e
      }
      this.apiGet(this.url,params).then(
        res => {
          this.qu1 = res.data;
          this.qu = "";
          for (var index3 in this.shi1) {
            if (e === this.shi1[index3].areaCode) {
              this.$emit("getCity", this.shi1[index3].areaName, e);
            }
          }
        }
      );
    },
    // 选区
    choseBlock(e) {
      for (var index4 in this.qu1) {
        if (e === this.qu1[index4].areaCode) {
          this.$emit("getQu", this.qu1[index4].areaName, e);
        }
      }
    },
    // 获取选择后的省市区编码
    getArea(){
      let areaCode =  this.sheng+"-"+this.shi+"-"+ this.qu;
      return areaCode
    },
    // 更新市或区
    async updateArea(){
      if (this.addrCode){
        this.sheng = this.addrCode.split("-")[0];
        this.shi = this.addrCode.split("-")[1];
        this.qu = this.addrCode.split("-")[2];
        let params = {}
        if (this.sheng) {
          params.parentCode = this.sheng
          let shires = await this.apiGet(this.url,params);
          this.shi1 = shires.data;
        }
        if (this.shi) {
          params.parentCode = this.shi
          let qures = await this.apiGet(this.url,params);
          this.qu1 = qures.data;
        }
      }
    }
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



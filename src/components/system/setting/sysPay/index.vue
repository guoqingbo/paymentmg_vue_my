<template>
    <div class="market-box">
        <div class="pay-title">设置支付方式</div>
        <div class="pay-list">
            <div v-for="(item,index) in listData" :key="index" class="pay-item" :class="{'pay-add':!item.iconUrl}">
                <img v-if="item.iconUrl" :src="item.iconUrl" alt="">
                <span v-else>{{item.name}}</span>
            </div>
            <div class="pay-item pay-add" @click="show=true">+新增支付方式</div>
        </div>
        <Modal v-model="show" title="新增支付方式" @on-cancel="cancel">
            <Form :model="formItem" ref="formItem" label-position="right" :label-width="100">
                <FormItem label="支付名称：">
                    <Input v-model="formItem.name" style="width:200px;"></Input>
                </FormItem>
                <FormItem label="图标：">
                    <uploadFile :limitNum="1" v-model="formItem.iconUrl"></uploadFile>
                </FormItem>
                <FormItem>
                    <Button type="primary" @click="addSave">保存</Button>
                </FormItem>
            </Form>
            <div slot="footer"></div>
        </Modal>
        <Spin size="large" fix v-if="spinShow"></Spin>
    </div>
</template>


<script>
import { apiPost, apiGet, apiPostJson } from "@/fetch/api";
import uploadFile from "@/components/global/uploadFile";
export default {
  data() {
    return {
      formItem: {
        enabled: "T",
        name: "",
        iconUrl: ""
      },
      show: false,
      listData: [],
      spinShow:true,
    };
  },
  components: { uploadFile },
  created() {
    this.getList();
  },
  mounted() {},
  methods: {
      cancel(){
          this.formItem.name=''
          this.formItem.iconUrl=''
      },
    getList() {
      apiGet("/manage/admin/webApi/sysPayMethodApi/listSysPayMethod").then(res => {
          if(res.status==200){
              this.spinShow=false
              this.listData = res.data;
          }
      });
    },
    addSave() {
        let _this=this
      apiPostJson("/manage/admin/webApi/sysPayMethodApi/add",this.formItem).then(res => {
        if (res.status == 200) {
          this.show = false;
          this.getList();
          _this.$refs.formItem.resetFields()
        }
      });
    }
  }
};
</script>
<style lang="scss">
.market-box {
  width: 100%;
//   min-width: 1366px;
  position: relative;
  .pay-title {
    text-align: center;
    padding-bottom: 30px;
  }
  .pay-list {
    display: flex;
    flex-wrap: wrap;
    justify-content: flex-start;
    .pay-item {
      width: 180px;
      height: 72px;  
      color: #303133;
      font-size: 16px;
      text-align: center;
      line-height: 72px;
      margin: 15px 20px;
      cursor: pointer;
    }
    .pay-add{
        border: 1px solid #dcdee2;
    }
  }
}
</style>





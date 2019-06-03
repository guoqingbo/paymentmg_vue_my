<template>
    <div class="guestSource">
        <div class="pay-title">设置客人来源</div>
        <div class="pay-list">
            <div v-for="(item,index) in listData" :key="index" class="pay-item" :class="{'pay-add':!item.iconUrl}">
                <img v-if="item.iconUrl" :src="item.iconUrl" alt="">
                <span v-else>{{item.name}}</span>
                <div class="source-color" :style="{background:item.defColor}"></div>
            </div>
            <div class="pay-item pay-add" @click="show=true">+新增渠道</div>
            <!-- <button @click="setColor">改变</button> -->
        </div>
        <Modal v-model="show" title="新增客人来源" @on-cancel="cancel">
            <Form :model="formItem" label-position="right" :label-width="100">
                <FormItem label="来源名称：">
                    <Input v-model="formItem.name" style="width:200px;"></Input>
                </FormItem>
                <FormItem label="主体颜色：">
                    <Input v-model="formItem.defColor" style="width:200px;"></Input>
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
        iconUrl: "",
        defColor: ""
      },
      show: false,
      listData: [],
      spinShow: true
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
          this.formItem.defColor=''
      },
    getList() {
      apiGet("/manage/admin/webApi/sysChannelSrc/listSysChannelSrc").then(res => {
        if (res.status == 200) {
          this.spinShow = false;
          this.listData = res.data;
        }
      });
    },
    addSave() {
      apiPostJson("/manage/admin/webApi/sysChannelSrc/add", this.formItem).then(res => {
        if (res.status == 200) {
          this.show = false;
          this.getList();
        }
      });
    },
    setColor() {
      apiGet("/manage/admin/webApi/sysChannelSrc/setColor", {
        id: 17,
        defColor: "#00428E"
      }).then(res => {

      });
    }
  }
};
</script>
<style lang="scss">
.guestSource {
  width: 100%;
  //   max-width: 1366px;
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
      position: relative;
      cursor: pointer;
      .source-color {
        height: 71px;
        width: 10px;
        position: absolute;
        top: 0;
        left: 0;
        background-color: #d1d1c5;
      }
      img {
        width: 100%;
        height: 100%;
      }
    }
    .pay-add {
      border: 1px solid #dcdee2;
    }
  }
}
</style>





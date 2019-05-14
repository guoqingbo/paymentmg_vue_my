<template>
    <Modal v-model="confirmModel"
           width="360"
           :mode="mode"
           :z-index="3000"
           class-name="ivu-confirm-modal">
        <p slot="header" style="text-align:center;">
            <!-- <Icon type="information-circled"></Icon> -->
            <span>信息确认</span>
        </p>
        <div style="margin-top:-20px;margin-left:10px;">
           <Icon class="icon-content" type="md-close-circle" />
          <h3 style=" display: inline-block;color:#ED4014;font-size:14px;">{{content}}</h3>
           <p style="margin-left:42px;margin-top:-18px;color:#909399;font-size:12px;">【警告】该操作不可恢复，请谨慎操作！</p>
        </div>
        <div slot="footer" style="text-align:center">
            <Button :loading="modal_loading" @click="ok">确认</Button>
            <Button type="primary" @click="cancel">取消</Button>
        </div>
    </Modal>
</template>
<script>
export default {
  data() {
    return {
      confirmModel: false,
      modal_loading: false,
      url: "",
      param: ""
    };
  },
  props: ["mode", "content", "sucessMsg"],
  methods: {
    confirm(url, param) {
      this.url = url;
      this.param = param;
      this.confirmModel = true;
    },
    cancel() {
      this.confirmModel = false;
    },
    ok() {
      // console.log(this.url)
      let _this = this;
      switch (this.mode) {
        //delete请求
        case "delete":
          _this.common.listDelete(_this, {
            url: _this.url,
            params: _this.param,
            callback: res => {
              if (res.success) {
                // this.$store.dispatch("postApi");
                this.$Message.success(this.sucessMsg);
                this.$emit('sucessDone')
              } else {
                this.$Message.warning(res.message);
              }
            }
          });
          break;
        //get请求
        case "done":
          _this.common.listDone(_this, {
            url: _this.url,
            params: _this.param,
            callback: res => {
              if (res.success || res.status == 200) {
                // this.$store.dispatch("postApi");
                this.$Message.success(this.sucessMsg);
                this.$emit('sucessDone')
              } else {
                this.$Message.warning(res.message);
              }
            }
          });
          break;
        case "forbidden":
          _this.common.listDone(_this, {
            url: _this.url,
            params: _this.param,
            callback: res => {
              if (res.success) {
                // this.$store.dispatch("postApi");
                this.$Message.success(this.sucessMsg);
                this.$emit('sucessDone')
              } else {
                this.$Message.warning(res.message);
              }
            }
          });
          break;
      }
      this.confirmModel = false;
    }
  }
};
</script>
<style>
.ivu-confirm-modal .ivu-modal {
  top: 50%;
  margin-top: -79px;
}
.icon-content{
    color:#ED4014;
    font-size:45px;
    display: inline-block;
    margin-top:15px;
}
.ivu-modal-footer{
    border:none !important;
    padding-bottom:30px !important;
    text-align: center !important;
}
.ivu-modal-header{
 border:none !important;
}
</style>

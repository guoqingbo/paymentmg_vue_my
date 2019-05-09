<template>
    <div>
        <Modal width="550" v-model="preLookModal" title="预览">
            <div style="margin-top:10px;">
                <span>领取短链接：{{copyUrl}}</span>
                <Button v-clipboard:copy="copyUrl" v-clipboard:success="onCopy" v-clipboard:error="onError">复制</Button>
                <Button v-clipboard:copy="copyLongUrl" v-clipboard:success="onCopy2" v-clipboard:error="onError2">复制长链接</Button>
                <p>
                    <span>领取二维码:
                        <a :href="codeUrl" download>下载二维码</a>
                    </span>
                </p>
                <p style="background:yellow;padding:5px 0;margin-top:5px;">
                    扫一扫查看，推荐使用支付宝、微信、手机浏览器 {{codeTxt}}
                </p>
                <center id="target" style="margin-top:20px;">
                    <qrcode :value="qrcodeUrl" :options="{ size: 170}">
                    </qrcode>
                </center>

            </div>
            <div slot="footer"></div>
        </Modal>

    </div>
</template>

<script>
import QRcode from "@xkeshi/vue-qrcode";
import { apiGet } from "@/fetch/api";
export default {
  props: ["codeTxt"],
  components: {
    qrcode: QRcode
  },
  data() {
    return {
      preLookModal: false,
      codeUrl: "", //二维码图片
      qrcodeUrl: "", //生成二维码地址
      copyUrl: "", //短链接
      copyLongUrl: "" //长链接
    };
  },
  methods: {
    async open(url, param) {
      let _this = this;
      await apiGet(url, param).then(res => {
        if (res.success || res.status == 200) {
          this.preLookModal = true;
          this.qrcodeUrl = res.data.qrCodeLongUrl;
          this.copyUrl = res.data.qrCodeUrl;
          this.copyLongUrl = res.data.qrCodeLongUrl;
          //把生成的二维码转换成图片
          this.$nextTick(function() {
            let canvasData = $("#target").children("canvas");
            _this.codeUrl = canvasData[0].toDataURL();
          });
        } else {
          this.$Message.warning(res.message);
        }
      });
    },
    onCopy() {
      this.$Message.success("复制成功！");
    },
    onError() {
      this.$Message.error("复制失败！");
    },
    onCopy2() {
      this.$Message.success("复制成功！");
    },
    onError2() {
      this.$Message.error("复制失败！");
    }
  }
};
</script>


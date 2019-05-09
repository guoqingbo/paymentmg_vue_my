<template>
    <div class="login-main">
        <h3 class="login-title">后台管理系统</h3>
        <Form ref="formInline" :model="formInline" :rules="ruleInline" class="login-from">
            <FormItem prop="username">
                <Input type="text" v-model="formInline.username" placeholder="用户名">
                <!-- <Icon type="ios-person-outline" ></Icon> -->
                <Icon type="ios-person-outline" slot="prepend" />
                </Input>
            </FormItem>
            <FormItem prop="password">
                <Input type="password" @on-enter="handleSubmit('formInline')" v-model="formInline.password" placeholder="密码">
                <Icon type="ios-locked-outline" slot="prepend"></Icon>
                <!-- <Icon type="ios-lock-outline" slot="prepend"/> -->
                </Input>
            </FormItem>
            <FormItem prop="checkcode">
                <Row>
                    <Col span="9">
                    <Input type="text" @on-enter="handleSubmit('formInline')" v-model="formInline.checkcode" placeholder="验证码"></Input>
                    </Col>
                    <Col span="9">
                    <img :src=codeImg @click="getCode" class="code-img">
                    </Col>
                    <Col span="6">
                    <a @click="getCode" href='javascript:;'>换一换</a>
                    </Col>
                </Row>
            </FormItem>
            <FormItem>
                <Button type="primary" long @click="handleSubmit('formInline')">登录</Button>
            </FormItem>
        </Form>
    </div>
</template>
<script>
import { getters, actions } from "vuex";
import store from "@/store";
import Main from "./main";
import { apiPost ,apiGet} from "@/fetch/api";
export default {
  data() {
    return {
      formInline: {
        username: "",
        password: "",
        checkcode: "",
      },
      codeImg: "",
      ruleInline: {
        username: [
          { required: true, message: "请填写用户名", trigger: "blur" }
        ],
        password: [
          { required: true, message: "请填写密码", trigger: "blur" },
          {
            type: "string",
            min: 6,
            message: "密码长度不能小于6位",
            trigger: "blur"
          }
        ],
        checkcode: [
          { required: true, message: "请填写验证码", trigger: "blur" }
        ],
      }
    };
  },
  store,
  beforeCreate() {
    document.getElementsByTagName("body")[0].className = "login-bg";
  },
  beforeDestroy() {
    document.body.removeAttribute("class", "add_bg");
  },
  mounted() {
    this.getCode();
  },
  created() {
    //   this.$cookies.set("pmsToken", "testToken123456");
  },
  methods: {
    // ...actions([
    //   'setUserIdAction'
    // ]),
    getCode() {
      this.codeImg = "/manage/admin/checkCode?rand=" + new Date().getTime();
    //   this.codeImg = "/checkCode";
    },
    handleSubmit(name) {
      this.$refs[name].validate(async valid => {
        if (valid) {
          // this.$Message.success('提交成功!')
          let url = "",
            params = {};
          if (this.$route.path == "/login") {
            url = "/manage/admin/logining";
            params = this.formInline;
          } else if (this.$route.path == "/adminLogin") {
            url = "/manage/admin/admin/logining";
            params = {
              username: this.formInline.username,
              password: this.formInline.password,
              checkcode: this.formInline.checkcode
            };
          }
          let res = await this.$store.dispatch("login", {
            url: url,
            params: params
          });
          if (res.success) {
            //sesstionstorage缓存登录用户token，vuex中缓存userId，用户后续路由beforeEach中判断也是是刷新还是只是路由变化
            this.$cookies.set("pmsToken", "testToken123456");
            this.$cookies.set("userId", "userId24567");
            this.$cookies.set("sessionId", res.user.sessionId);
            this.$cookies.set("hotelMerchantId", res.user.id);
            //  this.setUserIdAction("userId24567")
            this.$store.dispatch("setUserIdAction", "userId24567");
            await this.$store.dispatch("getApi"); //获取权限
            this.$store.dispatch("formaterRouterHandle"); // 根据权限获取路由
            // console.log(this.$store.state.menu.asyncRouter);
            this.$router.addRoutes([
              {
                path: "/main",
                name: "main",
                component: Main,
                children: [...this.$store.state.menu.asyncRouter]
              }
            ]); // 动态加载路由
            // this.formaterRouterHandle()
            this.$router.push(this.$store.state.menu.asyncRouter[0].path);
          } else {
            this.$Message.error(res.message);
          }
        }
      });
    }
  }
};
</script>
<style>
@import "../assets/styles/login.css";
</style>

<template>
    <div class="market-box">
        <searchForm :search-items='searchItems'></searchForm>

        <Row :gutter="16" class="btn-groups">
            <Col span="2">
            <Button type="primary" @click="showModal">新增服务</Button>
            </Col>
        </Row>
        <gridTable ref="gridTable" :columns="columns" :params="params" :data="data" :url="url"></gridTable>
        <confirm ref="confirmModel" :sucessMsg="sucessMsg" :content="content" :mode="mode"></confirm>
    </div>
</template>


<script>
import { apiPost, apiGet } from "@/fetch/api";
import searchForm from "@/components/global/searchForm";
import gridTable from "@/components/global/gridTable";
import confirm from "@/components/global/confirm";
export default {
  data() {
    return {
      searchItems: [
        {
          label: "名称",
          type: "input",
          name: "name"
        },
        {
          label: "服务类型",
          type: "select",
          name: "plugCode",
          data: [
            {
              value: "coupon",
              label: "优惠券"
            },
            {
              value: "wdf",
              label: "微多粉"
            },
            {
              value: "lpt",
              label: "来拼团"
            },
            {
              value: "mjs",
              label: "买即送"
            },
            {
              value: "rlsb",
              label: "人脸识别"
            },
            {
              value: "dzfp",
              label: "电子发票"
            },
            {
              value: "jzyx",
              label: "精准营销"
            }
          ]
        },
        {
          label: "状态",
          type: "select",
          name: "enabled",
          data: [
            {
              value: "T",
              label: "已上架"
            },
            {
              value: "F",
              label: "已下架"
            }
          ]
        }
      ],
      columns: [
        {
          title: "序号",
          align: "center",
          width: 60,
          render: (h, params) => {
            return h("span", params.index + 1);
          }
        },
        {
          title: "名称",
          key: "name",
          sortable: true
        },
        {
          title: "服务类型",
          key: "plugCode",
          sortable: true,
          render: (h, params) => {
            return h("span", this.filter.plugCode(params.row.plugCode));
          }
        },
        {
          title: "图片",
          key: "picture",
          sortable: true,
          render: (h, params) => {
            return h(
              "div",
              {
                attrs: {
                  style: "width:80px;hieght:60px;padding:5px;"
                }
              },
              [
                h("img", {
                  attrs: {
                    src: params.row.picture
                      ? params.row.picture
                      : "http://testwww.lotsmall.cn/static/h-ui/images/default_pic.png",
                    style: "width:80px;height:60px"
                  }
                })
              ]
            );
          }
        },
        {
          title: "服务简介",
          key: "introduce",
          sortable: true
        },
        {
          title: "状态",
          key: "enabled",
          sortable: true,
          render: (h, params) => {
            return h("span", params.row.enabled == "T" ? "已上架" : "已下架");
          }
        },
        {
          title: "操作",
          key: "action",
          width: 200,
          align: "center",
          render: (h, params) => {
            const actions = [
              {
                title: params.row.enabled == "T" ? "下架" : "上架",
                action: () => {
                  apiGet("/manage/admin/admin/service/enable", {
                    id: params.row.id,
                    enable: params.row.enabled == "T" ? "F" : "T"
                  }).then(res => {
                    if (res.status == 200) {
                      this.$Message.success(res.message);
                      this.$refs.gridTable.loadpage();
                    }
                  });
                }
              },
              {
                title: "修改",
                action: () => {
                  this.$router.push({
                    path: "/publishServise",
                    query: { id: params.row.id }
                  });
                }
              },
                {
                  title: "删除",
                  action: () => {
                    this.content = "确定删除？";
                    this.mode = "done";
                    this.sucessMsg = "删除成功！";
                    this.$refs.confirmModel.confirm(
                      "/manage/admin/admin/service/deleteServiceById?serviceId=" + params.row.id
                    );
                  }
                }
            ];
            return this.common.columnsHandle(h, actions);
          }
        }
      ],
      data: "",
      params: { page: 1, limit: 10, sort: "createTime", order: "desc" },
      url: "/manage/admin/admin/service/serviceGrid",
      modal: false,
      formItem: {
        paramCode: "",
        paramName: "",
        paramOption: "",
        sortNo: "",
        switch: true,
        remark: ""
      },
      modalTitle: "新增参数",
      type: "add",
      loading: true,
      ruleForm: {
        paramCode: [
          { required: true, message: "请输入参数编号", trigger: "blur" }
        ],
        paramName: [
          { required: true, message: "请输入参数名称", trigger: "blur" }
        ]
      },
      content: "",
      mode: "",
      sucessMsg: ""
    };
  },
  components: {
    searchForm,
    gridTable,
    confirm
  },
  mounted() {},
  methods: {
    showModal() {
      this.$router.push("/publishServise");
    }
  }
};
</script>
<style lang="scss">
.market-box {
}
</style>





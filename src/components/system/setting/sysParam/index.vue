<template>
    <div class="sys-param">
        <searchForm :search-items='searchItems'></searchForm>

        <Row :gutter="16" class="btn-groups">
            <!-- <Col span="2">
        <Button type="primary" icon="android-add" @click="test">手动添加权限测试</Button>
      </Col> -->
            <Col span="2">
            <Button type="primary" icon="android-add" @click="showModal">新增</Button>
            </Col>
            <Col span="2">
            <Button type="error" icon="android-delete" sucessMsg="删除成功！" content="确认删除吗？" @click="delAll">删除</Button>
            </Col>
        </Row>

        <gridTable ref="gridTable" :columns="columns" :params="params" :data="data" :url="url"></gridTable>
        <confirm ref="confirmModel" :sucessMsg="sucessMsg" :content="content" :mode="mode"></confirm>
        <!-- 弹出层 -->
        <Modal v-model="modal" width=700 :title="modalTitle" :loading="loading" @on-ok="ok" @on-cancel="cancel" :type="type">
            <Form :model="formItem" label-position="right" :label-width="150" ref="formItem" :rules="ruleForm">
                <FormItem label="参数编号：" prop="paramCode">
                    <Input v-model="formItem.paramCode" style="width:80%;"></Input>
                </FormItem>
                <FormItem label="参数名称：" prop="paramName">
                    <Input v-model="formItem.paramName" style="width:80%;"></Input>
                </FormItem>
                <FormItem label="选项：">
                    <Input v-model="formItem.paramOption" style="width:80%;" type="textarea" placeholder="0：已支付1：待支付（注意中英文）" :autosize="{minRows: 2,maxRows: 5}"></Input>
                </FormItem>
                <FormItem label="备注：">
                    <Input v-model="formItem.remark" style="width:80%;"></Input>
                </FormItem>
                <FormItem label="排序">
                    <Input v-model="formItem.sortNo" style="width:80%;"></Input>
                </FormItem>
            </Form>
        </Modal>
    </div>
</template>


<script>
import searchForm from "@/components/global/searchForm";
import gridTable from "@/components/global/gridTable";
import confirm from "@/components/global/confirm";
export default {
  data() {
    return {
      searchItems: [
        {
          label: "参数编号",
          type: "input",
          name: "paramCode"
        },
        {
          label: "参数名称",
          type: "input",
          name: "paramName"
        },
        {
          label: "选项",
          type: "input",
          name: "paramOption"
        },
        {
          label: "备注",
          type: "input",
          name: "remark"
        }
      ],
      columns: [
        {
          type: "selection",
          width: 60,
          align: "center"
        },
        {
          title: "参数编号",
          key: "paramCode",
        },
        {
          title: "参数名称",
          key: "paramName",
        },
        {
          title: "选项",
          key: "paramOption",
        },
        {
          title: "备注",
          key: "remark",
        },
        {
          title: "排序",
          key: "sortNo",
        },
        {
          title: "操作",
          key: "action",
          width: 150,
          align: "center",
          render: (h, params) => {
            const actions = [
              {
                title: "修改",
                action: () => {
                  this.modal = true;
                  this.modalTitle = "编辑参数";
                  this.formItem.paramCode = params.row.paramCode;
                  this.formItem.paramName = params.row.paramName;
                  this.formItem.paramOption = params.row.paramOption;
                  this.formItem.sortNo = params.row.sortNo;
                  this.formItem.remark = params.row.remark;
                  this.formItem.id = params.row.id;
                  this.type = "edit";
                }
              },
              {
                title: "删除",
                action: () => {
                    this.content="确定删除？"
                    this.mode="done"
                    this.sucessMsg="删除成功！"
                  this.$refs.confirmModel.confirm(
                    "/manage/admin/admin/param/deleteParam?id=" + params.row.id
                  );
                }
              }
            ];
            return this.common.columnsHandle(h, actions);
          }
        }
      ],
      data: "",
      params: { page: 1, limit: 10, sort: "modifyTime", order: "desc" },
      url: "/manage/admin/admin/param/paramGrid",
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
    ok() {
      let _this = this;
      let url =
        _this.type === "add"
          ? "/manage/admin/admin/param/saveParam"
          : "/manage/admin/admin/param/updateParam";
      this.common.formPost(this, {
        url,
        params: this.formItem,
        mold: "modal",
        callback(res) {
          if (res.status == 200) {
            _this.modal = false;
            _this.$Message.success(res.message);
            _this.$refs.gridTable.loadpage()
          }
        }
      });
    },
    cancel() {
        this.$refs.formItem.resetFields()
      this.formItem.paramCode = "";
      this.formItem.paramName = "";
      this.formItem.paramOption = "";
      this.formItem.sortNo = "";
      this.formItem.remark = "";
      this.modal = false;
    },
    showModal() {
      this.modal = true;
      this.type = "add";
      this.formItem.paramCode = "";
      this.formItem.paramName = "";
      this.formItem.paramOption = "";
      this.formItem.sortNo = "";
      this.formItem.remark = "";
      this.modalTitle = "新增参数";
    },
    delAll() {
      let selection = this.$refs.gridTable.selection;
      if (selection.length) {
        let ids = "";
        selection.forEach(element => {
          ids += element.id + ",";
        });
        this.content="确定删除？"
        this.mode="done"
        this.sucessMsg="删除成功！"
        this.$refs.confirmModel.confirm("/admin/param/deleteParam?id=" + ids);
      } else {
        this.$Message.warning("请选择一条数据！");
      }
    }
  }
};
</script>

<style lang="scss">
.sys-param{
    
}
</style>





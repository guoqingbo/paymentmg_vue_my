<template>
    <div class="sys-param">
        <searchForm :search-items='searchItems'></searchForm>

        <Row :gutter="16" class="btn-groups">
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
            <FormItem label="接口编码：" prop="funcCode">
              <Input v-model="formItem.funcCode" style="width:80%;"></Input>
            </FormItem>
            <FormItem label="接口名称：" prop="funcName">
              <Input v-model="formItem.funcName" style="width:80%;"></Input>
            </FormItem>
            <FormItem label="接口类型：" prop="funcType">
              <Select v-model="formItem.funcType" style="width:50%;">
                <Option :value="item.value" v-for="(item,index) in funcType " :label="item.label" :key="index"></Option>
              </Select>
            </FormItem>
            <FormItem label="接口类别：" prop="funcCategory">
              <Select v-model="formItem.funcCategory" style="width:50%;">
                <Option :value="item.value" v-for="(item,index) in funcCategory " :label="item.label" :key="index"></Option>
              </Select>
            </FormItem>
            <FormItem label="接口描述：" prop="funcDesc">
              <Input v-model="formItem.funcDesc" style="width:80%;"></Input>
            </FormItem>
          </Form>
        </Modal>
    </div>
</template>
<script>
import searchForm from "@/components/global/searchForm";
import gridTable from "@/components/global/gridTable";
import confirm from "@/components/global/confirm";
import { apiPost, apiGet } from "@/fetch/api";
export default {
  data() {
    return {
      searchItems: [
        {
          label: "接口编码",
          type: "input",
          name: "funcCode"
        },
        {
          label: "接口名称",
          type: "input",
          name: "funcName"
        }
      ],
      funcType: [],
      funcCategory: [],
      columns: [
        {
          type: "selection",
          width: 60,
          align: "center"
        },
        {
          title: "接口编码",
          key: "funcCode",
          sortable: true
        },
        {
          title: "接口名称",
          key: "funcName",
          sortable: true
        },
        {
          title: "接口类型",
          key: "funcType",
          sortable: true
        },
        {
          title: "接口类别",
          key: "funcCategory",
          sortable: true
        },
        {
          title: "接口描述",
          key: "funcDesc",
          align: "center",
        },
        {
          title: "操作",
          key: "action",
          width: 80,
          align: "center",
          render: (h, params) => {
            const actions = [
              {
                title: "编辑",
                action: () => {
                  this.modal = true;
                  this.modalTitle = "编辑";
                  this.formItem.id = params.row.id;
                  this.formItem.funcCode = params.row.funcCode;
                  this.formItem.funcName = params.row.funcName;
                  this.formItem.funcType = params.row.funcType;
                  this.formItem.funcCategory = params.row.funcCategory;
                  this.formItem.funcDesc = params.row.funcDesc;
                  this.type = "edit";
                }
              }
            ];
            return this.common.columnsHandle(h, actions);
          }
        }
      ],
      data: "",
      params: { page: 1, limit: 10, sort: "modifyTime", order: "desc" },
      url: "/manage/admin/admin/service/func/funcGrid",
      modal: false,
      formItem: {
        funcCode: "",
        funcName: "",
        funcType: "",
        funcCategory: "",
        funcDesc: "",
      },
      modalTitle: "新增参数",
      type: "add",
      loading: true,
      ruleForm: {
        funcCode: [
          { required: true, message: "请输入接口编码", trigger: "blur" }
        ],
        funcName: [
          { required: true, message: "请输入接口名称", trigger: "blur" }
        ],
        funcType: [
          { required: true, message: "请选择接口类型", trigger: "change" }
        ],
        funcCategory: [
          { required: true, message: "请选择接口类别", trigger: "change" }
        ],
        funcDesc: [
          { required: true, message: "请输入接口描述", trigger: "blur" }
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
  mounted() {
    apiPost("/manage/admin/admin/param/getParamValues",{
      code: 'funcType'
    }).then(res => {
      if (res.status == 200) {
        res.data.map(item=>{
          this.funcType.push({
            value: item.key,
            label: item.value
          })
        })
        this.searchItems.push({
          label: "接口类型",
          type: "select",
          name: "funcType",
          data: this.funcType
        })
      }else{
        this.$Message.success(res.message);
      }
    });
    apiPost("/manage/admin/admin/param/getParamValues",{
      code: 'funcCategory'
    }).then(res => {
      if (res.status == 200) {
        res.data.map(item=>{
          this.funcCategory.push({
            value: item.key,
            label: item.value
          })
        })
        this.searchItems.push({
          label: "接口类别",
          type: "select",
          name: "funcCategory",
          data: this.funcCategory
        })
      }else{
        this.$Message.success(res.message);
      }
    });
  },
  methods: {
    ok() {
      let _this = this;
      let url =
        _this.type === "add"
          ? "/manage/admin/admin/service/func/saveFunc"
          : "/manage/admin/admin/service/func/updateFunc";
      this.common.formPost(this, {
        url,
        params: this.formItem,
        mold: "modal",
        callback(res) {
          if (res.status == 200) {
            _this.modal = false;
            _this.$Message.success(res.message);
            _this.$refs['formItem'].resetFields();
            _this.$refs.gridTable.loadpage()
          }else{
            this.$Message.warning(res.message);
          }
        }
      });
    },
    cancel() {
      this.$refs['formItem'].resetFields();
    },
    showModal() {
      this.type = 'add';
      delete this.formItem.id;
      this.modal = true;
    },
    delAll() {
      let selection = this.$refs.gridTable.selection;
      if (selection.length) {
        let ids = [];
        selection.forEach(ele => {
          ids.push(ele.id)
        });
        this.content="确定删除？"
        this.mode="done"
        this.sucessMsg="删除成功！"
        this.$refs.confirmModel.confirm("/manage/admin/admin/service/func/deleteFuncById?funcId=" + ids.join(','));
      } else {
        this.$Message.warning("请选择一条数据！");
      }
    }
  }
};
</script>




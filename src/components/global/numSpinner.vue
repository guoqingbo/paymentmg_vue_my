<template>
    <div class="numSpinner">
        <div class="pinner left" :class="{disabled:num<=min}" @click="changeNum('minus')">
            <Icon type="ios-remove" />
        </div>
        <Input v-model="num" @on-blur="keyNum" @on-input="convertNum" :maxlength="2" style="width:60px;">
        <span style="display:inline-block;font-size:13px;margin-top:7px;" slot="suffix">晚</span>
        </Input>
        <div class="pinner right" :class="{disabled:num>=max}" @click="changeNum('add')">
            <Icon type="ios-add" />
        </div>
    </div>
</template>

<script>
export default {
  data() {
    return {
      num: 0
    };
  },
  props: {
    value: {
      type: Number
    },
    max: {
      type: Number
    },
    min: {
      type: Number
    }
  },
  watch: {
    value: {
      handler(value) {
        this.num = this.value;
      },
      immediate: true
    }
  },
  methods: {
    changeNum(mold) {
      switch (mold) {
        case "minus":
          if (typeof this.min !== "undefined" && this.num <= this.min) {
          } else {
            this.num--;
          }
          break;
        case "add":
          if (typeof this.max !== "undefined" && this.num >= this.max) {
          } else {
            this.num++;
          }
          break;
      }
      this.$emit("input", this.num);
      this.$emit("on-change", this.num);
    },
    keyNum() {
      if (typeof this.max !== "undefined" && this.num > this.max) {
        this.num = this.max;
      }
      if (typeof this.min !== "undefined" && this.num < this.min) {
        this.num = this.min;
      }
      this.$emit("input", parseFloat(this.num));
      this.$emit("on-change", parseFloat(this.num));
    },
    convertNum(event) {
      if (
        event.data !== "-" &&
        isNaN(event.data) &&
        (event.data !== "." && isNaN(event.data))
      ) {
        this.num = this.value;
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.numSpinner {
  user-select: none;
  line-height: 30px;
  text-align: center;
  overflow: hidden;
  color: #413838;
  font-size: 0;
  .pinner {
    width: 30px;
    cursor: pointer;
    display: inline-block;
    border: 1px solid #dcdee2;
    vertical-align: middle;
    font-size: 14px;
    background-color: #f3f7fa;
    &:hover {
      background-color: #e8ecef;
    }
  }
  .disabled {
    cursor: no-drop;
    background-color: #f3f7fa !important;
  }
  .left {
    border-right: none;
  }
  .right {
    border-left: none;
  }
}
</style>



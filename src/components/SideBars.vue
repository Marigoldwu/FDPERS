<template>
  <div class="sideBars">
    <el-menu
      default-active="activeIndex"
      class="el-menu-vertical-demo"
      :router="true"
      background-color="#238aad"
      text-color="#fff"
      active-text-color="#ffd04b"
      id="sideBars"
    >
      <el-menu-item index="pengzhang">
        <i class="el-icon-aim" style="color: white"></i>
        <span slot="title">膨胀比测定</span>
      </el-menu-item>
      <el-menu-item index="paishui">
        <i class="el-icon-stopwatch" style="color: white"></i>
        <span slot="title">排水性测定</span>
      </el-menu-item>
      <el-menu-item index="code" v-show="this.auth == 'admin'">
        <i class="el-icon-present" style="color: white"></i>
        <span slot="title">用户邀请码</span>
      </el-menu-item>
    </el-menu>
  </div>
</template>

<script>
export default {
  name: "SideBars",
  data() {
    return {
      activeIndex: "pengzhang",
      auth: null,
    };
  },
  methods: {
    handleSelect(index) {
      this.activeIndex = index;
    },
  },
  watch: {
    $route() {
      this.activeIndex = this.$route.matched[1].path
        .replace("/index/", "")
        .split("/")[1];
      this.handleSelect(this.activeIndex);
    },
  },
  created() {
    this.activeIndex = this.$route.matched[1].path
      .replace("/index/", "")
      .split("/")[1];
  },
  mounted() {
    this.auth = window.localStorage.getItem("auth");
  },
};
</script>

<style scoped>
.el-menu-vertical-demo {
  width: 200px;
}
</style>
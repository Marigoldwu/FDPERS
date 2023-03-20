<template>
  <el-container style="min-width: 1300px">
    <el-header>
      <NavBars></NavBars>
    </el-header>
    <el-container style="height: calc(100vh - 60px)">
      <el-aside width="200px">
        <SideBars />
      </el-aside>
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
import NavBars from "../components/NavBars.vue";
import SideBars from "../components/SideBars.vue";

export default {
  name: "Index",
  components: {
    NavBars,
    SideBars,
  },
  data() {
    return {};
  },
  created() {},
  mounted() {
    this.username = window.localStorage.getItem("username");
    if ("serial" in navigator) {
      this.$notify.success({
        title: "Web Serial API检测",
        message: "当前浏览器支持Web Serial API!",
      });
    } else {
      this.$notify.error({
        title: "Web Serial API检测",
        message:
          "当前浏览器不支持Web Serial API!请使用Chrome浏览器或基于Chrome内核的浏览器!",
      });
    }
  },
};
</script>

<style scoped>
* {
  margin: 0;
  padding: 0;
}

/*element容器*/
.el-header {
  background-color: #238aad;
  color: white;
  text-align: left;
  line-height: 60px;
  padding-left: 0;
  font-size: 0;
}

.el-aside {
  background-color: #238aad;
  color: #333;
  text-align: center;
  height: calc(100vh - 60px);
  overflow: scroll !important;
}

.el-aside::-webkit-scrollbar {
  display: none;
}

.el-main {
  background-color: #fafafa;
  color: #333;
  height: 100%;
}
</style>
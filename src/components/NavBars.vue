<template>
  <div class="header">
    <div class="header-title">泡沫排水性能及膨胀比测定系统</div>
    <div class="header-user">
      <el-dropdown @command="logout"
        ><span style="color: #fff; font-size: 16px"
          >你好, {{ username }}<i class="el-icon-arrow-down el-icon--right"></i
        ></span>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item command="logout">退出登录</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
  </div>
</template>

<script>
export default {
  name: "NavBars",
  data() {
    return {
      username: null,
    };
  },
  methods: {
    logout(command) {
      if (command == "logout") {
        window.localStorage.removeItem("username");
        window.localStorage.removeItem("auth");
        this.$message.success("退出成功！");
        this.$router.push({ name: "Login" });
      }
    },
  },
  mounted() {
    this.username = window.localStorage.getItem("username");
  },
};
</script>

<style scoped>
.header {
  position: relative;
  height: 50px;
  line-height: 50px;
  background-color: #238aad;
  color: #fff;
  vertical-align: middle;
}

.header-title {
  position: absolute;
  font-size: 26px;
  font-family: "Courier New", Courier, monospace;
  left: 20px;
}

.header-user {
  position: absolute;
  right: 20px;
}
</style>
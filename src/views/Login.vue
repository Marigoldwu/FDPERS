<template>
  <div class="loginPage">
    <div class="login-left"></div>
    <div class="login-right">
      <div class="loginCard">
        <div class="title">泡沫排水性能及膨胀比测定系统</div>
        <div class="form">
          <div class="form-body">
            <el-form ref="user" :model="user" :rules="rules" label-width="80px">
              <el-form-item label="用户名" prop="account">
                <el-input v-model="user.account"></el-input>
              </el-form-item>
              <el-form-item label="密码" prop="password">
                <el-input
                  v-model="user.password"
                  type="password"
                  @keyup.enter.native="loginAccount('user')"
                ></el-input>
              </el-form-item>
              <el-form-item label="权限">
                <el-select
                  v-model="user.auth"
                  placeholder="管理员"
                  style="width: 100%"
                >
                  <el-option label="管理员" value="admin"></el-option>
                  <el-option label="普通用户" value="user"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="服务器">
                <el-input v-model="user.server" :disabled="true"></el-input>
              </el-form-item>
              <el-form-item id="btn">
                <el-button type="success" @click="signAccount()"
                  >注册</el-button
                >
                <el-button type="primary" @click="loginAccount('user')"
                  >登录</el-button
                >
              </el-form-item>
            </el-form>
          </div>
        </div>
      </div>
    </div>
    <el-dialog title="注册" :visible.sync="disable" width="30%" center>
      <el-form ref="sign" :model="sign" :rules="signRules" label-width="80px">
        <el-form-item label="用户名" prop="account">
          <el-input v-model="sign.account"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="sign.password" type="password"></el-input>
        </el-form-item>
        <el-form-item label="邀请码" required>
          <el-input v-model="sign.code" prop="code"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="disable = false">取 消</el-button>
        <el-button type="primary" @click="disable = false">注册</el-button>
      </span>
    </el-dialog>
  </div>
</template>
  
<script>
export default {
  name: "Login",
  data() {
    return {
      user: {
        account: "",
        password: "",
        auth: "admin",
        server: "172.0.0.1",
      },
      rules: {
        account: [{ required: true, message: "请输入用户名", trigger: "blur" }],
        password: [{ required: true, message: "请输入密码", trigger: "blur" }],
      },
      sign: {
        account: "",
        password: "",
        code: "",
      },
      signRules: {
        account: [{ required: true, message: "请输入用户名", trigger: "blur" }],
        password: [{ required: true, message: "请输入密码", trigger: "blur" }],
      },
      disable: false,
    };
  },
  methods: {
    loginAccount(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (this.user.account == "admin" || this.user.account == "user") {
            if (this.user.password == "123456") {
              this.$message({
                message: "登录成功！",
                type: "success",
              });
              window.localStorage.setItem("username", this.user.account);
              window.localStorage.setItem("auth", this.user.auth);
              this.$router.push({
                name: "PengZhang",
              });
            } else {
              this.$message({
                message: "密码错误!",
                type: "error",
              });
              this.user.password = "";
            }
          } else {
            this.$message({
              message: "用户名不存在!",
              type: "error",
            });
            this.user.account = "";
            this.user.password = "";
          }
        } else {
          this.$message.error("登录失败！");
          this.user.account = "";
          this.user.password = "";
          return false;
        }
      });
    },
    signAccount() {
      this.disable = true;
    },
  },
  created() {},
};
</script>

<style scoped>
.loginPage {
  width: 100vw;
  height: 100vh;
  text-align: center;
  font-size: 0;
}
.login-left {
  display: inline-block;
  width: 50vw;
  height: 100vh;
  font: Arial;
  font-size: 20px;
  color: white;
  vertical-align: middle;
  background: url(background.jpg) no-repeat;
  background-color: #238aad;
  background-size: auto 100%;
  background-attachment: fixed;
}

.login-right {
  display: inline-block;
  width: 50vw;
  height: 100vh;
  text-align: center;
  vertical-align: middle;
}

.title {
  font-family: "Courier New", Courier, monospace;
  font-size: 40px;
  color: #fff;
  text-align: center;
  line-height: 20vh;
  height: 20vh;
  background-color: #238aad;
}
.form {
  display: inline-block;
  width: 50vw;
  height: 75vh;
  padding-top: 5vh;
  background-color: #238aad;
}
#btn >>> .el-form-item__content {
  margin-left: 0 !important;
}
.form-body {
  display: inline-block;
  padding: 50px 50px;
  width: 50%;
  background-color: #fefefe;
  border-radius: 10px;
  box-shadow: 0 2px 12px 0 rgb(0 0 0 / 10%);
}
</style>
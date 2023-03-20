<template>
  <div>
    <div class="body-card" v-loading.fullscreen.lock="fullscreenLoading">
      <el-card class="my-card" shadow="hover">
        <div slot="header" class="clearfix">
          <span style="font-size: 20px">泡沫膨胀比测定</span>
          <el-button
            style="float: right; padding: 3px 0"
            type="text"
            @click="settingClick"
            ><i class="el-icon el-icon-setting" style="font-size: 20px"></i
          ></el-button>
        </div>
        <div>
          <el-form :model="settings" label-width="180px">
            <el-form-item label="测量时间(单位: 毫秒ms)">
              <el-input
                v-model="settings.sampleInterval"
                type="number"
              ></el-input>
            </el-form-item>
            <el-form-item label="容器体积(单位: 毫升ml)">
              <el-input v-model="settings.volume" type="number"></el-input>
            </el-form-item>
            <el-form-item label="实时信息">
              <el-input
                type="textarea"
                v-model="settings.information"
              ></el-input>
            </el-form-item>
          </el-form>
          <div class="sample-btn1">
            <el-button type="warning" @click="connectPort" class="sbtn"
              >打开串口</el-button
            >
          </div>
          <div class="sample-btn1">
            <el-button type="primary" @click="startSample()" class="sbtn">{{
              btnText
            }}</el-button>
          </div>
        </div>
      </el-card>
    </div>
  </div>
</template>

<script>
import { getDateTime } from "../../utils/date.js";
export default {
  name: "PengZhang",
  data() {
    return {
      settings: {
        comId: "ES_001",
        comName: "COM3",
        comBitRate: 9600,
        dataBit: 8,
        stopBit: 1,
        valid: "无",
        description: "电子秤1串口",
        isDefault: 1,
        data: 0.0,
        sampleInterval: 0,
        volume: 0,
        density: 0,
        flowDirection: "flow_in",
        information: "",
        time: "",
      },
      btnText: "开始测量",
      fullscreenLoading: false,
      timeInterval: null,
      cmpg: 0,
      keepReading: false,
      connected: false,
      realTimeData: null,
      oldData: null,
    };
  },
  methods: {
    settingClick() {},
    async sampleStop() {
      this.btnText = "开始测量";
      this.connected = false;
      this.keepReading = false;
      clearInterval(this.timeInterval);
      await this.reader.cancel();
      await this.port.close();
    },
    async connectPort() {
      this.$message.warning("请在弹出窗口中选择相应的串口并点击连接!");
      this.keepReading = true;
      await this.openPort();
    },
    async startSample() {
      if (this.settings.sampleInterval <= 300) {
        this.$message.error("采样间隔不能小于300毫秒!");
        this.settings.information = "采样间隔不能小于300毫秒!";
        return;
      }
      if (this.settings.volume <= 0) {
        this.$message.error("容器体积不能为非正值!");
        this.settings.information = "容器体积不能为非正值!";
        return;
      }
      const loading = this.$loading({
        lock: true,
        text: "膨胀比测定中,请稍等",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.7)",
      });
      setTimeout(() => {
        this.settings.data = Number(this.realTimeData);
        console.log(this.settings.data);
        let time = getDateTime();
        this.settings.information = time + "数据已采样!";
        this.settings.time = time;
        this.cmpg = (this.settings.volume / this.settings.data).toFixed(1);
        window.localStorage.setItem("density", this.cmpg);
        loading.close();
        this.$alert(`泡沫膨胀比为: ` + this.cmpg + `.`, "测定结果", {
          confirmButtonText: "确定",
        });
        this.sampleStop();
      }, this.settings.sampleInterval);
    },
    async openPort() {
      try {
        this.port = await navigator.serial.requestPort();
        await this.port.open({ baudRate: this.settings.comBitRate });
        await this.connect();
      } catch (error) {
        console.error(error);
      }
    },
    async connect() {
      this.reader = this.port.readable.getReader();
      this.connected = true;
      this.$message.success("串口连接成功!");
      this.readData();
    },
    async readData() {
      while (this.connected && this.keepReading) {
        try {
          const { value, done } = await this.reader.read();
          if (done) {
            this.reader.releaseLock();
            break;
          }
          // console.log(value);
          const hexString = this.uint8Array(value);
          hexString.then((myString) => {
            // 将16进制字符串转换为十进制数字数组
            const decimalArray = myString
              .match(/.{1,2}/g)
              .map((hex) => parseInt(hex, 16));
            // 将十进制数字数组转换为ASCII码字符串
            const asciiString = String.fromCharCode(...decimalArray);
            const dataArray = asciiString.split(" ");
            if (dataArray.length - 2 > 0) {
              this.realTimeData = dataArray[dataArray.length - 2];
              this.oldData = this.realTimeData;
            } else {
              this.realTimeData = this.oldData;
            }
            console.log(this.realTimeData);
          });
        } catch (error) {
          console.error(error);
        }
      }
    },
    async uint8Array(uint8Array) {
      return Array.prototype.map
        .call(uint8Array, (x) => ("00" + x.toString(16)).slice(-2))
        .join("");
    },
    async buf2hex(buffer) {
      return Array.prototype.map
        .call(new Uint8Array(buffer), (x) => ("00" + x.toString(16)).slice(-2))
        .join("");
    },
  },
};
</script>

<style scoped>
.body-card {
  padding-left: 150px;
  padding-right: 150px;
  padding-top: 20px;
  width: calc(100vw -400px);
  text-align: center;
}

.sbtn {
  display: inline-block;
  width: 50%;
  margin-top: 10px;
}
</style>
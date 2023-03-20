<template>
  <div class="com-card">
    <audio src="/static/audio/25.mp3" preload="auto" hidden id="audio1"></audio>
    <audio src="/static/audio/50.mp3" preload="auto" hidden id="audio2"></audio>
    <el-card class="box-card" shadow="hover">
      <div slot="header" class="clearfix">
        <span style="font-size: 20px"
          >{{ comCopy.comId }}: {{ comCopy.comName }}</span
        >
        <el-button
          style="float: right; padding: 3px 0"
          type="text"
          @click="settingClick"
          ><i class="el-icon el-icon-setting" style="font-size: 20px"></i
        ></el-button>
      </div>
      <div>
        <el-form :model="comCopy" label-width="80px">
          <el-form-item label="实时数值">
            <span style="font-size: 30px; font-style: bold">{{
              comCopy.data
            }}</span>
          </el-form-item>
          <el-form-item label="采样间隔">
            <el-input v-model="comCopy.sampleInterval" type="number"></el-input>
          </el-form-item>
          <el-form-item label="容器体积">
            <el-input v-model="comCopy.volume" type="number"></el-input>
          </el-form-item>
          <el-form-item label="膨胀比">
            <el-input v-model="comCopy.density"></el-input>
          </el-form-item>
          <el-form-item label="流向选择">
            <el-radio v-model="comCopy.flowDirection" label="flow_in"
              >流入</el-radio
            >
            <el-radio v-model="comCopy.flowDirection" label="flow_out"
              >流出</el-radio
            >
          </el-form-item>
          <el-form-item label="实时信息">
            <el-input type="textarea" v-model="comCopy.information"></el-input>
          </el-form-item>
        </el-form>
        <div class="sample-btn">
          <el-button type="warning" @click="connectPort" class="sbtn"
            >打开串口</el-button
          >
        </div>
        <div class="sample-btn">
          <el-button
            type="primary"
            @click="startSample(btnBool)"
            class="sbtn"
            >{{ btnText }}</el-button
          >
        </div>
        <div class="sample-btn">
          <el-button type="success" @click="dataVisible = true" class="sbtn"
            >查询数据</el-button
          >
        </div>
      </div>
    </el-card>
    <el-dialog
      title="设置串口参数"
      :visible.sync="dialogDisable"
      width="30%"
      center
    >
      <el-form ref="com" :model="com" :rules="comRules" label-width="80px">
        <el-form-item label="串口编号" prop="comId">
          <el-input v-model="com.comId" disabled></el-input>
        </el-form-item>
        <el-form-item label="串口名称" prop="comName">
          <el-input v-model="com.comName"></el-input>
        </el-form-item>
        <el-form-item label="波特率" prop="comBitRate">
          <el-select
            v-model="com.comBitRate"
            placeholder="9600"
            style="width: 100%"
          >
            <el-option label="9600" value="9600"></el-option>
            <el-option label="4800" value="4800"></el-option>
            <el-option label="2400" value="2400"></el-option>
            <el-option label="1200" value="1200"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="数据位" prop="dataBit">
          <el-input v-model="com.dataBit"></el-input>
        </el-form-item>
        <el-form-item label="停止位" prop="stopBit">
          <el-input v-model="com.stopBit"></el-input>
        </el-form-item>
        <el-form-item label="奇偶校验" prop="stopBit">
          <el-select v-model="com.valid" placeholder="无" style="width: 100%">
            <el-option label="无" value="0"></el-option>
            <el-option label="奇校验" value="1"></el-option>
            <el-option label="偶校验" value="2"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="串口描述" prop="description">
          <el-input type="textarea" v-model="com.description"></el-input>
        </el-form-item>
        <el-form-item label="是否默认" prop="isDefault">
          <el-radio v-model="com.isDefault" label="0">否</el-radio>
          <el-radio v-model="com.isDefault" label="1">是</el-radio>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="danger" @click="cancelSetting()">取 消</el-button>
        <el-button type="primary" @click="ackSetting()">设置</el-button>
      </span>
    </el-dialog>
    <el-dialog
      :title="comCopy.comId + `:` + comCopy.comName + `实时数据`"
      :visible.sync="dataVisible"
      width="50%"
      center
    >
      <el-table :data="allData" height="550" border highlight-current-row>
        <el-table-column type="index" width="80" label="序号"></el-table-column>
        <el-table-column
          property="data"
          label="重量(g)"
          width="100"
          align="center"
        ></el-table-column>
        <el-table-column
          property="gps"
          label="重量流速(g/s)"
          width="150"
          align="center"
        ></el-table-column>
        <el-table-column
          property="label"
          label="时间"
          align="center"
          width="250"
        ></el-table-column>
        <el-table-column
          property="information"
          label="备注"
          align="center"
        ></el-table-column>
      </el-table>
      <span slot="footer" class="dialog-footer">
        <el-button type="danger" @click="deleteData()">清空数据</el-button>
        <el-button type="primary" @click="startSample(btnBool)">{{
          btnText
        }}</el-button>
        <el-button type="success" @click="exportFile()">导出数据</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { getDateTime, getDate } from "../utils/date";
import { exportToCSV } from "../utils/file";
export default {
  name: "ComCard",
  props: ["send", "charts", "density"],
  data() {
    return {
      com: {
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
      dialysate25: 0,
      dialysate50: 0,
      allData: [],
      btnText: "开始采样",
      btnBool: false,
      timeInterval: null,
      comCopy: {},
      count: 0,
      comRules: {
        comId: [
          { required: true, message: "串口编号不能为空", trigger: "blur" },
        ],
        comName: [
          { required: true, message: "串口名称不能为空", trigger: "blur" },
        ],
      },
      dialogDisable: false,
      dataVisible: false,
      port: null,
      reader: null,
      connected: false,
      keepReading: false,
      realTimeData: 0,
      oldData: 0,
    };
  },
  methods: {
    settingClick() {
      this.dialogDisable = true;
    },
    cancelSetting() {
      this.com = JSON.parse(JSON.stringify(this.comCopy));
      this.dialogDisable = false;
      this.$message.info("取消修改!");
    },
    ackSetting() {
      this.comCopy = JSON.parse(JSON.stringify(this.com));
      this.dialogDisable = false;
      this.$message.success("设置成功!");
    },
    async connectPort() {
      this.$message.warning("请在弹出窗口中选择相应的串口并点击连接!");
      this.keepReading = true;
      await this.openPort();
    },
    async sampleStop() {
      this.btnBool = false;
      this.btnText = "开始采样";
      this.connected = false;
      this.keepReading = false;
      clearInterval(this.timeInterval);
      await this.reader.cancel();
      await this.port.close();
    },
    async startSample(btnBool) {
      if (this.comCopy.sampleInterval <= 300) {
        this.$message.error("采样间隔不能小于300毫秒!");
        this.comCopy.information = "采样间隔不能小于300毫秒!";
        return;
      }
      if (this.comCopy.volume <= 0) {
        this.$message.error("容器体积不能为非正值!");
        this.comCopy.information = "容器体积不能为非正值!";
        return;
      }
      if (this.comCopy.density <= 0) {
        this.$message.error("密度不能为非正值!");
        this.comCopy.information = "密度不能为非正值!";
        return;
      }
      if (btnBool) {
        // 停止采样
        this.sampleStop();
      } else {
        this.dialysate25 = 0.25 * this.comCopy.density * this.comCopy.volume;
        this.dialysate50 = 0.5 * this.comCopy.density * this.comCopy.volume;
        console.log("25%析液", this.dialysate25);
        console.log("析液半衰期", this.dialysate50);
        // 开始采样
        this.$message.success("开始采样!");
        this.btnBool = true;
        this.btnText = "停止采样";
        let gps = 0;
        this.timeInterval = window.setInterval(() => {
          this.count += 1;
          this.oldData = this.comCopy.data;
          // 模拟数据，后续删除
          // this.realTimeData = Math.random(1) * 1000;
          this.comCopy.data = Number(this.realTimeData).toFixed(1);
          let time = getDateTime();
          this.comCopy.information = time + "数据已采样!";
          this.comCopy.time = time;
          let param = {
            data: this.comCopy.data,
            label: this.comCopy.time,
            gps: Number(gps),
            information: "-",
          };

          if (this.allData.length == 0) {
            gps = (
              (this.comCopy.data * 1000) /
              this.comCopy.sampleInterval
            ).toFixed(1);
          } else {
            let dValue =
              this.comCopy.data - this.allData[this.allData.length - 1].data;
            gps = ((dValue * 1000) / this.comCopy.sampleInterval).toFixed(1);
          }
          let t = this.count * this.comCopy.sampleInterval;
          if (
            this.comCopy.data >= this.dialysate25 &&
            this.oldData <= this.dialysate25
          ) {
            // 当电子秤实时质量刚达到百分之二十五析液质量
            let audio1 = document.getElementById("audio1");
            audio1.play();
            param.information = "25%析液质量，耗时" + t + " ms";
          }
          if (
            this.comCopy.data >= this.dialysate50 &&
            this.oldData <= this.dialysate50
          ) {
            // 当电子秤实施质量刚达到析液半衰期
            let audio2 = document.getElementById("audio2");
            audio2.play();

            param.information = "50%析液质量，耗时" + t + " ms";
            this.sampleStop();
          }
          this.allData.push(param);
          this.send(this.comCopy);
        }, this.comCopy.sampleInterval);
      }
    },
    async openPort() {
      try {
        this.port = await navigator.serial.requestPort();
        await this.port.open({ baudRate: this.comCopy.comBitRate });
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
    exportFile() {
      if (this.allData.length == 0) {
        this.$message.warning("当前没有测量数据!无法导出!");
      } else {
        const jsonData = JSON.parse(JSON.stringify(this.allData));
        const date = getDate();
        const filename = date + "串口" + this.comCopy.comName + "实验数据";
        exportToCSV(jsonData, filename);
      }
    },
    deleteData() {
      this.$confirm("此操作将永久删除实验数据, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          if (this.allData.length == 0) {
            this.$message.warning("暂无数据!");
          } else {
            this.allData = [];
            this.charts.data.labels = [];
            this.charts.data.datasets.data = [];
            this.charts.update();
            this.dataVisible = false;
            this.$message({
              type: "success",
              message: "删除成功!",
            });
          }
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
  },
  created() {
    this.comCopy = JSON.parse(JSON.stringify(this.com));
    this.comCopy.density = this.density;
  },
};
</script>

<style scoped>
.com-card {
  width: 25vw;
  text-align: center;
}

.el-statistic >>> .con {
  height: 40px !important;
}

.el-card >>> .el-card__header {
  background-color: aliceblue;
}
.el-form >>> .el-form-item {
  margin-bottom: 5px;
}

.sample-btn {
  width: 100%;
  margin-top: 10px;
}

.sbtn {
  width: 100%;
}
</style>
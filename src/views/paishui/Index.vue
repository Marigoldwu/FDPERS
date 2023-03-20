<template>
  <div>
    <div class="body">
      <div class="card">
        <ComCard :send="send" :charts="charts" :density="density"></ComCard>
      </div>
      <div class="myCanvas">
        <canvas id="myChart" width="800" height="400"></canvas>
      </div>
    </div>
  </div>
</template>

<script>
import ComCard from "../../components/ComCard.vue";
import Chart from "chart.js";
export default {
  name: "MainPage",
  components: {
    ComCard,
  },
  data() {
    return {
      username: "",
      charts: null,
      density: 0,
    };
  },
  methods: {
    send(param) {
      this.charts.data.labels.push(param.time.split("  ")[1]);
      this.charts.data.datasets[0].data.push(param.data);
      this.charts.update();
    },
  },
  mounted() {
    var ctx = document.getElementById("myChart");
    const labels = []; // 设置 X 轴上对应的标签
    const data = {
      labels: labels,
      datasets: [
        {
          label: "电子秤实时质量",
          data: [],
          fill: false,
          borderColor: "rgb(75, 192, 192)", // 设置线的颜色
          tension: 0.1,
        },
      ],
    };
    const config = {
      type: "line", // 设置图表类型
      data: data,
    };
    this.charts = new Chart(ctx, config);
  },
  created() {
    if (!window.localStorage.getItem("density")) {
      this.$alert("当前还未测量膨胀比，请前往测量或手动输入!", "提示", {
        confirmButtonText: "确定",
      });
    } else {
      this.density = window.localStorage.getItem("density");
    }
  },
};
</script>

<style scoped>
* {
  font-size: 16px;
}
.body {
  height: calc(100vh - 50px);
  padding-top: 20px;
  background-color: #fafafa;
  display: flex;
  justify-content: center;
  flex-direction: row;
  align-content: flex-start;
  flex-wrap: wrap;
}

.card {
  display: inline-block;
}

.myCanvas {
  display: inline-block;
  margin-left: 20px;
}

.myCanvas:hover {
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}
</style>
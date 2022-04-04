<template>
  <div class="com-container">
    <div class="com-chart" ref="trend-ref">
    </div>
  </div>
</template>

<script>
import 'echarts/theme/chalk'
export default {
  name: 'TrendCom',
  data () {
    return {
      chartInstance: null,
      jsonData: null
    }
  },
  mounted () {
    this.initChart()
    this.getChartData()
    window.addEventListener('resize', this.screenAdapter)
    this.screenAdapter()
  },
  destroyed () {
    window.removeEventListener('resize', this.screenAdapter)
  },
  methods: {
    initChart () {
      this.chartInstance = this.$echarts.init(this.$refs['trend-ref'], 'chalk')
      const initOption = {
        xAxis: { type: 'category' },
        yAxis: { type: 'value' }
      }
      this.chartInstance.setOption(initOption)
    },
    async getChartData () {
      await this.$axios.get('trend').then(res => {
        this.jsonData = res.data
        this.updateChart()
      })
    },
    updateChart () {
      const monthData = this.jsonData.common.month
      const valueData = this.jsonData.map.data
      const seriesData = valueData.map(item => {
        return {
          name: item.name,
          type: 'line',
          data: item.data,
          stack: 'map'
        }
      })
      // 获取图例
      const legendData = valueData.map(item => { return item.name })
      const dataOption = {
        xAxis: { data: monthData },
        series: seriesData,
        legend: { data: legendData }
      }
      this.chartInstance.setOption(dataOption)
    },
    screenAdapter () {
      const adapterOption = {}
      this.chartInstance.setOption(adapterOption)
      this.chartInstance.resize()
    }
  }
}
</script>

<style lang="less" scoped>

</style>

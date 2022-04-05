<!--商家销量统计的横向柱状图-->
<template>
  <div class="com-container">
    <div class="com-chart" ref="seller-ref">
    </div>
  </div>
</template>

<script>
export default {
  name: 'SellerCom',
  data () {
    return {
      chartInstance: null,
      jsonData: null,
      totalPage: 0,
      currentPage: 1,
      timerId: null
    }
  },
  mounted () {
    this.initChart()
    this.getChartData()
    window.addEventListener('resize', this.screenAdapter)
    this.screenAdapter()
  },
  destroyed () {
    clearInterval(this.timerId)
    window.removeEventListener('resize', this.screenAdapter)
  },
  methods: {
    // 初始化echartsInstance对象
    initChart () {
      this.chartInstance = this.$echarts.init(this.$refs['seller-ref'], 'chalk')
      const initOption = {
        title: {
          text: '▋ 商家销量统计',
          textStyle: {
            fontStyle: 'italic',
            fontWeight: 'bolder'
          },
          left: 15,
          top: 20
        },
        grid: {
          top: '10%',
          right: '3%',
          left: '3%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: { type: 'value' },
        yAxis: { type: 'category' },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'line',
            z: 0,
            lineStyle: {
              type: 'solid', // 默认为dash，不改的话就会是一段一段的
              color: '#2D3443'
            }
          }
        },
        series: {
          type: 'bar',
          label: {
            show: true,
            position: 'right',
            fontSize: 15,
            distance: 20
          },
          itemStyle: {
            // 柱子圆角
            // borderRadius: [0, 30, 30, 0],
            // 颜色渐变：1、指明颜色渐变的方向 2、指明不同百分比下颜色的值
            color: new this.$echarts.graphic.LinearGradient(0, 0, 1, 0, [
              {
                offset: 0,
                color: '#5052EE'
              },
              {
                offset: 1,
                color: '#AB6EE5'
              }
            ])
          }
        }
      }
      this.chartInstance.setOption(initOption)
      this.chartInstance.on('mouseover', () => { clearInterval(this.timerId) })
      this.chartInstance.on('mouseout', () => { this.startInterval() })
    },
    // 获取图表所需数据
    async getChartData () {
      await this.$axios.get('seller').then(res => {
        this.jsonData = res.data
        this.jsonData.sort((a, b) => { return a.value - b.value })
        this.totalPage = this.jsonData.length % 5 === 0 ? this.jsonData.length / 5 : this.jsonData.length / 5 + 1
        this.updateChart()
        this.startInterval()
      })
    },
    // 更新图表
    updateChart () {
      const start = (this.currentPage - 1) * 5
      const end = this.currentPage * 5
      const showJsonData = this.jsonData.slice(start, end)
      const sellerName = showJsonData.map((item) => { return item.name })
      const sellerValue = showJsonData.map((item) => { return item.value })
      const dataOption = {
        yAxis: { data: sellerName },
        series: { data: sellerValue }
      }
      this.chartInstance.setOption(dataOption)
    },
    startInterval () {
      if (this.timerId != null) {
        clearInterval(this.timerId)
      }
      this.timerId = setInterval(() => {
        this.currentPage++
        if (this.currentPage > this.totalPage) this.currentPage = 1
        this.updateChart()
      }, 2000)
    },
    // 屏幕大小变化时进行适配
    screenAdapter () {
      // console.log(this.$refs['seller-ref'].offsetWidth)
      const titleFontSize = this.$refs['seller-ref'].offsetWidth / 100 * 4.5
      const adapterOption = {
        title: {
          textStyle: {
            // fontStyle: 'italic',
            fontSize: titleFontSize / 1.5
            // fontWeight: 'bolder'
          }
        },
        tooltip: {
          axisPointer: {
            lineStyle: {
              width: titleFontSize
            }
          }
        },
        series: {
          barWidth: titleFontSize,
          // label: {
          //   show: true,
          //   position: 'right',
          //   fontSize: 15,
          //   distance: 20
          // },
          itemStyle: {
            borderRadius: [0, titleFontSize / 2, titleFontSize / 2, 0]
          }
        }
      }
      this.chartInstance.setOption(adapterOption)
      this.chartInstance.resize()
    }
  }
}
</script>

<style lang="less" scoped>

</style>

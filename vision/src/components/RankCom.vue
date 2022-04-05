<template>
  <div class="com-container">
    <div class="com-chart" ref="rank-ref">RankCom</div>
  </div>
</template>

<script>
export default {
  name: 'RankCom',
  data () {
    return {
      chartInstance: null,
      jsonData: null,
      startValue: 0, // 区域缩放的起点值
      endValue: 7, // 区域缩放的终点值
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
    window.removeEventListener('resize', this.screenAdapter)
    clearInterval(this.timerId)
  },
  methods: {
    initChart () {
      this.chartInstance = this.$echarts.init(this.$refs['rank-ref'], 'chalk')
      const initOption = {
        title: {
          text: '▋ 地区销量排行',
          textStyle: {
            fontStyle: 'italic',
            fontWeight: 'bolder'
          },
          left: 15,
          top: 20
        },
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
        grid: {
          top: '13%',
          right: '3%',
          left: '3%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: {
          type: 'category'
        },
        yAxis: {
          type: 'value'
        },
        series: {
          type: 'bar',
          label: {
            show: true,
            position: 'top'
          }
        }
      }
      this.chartInstance.setOption(initOption)
      this.chartInstance.on('mouseover', () => { clearInterval(this.timerId) })
      this.chartInstance.on('mouseout', () => { this.startInterval() })
    },
    async getChartData () {
      await this.$axios.get('rank').then(res => {
        this.jsonData = res.data
        // console.log(res.data)
        this.jsonData.sort((a, b) => { return b.value - a.value })
        console.log(this.jsonData.length)
        this.updateChart()
        this.startInterval()
      })
    },
    updateChart () {
      const colorArr = [
        ['#0490BC', '#4FF778'],
        ['#2E72Bf', '#23E5E5'],
        ['#5052EE', '#AB6EE5']
      ]
      const regionName = this.jsonData.map(item => item.name)
      const regionValue = this.jsonData.map(item => item.value)
      const dataOption = {
        xAxis: {
          data: regionName
        },
        dataZoom: {
          show: false,
          startValue: this.startValue,
          endValue: this.endValue
        },
        series: {
          data: regionValue,
          itemStyle: {
            color: arg => {
              let targetColorArr
              if (arg.value > 250) {
                targetColorArr = colorArr[0]
              } else if (arg.value > 150) {
                targetColorArr = colorArr[1]
              } else {
                targetColorArr = colorArr[2]
              }
              return new this.$echarts.graphic.LinearGradient(0, 1, 0, 0, [
                {
                  offset: 0,
                  color: targetColorArr[0]
                },
                {
                  offset: 1,
                  color: targetColorArr[1]
                }
              ])
            }
          }
        }
      }
      this.chartInstance.setOption(dataOption)
    },
    startInterval () {
      if (this.timerId) {
        clearInterval(this.timerId)
      }
      this.timerId = setInterval(() => {
        this.startValue++
        this.endValue++
        if (this.endValue === this.jsonData.length) {
          this.startValue = 0
          this.endValue = 7
        }
        this.updateChart()
      }, 2000)
    },
    screenAdapter () {
      const titleFontSize = this.$refs['rank-ref'].offsetWidth / 100 * 4.5
      const titleFontSizeHeight = this.$refs['rank-ref'].offsetWidth / 100 * 4.5
      const adapterOption = {
        title: {
          textStyle: {
            fontSize: titleFontSize / 1.5
          }
        },
        tooltip: {
          axisPointer: {
            lineStyle: {
              width: titleFontSize / 1.5
            }
          }
        },
        series: {
          barWidth: titleFontSize,
          itemStyle: {
            borderRadius: [titleFontSize / 2, titleFontSize / 2, 0, 0]
          },
          label: {
            fontSize: titleFontSize / 4,
            distance: titleFontSizeHeight / 4
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

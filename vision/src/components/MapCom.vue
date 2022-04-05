<template>
  <div class="com-container" @dblclick="returnChinaMap">
    <div class="com-chart" ref="map-ref"></div>
  </div>
</template>

<script>
import axios from 'axios'
export default {
  name: 'MapCom',
  data () {
    return {
      chartInstance: null,
      jsonData: null,
      titleFontSize: 0,
      provinceMapData: {}
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
    async initChart () {
      this.chartInstance = this.$echarts.init(this.$refs['map-ref'], 'chalk')
      await axios.get('http://localhost:8999/static/map/china.json').then(res => {
        this.$echarts.registerMap('chinaMap', res.data)
      })
      const initOption = {
        title: {
          text: '▋ 商家分布',
          textStyle: {
            fontStyle: 'italic',
            fontWeight: 'bolder'
          },
          left: 15,
          top: 20
        },
        geo: {
          // layoutCenter: ['45%', '70%'],
          // layoutSize: 900,
          top: '32%',
          // left: '35%',
          type: 'map',
          map: 'chinaMap',
          roam: true,
          zoom: 1.5,
          label: {
            // show: true
          },
          // 设置陕西省为中心点
          // center: [108.948024, 34.263161],
          itemStyle: {
            // areaColor: '#2E72BF',
            areaColor: 'rgba(46, 114, 191, 0.7)',
            borderColor: '#333'
          }
        },
        legend: {
          top: '5%'
          // orient: 'vertical' 图例竖直排列
        }
      }
      this.chartInstance.setOption(initOption)
      // this.chartInstance.on('click', async arg => {
      //   if (!this.provinceMapData[arg.name]) {
      //     await axios.get('http://localhost:8999/static/map/province/' + arg.name + '.json').then(res => {
      //       this.provinceMapData[arg.name] = res.data
      //       this.$echarts.registerMap(arg.name, res.data)
      //     })
      //   }
      //   const changeGeoOption = {
      //     geo: {
      //       map: arg.name
      //     }
      //   }
      //   this.chartInstance.setOption(changeGeoOption)
      // })
    },
    async getChartData () {
      await this.$axios.get('map').then(res => {
        this.jsonData = res.data
        this.updateChart()
      })
    },
    updateChart () {
      // 图例数据
      const legendData = this.jsonData.map(item => {
        return item.name
      })
      // 散点图数据
      const seriesData = this.jsonData.map(item => {
        // return的这个对象就代表一个类别下的所有散点数据
        // 如果要在地图中显示散点数据，需要给散点图表增加coordinateSystem: 'geo'配置
        return {
          type: 'effectScatter',
          rippleEffect: {
            scale: 5,
            brushType: 'stroke'
          },
          name: item.name,
          data: item.children,
          coordinateSystem: 'geo'
        }
      })
      const updateOption = {
        series: seriesData, // 散点图数据
        legend: { data: legendData } // 图例数据
      }
      this.chartInstance.setOption(updateOption)
    },
    screenAdapter () {
      this.titleFontSize = this.$refs['map-ref'].offsetWidth / 100 * 4.5
      const adapterOption = {
        title: {
          textStyle: {
            fontSize: this.titleFontSize / 1.5,
            fontStyle: 'italic',
            fontWeight: 'bolder'
          }
        },
        legend: {
          itemWidth: this.titleFontSize / 2,
          itemHeight: this.titleFontSize / 2,
          itemGap: this.titleFontSize / 2,
          textStyle: {
            fontSize: this.titleFontSize / 2.5
          }
        }
      }
      this.chartInstance.setOption(adapterOption)
      this.chartInstance.resize()
    },
    returnChinaMap () {
      // const changeMapOption = {
      //   geo: {
      //     map: 'chinaMap'
      //   }
      // }
      // this.chartInstance.setOption(changeMapOption)
    }
  }
}
</script>

<style lang="less" scoped>

</style>

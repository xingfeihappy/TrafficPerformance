<template>
    <section class="chart-container">
        <el-row>
            
            <el-col :xs="24" :sm="24" :md="12" :lg="12" >
                 <!-- <div id="chartColume" style="width:568px; height:400px;" v-show="chartColumeData.toString()!==''"></div> -->
                 <div id="chartColume" style="width:568px; height:400px;"></div>
            </el-col>
             
            <el-col :xs="24" :sm="24" :md="12" :lg="12">
                <div id="chartBar" style="width:100%; height:400px;"></div>
            </el-col>
            <el-col :xs="24" :sm="24" :md="12" :lg="12">
                <div id="chartLine" style="width:100%; height:400px;"></div>
            </el-col>
           <el-col :xs="24" :sm="24" :md="12" :lg="12">
                <div id="chartPie" style="width:100%; height:400px;"></div>
            </el-col>
            <el-col :xs="24" :sm="24" :md="24" :lg="24">
                <div id="myHeatMap" style="width:100%; height:400px;"></div>
            </el-col>
            
<!--             <el-col :span="24">
    <a href="http://echarts.baidu.com/examples.html" target="_blank" style="float: right;">more>></a>
</el-col> -->
        </el-row>
    </section>
</template>

<script>
    import echarts from 'echarts'
    require('echarts/extension/bmap/bmap')

    const err_OK = 0;
    export default {
        data() {
            return {
                chartColume: null,
                chartBar: null,
                chartLine: null,
                chartPie: null,
                heatMap: null
            }
        },

        methods: {
            drawColumnChart() {
                /*var container = document.getElementById('chartColume');
                console.log(container);
                var resizeContainer = function(){
                    container.style.width = window.innerWidth/2+'px';
                }
                resizeContainer();
                this.chartColume = echarts.init(document.getElementById('chartColume'));
                this.chartColume.setOption({
                  title: { text: 'Column Chart' },
                  tooltip: {},
                  xAxis: {
                      data: ["衬衫", "羊毛衫", "雪纺衫", "裤子", "高跟鞋", "袜子"]
                  },
                  yAxis: {},
                  series: [{
                      name: '销量',
                      type: 'bar',
                      data: this.chartColumeData
                      // [5, 20, 36, 10, 10, 20]
                    }]
                });*/
               /* this.chartColume.setOption(this.chartColumeJson);*/

               this.chartColume = echarts.init(document.getElementById('chartColume'));
               var _this = this;
                $.get('./api/chartColume').done(function (res) {
                    if(res.errno ===  err_OK){
                         _this.chartColume.setOption(res.data);
                    }
                    
                })
            },
            drawBarChart() {
                this.chartBar = echarts.init(document.getElementById('chartBar'));
                this.chartBar.setOption({
                    title: {
                        text: 'Bar Chart',
                        subtext: '数据来自网络'
                    },
                    tooltip: {
                        trigger: 'axis',
                        axisPointer: {
                            type: 'shadow'
                        }
                    },
                    legend: {
                        data: ['2011年', '2012年']
                    },
                    grid: {
                        left: '3%',
                        right: '4%',
                        bottom: '3%',
                        containLabel: true
                    },
                    xAxis: {
                        type: 'value',
                        boundaryGap: [0, 0.01]
                    },
                    yAxis: {
                        type: 'category',
                        data: ['巴西', '印尼', '美国', '印度', '中国', '世界人口(万)']
                    },
                    series: [
                        {
                            name: '2011年',
                            type: 'bar',
                            data: [18203, 23489, 29034, 104970, 131744, 630230]
                        },
                        {
                            name: '2012年',
                            type: 'bar',
                            data: [19325, 23438, 31000, 121594, 134141, 681807]
                        }
                    ]
                });
            },
            drawLineChart() {
                this.chartLine = echarts.init(document.getElementById('chartLine'));
                this.chartLine.setOption({
                    title: {
                        text: 'Line Chart'
                    },
                    tooltip: {
                        trigger: 'axis'
                    },
                    legend: {
                        data: ['邮件营销', '联盟广告', '搜索引擎']
                    },
                    grid: {
                        left: '3%',
                        right: '4%',
                        bottom: '3%',
                        containLabel: true
                    },
                    xAxis: {
                        type: 'category',
                        boundaryGap: false,
                        data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
                    },
                    yAxis: {
                        type: 'value'
                    },
                    series: [
                        {
                            name: '邮件营销',
                            type: 'line',
                            stack: '总量',
                            data: [120, 132, 101, 134, 90, 230, 210]
                        },
                        {
                            name: '联盟广告',
                            type: 'line',
                            stack: '总量',
                            data: [220, 182, 191, 234, 290, 330, 310]
                        },
                        {
                            name: '搜索引擎',
                            type: 'line',
                            stack: '总量',
                            data: [820, 932, 901, 934, 1290, 1330, 1320]
                        }
                    ]
                });
            },
            drawPieChart() {
                this.chartPie = echarts.init(document.getElementById('chartPie'));
                this.chartPie.setOption({
                    title: {
                        text: 'Pie Chart',
                        subtext: '纯属虚构',
                        x: 'center'
                    },
                    tooltip: {
                        trigger: 'item',
                        formatter: "{a} <br/>{b} : {c} ({d}%)"
                    },
                    legend: {
                        orient: 'vertical',
                        left: 'left',
                        data: ['直接访问', '邮件营销', '联盟广告', '视频广告', '搜索引擎']
                    },
                    series: [
                        {
                            name: '访问来源',
                            type: 'pie',
                            radius: '55%',
                            center: ['50%', '60%'],
                            data: [
                                { value: 335, name: '直接访问' },
                                { value: 310, name: '邮件营销' },
                                { value: 234, name: '联盟广告' },
                                { value: 135, name: '视频广告' },
                                { value: 1548, name: '搜索引擎' }
                            ],
                            itemStyle: {
                                emphasis: {
                                    shadowBlur: 10,
                                    shadowOffsetX: 0,
                                    shadowColor: 'rgba(0, 0, 0, 0.5)'
                                }
                            }
                        }
                    ]
                });
            },
            drawHeatMap(){
                var dom = document.getElementById("myHeatMap");
                  var myChart = echarts.init(dom);
                  var app = {};
                  var option = null;
                  app.title = '热力图与百度地图扩展';
                  console.log("lalalal");
                  $.get('./api/hangzhouTrack', function (res) {
                     var data =res.data;
                      var points = [].concat.apply([], data.map(function (track) {
                          return track.map(function (seg) {
                              return seg.coord.concat([1]);
                          });
                      }));
                      myChart.setOption(option = {
                            animation: false,
                            bmap: {
                                center: [120.13066322374, 30.240018034923],
                                zoom: 14,
                                roam: true
                            },
                            visualMap: {
                                show: false,
                                top: 'top',
                                min: 0,
                                max: 5,
                                seriesIndex: 0,
                                calculable: true,
                                inRange: {
                                    color: ['blue', 'blue', 'green', 'yellow', 'red']
                                }
                            },
                            series: [{
                                type: 'heatmap',
                                coordinateSystem: 'bmap',
                                data: points,
                                pointSize: 5,
                                blurSize: 6
                            }]
                        });
                      if (!app.inNode) {
                          // 添加百度地图插件
                          var bmap = myChart.getModel().getComponent('bmap').getBMap();
                          bmap.addControl(new BMap.MapTypeControl());
                      }
                  });

                  if (option && typeof option === "object") {
                      myChart.setOption(option, true);
                  }
            },
            drawCharts() {
                this.drawColumnChart()
                this.drawBarChart()
                this.drawLineChart()
                this.drawPieChart()
                this.drawHeatMap()
            },
        },
        mounted: function () {
            this.drawCharts();
        },
        updated: function () {
            this.drawCharts()
        }
    }
</script>

<style scoped>
    .chart-container {
        width: 100%;
        float: left;
    }
    /*.chart div {
        height: 400px;
        float: left;
    }*/

    .el-col {
        padding: 30px 20px;
    }
</style>

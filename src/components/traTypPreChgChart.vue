<<template>
  <section>
      <el-row>
            <el-col>
                <el-date-picker
                    v-model="year"
                    type="year"
                    placeholder="选择年">
                </el-date-picker>
            </el-col>
      </el-row>
      <el-row>
            <el-col>
                <div id="traTypPreChgChart"style="width:100%; height:400px;" class="chart-content"></div>
            </el-col>
      </el-row>    
  </section>
</template>


<script>
export default {
    data(){
        return {
            year:''
        }
    },
    methods:{
          darwTraTypPreChgChart(){
            let traTypPreChgChart = echarts.init(document.getElementById('traTypPreChgChart'));
            let option = {
                title : {
                    text: '',
                },
                tooltip: {
                    trigger: 'axis',
                    axisPointer: {
                        type: 'cross'
                    }
                },
                legend: {
                    data:['道路客运','道路货运','公交客运','出租车运输','内河运输','海洋货运','海洋客运']
                },
                toolbox: {
                    show : true,
                    feature : {
                        dataView : {show: true, readOnly: false}
                    }
                },
                xAxis : [
                    {
                        type : 'category',
                        boundaryGap: false,
                        data : ['1月','2月','3月','4月','5月','6月','7月','8月','9月','10月','11月','12月']
                    }
                ],
                yAxis : [
                    {
                        type : 'value',
                        name: '单位使用能耗(单位：万吨标准煤/亿人公里或万吨标准煤/亿吨公里)',
                        axisLabel: {
                            formatter: '{value}'
                        },
                        axisPointer: {
                            snap: true
                        }
                    }
                ],
                series : [
                    {
                        name:'道路客运',
                        type:'line',
                        data:[2.0, 4.9, 7.0, 23.2, 25.6, 76.7, 135.6, 162.2, 32.6, 20.0, 6.4, 3.3]
                    },
                    {
                        name:'道路货运',
                        type:'line',
                        
                        data:[2.6, 5.9, 9.0, 26.4, 28.7, 70.7, 175.6, 182.2, 48.7, 18.8, 6.0, 2.3]
                      
                    },
                    {
                        name:'公交客运',
                        type:'line',
                        data:[3.2,6.6,9.3,12.4, 24.7, 67.7, 155.6, 132.2, 44.7, 20.8,13.2,7.8]
                    },
                    {
                        name:'出租车运输',
                        type:'line',
                        data:[20, 49, 70, 232, 256, 160, 135.6, 100.2, 70.6, 50.0, 64, 33]
                    },
                    {
                        name:'内河运输',
                        type:'line',
                       
                        data:[6, 9, 16, 25.4, 29.7, 150.7, 180.6, 162.2, 130.7, 70.8, 16.0, 2.3]
                      
                    },
                    {
                        name:'海洋货运',
                        type:'line',
                        data:[7,16,9.3,18, 29, 80, 130.6, 170.2, 100.7, 25.8,11.2,7.8]
                    },
                    {
                        name:'海洋客运',
                        type:'line',
                        data:[5,6.6,19.3,15.4, 27.7, 67.7, 100.6, 132.2,77.7, 50.8,13.2,7.8]
                    }
                ]
            };

            traTypPreChgChart.setOption(option);
       }
    },
    mounted:function(){
        this.darwTraTypPreChgChart();
    },
    updated:function(){

    }
}
</script>






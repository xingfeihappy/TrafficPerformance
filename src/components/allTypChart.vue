<<template>
  <section>
      <el-row>
            <el-col>
                <el-date-picker
                    v-model="timeRange"
                    type="daterange"
                    placeholder="选择日期范围">
                </el-date-picker>
            </el-col>
      </el-row>
      <el-row>
            <el-col>
            <div id="allTypChart"style="width:100%; height:400px;" class="chart-content"/>
            </el-col>
      </el-row>    
  </section>
</template>

<script>
export default {
    data(){
      return {
            timeRange:''
      }
    },
    methods:{
          darwAlltypChart(){
            let allTypChart = echarts.init(document.getElementById('allTypChart'));
            let option = {
                title : {
                    text: '',
                },
                tooltip : {
                    trigger: 'axis'
                },
                legend: {
                    data:['油耗','气耗','电耗']
                },
                toolbox: {
                    show : true,
                    feature : {
                        dataView : {show: true, readOnly: false},
                        magicType : {show: true, type: ['line', 'bar']},
                    }
                },
                calculable : true,
                xAxis : [
                    {
                        type : 'category',
                        data : ['道路客运','道路货运','公交客运','出租车运输','内河运输','海洋货运','海洋客运']
                    }
                ],
                yAxis : [
                    {
                        type : 'value',
                         name: '单位使用能耗(单位：万吨标准煤)'
                    }
                ],
                series : [
                    {
                        name:'油耗',
                        type:'bar',
                        data:[7.0, 23.2, 25.6, 76.7, 135.6, 162.2, 32.6]
                    },
                    {
                        name:'气耗',
                        type:'bar',
                        data:[26.4, 28.7, 70.7, 175.6, 182.2, 48.7, 18.8,]
                      
                    },
                    {
                        name:'电耗',
                        type:'bar',
                        data:[12.4, 24.7, 67.7, 155.6, 132.2, 44.7, 20.8]
                    }
                ]
            };

            allTypChart.setOption(option);
       }
    },
    mounted:function(){
     this.darwAlltypChart();
    },
    updated: function () {
           
    }
}
</script>







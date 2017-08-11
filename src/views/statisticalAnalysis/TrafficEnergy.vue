<template>
    <section class="chart">
        <el-row> 
            <el-col class="chart-container">
                <div class="chart-header">
                    <el-date-picker
                        v-model="timeRange"
                        type="daterange"
                        placeholder="选择日期范围"
                        range-separator = ':'
                        @change="selectOther">
                    </el-date-picker>
                </div>
                <div class="chart-header">
                    <el-select v-model="cityType" placeholder="请选择城市" @change="citySelectChange">
                        <el-option key="杭州" label="杭州" value="杭州"></el-option>
                        <el-option key="宁波" label="宁波" value="宁波"></el-option>
                        <el-option key="温州" label="温州" value="温州"></el-option>
                        <el-option key="嘉兴" label="嘉兴" value="嘉兴"></el-option>
                        <el-option key="湖州" label="湖州" value="湖州"></el-option>
                        <el-option key="绍兴" label="绍兴" value="绍兴"></el-option>
                        <el-option key="金华" label="金华" value="金华"></el-option>
                        <el-option key="衢州" label="衢州" value="衢州"></el-option>
                        <el-option key="舟山" label="舟山" value="舟山"></el-option>
                        <el-option key="台州" label="台州" value="台州"></el-option>
                        <el-option key="丽水" label="丽水" value="丽水"></el-option>
                    </el-select>
                </div>
            </el-col>
        </el-row>

        <el-row> 
            <el-col class="chart-container">
                <div id="trafficTypeEnergyPie" style="width:100%; height:400px;"></div>
            </el-col>
        </el-row>
    </section>
</template>

<script>
    import {getCookie,delCookie,setCookie} from '../../common/js/Cookie.js';
    var dataForTranEngAll = [];
    var trafficTypeEnergyPie;

    var beforTimeRange = '';
    var beforCity ='';

    var requestData = {};

    var optionPi={
        title:{
            text: '各运输类型能耗构成图',
            x: 'center'
        },
        tooltip : {
            trigger: 'item',
            formatter: "{a} <br/>{b} : {c} ({d}%)"
        },
        legend: {
            orient: 'vertical',
            left: 'left',
            data: []
        },
        toolbox: {
            show : true,
            feature : {
                mark : {show: true},                 
                dataView : {show: true, readOnly: false},
                saveAsImage : {show: true},
            }
        },
        series : [
            {
                name: '能耗',
                type: 'pie',
                radius : '80%',
                center: ['50%', '60%'],
                data:[],
            }
        ]

    };

    function setData(res){
        var engerData = {};
        var eng_all_for_PI = []; //饼图填充数据

        res.traTypOther.forEach(function(element){
            var t = engerData[element.baseTyp];
            if(!t) t=[0];
            t[0] += element.baseTypDatOfAllEng;
            //t[1] += element.baseTypDatOfAllLen;
            engerData[element.baseTyp] = t;
        }); 
        res.xs[0].forEach(function(e1){
            var t = engerData[e1];
            if(t)
            {
                eng_all_for_PI.push({name:e1,value:t[0]})
               // eng_per.push((t[0]/t[1]).toFixed(2))
            }else{
                //eng_all_for_PI.push({name:e1,value:0})
               // eng_per.push(0)
            }
        });

        dataForTranEngAll.splice(0,dataForTranEngAll.length);
        dataForTranEngAll.push(res.xs[0]);
        dataForTranEngAll.push(eng_all_for_PI);
    }

    import echarts from 'echarts'
    export default{
        data(){
            return{
                timeRange:'',
                cityType:'杭州',
            }
        },
        methods:{
            initRequestData(requestData){
                var date = new Date;
                var year = date.getFullYear().toString();
                var token = getCookie('token');
                var userInfo = JSON.parse(getCookie('userInfo'));
                requestData.token = token;
                requestData.username = userInfo.name;
                if(userInfo.roleName!=null && userInfo.roleName!="")
                    requestData.roleName = userInfo.roleName;
                requestData.roleType = userInfo.roleType;
                if(userInfo.place1!=null && userInfo.place1!="")
                    requestData.place1 =userInfo.place1;
                if(userInfo.place2!=null && userInfo.place2!="")
                    requestData.place2 = userInfo.place2;          
                requestData.timeRange = year+'-01-01:'+year+'-12-31';
                requestData.cityType = "杭州";
            },
            getDataFromService(requestData){
                var _this = this;
                $.get(this.Constant.ajaxAddress+this.Constant.trafficenergyAjax,requestData).
                done(function (res){
                    if(res.errCode==30){//data ok
                        setData(res);
                        optionPi.legend.data = dataForTranEngAll[0];
                        optionPi.series[0].data = dataForTranEngAll[1];
                        trafficTypeEnergyPie.clear();
                        trafficTypeEnergyPie.setOption(optionPi);
                    }else if(res.errCode==31){ // data err
                        window.log('unknow err');
                    }else if(res.errCode==44){ // auth 
                        _this.$router.push('/login');
                    }

                });
                
            },
            selectOther(tr){
                console.log(tr+'   before=' + beforTimeRange);
                if(!tr||tr== '')
                    return ;
                requestData['timeRange']=tr;     
                this.getDataFromService(requestData);
                beforTimeRange = tr;
            },
            citySelectChange(ct){
                console.log(ct+'   before=' + beforCity);
                if(!ct||ct=='')
                    return ;
                requestData['cityType']=ct;
                this.getDataFromService(requestData);
                beforCity = ct;
            }

        },
        mounted: function () {
            trafficTypeEnergyPie = echarts.init(document.getElementById('trafficTypeEnergyPie'));
            trafficTypeEnergyPie.setOption(optionPi);
            this.initRequestData(requestData);
            this.getDataFromService(requestData);
        },
        updated: function () {
            console.log("update");
        }
    }
</script>


<style scoped lang="scss">
    .chart {
        width: 100%;
        float: left;
        .chart-container{
             background-color: #F2F2F2; 
             border-radius: 8px;
            .chart-header{
                float: right;
                margin-right: 20px;
                position: relative;
            }
            .chart-content{
                overflow: hidden;
            }
        }
        
    }
    /*.chart div {
        height: 400px;
        float: left;
    }*/

    .el-col {
        padding: 20px 20px;
    }
    .el-row {
        margin-bottom: 15px;
        &:last-child {
        margin-bottom: 0;
        }
    }
</style>
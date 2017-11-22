<template>
    <section>
        <el-row>
            <el-col :span="24">
                <div>
                    {{text}}
                </div>
            </el-col>
        </el-row>
    </section>
</template>

<script>
import {getCookie,delCookie,setCookie} from '../common/js/Cookie.js';
var requestData = {};

export default {
    data(){
        return{
            text:'hello world!'
        }   
    },
    methods:{
        initRequestData(requestData){
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
            requestData.timeRange = '2017-01-01:2017-07-30';
        },
        getDataFromService(requestData){
            var _this = this;
            $.get(this.Constant.ajaxAddress+this.Constant.analyzeReport,
            requestData)
            .done(function(data){
                if(data.errCode==30){//成功
                    //console.log('getReportData',JSON.stringify(data));
                    _this.text = JSON.stringify(data);
                }else if(data.errCode==31){//未知错误
                    _this.$message.error('获取失败，未知错误！'); 
                }else if(data.errCode==44){//
                    _this.$router.push('/login');
                }
            });
        }
    },
    mounted() {
       this.initRequestData(requestData);
       this.getDataFromService(requestData);
    }
}
</script>



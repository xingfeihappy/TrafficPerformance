<template>
	<div class="register-wrapper">
		<el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm register-container">
			<h3 class="title">公司名注册公司名注册</h3>
			<p class="text-header">注册</p>
		  <el-form-item label="单位名称" prop="name">
		    <el-input v-model="ruleForm.name"></el-input>
		  </el-form-item>
		  <el-form-item label="单位性质" prop="region">
		    <el-select v-model="ruleForm.region" placeholder="请选择活动区域">
		      <el-option label="省交通运输厅" value="shanghai"></el-option>
		      <el-option label="区域二" value="beijing"></el-option>
		    </el-select>
		  </el-form-item>
		  <!--  <el-form-item label="活动时间" required>
		   <el-col :span="11">
		     <el-form-item prop="date1">
		       <el-date-picker type="date" placeholder="选择日期" v-model="ruleForm.date1" style="width: 100%;"></el-date-picker>
		     </el-form-item>
		   </el-col>
		   <el-col class="line" :span="2">-</el-col>
		   <el-col :span="11">
		     <el-form-item prop="date2">
		       <el-time-picker type="fixed-time" placeholder="选择时间" v-model="ruleForm.date2" style="width: 100%;"></el-time-picker>
		     </el-form-item>
		    </el-col>
		  </el-form-item> -->
		  <!-- <el-form-item label="即时配送" prop="delivery">
		    <el-switch on-text="" off-text="" v-model="ruleForm.delivery"></el-switch>
		  </el-form-item>
		  <el-form-item label="活动性质" prop="type">
		    <el-checkbox-group v-model="ruleForm.type">
		      <el-checkbox label="美食/餐厅线上活动" name="type"></el-checkbox>
		      <el-checkbox label="地推活动" name="type"></el-checkbox>
		      <el-checkbox label="线下主题活动" name="type"></el-checkbox>
		      <el-checkbox label="单纯品牌曝光" name="type"></el-checkbox>
		    </el-checkbox-group>
		  </el-form-item> -->
		  <el-form-item label="单位规模" prop="resource">
		    <el-radio-group v-model="ruleForm.resource">
		      <el-radio label="999人以上"></el-radio>
		      <el-radio label="999人以下"></el-radio>
		    </el-radio-group>
		  </el-form-item>
		  <el-form-item label="单位地址" prop="desc">
		    <el-input type="textarea" v-model="ruleForm.desc"></el-input>
		  </el-form-item> 
		  
		  <el-form-item>
		    <el-button type="primary" @click="submitForm('ruleForm')" class="registerBtn">立即注册</el-button>
		    <el-button @click="resetForm('ruleForm')">重置</el-button>
		  </el-form-item>
		  
		  <div class="registration">
	        	已有账号?
	          <span class="signup"  @click="backToLogin">
	              点击登录
	          </span>
    	</div>
		</el-form>
		
	</div>
</template>
<script>
	export default {
    data() {
      return {
        ruleForm: {
          name: '',
          region: '',
          date1: '',
          date2: '',
          delivery: false,
          type: [],
          resource: '',
          desc: ''
        },
        rules: {
          name: [
            { required: true, message: '请输入活动名称', trigger: 'blur' }
            // { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
          ],
          region: [
            { required: true, message: '请选择活动区域', trigger: 'change' }
          ],
          date1: [
            { type: 'date', required: true, message: '请选择日期', trigger: 'change' }
          ],
          date2: [
            { type: 'date', required: true, message: '请选择时间', trigger: 'change' }
          ],
          type: [
            { type: 'array', required: true, message: '请至少选择一个活动性质', trigger: 'change' }
          ],
          resource: [
            { required: true, message: '请选择活动资源', trigger: 'change' }
          ],
          desc: [
            { required: true, message: '请填写活动形式', trigger: 'blur' }
          ]
        }
      };
    },
    methods: {
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.$message({
                  message: '注册成功',
                  type: 'success'
            }); 
            //将用户信息添加到数据库
            
            //跳转到登录页
            this.$router.push('/login');

          } else {
            console.log('error submit!!');
            return false;
          }
        });
      },
      resetForm(formName) {
        this.$refs[formName].resetFields();
      },
      backToLogin(){
      	this.$router.go(-1);
      }
    }
  }
</script>
<style scoped lang="scss">
.register-wrapper{
    position: fixed;
    top: 0;
    left: 0;
    bottom: 0;
    background-image: url(../assets/login-bg.jpg);
    background-size: cover;
    width: 100%;
    height: 100%;

    .register-container {
      position: relative;
      -webkit-border-radius: 5px;
      border-radius: 5px;
      -moz-border-radius: 5px;
      background-clip: padding-box;
      margin: 180px auto;
      width: 350px;
      padding: 40px 20px 15px 0;
      background: #fff;
      border: 1px solid #eaeaea;
      .title {
        position: absolute;
        top: -60px;
        width: 100%;
        text-align: center;
        left: 0;
        margin: 0px auto 40px auto;
        text-align: center;
        color: #505458;
        font-size: 24px;
        color: #fff;
      }
      .text-header{
      	position: absolute;
        top: 0;
        width: 100%;
        margin-left: 15px;

      }
      .registerBtn{
        background: #6bc5a4;
        color: #fff;
        -webkit-transition: all 0.3s;
        -moz-transition: all 0.3s;
        transition: all 0.3s;
        /*font-size: 30px;*/
        border: none;
      }
      .registerBtn:hover{
        background: #688ac2;
        /*background: #20A0FF;*/

        transition: all 0.3s;
      }
		.registration{
	        color: #c7c7c7;
	        text-align: center;
	        margin-top: 15px;
	        .signup{
	          color: #6bc5a4;
	          text-decoration: none;
	          cursor: pointer;
	        }
	        .signup:hover{
	          text-decoration: underline;
	        }
	    }
	    .el-radio__input.is-checked  {
	    	.el-radio__inner{
	    		border-color: #6bc5a4;
		   	 	background: #6bc5a4;
	    	}
		   
		}
	    .el-button:focus, .el-button:hover {
		    color: #6bc5a4;
		    border-color: #6bc5a4;
		}

     }

    }
</style>
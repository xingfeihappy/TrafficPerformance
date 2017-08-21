<template>
    <section>

       <div>
           <span>
               帮助文档
           </span>
       </div>
        <el-row >
            <el-col ></el-col>
            <el-col >
                    <!-- <el-upload
                    :action="murl"
                    :data = "data"
                    :on-preview="handlePreview"
                    :on-remove="handleRemove"
                    :headers="headers"
                    :before-upload="beforeUpload">
                    <el-button size="small" type="primary">点击上传</el-button>
                    <div slot="tip" class="el-upload__tip"></div>
                    </el-upload>    -->
                    <input type="file"  @change="upload">  
            </el-col>
        </el-row>
    </section> 
</template>

<script>

export default {
    data() {
        return {
            murl:this.Constant.ajaxAddress+this.Constant.upload,
            data:{},
            headers:{'Access-Control-Allow-Origin':'*','Content-Type':'multipart/form-data'}
        }
    },
    methods:{
        upload(event){
            console.log(event);
            var pdfFile= event.target.files[0];
            if(!pdfFile) return ;
            console.log(pdfFile);
            this.data.token = this.$token;
            
            var fd = new FormData();
            fd.append('file',pdfFile);
            fd.append('token', this.$token);

            this.$http.post(this.murl,fd,{emulateJSON: true}).then(res =>{
                console.log(res)
            },err =>{ console.log('err')})


        },


      handleRemove(file, fileList) {
        console.log(file, fileList);
      },
      handlePreview(file) {
        console.log(file);
      },
      beforeUpload(file){
           console.log('before upload',this.headers);
           
          this.data.token = this.$token;   
      }


    }
 }
</script>


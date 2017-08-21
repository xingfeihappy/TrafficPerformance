<template>
    <section>
        <el-row :span="24">
            <el-col :span="8"></el-col>
            <el-col :span="8">
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

        <el-row >
            <el-col :span="20">
                <div>
                    <el-button id="prev" @click="onPrevPage">Previous</el-button>
                    <el-button id="next" @click="onNextPage">Next</el-button>
                    &nbsp; &nbsp;
                    <span>Page: <span id="page_num"></span> / <span id="page_count"></span></span>
                </div>
            </el-col>
        </el-row>

        <el-row>
                <canvas id="the-canvas" class = "pdf"></canvas>
        </el-row>



    </section> 
</template>

<script>
    PDFJS.workerSrc = 'https://mozilla.github.io/pdf.js/build/pdf.worker.js';

export default {
    data() {
        return {
            pageNum:1,
            pageRendering:false,
            pdfDoc:null,
            pageNumPending:null,
            scale : 0.8,
            canvas : {},
            ctx:{},
            murl:this.Constant.ajaxAddress+this.Constant.upload,
            durl:this.Constant.ajaxAddress+this.Constant.download,
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
            var _this = this;
            this.$http.post(this.murl,fd,{emulateJSON: true}).then(res =>{
                _this.$message('上传成功');
                 _this.loadPdf();
                console.log(res);
            },err =>{ 
                _this.$message('上传失败');console.log('err');})
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
        },
        loadPdf(){
            this.pageNum=1;
            this.pageRendering=false;
            this.pdfDoc=null;
            this.pageNumPending=null;
            var _this = this;
            PDFJS.getDocument(this.durl).then(function(pdfDoc_) {
                console.log('pdfDoc',pdfDoc_);
                _this.pdfDoc = pdfDoc_;
                console.log('pdfDoc',_this.pdfDoc);
                document.getElementById('page_count').textContent = _this.pdfDoc.numPages;
                // Initial/first page rendering
                _this.renderPage(_this.pageNum);
            });
        },
        renderPage(num) {
            var _this = this;
            this.pageRendering = true;
            // Using promise to fetch the page
            this.pdfDoc.getPage(num).then(function(page) {
                var viewport = page.getViewport(_this.scale);
                _this.canvas.height = viewport.height;
                _this.canvas.width = viewport.width;

                // Render PDF page into canvas context
                var renderContext = {
                canvasContext: _this.ctx,
                viewport: viewport
                };
                var renderTask = page.render(renderContext);

                // Wait for rendering to finish
                renderTask.promise.then(function() {
                _this.pageRendering = false;
                if (_this.pageNumPending !== null) {
                    // New page rendering is pending
                    renderPage(_this.pageNumPending);
                    _this.pageNumPending = null;
                }
                });
            });
            // Update page counters
            document.getElementById('page_num').textContent = this.pageNum;
        },
        queueRenderPage(num) {
            if (this.pageRendering) {
                this.pageNumPending = num;
            } else {
                this.renderPage(num);
            }
        },
        onPrevPage() {
            if (this.pageNum <= 1) {
                return;
            }
            this.pageNum--;
            this.queueRenderPage(this.pageNum);
        },
        onNextPage() {
            if (this.pageNum >= this.pdfDoc.numPages) {
                return;
            }
            this.pageNum++;
            this.queueRenderPage(this.pageNum);
        }
    },
    mounted:function(){
        this.canvas = document.getElementById('the-canvas');
        this.ctx = this.canvas.getContext('2d');
        this.loadPdf();
    }

 }
</script>

<style scoped lang="scss">
    .pdf{
        border:1px solid black;
    }

</style>



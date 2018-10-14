$(function () {
    var letao = new Letao();
    letao.getSecondCategory();
    letao.getPage();
    letao.addSecondCategory();
});
var Letao = function () {};
Letao.prototype = {
    page:1,
    pageSize:5,
    // 获取一级分类页面函数
    getSecondCategory:function(){
        var that = this
        $.ajax({
            url:"/category/querySecondCategoryPaging",
            data:{page:that.page,pageSize:that.pageSize},
            success:function(data){
                // console.log(data);
                var html = template('secondCategoryTpl',data);
                $('.table tbody').html(html);
                var totalPage = Math.ceil(data.total/that.pageSize);
                that.getPage(totalPage);
                
            }
        })
    },
    // 页码初始化以及点击效果
    getPage: function (totalPages) {
        var that = this;
        $("#page").bootstrapPaginator({
            bootstrapMajorVersion: 3, //对应的bootstrap版本
            currentPage: 1, //当前页数
            numberOfPages: 5, //每次显示页数
            totalPages: totalPages, //总页数
            shouldShowPage: true, //是否显示该按钮
            useBootstrapTooltip: true,
            //点击事件
            onPageClicked: function (event, originalEvent, type, page) {
                that.page = page;
                that.getSecondCategory();
            }
        });
    },
    // 添加二级分类
    addSecondCategory:function(){
        var that = this;
        // 渲染模态框中的下拉框数据
        $('.add-category').on('click',function(){
            $.ajax({
                url:"/category/queryTopCategoryPaging",
                data:{page:that.page,pageSize:50},
                success:function(data){
                    // console.log(data);
                    var html = template('selectTpl',data);
                    $('.content .select-category').html(html);
                    var totalPage = Math.ceil(data.total/that.pageSize);
                    that.getPage(totalPage);
                    
                }
            });
        });
        // 给图片选择框添加值改变事件
        $('.select-file').on('change',function(e){
            // console.log(e);
            var fileName = e.target.files[0].name;
            console.log(fileName);
            var fileUrl = '/mobile/images/' + fileName;
            console.log(fileUrl);
            // 这里选择的图片必须在/mobile/images中的图片
            $('.img img').attr('src',fileUrl);
                  
        })
        // 给按钮添加保存事件
        $('.btn-save').on('click',function(){
            var categoryId = $('.select-category').val();
            var brandName = $('.brandName').val();
            var brandLogo = $('.img img').attr('src');
            if(!categoryId.trim()){
                alert("分类名称无效");
                return false;
            };
            if(!brandName.trim()){
                alert('品牌名称不能为空');
                return false;
            };
            $.ajax({
                url:"/category/addSecondCategory",
                type:'post',
                data:{categoryId:categoryId,brandName:brandName,brandLogo:brandLogo,hot:1},
                success:function(data){
                    // console.log(data);
                    that.getSecondCategory();
                    
                }
            })
        })
        

        
           
            
            
    }

            
            
}
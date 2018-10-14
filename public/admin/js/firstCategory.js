$(function () {
    var letao = new Letao();
    letao.getFirstCategory();
    letao.getPage();
    letao.addFirstCategory();
});
var Letao = function () {};
Letao.prototype = {
    page:1,
    pageSize:5,
    // 获取一级分类页面函数
    getFirstCategory:function(){
        var that = this
        $.ajax({
            url:"/category/queryTopCategoryPaging",
            data:{page:that.page,pageSize:that.pageSize},
            success:function(data){
                // console.log(data);
                var html = template('FirstCategoryTpl',data);
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
                that.getFirstCategory();
            }
        });
    },
    // 添加一级分类
    addFirstCategory:function(){
        var that =this;
        $('.btn-save').on('click',function(){
            // console.log(this);
            var categoryName = $('.categoryName').val();
            if(!categoryName.trim()){
                alert('请输出分类名称');
                return;
            }
            $.ajax({
                url:"/category/addTopCategory",
                type:'post',
                data:{categoryName:categoryName},
                success:function(data){
                    console.log(data);
                    if(data.success){
                        that.getFirstCategory()
                    }
                    
                }
            })
            
            
        })
    }

            
            
}
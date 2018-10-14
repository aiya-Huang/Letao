$(function () {
    var letao = new Letao();
    letao.getPage();
    letao.queryUser();
    letao.updateUser();
});
var Letao = function () {};
Letao.prototype = {
    page:1,
    pageSize:5,
    // 获取用户页面函数
    queryUser:function(){
        var that = this
        $.ajax({
            url:"/user/queryUser",
            data:{page:that.page,pageSize:that.pageSize},
            success:function(data){
                // console.log(data);
                var html = template('getUser',data);
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
                that.queryUser();
            }
        });
    },
    // 点击按钮发生改变事件
    updateUser:function(){
        var that =this;
        $(".table tbody").on('click','.select-btn',function(){
            var id = $(this).data('id');
            var isDelete = $(this).data('is-delete');
            // console.log(id,isDelete);
            if(isDelete == 0){
                isDelete = 1;
            }else{
                isDelete = 0;
            };
            $.ajax({
                url:"/user/updateUser",
                type:'post',
                data:{id:id,isDelete:isDelete},
                success:function(data){
                    if(data.success){
                        that.queryUser();
                    }
                    
                }
            })
            
            
        })
    }
}
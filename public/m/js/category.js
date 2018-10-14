$(function(){
    var letao = new Letao();
    letao.initScroll();
    letao.queryTopCategory();
    letao.querySecondCategory();
})
var Letao = function(){

};
Letao.prototype = {
    initScroll:function(){
        mui('.mui-scroll-wrapper').scroll({
            deceleration: 0.0005 //flick 减速系数，系数越大，滚动速度越慢，滚动距离越小，默认值0.0006
        });
    },
    queryTopCategory:function(){
        $.ajax({
            url:"/category/queryTopCategory",
            success:function(data){
                // console.log(data);
                var html = template('topCategoryTpl',data);
                $('.category-left ul').html(html);
                // 点击实现高亮效果
                $('.category-left ul').on('tap',"li",function(){
                    $(this).addClass('active').siblings('li').removeClass('active');
                });
                $('#loading').hide();
              
            }
        })
    },
    querySecondCategory:function(){
        // 页面一打开就进行渲染二级分类页面
        loadData(1);
        $('.category-left ul').on('tap',"li a",function(){
            $('#loading').show();
            // 先获取到一级分类的id
            var id = $(this).data('id');
            // console.log(id);
            // 根据不同的一级分类id，进行相应的渲染
            loadData(id);         
        });
        function loadData(id){
            $.ajax({
                url:"/category/querySecondCategory",
                data:{"id":id},
                success:function(data){
                    // console.log(data);                
                    var html = template('secondCategoryTpl',data);
                    $(".category-right .mui-row").html(html);
                    $('#loading').hide();
                }
            })
        }
        
    }
}
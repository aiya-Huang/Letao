$(function(){
    var letao = new Letao();
    letao.addHistory();
    letao.queryHistory();
    letao.delateHistory();
    letao.clearHistory();
});
var Letao = function(){

};
Letao.prototype = {
    // 添加搜索记录
    addHistory:function(){
        var that = this;
        $('.btn-search').on('tap',function(){
            var search = $(".input-search").val();
            if(!search){
                alert('请输入搜索内容!');
                return false;
            }
            // 获取本地存储内容
            var historyData = JSON.parse(localStorage.getItem('historyData')) || [];
            // 判断是否已存在，进行添加
            if(historyData.indexOf(search) != -1){
                historyData.splice(historyData.indexOf(search),1);
                historyData.unshift(search);
            }else{
                historyData.unshift(search);
            }
            // 保存修改后的key值
            localStorage.setItem('historyData',JSON.stringify(historyData));
            

            that.queryHistory();
            $(".input-search").val('');
        })
        

    },
    // 查询搜索记录，渲染界面
    queryHistory:function(){
        // 获取本地存储内容
        var historyData = JSON.parse(localStorage.getItem('historyData')) || [];
        var html = template('searchHistoryTpl',{'rows':historyData});
        $('.content ul').html(html);
    },
    // 删除搜索记录
    delateHistory:function(){
        var that = this;
        $('.contant ul').on('tap','li i',function(){
            var index = $(this).data('id');
            var historyData = JSON.parse(localStorage.getItem('historyData')) || [];
            historyData.splice(index,1);
             // 保存修改后的key值
             localStorage.setItem('historyData',JSON.stringify(historyData));

             that.queryHistory();

        })
    },
    // 清空搜索记录
    clearHistory:function(){
        var that = this;
        $('.clear-btn').on('tap',function(){
            var historyData = JSON.parse(localStorage.getItem('historyData')) || [];
            localStorage.removeItem('historyData');
            that.queryHistory();
        })
    }
}
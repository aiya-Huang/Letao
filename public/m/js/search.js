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
    // 添加搜索历史记录
    addHistory:function(){
        var that = this;
        $(".btn-search").on('tap',function(){
            var search = $(".input-search").val();

            // 判断输入框为空时，不进行下面操作
            if(!search){
                alert("请输入要搜索的商品!");
                // 不再向下进行，阻止a标签默认跳转
                return false;
            }

            // 获取本地存储数据
            var historyData = localStorage.getItem('historyData');
            // 对获取的数据进行判断
            if(historyData){
                // json => js
                historyData = JSON.parse(historyData);
                console.log(historyData);
                
            }else{
                historyData = [];
            }

            // 判断当前输入的值是否已存在
            // historyData.indexOf(search) 返回值就是下标
            if(historyData.indexOf(search) != -1){
                // 如果存在，删除已有的值，添加新的值（保证最新一次搜索历史记录在最前面）
                historyData.splice(historyData.indexOf(search),1);
                // 将下一个数据添加到数组最前面
                historyData.unshift(search);
                // 将下一个数据添加到数组最后面
                // historyData.push(search);
            }else{
                historyData.unshift(search);
                // historyData.push(search);
            }

            // 将添加完成的数组保存到本地存储中，要转格式
            // js => json
            localStorage.setItem('historyData',JSON.stringify(historyData));
            that.queryHistory();
            // 清空搜索框
            $('.input-search').val('');
        })
    },
    // 查询搜索历史记录
    queryHistory:function(){
        // 逻辑或，有值就进行转换，无值为空数组
        var historyData = JSON.parse(localStorage.getItem('historyData')) || [];
        var html = template('searchHistoryTpl',{'rows':historyData});
        $('.content ul').html(html);
    },
    // 删除搜索历史记录
    delateHistory:function(){
        var that = this;
        // 点击xx实现删除效果
        $('.content ul').on('tap','li i',function(){
            var index = $(this).data('id');
            console.log(index);
            
            // var historyData = JSON.parse(localStorage.getItem('historyData')) || [];
            // historyData.splice(index,1);
            // localStorage.setItem('historyData',JSON.stringify(historyData));
            // that.queryHistory();

            // 3. 获取当前本地存储的数组 把当前索引的值删掉
            var historyData = JSON.parse(localStorage.getItem('historyData')) || [];
            historyData.splice(index, 1);
            // 4. 删除完成后存储到本地存储中 把数组转成字符串
            localStorage.setItem('historyData', JSON.stringify(historyData));
            // 5. 在删除完成后调用查询刷新页面
            that.queryHistory();
        })
    },
    // 清除历史记录
    clearHistory:function(){
        var that = this;
        $('.clear-btn').on('tap',function(){
            // 删除自己创建key对应的值
            localStorage.removeItem('historyData')
            // 重新加载页面
            that.queryHistory();
        })
    }
}
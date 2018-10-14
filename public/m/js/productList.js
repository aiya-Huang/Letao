$(function(){
    var letao = new Letao();
    // 注意：获取地址栏变量的值，传入的是 要获取的字符串
    letao.search = letao.getQueryString('search');
    // 调用 查询商品列表数据
    letao.queryProduct(function(data){
        var html = template('productListTpl',data);
        $('.productList-content .mui-row').html(html);
    });
    // 调用 下拉刷新和上拉加载 搜索商品
    letao.initPullRefresh();
    // 调用商品的点击搜索
    letao.searchProduct();
    // 调用 商品排序
    letao.sortProduct();


});
var Letao = function(){

};
Letao.prototype = {
    search:'',
    page:1,
    pageSize:2,
    price:"",
    num:"",

    // 通过url地址栏获取传递变量的值
    getQueryString: function(name) {
        var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)');
        // productlist.html?search=李宁&id=3
        // / 这里是整个正则匹配出来的 ='search=李宁&'
        // 这个正则是寻找 &+url参数名字=值+&  &可以不存在。
        // 1.   这里的(^|&)会匹配开头 为空或&的字符  =''
        // 2.   + name + 这里是匹配你要找的参数名 ='search'
        // 3.   ([^&]*)这里是匹配“参数=”后面 非&的字符 ='李宁'
        // 4.   (&|$)这里匹配 以空或&结束的字符  ='&'
        // 5.   [^] 负向类正则，表示 非
        // 6.   边界类正则：(^a) 以 a 开始，(b$)以 b 结束
        
        // location.search获取地址栏中 ?后内容，productlist.html?search=李宁&id=3
        // substr(1) 从下标1开始截取到最后，此时去除了？
        // match(reg) 这里match方法可以把符合正则的字符找出来，是以数组形式给出
        // ['search=李宁&','','李宁','&'] 我们只需要下标为2的李宁
        var r = window.location.search.substr(1).match(reg);
        console.log(r);
        
        if (r != null) {
            // decodeURI(data) 将乱码转换成中文
            return decodeURI(r[2]);
        }
        return null;
    },

    // 查寻商品列表
    queryProduct:function(callback){
        $.ajax({
            url:"/product/queryProduct",
            data:{'proName':this.search,'page':this.page,'pageSize':this.pageSize,'price':this.price,'num':this.num},
            success:function(data){
                // console.log(data);
                
                // var html = template('productListTpl',data);
                // 下面那句话需要通过回调函数传递过来，不能写死，
                // 原因：下拉刷新需要直接加载数据，而上拉加载需要追加数据
                // $('.productList-content .mui-row').html(html);

                callback && callback(data);
                $('#loading').hide();

            }
        })
    },

    //初始化下拉刷新和上拉加载
    initPullRefresh: function() {
        var that = this;
        mui.init({
            pullRefresh: {
                //传入区域滚动(下拉刷新的父容器) 的选择器
                container: '#pullrefresh', //.mui-scroll-wrapper 也可以
                down: {
                    //初始化下拉刷新 回调函数在你执行下拉操作的时候触发
                    //必须传入下拉刷新的回调函数 写真实数据请求渲染页面
                    contentrefresh: '哥在刷新，请勿着急····',
                    callback: pulldownRefresh                    
                },
                up: {
                    //初始化上拉 回调函数在你执行上拉操作的时候触发
                    //必须传入上拉加载的回调函数 写真实数据请求渲染页面
                    contentrefresh: '火力全开,拼命加速····',
                    callback: pullupRefresh
                }
            }
        });
        //下拉刷新的回调函数
        function pulldownRefresh() {
            //设置一个定时器模拟请求的延迟,因为是本地存储会加载的很快速
            setTimeout(function() {
                //下拉刷新就是是刷新第一页
                that.page = 1;
                //数据请求完毕结束下拉刷新
                that.queryProduct(function(data){
                    // 直接加载数据
                    var html = template('productListTpl',data);
                    $('.productList-content .mui-row').html(html);

                    // 数据渲染完毕结束下拉刷新
                    mui('#pullrefresh').pullRefresh().endPulldownToRefresh();
                    //下拉刷新完成后去 重置 上拉加载更多 并且 在数据没有时 会提示 没有更多数据
                    //  但是自动触发一下上拉加载 没法解决
                    mui('#pullrefresh').pullRefresh().refresh(true);
                });
               
            },1000)
        }
        //上拉加载的回调函数
        function pullupRefresh() {
            setTimeout(function() {
                //上拉加载的时候请求后面的数据
                that.page++;
                //数据请求完毕结束下拉刷新
                that.queryProduct(function(data){
                    // 判断数据是否存在，存在就加载刷新，不存在就提示无数据
                    if(data.data.length){
                        // 进行追加数据
                        var html = template('productListTpl',data);
                        $('.productList-content .mui-row').append(html);
                        // 数据渲染完毕结束上拉刷新
                        mui('#pullrefresh').pullRefresh().endPullupToRefresh();
                    }else{
                        // 没有数据就结束上拉加载 并且提示没有数据了
                        mui('#pullrefresh').pullRefresh().endPullupToRefresh(true);
                    }                
                });
                
            },1000)
        }
    },

    // 点击查询商品
    searchProduct:function(){
        var that = this;
        $('.btn-search').on('tap',function(){
            that.search = $('.input-search').val();
            that.page = 1;
            that.queryProduct(function(data){
                var html = template('productListTpl',data);
                $('.productList-content .mui-row').html(html);
                //重置上拉加载的效果 但是会自动触发一次上拉
                mui('#pullrefresh').pullRefresh().refresh(true);
            });
        })
    },

    // 根据价格或者产品进行排序
    sortProduct:function(){
        var that =this;
        $('.title a').on('tap',function(){
            // 获取排序名称
            var sortType = $(this).data('sort-type');
            // 获取排序顺序
            var sort = $(this).data('sort');
            // 切换排序顺序
            sort = sort == 1 ? 2 : 1;
            // 保存到标签自定义属性上,为了保证下一次可以进行切换
            $(this).data('sort',sort);
            if(sortType == 'price'){
                that.price = sort;
                that.num = "";
            }else{
                that.price = "";
                that.num = sort;
            }
            that.page = 1;
            that.queryProduct(function(data){
                var html = template('productListTpl',data);
                $('.productList-content .mui-row').html(html);
                //重置上拉加载的效果 但是会自动触发一次上拉
                mui('#pullrefresh').pullRefresh().refresh(true);
            });
        })
    }

}

/*
    1.根据url地址栏截取变量的值，复制粘贴一把梭一段函数 
        注意：传入的参数是一个字符串
    2.根据搜索内容渲染页面
        发送ajax请求，传参数，获取数据，由于下面 上拉加载与下拉刷新拿到数据处理方式不一样，所以将获取到的数据放在函数里
    3.初始化 上拉加载与下拉刷新 的函数
        分别写上拉加载与下拉刷新 的函数
        下拉刷新：页码为1，调用渲染页面函数，直接加载，进行结束下拉刷新，重置上拉加载并传参数true，当数据没有时进行提示（因为当不断上拉加载完成后，重新再下拉刷新无效果）
        上拉加载：页码++，调用渲染页面函数，对获取到的数据进行判断
            当数据存在时（即数据的长度>0），进行追加数据，进行调用 结束上拉加载 方法，
            当数据没有时，进行调用 结束上拉加载 方法 并传参数true
    4.点击搜索按钮获取对应数据进行渲染
        将搜索框的内容保存到变量中，页码为1，通过渲染页面函数的参数进行传入，调用该函数，重置上拉加载并传参数true
    5.通过销量和价格进行排序
        1.给销量和价格标签，添加自定义属性data-sort-type,data-sort,
        给分类按钮添加点击事件：
            1.获取到排序的名称和排序顺序
            2.对排序顺序通过三元表达式进行切换，并保存到自定义变签中(为了保证下一次点击可以切换顺序)
            3.页码为1，调用渲染页面函数，重置上拉加载并传参数true


*/

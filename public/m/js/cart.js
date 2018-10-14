/*
    1.查询购物车页面，通货传入参数page,pageSize获取数据
        注意对获取到的数据进行 覆盖 或者 追加 操作，所以将不同的操作封装成回调函数
    2.下拉刷新和上拉加载
        下拉刷新：
            重置页码为1
            调用查询购物车页面函数，参数为函数
            函数内对数据进行覆盖，html
            调用结束下拉刷新方法(结束加载圆圈动画)，
            调用重置上拉加载方法，传入参数true，再次进行上拉加载数据完成时，可以提示没有数据
        上拉加载：
            页码++
            调用查询购物车页面函数，参数为函数
            对数据长度进行判断，如果大于0:
                函数内对数据进行追加，append
                调用结束上拉加载方法(结束加载圆圈动画)
            否则：
                调用结束上拉加载方法，传入参数true，提示没有数据
    3.左滑出现编辑和删除按钮
        复制结构函数，主要是添加关键的类名
        将每一项数据的id存到按钮外的li标签上，通过$(elem.parentNode.parentNode).data('id') 可以进行获取
    4.删除操作
        由于删除按钮是动态添加的，需要用委托事件，给删除按钮添加点击的委托事件：
            点击后会弹出一个确认框，通过确认框上的是或否进行不同的操作：
                是：发送ajax请求去删除数据库中数据，传入参数id，
                    成功后：调用查询购物车页面函数，参数为函数
                    失败：跳转到登录页面，进行登录
                否：按钮滑动回来
    5.编辑操作
        将整条数据对象存到编辑按钮上的自定义属性中：data-product='{{value}}'
        要提前写好一个编辑模板，包括尺码和数量
        由于编辑按钮是动态添加的，需要用委托事件，给编辑按钮添加点击的委托事件：
            通过取自定义属性，获取整条数据，对数据中的尺码进行处理，变成数组，并将对象中的尺码替换
            调用模板方法，由于模板中有大量的回车换行，在mui.confirm会帮你自动生成br标签，去除br:html.replace(/[\r\n]/g, "")
            弹出确认框，将整个html作为内容添加进去，通过确认框上的是或否进行不同的操作：
                是：发送ajax请求去修改数据库中数据，传入参数size，num，所以要先获取到被点击的size和num：
                        请求成功：调用查询购物车页面函数
                否：按钮滑动回来
            确认框尺码和数量渲染出来后，并不能点击，因为是动态添加的，需要手动调用：
                初始化尺码的点击
                初始化数字框
            
    6.总金额变化
        根据复选框的值改变事件进行改变总金额：将商品的价格和数量通过自动定义属性存到复选框上
        由于复选框是动态添加的，需要用委托事件，给复选框添加值改变的委托事件：
            获取到所有选中的复选框，进行遍历，获取到价格和数量，将两者的乘积存到变量上
            注意获取到的总数值进行保留两位小数的操作
            将变量总金额的值 赋值给 总金额标签上

*/

$(function(){
    var letao = new Letao();
    letao.queryCartPaging(function(data){
        var html = template('cartListTpl',data);
        $('.cart-list').html(html);
    });
    letao.initPullRefresh();
    letao.deleteCart();
    letao.editCart();
    letao.getSum();
});
var Letao = function(){};
Letao.prototype = {
    page:1,
    pageSize:5,
    // 渲染购物车列表数据
    queryCartPaging:function(callback){
        
        $.ajax({
            url:"/cart/queryCartPaging",
            data:{'page':this.page,'pageSize':this.pageSize},
            success:function(data){
                // console.log(data);
                  
                if(data instanceof Array){
                    data = {data:data};
                };     
                // 一段代码不同的地方会重复使用，通过回调函数实现
                callback && callback(data);    
                $('#loading').hide();     
            }
        })
    },
    // 下拉刷新与上拉加载
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
                that.queryCartPaging(function(data){
                    // 直接加载数据
                    var html = template('cartListTpl',data);
                    $('.cart-list').html(html);

                    // 数据渲染完毕结束下拉刷新
                    mui('#pullrefresh').pullRefresh().endPulldownToRefresh();
                    //下拉刷新完成后去 重置 上拉加载更多 并且 在数据没有时 会提示 没有更多数据
                    //  但是自动触发一下上拉加载 没法解决
                    mui('#pullrefresh').pullRefresh().refresh(true);
                });
               
            },1000)
        };

        //上拉加载的回调函数
        function pullupRefresh() {
            setTimeout(function() {
                // 下拉刷新的时候重置page=1
                that.page++;
                that.queryCartPaging(function(data) {
                    // 由于后台返回的数据为空的时候返回是一个空数组不是一个对象 data{data:[]}
                    // 由于公共函数里面处理成对象了就判断对象里面的data数组的长度是否大于0
                    console.log(data);
                    
                    if (data.data.length > 0) {
                        var html = template('cartListTpl', data);
                        $('.cart-list').append(html);
                        //结束上拉加载
                        mui('#pullrefresh').pullRefresh().endPullupToRefresh();
                    } else {
                        //结束上拉加载 并且提示没有更多数据
                        mui('#pullrefresh').pullRefresh().endPullupToRefresh(true);
                    }
                });
            }, 1000)
        }
    },
    // 删除购物车
    deleteCart:function(){
        var that = this;
        // li标签滑动出现提示内容
        // $('.cart-list').on('slideleft', '.mui-table-view-cell', function(event) {
        // 删除按钮点击出现提示内容 
        $('.cart-list').on('tap', '.btn-delete', function(event) {
            var elem = this;
            // console.log(elem);// 是一个dom元素   下面的方法不能用                  
            // var id = elem.parentNode.parentNode.data('id');
            var id = $(elem.parentNode.parentNode).data('id');
            // 参数一：提示对话框上显示的内容
            // 参数二：提示对话框上显示的标题
            // 参数三：提示对话框上按钮显示的内容
            // 参数四：提示对话框上关闭后的回调函数
            mui.confirm('确认删除该商品？', '温馨提示', ['是','否'], function(e) {
                if (e.index == 0) {
                    // elem.parentNode.removeChild(elem);
                    $.ajax({
                        url:"/cart/deleteCart",
                        data:{'id':id},
                        success:function(data){
                            if(data.success){
                                that.page = 1;
                                that.queryCartPaging(function(data){
                                    // 直接加载数据
                                    var html = template('cartListTpl',data);
                                    $('.cart-list').html(html);
                
                                    // 数据渲染完毕结束下拉刷新
                                    mui('#pullrefresh').pullRefresh().endPulldownToRefresh();
                                    //下拉刷新完成后去 重置 上拉加载更多 并且 在数据没有时 会提示 没有更多数据
                                    //  但是自动触发一下上拉加载 没法解决
                                    mui('#pullrefresh').pullRefresh().refresh(true);
                                });
                            }else{
                                location.href = "login.html?returnUrl=user.html";
                            }
                        }
                    })
                } else {
                    setTimeout(function() {
                        // 上面改为按钮的事件后，本身不能滑动，而是他的父元素的父元素可以滑动
                        // 注意：mui中的代码都是原生js写的，只能写dom对象
                        // mui.swipeoutClose(elem);
                        mui.swipeoutClose(elem.parentNode.parentNode);
                        // 这里的$是指mui框架中的mui
                        // $.swipeoutClose(elem);
                    }, 0);
                }
            });
        });
    },
    // 编辑按钮操作
    editCart:function(){
        var that =this;
        $('.cart-list').on('tap', '.mui-table-view-cell .btn-edit', function(event) {
            var elem = this;
            var product = $(this).data('product');         
            var start = product.productSize.split('-')[0];
            var end = product.productSize.split('-')[1];
            var arr = [];
            for(var i=start;i<=end;i++){
                arr.push(parseInt(i));
            }
            product.productSize = arr;
            // console.log(product);
            
            var html = template('editTpl',product);
            // 模板中有大量的回车换行，在mui.confirm会帮你自动生成br标签
            // 需要进行删除，否则结构很奇怪
            html = html.replace(/[\r\n]/g, "");  
            // console.log(html);
            
            mui.confirm(html, '编辑商品标题', ['确定','取消'], function(e) {
                // console.log(e);
                if(e.index == 0){
                    var size = $('.btn-size.active').data('size');
                    var num = mui('.mui-numbox').numbox().getValue();
                    $.ajax({
                        url:"/cart/updateCart",
                        type:"post",
                        data:{id:product.id,size:size,num:num},
                        success:function(data){
                            // 这里必须重置页码数，原因：当编辑最后一页的数据时，如果不设置页码数，
                            // 就会因为数据加载完成后 提示到没有数据
                            that.page = 1;
                            that.queryCartPaging(function(data){
                                // 直接加载数据
                                var html = template('cartListTpl',data);
                                $('.cart-list').html(html);
            
                                // 数据渲染完毕结束下拉刷新
                                mui('#pullrefresh').pullRefresh().endPulldownToRefresh();
                                //下拉刷新完成后去 重置 上拉加载更多 并且 在数据没有时 会提示 没有更多数据
                                //  但是自动触发一下上拉加载 没法解决
                                mui('#pullrefresh').pullRefresh().refresh(true);
                            });
                            
                        }
                    })
                }else{
                    setTimeout(function() {
                        mui.swipeoutClose(elem.parentNode.parentNode);
                    },0)
                }
                
            });
            //初始化尺码的点击
            $('.btn-size').on('tap', function() {
                //获取当前点击的尺码添加active其他删除active
                $(this).addClass('active').siblings().removeClass('active');
            });
            //等数字框动态加载完后再次初始化数字框
            mui('.mui-numbox').numbox();
        })
    },
    // 总金额累加事件
    getSum:function(){
        // 复选框的值改变事件
        $('.cart-list').on('change',"input[type='checkbox']",function(){
            // console.log(this);
            var checkeds = $(":checked");
            console.log(checkeds);
            var sum = 0;
            checkeds.each(function(index,value){
                var price = $(value).data('price')
                var num = $(value).data('num')
                sum += price*num;
            });
            console.log(sum);
            // 获取数值为小数点后保留两位
            sum = sum.toFixed(2);
            $('#order .left span').html(sum);           
        })
    }

 
};




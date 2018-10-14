$(function () {
    var letao = new Letao();
    letao.initScroll();
    letao.id = letao.getQueryString('id');
    console.log(letao);//得到构造函数Letao
    
    letao.queryProductDetail();
    // letao.id = letao.getQueryString('id');//放在后面就不行
    letao.addcart();
    
    

});
var Letao = function () {

};
Letao.prototype = {
    // 这里的id可以不用写，原因：queryProductDetail函数调用的时候，已经给letao对象添加id方法
    // id:"",
    // 滚动条事件
    initScroll: function () {
        mui('.mui-scroll-wrapper').scroll({
            deceleration: 0.0005 //flick 减速系数，系数越大，滚动速度越慢，滚动距离越小，默认值0.0006
        });
    },

    //专门获取url参数的值的方法 根据参数名获取参数值
    getQueryString: function (name) {
        var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)','i');
        // var reg = new RegExp('[^|&]' + name + '=([^&]*)[&|$]', 'i');
        // ()主要应用在限制多选结构的范围/分组/捕获文本/环视/特殊模式处理
        // []是单个匹配 字符集/排除字符集/命名字符集
        // new RegExp(pattern, attributes);
        // pattern是一个字符串，指定了正则表达式的模式或其他正则表达式。
        // attributes是一个可选的字符串，包含属性 "g"、"i" 和 "m"，分别用于指定全局匹配、区分大小写的匹配和多行匹配。

        var r = window.location.search.substr(1).match(reg);
        if (r != null) {
            return decodeURI(r[2]);
        }
        return null;
    },
    // 查询商品详情页
    queryProductDetail: function () {
        var that = this;
        console.log(that.id);
        
        $.ajax({
            url: "/product/queryProductDetail",
            data: {
                id: this.id
            },
            success: function (data) {
                // console.log(data);
                var html = template('slideTpl', data);
                $('.mui-slider').html(html);
                // that.initSlide();

                // mui框架会默认初始化当前页面的图片轮播组件，但是如果轮播图是动态添加，就要手动调用图片轮播的初始化方法
                //获得slider插件对象
                var gallery = mui('.mui-slider');
                gallery.slider({
                    interval: 5000 //自动轮播周期，若为0则不自动播放，默认为0；
                });

                // 处理尺码数据，使其变成一个数组
                var size = data.size;
                // console.log(size);
                // console.log(size.split('-')); ["40", "50"] 返回的是一个数组
                
                var start = size.split('-')[0];
                var end = size.split('-')[1];
                var arr =[];
                for(var i = start;i<=end;i++){
                    arr.push(parseInt(i));
                };
                data.size = arr;
                var html = template('productDetailTpl',data);
                $('.product-detail').html(html);

                // mui在mui.init()中会自动初始化基本控件,但是 动态添加的Numbox组件需要手动初始化
                mui('.mui-numbox').numbox();
                $('#loading').hide();

                 //让尺码支持点击
                 $('.btn-size').on('tap', function() {
                    //获取当前点击的尺码添加active其他删除active
                    $(this).addClass('active').siblings().removeClass('active');
                });
            }
        })
    },

    // 添加购物车函数
    addcart:function(){
        var that = this;
        $('.btn-add-cart').on('tap',function(){
            var size = $('.btn-size.active').data('size');
            if(!size){
                mui.toast('请选择尺码',{ duration:'long', type:'div' });
                return false;
            };
            // mui自带的数字输入框，获取数值方法
            var num = mui('.mui-numbox').numbox().getValue();
            if(!num){
                mui.toast('请选择数量',{ duration:'long', type:'div' });
                return false;
            }
            // 调用加入购物车的api去加入购物车
            $.ajax({
                url:"/cart/addCart",
                // 提交方式为post
                type:'post',
                // 注意参数名要和API中给的一致
                data:{'productId':that.id,'size':size,'num':num},
                success:function(data){
                    console.log(data);
                    if(data.error){
                        //注意id是detail.html页面的参数 
                        var returnUrl = 'detail.html?id='+that.id;
                        location.href = 'login.html?returnUrl='+returnUrl;
                    }else{
                        mui.confirm('添加成功，是否去购物车查看','温馨提示',['是','否'],function(e){
                            console.log(e);
                            if(e.index == 0){
                                location.href = "cart.html";
                            }else{
                                mui.toast('请继续添加',{ duration:'long', type:'div' }) 
                            }
                            
                        }) 
                    }
                }
            })
        })
    }

}
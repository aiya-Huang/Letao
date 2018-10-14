$(function(){
    var letao = new Letao();
    letao.queryUserMessage();
    letao.exit();
    
});
var Letao = function(){};
Letao.prototype = {
    queryUserMessage:function(){
        // 个人中心加载用户名和手机号
        $.ajax({
            url:"/user/queryUserMessage",
            success:function(data){
                console.log(data);
                $(".username").html(data.username);
                $(".mobile").html(data.mobile);              
            }
        })
    },
    exit:function(){
        $('.btn-exit').on('tap',function(){
            $.ajax({
                url:"/user/logout",
                success:function(data){
                    if(data.success){
                        location.href = "login.html?returnUrl=user.html";
                    }
                    
                }
            })
        })
    }

}
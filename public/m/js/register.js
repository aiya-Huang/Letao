$(function(){
    var letao = new Letao();
    letao.register();
    letao.getVcode();
});
var Letao = function(){};
Letao.prototype = {
    vCode:"",
    register:function(){
        var that =this;
        //登录功能函数
        // 1. 验证表单是否输入
        // 2. 如果验证通过获取当前用户名 手机号 密码 验证码调用 注册APi实现注册
        // 3. 注册完成后跳转到登录页面
        $('.register').on('tap',function(){
            var check = true;
            mui(".mui-input-group input").each(function() {
                //若当前input为空，则alert提醒         
                if(!this.value || this.value.trim() == "") {
                    var label = this.previousElementSibling;
                    mui.toast(label.innerText + "不允许为空", { duration: 'short', type: 'div' });
                    check = false;
                    return false;
                }
            }); //校验通过，继续执行业务逻辑 
            if(check){
               var username = $('.username').val();
               var password1 = $('.password1').val();
               var password2 = $('.password2').val();
               var mobile = $('.mobile').val();
               var vcode = $('.vcode').val();
               //判断密码是否一致
               if(password1 != password2) {
                    mui.toast("两次密码不一致，请重新输入", { duration: 'short', type: 'div' });
                    return false;
               };
                //判断手机号是否正确    
               if(!(/^1[34578]\d{9}$/.test(mobile))){
                    mui.toast("手机号格式不正确，请重新输入", { duration: 'short', type: 'div' });
                    return false;
               }
                //判断验证码是否正确
                if(vcode != that.vCode){
                    mui.toast("验证码不正确，请重新输入", { duration: 'short', type: 'div' });
                    return false;
                }    
                //进行注册
                $.ajax({
                    url:"/user/register",
                    type:"post",
                    data:{username:username,password:password1,mobile:mobile,vCode:vcode},
                    success:function(data){
                        // console.log(data.message);
                        if(data.error){
                            mui.toast(data.message, { duration: 'short', type: 'div' });
                        }else{
                            //如果成功就跳转到登录页面  但是注册页去到登录页面不能再回到注册页面
                            location.href = "login.html?returnUrl=user.html";
                        }                     
                    }
                })    
            } 
        })
       
    },
    getVcode:function(){
        var that = this;
        $('.getVcode').on('tap',function(){
            $.ajax({
                url:"/user/vCode",
                success:function(data){
                    console.log(data.vCode);    
                    that.vCode = data.vCode;             
                }
            })
        })
    }
}
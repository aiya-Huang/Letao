$(function(){
    var letao = new Letao();
    letao.login();
});
var Letao = function(){

};
Letao.prototype = {
    login:function(){
        var that = this;
        $('.btn-login').on('tap',function(){
            var check = true;
            mui(".mui-input-group input").each(function() {              
                //若当前input为空，则alert提醒 
                if(!this.value || this.value.trim() == "") {
                    var label = this.previousElementSibling;
                    mui.alert(label.innerText + "不允许为空");
                    check = false;
                    return false;
                }
            }); //校验通过，继续执行业务逻辑 
            if(check){
                // mui.alert('验证通过!')
                $.ajax({
                    url:"/user/login",
                    type:'post',
                    data:{'username':$('.username').val(),'password':$('.password').val()},
                    success:function(data){
                        console.log(data);
                        if(data.error){
                            mui.toast(data.message,{ duration:'long', type:'div' }) 
                        }else{
                            // history.back(-1);
                            var returnUrl = that.getQueryString('returnUrl'); 
                            console.log(returnUrl);                                                   
                            location.href = returnUrl;
                        }
                        
                    }
                })
            }
        })
        
        
    },
    //专门获取url参数的值的方法 根据参数名获取参数值
    getQueryString: function(name) {
        var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i');
        var r = window.location.search.substr(1).match(reg);
        if (r != null) {
            return decodeURI(r[2]);
        }
        return null;
    }
    
}
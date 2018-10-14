$(function(){
    var letao = new Letao();
    letao.login();

});
var Letao = function(){};
Letao.prototype = {
    login:function(){
        $('.btn-login').on('click',function(){
            var username = $('.username').val();
            var password = $('.password').val();
            if(!username.trim()){
                alert("用户名不能为空!")
                return false;
            };
            if(!password.trim()){
                alert("密码不能为空!")
                return false;
            };
            $.ajax({
                url:"/employee/employeeLogin",
                type:"post",
                data:{username:username,password:password},
                success:function(data){
                    console.log(data);
                    
                    if(data.success){
                        location.href = "index.html";
                    }else{
                        alert(data.message);
                    }
                }
            })
        })
        
    }
}
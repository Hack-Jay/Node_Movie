/**
 * Created by Administrator on 2017/6/26 0026.
 */
$('#signup').on('click', function(){

    //iframe层
    layer.open({
        type: 2,
        title: '登陆注册',
        shadeClose: true,
        shade: 0.8,
        area: ['380px', '320px'],
        content: '/sign-denglu'  //iframe的url
    });
});
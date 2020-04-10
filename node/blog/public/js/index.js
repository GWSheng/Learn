var id = getParameterByName('id');

$(function(){

	$("#logOut").on("click",function(){
		$.ajax({
			type:"get",
			url:"/logOut?id=" + id ,
			success:function(data){
				if (data.resCode === 0) {
					window.location.href = "/login";
				}
			},
			error:function(error){
				console.log(error);
			}
		})
	})
})


function getParameterByName(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}
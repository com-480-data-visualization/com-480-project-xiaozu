$('#menuList a').on('click', function (e) {
  e.preventDefault()
  $(this).tab('show')
})

$('#slide-courses').click(function (e) {
  var contentBtn = e.currentTarget;
  var toExpand = false;
  if(contentBtn.innerHTML.includes("Show")){
    contentBtn.innerHTML = `<i class="fas fa-columns"></i> Hide
    courses done`;
    $("#selected-courses")[0].classList.remove("col-1");
    $("#selected-courses")[0].classList.add("col-12");
    toExpand = true;
  } else {
    contentBtn.innerHTML = `<i class="fas fa-columns"></i> Show
    courses done`;
    $("#selected-courses")[0].classList.add("col-1");
    $("#selected-courses")[0].classList.remove("col-12");
    toExpand = false;
  }

  var $marginLefty = $("#selected-courses");
  $marginLefty.animate({ 
    marginLeft: toExpand ? 400 : 1000 });
  });

q = d3.queue();
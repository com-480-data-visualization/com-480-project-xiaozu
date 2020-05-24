$('#menuList a').on('click', function (e) {
  e.preventDefault()
  $(this).tab('show')
})

$('#slide-courses').click(function (e) {
  var contentBtn = e.currentTarget;
  if(contentBtn.innerHTML.includes("Show")){
    contentBtn.innerHTML = `<i class="fas fa-columns"></i> Hide
    courses done`;
  } else {
    contentBtn.innerHTML = `<i class="fas fa-columns"></i> Show
    courses done`;
  }

  var $marginLefty = $("#selected-courses");
  $marginLefty.animate({ 
    marginLeft: parseInt($marginLefty.css('marginLeft'), 10) == 400 ? 820 : 400 });
  });

q = d3.queue();
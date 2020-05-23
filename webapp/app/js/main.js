$('#menuList a').on('click', function (e) {
  e.preventDefault()
  $(this).tab('show')
})

$('#slide-courses').click(function () { 
  var $marginLefty = $("#selected-courses");
  $marginLefty.animate({ 
    marginLeft: parseInt($marginLefty.css('marginLeft'), 10) == 600 ? 800 : 600 });
  });

q = d3.queue();
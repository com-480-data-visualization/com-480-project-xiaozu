$('#menuList a').on('click', function (e) {
  e.preventDefault()
  $(this).tab('show')
})

var introguide = introJs();
introguide.setOptions({
  'showButtons': false,
  steps: [
      {
        element: '.btn-start',
        intro: 'We will guide you around our website for a full immersive experience. <br><br>Use the arrow keys for navigation or hit ESC to exit the tour immediately.',
        position: 'bottom'
      },
      {
        element: '#explore-btn',
        intro: 'Click this tab to see which are the popular courses over the years.',
        position: 'bottom'
      },
      {
        element: '#network-btn',
        intro: 'Click this tab to explore suggested courses for a specific student.',
        position: 'bottom'
      }
  ]
});

$('#slide-courses').click(function (e) {
  var contentBtn = e.currentTarget;
  var toExpand = false;
  if(contentBtn.innerHTML.includes("Show")){
    contentBtn.innerHTML = `<i class="fas fa-columns"></i> Hide
    courses done`;
    toExpand = true;
  } else {
    contentBtn.innerHTML = `<i class="fas fa-columns"></i> Show
    courses done`;
    toExpand = false;
  }

  var $marginLefty = $("#selected-courses");
  $marginLefty.animate({
    marginLeft: toExpand ? "55%" : "100%" });
  });

  introguide.start();

q = d3.queue();

// Keeping track of which courses have been locked
locked_courses = []
saved_student_name = ""

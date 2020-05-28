$('#menuList a').on('click', function (e) {
  e.preventDefault()
  $(this).tab('show')
})

var introguide = introJs();
introguide.setOptions({
  steps: [
      {
        element: '.btn-start',
        intro: 'This guided tour will explain the Hongkiat demo page interface.<br><br>Use the arrow keys for navigation or hit ESC to exit the tour immediately.',
        position: 'bottom'
      },
      // {
      //   element: '.nav-logo',
      //   intro: 'Click this main logo to view a list of all Hongkiat demos.',
      //   position: 'bottom'
      // },
      // {
      //   element: '.nav-title',
      //   intro: 'Hover over each title to display a longer description.',
      //   position: 'bottom'
      // },
      // {
      //   element: '.readtutorial a',
      //   intro: 'Click this orange button to view the tutorial article in a new tab.',
      //   position: 'right'
      // },
      // {
      //   element: '.nav-menu',
      //   intro: "Each demo will link to the previous & next entries.",
      //   position: 'bottom'
      // }
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

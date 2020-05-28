$('#menuList a').on('click', function (e) {
  e.preventDefault()
  $(this).tab('show')
})



var introguide = introJs();

introguide.onchange(function(targetElement) {
  console.log(targetElement);
  if(targetElement.id != "start-the-tutorial")
    targetElement.click();
});


introguide.setOptions({
  'showButtons': false,
  steps: [
      {
        element: '.btn-start',
        intro: 'We will guide you around our website for a full immersive experience. <br><br>Use the arrow keys for navigation or hit ESC to exit.',
        position: 'bottom'
      },
      {
        element: '#explore-btn',
        intro: 'In this tab you can see which are the popular courses over the years.',
        position: 'bottom'
      },
      {
        element: '#dropdownMenuButton',
        intro: 'Select the sections that you want to show on the bubble graph.',
        position: 'bottom'
      },
      {
        element: '#checkbox-tutorial',
        intro: 'Check/Uncheck to show/hide a section from the graph.',
        position: 'bottom'
      },
      {
        element: '#slide-tutorial',
        intro: 'Slide to navigate over different years.',
        position: 'bottom'
      },
      {
        element: '#statistic-tutorial-bubble',
        intro: 'Here you can see some statistics.',
        position: 'bottom'
      },


      {
        element: '#network-btn',
        intro: 'In this tab you can explore suggested courses for a specific student.',
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

  $('#start-the-tutorial').on('click', function (e) {
    introguide.start();
  })


q = d3.queue();

// Keeping track of which courses have been locked
locked_courses = []
saved_student_name = ""

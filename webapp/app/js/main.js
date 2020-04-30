$('#menuList a').on('click', function (e) {
    e.preventDefault()
    $(this).tab('show')
  })

q = d3.queue();
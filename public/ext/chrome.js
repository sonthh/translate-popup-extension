
$(document).ready(() => {
  $('p').prepend("<span class='vocabulary'>Hello world</span>");

  $('p').live(() => {
    $(this).prepend("<span class='vocabulary'>Hello world</span>");
  });
});
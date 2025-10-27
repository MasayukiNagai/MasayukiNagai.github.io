/*
* Greedy Navigation
*
* http://codepen.io/lukejacksonn/pen/PwmwWV
*
*/

var $nav = $('#site-nav');
var $btn = $('#site-nav button');
var $vlinks = $('#site-nav .visible-links');
var $vlinks_persist_tail = $vlinks.children("*.persist.tail");
var $hlinks = $('#site-nav .hidden-links');

var totalMenuWidth = 0;

function getVisibleLinksWidth() {
  var totalWidth = 0;

  $vlinks.children().each(function () {
    totalWidth += $(this).outerWidth(true);
  });

  return totalWidth;
}

function setToggleState() {
  var hiddenCount = $hlinks.children().length;

  $btn.attr('count', hiddenCount);

  if (hiddenCount === 0) {
    $btn.addClass('hidden').removeClass('close');
    $hlinks.addClass('hidden');
    $nav.removeClass('is-collapsed');
  } else {
    $btn.removeClass('hidden');
  }
}

function collapseNav() {
  if ($nav.hasClass('is-collapsed')) {
    return;
  }

  var $nonPersistItems = $vlinks.children(':not(.persist)');

  if ($nonPersistItems.length === 0) {
    return;
  }

  $nonPersistItems.appendTo($hlinks);
  $nav.addClass('is-collapsed');
  $hlinks.addClass('hidden');
  setToggleState();
}

function expandNav() {
  if (!$nav.hasClass('is-collapsed')) {
    return;
  }

  var $itemsToRestore = $hlinks.children();

  if ($itemsToRestore.length) {
    if ($vlinks_persist_tail.length) {
      $itemsToRestore.insertBefore($vlinks_persist_tail);
    } else {
      $itemsToRestore.appendTo($vlinks);
    }
  }

  $nav.removeClass('is-collapsed');
  $hlinks.addClass('hidden');
  $btn.addClass('hidden').removeClass('close');
  totalMenuWidth = getVisibleLinksWidth();
  setToggleState();
}

function updateNav() {
  var navWidth = $nav.width();
  var toggleAllowance = $btn.outerWidth(true) + 30;
  var availableSpace = $btn.hasClass('hidden') ? navWidth : navWidth - toggleAllowance;

  if (!$nav.hasClass('is-collapsed')) {
    totalMenuWidth = getVisibleLinksWidth();

    if (totalMenuWidth > availableSpace) {
      collapseNav();
      navWidth = $nav.width();
      availableSpace = navWidth - toggleAllowance;
    }
  } else if (navWidth - toggleAllowance >= totalMenuWidth) {
    expandNav();
    navWidth = $nav.width();
    availableSpace = $btn.hasClass('hidden') ? navWidth : navWidth - toggleAllowance;
  }

  setToggleState();

  // update masthead height and the body/sidebar top padding
  var mastheadHeight = $('.masthead').height();
  $('body').css('padding-top', mastheadHeight + 'px');
  if ($(".author__urls-wrapper button").is(":visible")) {
    $(".sidebar").css("padding-top", "");
  } else {
    $(".sidebar").css("padding-top", mastheadHeight + "px");
  }

}

// Window listeners

$(window).on('resize', function () {
  updateNav();
});
screen.orientation.addEventListener("change", function () {
  updateNav();
});

$btn.on('click', function () {
  $hlinks.toggleClass('hidden');
  $(this).toggleClass('close');
});

updateNav();

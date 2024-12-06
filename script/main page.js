var resizeTimer;
window.addEventListener('resize', function() {
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(function() {
    if (window.innerWidth < 800) {
      window.location.href = 'main_mobile.html'; 
    }
  }, 5); 
});


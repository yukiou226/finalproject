$(document).ready(() => {
    // Form validation for posting recipe
    $('#postRecipeForm').on('submit', function (e) {
      const title = $('#recipeTitle').val().trim();
      const content = $('#recipeContent').val().trim();
  
      if (!title || !content) {
        alert('Title and content are required.');
        e.preventDefault();
      }
    });
  
    // AJAX login
    $('#loginForm').on('submit', function (e) {
      e.preventDefault();
      $.ajax({
        method: 'POST',
        url: '/users/login',
        data: $(this).serialize(),
        success: function (res) {
          window.location.href = '/dashboard';
        },
        error: function (err) {
          alert('Login failed. Check credentials.');
        }
      });
    });
  });
  
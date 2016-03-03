$(document).ready(function() {
    $('.workout-edit').click(function(e)){
        e.preventDefault();
        var csrftoken=getCookie('csrftoken');
        $.ajax({
            url : window.location.href,
            type : 'POST',
            data : {
                name : name,
            },
            success : function() {console.log('Success!')},
            error : function() {console.log('Fail!')}
        
        });
    };

    $('.workout_delete').click(function(e)){
        e.preventDefault();
        var pk = $(this).attr('id');
        if (confirm('Delete this workout?')==true){
            $.ajax({
                url : "delete/",
                type : "DELETE",
                data : {},
            });
        
        success : function() { console.log('Success!')};
        error : function() { console.log ('Fail!')};
        } 
        else {
            return false;
        }
    };
    
    //For getting CSRF token
    function getCookie(name) {
          var cookieValue = null;
          if (document.cookie && document.cookie != '') {
                var cookies = document.cookie.split(';');
          for (var i = 0; i < cookies.length; i++) {
               var cookie = jQuery.trim(cookies[i]);
          // Does this cookie string begin with the name we want?
          if (cookie.substring(0, name.length + 1) == (name + '=')) {
            cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
              break;
             }
          }
      }
    return cookieValue;
    }
});

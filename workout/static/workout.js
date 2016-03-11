$(document).ready(function() {
    $('.workout-edit').click(function(){
        $(this).closest('tr').next().show();
    });
    $('.cancel-edit').click(function(){
        $(this).closest('tr').hide();
    });   
    
    $('form').submit(function(e){
        e.preventDefault();
        var form = $(this);
        var csrftoken=getCookie('csrftoken');
        $.ajax({
            beforeSend: function(xhr) {
                xhr.setRequestHeader("X-CSRFToken", csrftoken); },
            url :  'edit/',
            type : 'POST', 
            cache: 'false',      
            data : form.serialize(),
            success : function() {console.log(form.serialize())},
            error : function() {console.log(form.serialize())}
        
        });
        return false;
    });

    $('.workout-delete').click(function(e){
        e.preventDefault();
        var csrftoken=getCookie('csrftoken');
        var pk = $(this).attr('id');
        if (confirm('Delete this workout?')==true){
            $.ajax({
                beforeSend: function(xhr) {
                        xhr.setRequestHeader("X-CSRFToken", csrftoken); },
                url :"delete/" + pk,
                type : "DELETE",        
                success : function() { console.log('Success!')},
                error : function() { console.log ('Fail!')},
            });
            $(this).closest('tr').hide();
        } 
        else {
            return false;
        }
    });
    
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

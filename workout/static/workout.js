$(document).ready(function() {
    
    $('#header-back').click(function(){
        window.location.href = $(self).attr('href')    
    });

    // Animate date fly-in
     $('.header-date').each(function(index){
        // Set variable to reference self
        var self = this 
        // Animate each date header individually with slight delay
        setTimeout(function(){    
            // Animate from top of window to center
            $(self).delay(300).animate({'margin': '0 1% 0 -2%'}, 300)
                .animate({'margin':'0 0 0 1%'}, 100);
        }, index*300);
    });   
    
    // Create and animate date circles
    $('.date-circle').each(function(index){
        // Get number of workouts per date
        var amount = parseInt($(this).attr('workouts'));
        // Set variable to reference self
        var self = this 
        // Size and animate each circle individually
        // with slight delay
        setTimeout(function(){    
            // Size circle depending on number of workouts
            if (amount > 200) {
                $(self).width(amount).height(amount).css('line-height', amount+'px');
            } else if ((amount > 10) && (amount <= 200)) {
                amount = (amount*5)+100;
                $(self).width(amount).height(amount).css('line-height',amount+'px');
            }  else if (amount < 10 ) {
                amount = (amount*25)+100;
                $(self).width(amount).height(amount).css('line-height',amount+'px');
            }
            // Animate from top of window to center
            $(self).delay(1200).animate({'margin': '15% auto 2% auto'}, 300)
                .animate({'margin':'2% auto 2% auto'}, 100);       
        }, index*300);   
    });
    
    // Animate and send to url on date circle click
    $('.date-circle').click(function(event){
        // Halt immediate url change
        event.preventDefault();
        // Set variable to reference self
        var self = this;
        // Single out clicked circle by changing class
        $(self).addClass('date-circle-active').removeClass('date-circle');
        // Animate down remaining circles off screen
        $('.date-circle').animate({
            'margin':'1000px auto -1000px auto',
            'opactiy': '0'
            }, 300, function(){
                // Animate up clicked circle off screen
                $(self).animate({
                    'margin':'-1000px auto 1000px auto',
                    'opacity':'0'
                }, 300, function(){
                    // Redirect to url of clicked circle 
                    window.location.href = $(self).attr('href')
                });       
        });
    });
    
    $('.workout-edit').click(function(){
        $(this).closest('tr').next().fadeIn('slow');
    });
    $('.cancel-edit').click(function(){
        $(this).closest('tr').fadeOut('slow');
    });   
    
    $('busta').submit(function(){
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
            $(this).closest('tr').fadeOut();
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

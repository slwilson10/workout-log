$(document).ready(function() { 

    // FadeIn/Out workouts overlay on hover
    $('.date-circle').hover(function(){
        $(this).find('.date-circle-workouts').fadeIn();
    },function(){
        $(this).find('.date-circle-workouts').fadeOut();
    });

    //Animate date fly-in, the lazy way
    $('#header').delay(600).animate({'width':'98%'},300);

    // Animate date fly-in, the hard way
   /*  $('.header-date').each(function(index){
        // Set variable to reference self
        var self = this 
        // Animate each date header individually with slight delay
        setTimeout(function(){    
            // Animate from top of window to center
            $(self).delay(300).animate({'margin': '0 1% 0 -2%'}, 300)
                .animate({'margin':'0 0 0 1%'}, 100);
        }, index*300);
    });*/   
    
    // Create and animate date circles
    $('.date-circle').each(function(index){
        // Get number of workouts per date
        var nmbrOfWorkouts = parseInt($(this).attr('workouts'));
        // Get Number of circles
        var nmbrOfCircles = $('.date-circle').length;
        // If there are more than 6 circles then expand container
        if (nmbrOfCircles > 6 ){
            $('#container').css('width','100%');
        }
        // Get width of container
        var containerWidth = $('#container').width();
        var circleWidth = Math.round(containerWidth / 6);
        var circleDem = Math.round(nmbrOfWorkouts * 2) + circleWidth;
        var fontSize = (circleDem/2.5);
        // Set variable to reference self
        var self = this 
        // Size and animate each circle individually
        // with slight delay
        setTimeout(function(){    
            // Size circle depending on number of workouts
            $(self).width(circleDem).height(circleDem);
            $(self).find('.date-circle-date').css('font-size', fontSize+'px'); 
            $(self).find('.date-circle-workouts-text').css('font-size', (fontSize / 2)+'px');

            // Animate from top of window to center
            $(self).delay(1200).animate({'margin': '15% auto 2% auto'}, 300)
                .animate({'margin':'2% auto 2% auto'}, 100);       
        }, index*300);   
    });
    
    // Animate and send back on back button click 
    $('#header-back').click(function(){
        // Set variable to reference self
        var self = this;
        // Check if circles exist
        if ($('.date-circle').length){
            // Animate circles down off screen
            $('.date-circle').animate({
                'margin':'1000px auto -1000px auto',
                'opactiy': '0'
                }, 300, function(){
                    // Redirect to url of clicked circle 
                    window.location.href = $(self).attr('href');
                });
        } else { window.location.href = $(self).attr('href'); }
    });

    // Animate and send to url on date circle click
    $('.date-circle').click(function(){
        // Set variable to reference self
        var self = this;
        // Single out clicked circle by changing class
        $(self).addClass('date-circle-active').removeClass('date-circle');
        if ($('.date-circle').length == 0){
            window.location.href = $(self).attr('href');
        } else {
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
                    window.location.href = $(self).attr('href');
                });       
        });
        }
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

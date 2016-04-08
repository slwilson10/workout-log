$(document).ready(function() {
    
    // Create and animate date circles
    $('.date-circle').each(function(index){
        var amount = parseInt($(this).attr('workouts'));
        var pos = $(window).height()/2-$(this).outerHeight()/2
        var self = this 
        setTimeout(function(){    
            
            if (amount > 200) {
                $(self).width(amount).height(amount).css('line-height', amount+'px');
            
            } else if ((amount > 10) && (amount <= 200)) {
                amount = (amount*5)+100;
                $(self).width(amount).height(amount).css('line-height',amount+'px');
            
            }  else if (amount < 10 ) {
                amount = (amount*25)+100;
                $(self).width(amount).height(amount).css('line-height',amount+'px');
            }
             
            $(self).delay(300).animate({'margin': '15% auto 2% auto'}, 300)
                .animate({'margin':'2% auto 2% auto'}, 100);       
    
        }, index*300);   
    
    });
    
    // Animate and send to url on date circle click
    $('.date-circle').click(function(event){
        event.preventDefault();
        var self = this;
        $(self).addClass('date-circle-active').removeClass('date-circle');
        $('.date-circle').animate({
            'margin':'1000px auto -1000px auto',
            'opactiy': '0'
            }, 300, function(){
                $(self).animate({
                    'margin':'-1000px auto 1000px auto',
                    'opacity':'0'
                }, 300, function(){
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

    // CHART STUFF
    var ctx = $('#chart').get(0).getContext('2d');
    
    var data = {
        labels:['Jan','Feb','Mar','Apr','May','Jun','Jul'],
        datasets:[
            {
                label: "Calories Burned",
                fillColor: "rgba(220,220,220,0.5)",
                strokeColor: "rgba(220,220,220,0.8)",
                highlightFill: "rgba(220,220,220,0.75)",
                highlightStroke: "rgba(220,220,220,1)",
                data: [65, 59, 80, 81, 56, 55, 40]
            }
        ]          
    };
    
    var workoutChart = new Chart(ctx).Bar(data); 
    

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

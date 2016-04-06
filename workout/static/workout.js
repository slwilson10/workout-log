$(document).ready(function() {
    
    $('.date-circle').each(function(){
        var amount = parseInt($(this).attr('workouts'));
        console.log(amount+150);
        if (amount > 200) {
            $(this).width(amount).height(amount).css('line-height', amount+'px');
                    
        } else if ((amount > 10) && (amount <= 200)) {
            amount = (amount*5)+100;
            $(this).width(amount).height(amount).css('line-height',amount+'px');
        
        }  else if (amount < 10 ) {
            amount = (amount*25)+100;
            $(this).width(amount).height(amount).css('line-height',amount+'px');   
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

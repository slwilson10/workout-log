$(document).ready(function() {
    
     function ajaxCall(past_date_div){
        if(past_date_div == null){
            var past_date = new Date()
            var day = past_date.getDate()-7;
            var past_date_str = $('#date-past-str').attr('date');
        }else{
            var past_date = new Date(past_date_div);
            var day = past_date.getDate();
            var past_date_str = past_date_div;
        }
        var month = past_date.getMonth()+1;
        var year = past_date.getFullYear(); 
        var url = year+'/'+month+'/'+day+'/'
        $.ajax({
            url :  url,
            success : function(data){
                $('#date-past').html(past_date_str);
                $('#workout-list').html(data);
                drawChart();
            },
            error : function() {console.log('Fail!')}    
        });
    };
    
    ajaxCall();
    
    // Create and populate chart
    google.charts.load('current', {packages: ['corechart', 'bar']});
    google.charts.setOnLoadCallback(drawChart);
    function drawChart() {
        var data = new google.visualization.DataTable();
        data.addColumn('string', 'Date');
        data.addColumn('number', 'Calories');
        var workouts = $('.workout');
        var workoutList = [];
        
        function getDateString(date){
            var dateString = date[0]
            if (workouts.length >= 9){
                dateString = date[1]+' '+date[2];}
            return dateString
        };
            
        function getHTextLength(){
            var hTextLength = 2;
            if(workouts.length < 9){ 
                hTextLength = 1;
            }else if (workouts.length > 9 && workouts.length < 32){
                hTextLength = 2;
            }else{
                hTextLength = 10;
            }
            
            return hTextLength
        };
        
        workouts.each(function(){
            var self = $(this);
            var date = self.attr('date');
            date = new Date(date).toString().split(' ');
            
            var dateString = getDateString(date);

            workout = [dateString,parseInt(self.attr('cal'))];
            workoutList.push(workout); 
        });
        
        workoutList.reverse();
        data.addRows(workoutList);
        
        var hTextLength = getHTextLength();
        
        var options = {
            width: '100vw',
            height: 450,
            chartArea: {width: '90%',height:'85%'}, 
            hAxis:{
                showTextEvery: hTextLength,                
            },
            bar:{
            
            },
            annotations: {
                alwaysOutside: true,
                textStyle: {
                    fontSize: 14,
                    color: '#000',
                    auraColor: 'none'
                }
            },
            legend: {position: 'none'}
        };


        var chart = new google.visualization.ColumnChart(document.getElementById('workout-chart'));
        chart.draw(data, options);
    }

    $('.date-button').click(function(){
        var past_date_div= $(this).attr('date');
        ajaxCall(past_date_div);
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

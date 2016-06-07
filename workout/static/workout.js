$(document).ready(function() {
 
    // Create and populate chart
    google.charts.load('current', {packages: ['corechart', 'bar']});
    google.charts.setOnLoadCallback(drawChart);

    function drawChart() {
        var data = new google.visualization.DataTable();
        data.addColumn('date', 'Date');
        data.addColumn('number', 'Calories');
        var workouts = $('.workout');
        var workoutList = [];
        if(workouts.length < 9){var stamp = 'EEE';
        }else{var stamp = 'MMM d';}
        workouts.each(function(){
            var self = $(this);
            var date = self.attr('date');
            date = new Date(date);  
            workout = [date,parseInt(self.attr('cal'))];
            workoutList.push(workout); 
        });
        workoutList.reverse();
        data.addRows(workoutList);

        var options = {
            width: '100vw',
            height: 450,
            chartArea: {width: '90%',height:'85%'}, 
            hAxis:{
                format: stamp
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
        var past_date = $(this).attr('date');
        date_str = past_date.split(' ');
        var month = date_str[1];
        var day = date_str[2];
        var year = date_str[0]; 
        $.ajax({
            url :  year+'/'+month+'/'+day+'/',
            success : function(data){
                console.log('Success!');
                $('#workout-list').html(data);
                drawChart();
            },
            error : function() {console.log('Fail!')}    
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

$(document).ready(function() {
    
        
     function ajaxCall(past_date_div, type){
        console.log(past_date_div);
        console.log(type);
        
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
            url : url,
            success : function(data){
                var data_text = $('#chart-data').html(data);
                var total_workouts = data_text.find('#total-workouts').text();
                var total_calories = data_text.find('#total-calories').text();
                var total_duration = data_text.find('#total-duration').text();
                $('#total-workouts-str').text(total_workouts);
                $('#total-calories-str').text(total_calories);               
                $('#total-duration-str').text(total_duration);
                $('#date-past').html(past_date_str);
                $('#workout-list').html(data);
                drawChart(type);
            },
            error : function() {console.log('Fail!')}    
        });
    };
    
    ajaxCall();
    
    // Create and populate chart
    google.charts.load('current', {packages: ['corechart', 'bar']});
    google.charts.setOnLoadCallback(drawChart);
    function drawChart(type) {
        var data = new google.visualization.DataTable();
        
        data.addColumn('string', 'Date');
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


        if(type == 'heartrate'){
            data.addColumn('number', 'Heartrate');
        }else if (type == 'duration'){
            data.addColumn('number', 'Duration')
        }
        else{
            data.addColumn('number', 'Calories');
        }

        workouts.each(function(){
            var self = $(this);
            var date = self.attr('date');
            var duration = self.attr('duration');
            date = new Date(date).toString().split(' ');
            duration = duration.toString().split(':');
            duration = parseInt(duration[0]*3600)+parseInt(duration[1]*60+parseInt(duration[2])); 
            var dateString = getDateString(date);
            
            if(type== 'heartrate'){
                workout = [dateString,parseInt(self.attr('heartrate'))]
            }else if (type == 'duration'){
                workout = [dateString,duration]
            }else{workout = [dateString,parseInt(self.attr('cal'))]}
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

    $('.chart-date-button').click(function(){
        $('.chart-date-button').removeClass('chart-date-button-active');
        $(this).addClass('chart-date-button-active');
        var past_date_div= $(this).attr('date');
        var stat = $('.chart-stat-button-active').attr('stat');
        ajaxCall(past_date_div, stat);
        return false;
    });

    $('.chart-stat-button').click(function(){
        $('.chart-stat-button').removeClass('chart-stat-button-active');
        $(this).addClass('chart-stat-button-active');
        var stat = $(this).attr('stat');
        var past_date_div = $('.chart-date-button-active').attr('date');
        ajaxCall(past_date_div, stat);
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

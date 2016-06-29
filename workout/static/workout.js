$(document).ready(function() {
     
     function chartAjaxCall(past_date_div, type){
        if(past_date_div == null){
            var past_date = new Date()
            var day = past_date.getDate()-7;
            var past_date_str = $('#date-past-str').attr('date');
        }else{
            var past_date = new Date(past_date_div);
            var day = past_date.getDate();
            var past_date_str = past_date_div;
        }
        if(type == null){
            type = 'calories';
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
                drawChart(type);
            },
            error : function() {console.log('Fail!')}    
        });
    };

    function listAjaxCall(list_year, list_month){
        var list_date = new Date()
        var year = list_date.getFullYear();
        var month = list_date.getMonth()+1;
        var monthStr = list_date.toString().split(' ')[1];
 
        var url = year+'/'+month+'/'
        $.ajax({
            url : url,
            success : function(data){
                var data_text = $('#list-data').html(data);
                var listYear = data_text.find('#list-date').attr('year');
                var listMonth= data_text.find('#list-date').attr('month');
                $('#list-year').text(year);
                $('#list-month').text(monthStr);
            },
            error : function() {console.log('Fail!')}    
        });
    };

    chartAjaxCall();
    listAjaxCall();

    function getTooltip(date, name, calories, heartrate, duration){
        return '<style>#tooltip div div {display:inline-block;font-size:1.5em;}</style>'+
                '<div id="tooltip" style="padding:10px;overflow:hidden;">'+
                    '<div style="width:100%;margin-bottom:5%;">'+
                        '<div style="margin-right:20px;">'+ name +'</div>'+
                        '<div>'+ date +'</div>'+
                    '</div>'+
                    '<ul>'+
                        '<li>'+ calories +' calories</li>'+
                        '<li>'+ heartrate +' heartrate</li>'+
                        '<li>'+ duration +' duration</li>'+
                    '</ul>'+
                '</div>';
    };
    
    // Create and populate chart
    google.charts.load('current', {packages: ['corechart']});
    google.charts.setOnLoadCallback(drawChart);
    function drawChart(type) {
        var data = new google.visualization.DataTable();
        var workouts = $('.chart-workout');
        var workoutList = [];
        
        data.addColumn('string', 'Date');
        
        
        function getFullDateString(date){
            return date[1]+' '+date[2]+', '+date[3];
        };

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
            var barColor = 'yellow';
            data.addColumn('number', 'Heartrate');
        }else if (type == 'duration'){
            var barColor = 'blue'
            data.addColumn('number', 'Duration')
        }
        else{
            var barColor = 'red'
            data.addColumn('number', 'Calories');
        }

        workouts.each(function(){
            var self = $(this);
            var name = self.attr('name').toString();
            var date_str = self.attr('date'); 
            date = new Date(date_str).toString().split(' ');
            var dateFull = getFullDateString(date);
            var dateString = getDateString(date);
            var heartrate = parseInt(self.attr('heartrate'));
            var duration_str = self.attr('duration');
            duration = duration_str.toString().split(':');
            duration = parseInt(duration[0]*3600)+parseInt(duration[1]*60+parseInt(duration[2])); 
            var calories = parseInt(self.attr('cal'));
            
            var tooltipHtml = getTooltip(dateFull, name, calories, heartrate, duration_str);
            
            if(type== 'heartrate'){
                workout = [dateString, heartrate, tooltipHtml]
            }else if (type == 'duration'){
                workout = [dateString, duration, tooltipHtml]
            }else{workout = [dateString, calories, tooltipHtml]}
            workoutList.push(workout); 
        });
        
        workoutList.reverse();
       
        data.addColumn({'type': 'string', 'role': 'tooltip', 'p': {'html': true}}); 
        data.addRows(workoutList);
        
        var hTextLength = getHTextLength();
        
        var options = {
            width: '100vw',
            height: 450,
            chartArea: {width: '90%',height:'85%'}, 
            hAxis:{
                showTextEvery: hTextLength,                
            },
            colors:[barColor],
            tooltip: { isHtml: true },
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
        chartAjaxCall(past_date_div, stat);
        return false;
    });

    $('.chart-stat-button').click(function(){
        $('.chart-stat-button').removeClass('chart-stat-button-active');
        $(this).addClass('chart-stat-button-active');
        var stat = $(this).attr('stat');
        var past_date_div = $('.chart-date-button-active').attr('date');
        chartAjaxCall(past_date_div, stat);
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

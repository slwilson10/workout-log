$(document).ready(function() {
    
    function setDateValues(startDate, endDate){
        $('#date-form').find('input[name="start-date"]').val(startDate);
        $('#date-form').find('input[name="end-date"]').val(endDate);
        $('#date-range-start').text(startDate);
        $('#date-range-end').text(endDate);       
    }

    function setDateButtonValues(){
        $('.date-button').each(function(){
            if($(this).text() == 'month'){
                startDate = moment().subtract(1, 'month').format('YYYY-MM-DD');
                $(this).attr('start-date', startDate)
            }else if($(this).text() == 'year'){
                startDate = moment().subtract(1, 'year').format('YYYY-MM-DD');
                $(this).attr('start-date', startDate)
            } else {
                startDate = moment().subtract(7, 'days').format('YYYY-MM-DD');
                $(this).attr('start-date', startDate)
            }
        });    
    }

    function setDefaults(){
        var endDate = moment().format('YYYY-MM-DD');
        var startDate = moment().subtract(7, 'days').format('YYYY-MM-DD'); 
        var field = $('.field-button-active').attr('field');
        setDateValues(startDate, endDate);
        setDateButtonValues();
        listAjaxCall(startDate, endDate);
        chartAjaxCall(startDate, endDate, field);
    }
    
    setDefaults();

    function listAjaxCall(startDate, endDate){
        $.ajax({
            type: 'GET',
            url: 'list/' + startDate + '/' + endDate + '/',
            success: function(data){
                var history = $(data).filter('#history');
                var totals = $(data).filter('#totals-list');
                $('#totals').html(totals);
                $('#history-list').html(history);
            },
            error: function(){ console.log('LIST FAIL')}
        });
    }

    function chartAjaxCall(startDate, endDate, field){
        $.ajax({
            type: 'GET',
            dataType: 'json',
            async: false,
            url: 'chart/' + startDate + '/' + endDate + '/',
            success: function(data){
                drawChart(data, field);
            },
            error: function(){ console.log('CHART FAIL')}
        });
    }

    $('#date-form').submit(function(event){ 
        event.preventDefault();
        var startDate = $(this).find('input[name="start-date"]').val();
        var endDate = $(this).find('input[name="end-date"]').val();
        var field = $('.field-button-active').attr('field');
        setDateValues(startDate, endDate);
        listAjaxCall(startDate, endDate);
        chartAjaxCall(startDate, endDate, field);
    });

    $('.date-button').click(function(){
        var startDate = $(this).attr('start-date');
        var endDate = moment().format('YYYY-MM-DD');
        var field = $('.field-button-active').attr('field');
        $('.date-button').removeClass('date-button-active');
        $(this).addClass('date-button-active');
        listAjaxCall(startDate, endDate);
        chartAjaxCall(startDate, endDate, field);
        setDateValues(startDate, endDate);
    });

    $('.field-button').click(function(){
        var startDate = $('#date-range-start').text();
        var endDate = $('#date-range-end').text();
        var field = $(this).attr('field');
        $('.field-button').removeClass('field-button-active');
        $(this).addClass('field-button-active');
        chartAjaxCall(startDate, endDate, field);
    });
    
    // Create and populate chart
    google.charts.load('current', {packages: ['corechart']});
    google.charts.setOnLoadCallback(setDefaults);
    function drawChart(workouts, field) {
         
        if(field == 'heartrate'){
            var barColor = 'yellow';
        }else if (field == 'duration'){
            var barColor = 'blue';
        }else{
            var barColor = 'red';
        }        


        function getTooltip(date, name, calories, heartrate,
                            hours, minutes, seconds){
            return '<style>#tooltip div div {display:inline-block;font-size:1.5em;}</style>'+
                '<div id="tooltip" style="padding:10px;overflow:hidden;">'+
                    '<div style="width:100%;margin-bottom:5%;">'+
                        '<div style="margin-right:20px;">'+ name +'</div>'+
                        '<div>'+ date +'</div>'+
                    '</div>'+
                    '<ul>'+
                        '<li>'+ calories +' calories</li>'+
                        '<li>'+ heartrate +' heartrate</li>'+
                        '<li>'+ hours+'h/'+ minutes+ 'm/'+ seconds + 's</li>'+
                    '</ul>'+
                '</div>';
        }

        var workoutsArray = []; 
        $.each(workouts, function(){
            var date = new Date(this['date']);
            date = date.getFullYear()+'-'+ (date.getMonth()+1)+'-'+ date.getDate();
            if(field == 'duration'){
                var number = parseInt(this['hours']*3600)+
                            parseInt(this['minutes']*60+
                            parseInt(this['seconds']));
            }else{ var number = this[field];}
            var tooltip = getTooltip(date, this['name'], this['calories'], 
                                    this['heartrate'], this['hours'], 
                                    this['minutes'], this['seconds'])
            workoutsArray.push([date, number, tooltip]);
        });
        workoutsArray.reverse();
         
        var data = new google.visualization.DataTable();
        data.addColumn('string', 'Date');
        data.addColumn('number', 'Number');
        data.addColumn({'type': 'string', 'role': 'tooltip', 'p': {'html': true}});
        data.addRows(workoutsArray);

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
        }

        var options = {
            width: '100vw',
            height: 450,
            chartArea: {width: '90%',height:'85%'},
            hAxis:{
                showTextEvery: getHTextLength(),
            },
            colors:[barColor],
            tooltip: { isHtml: true },
            legend: {position: 'none'}
        };

        var chart = new google.visualization.ColumnChart(document.getElementById('chart'));
        chart.draw(data, options);
    }

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

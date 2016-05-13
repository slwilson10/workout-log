$(document).ready(function() { 
    // Get size of window
    var windowHeight = $(window).height();
    var windowWidth = $(window).width(); 
    
    var timer;
    $('.date-circle').hover(function() {
        var self = $(this);
        timer = setTimeout(function(){
            $(self).find('.date-circle-workouts').fadeIn();    
        }, 400);
    }, function(){
         clearTimeout(timer);
        $(this).find('.date-circle-workouts').fadeOut();
      });

    //Animate date fly-in, the lazy way
    $('#header').delay(300).animate({'width':'98%'},300);
  
    $('.date-circle').each(function(){ 
        // Get number of workouts per date
        var nmbrOfWorkouts = parseInt($(this).parent().attr('workouts')); 
        // Set container width based on number of dates
        var containerWidth = Math.round(nmbrOfWorkouts * 4) + windowWidth/10;
        
        if(Math.abs(containerWidth) > 512) {containerWidth=512;}
        $(this).parent().css({'width': containerWidth, 'height': containerWidth});

        $(this).css({'line-height': containerWidth+'px'});
        
        $(this).find('.date-circle-date, .date-circle-workouts')
            .css('font-size', containerWidth/2.5+'px'); 
        
        $(this).delay(300).animate({
            width: containerWidth,
            height: containerWidth,
            opacity: 100    
        }, function(){
            $(this).find('.date-circle-date').fadeIn();
        }); 
    });
    
    // Size tables
    $('#workout-table-border').height(windowHeight / 2);
    // Animate workout table and chart
    var tables = $('#workout-table-border, #workout-chart-border');
    $(tables).slideUp(1).delay(300).slideDown("fast");
    
    // Animate and send back on back button click 
    $('#header-back').click(function(){
        // Set variable to reference self
        var self = this;
        // Animate header dates off screen
        $('.header-date').animate({
            'margin-top':'-10%',
        });

        // Check if circles/workout-table exist
        if ($('.date-circle, #workout-table-border').length){
            $('.date-circle-date').hide();
            // Animate circles/workout table down off screen
            $('.date-circle, #workout-table-border, #workout-chart-border'
                ).animate({
                    width: 0,
                    height: 0,
                    opacity: 0
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
        if ($('.date-circle').length) {
            $(self).find('.date-circle-workouts').fadeOut();
            $('.date-circle').find('.date-circle-date').hide();
            // Animate down remaining circles off screen
            $('.date-circle').animate({
                width: 0,
                height: 0,
                opacity:0
            }, 300, function(){
                $(self).find('.date-circle-date').delay(600).hide(0);
                // Animate up clicked circle off screen
                $(self).delay(600).animate({
                    width: 0,
                    height: 0,
                    opacity:0 
                }, 300, function(){
                    // Redirect to url of clicked circle 
                    window.location.href = $(self).attr('href');
                });       
        }); 
        } else { window.location.href = $(self).attr('href');}
    });
    
    // Animate workout form slide down when edit button clicked 
    $('.workout-edit').click(function(){
        var row = $(this).closest('tr').next();
        $(row).fadeIn('slow');
        $(row).children('td').slideUp(1).slideDown('slow');
    });

    // Animate workout form slide up when cancel button clicked
    $('.cancel-edit').click(function(){
        var row = $(this).closest('tr');
        $(row).fadeOut('slow');
        $(row).children('td').slideUp('slow');
    });

    // Create and populate chart
    google.charts.load('current', {packages: ['corechart', 'bar']});
    google.charts.setOnLoadCallback(drawAnnotations);

    function drawAnnotations() {
        var data = new google.visualization.DataTable();
        data.addColumn('timeofday', 'Time of Day');
        data.addColumn('number', 'Motivation Level');
        data.addColumn('number', 'Energy Level');

        data.addRows([
            [{v: [8, 0, 0], f: '8 am'}, 1, .25],
            [{v: [9, 0, 0], f: '9 am'}, 2, .5],
            [{v: [10, 0, 0], f:'10 am'}, 3, 1],
            [{v: [11, 0, 0], f: '11 am'}, 4, 2.25],
            [{v: [12, 0, 0], f: '12 pm'}, 5, 2.25],
            [{v: [13, 0, 0], f: '1 pm'}, 6, 3],
            [{v: [14, 0, 0], f: '2 pm'}, 7, 4],
            [{v: [15, 0, 0], f: '3 pm'}, 8, 5.25],
            [{v: [16, 0, 0], f: '4 pm'}, 9, 7.5],
            [{v: [17, 0, 0], f: '5 pm'}, 10, 10],
        ]);

    var options = {
        width: 1000,
        height: 300,
        chartArea: {width: '90%',height:'85%'},
        title: 'Motivation and Energy Level Throughout the Day',
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

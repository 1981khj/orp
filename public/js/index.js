(function($) {
    //for develop
    //var socket = io.connect('http://p9chat.hjkim.c9.io');
    
    //for deploy
    var socket = io.connect('http://orp.hjkim.c9.io');
    
    var canvas, ctx, color = null;    
    var oldPoint, newPoint = null;
    var index = null;
    var isDown = false;
    
    socket.on('line', function(data) {
        //data.width, data.color
        canvas = $("#slideset .slide").find("canvas").eq(data.index).get(0);        
        ctx = canvas.getContext("2d");
        ctx.lineWidth = 1;
        ctx.strokeStyle = "blue";
        ctx.beginPath();
        ctx.moveTo(data.x1, data.y1);
        ctx.lineTo(data.x2, data.y2);
        ctx.lineJoin = "round";
        ctx.stroke();
    });
    
    $("#slideset .slide").bind({
        mousedown: function(e){            
            isDown = true;
            index = $("#slideset .slide").index($(this)[0]);            
            oldPoint = new Point(event, this);
        },
        mouseup: function(e){
            isDown = false;
        },
        mousemove: function(e){
            if(isDown){
                newPoint = new Point(event, this);
                socket.emit('drawLine',{
                   //width: width,
                   //color: color,
                   index: index,
                   x1: oldPoint.x,
                   y1: oldPoint.y,
                   x2: newPoint.x,
                   y2: newPoint.y
                });

                oldPoint = newPoint;
            }
        }
    });
    
    /** Draw Image*/
    /*ctx.lineWidth = 1;
    ctx.strokeStyle = "blue";
    ctx.beginPath();
    ctx.moveTo(oldPoint.x, oldPoint.y);
    ctx.lineTo(newPoint.x, newPoint.y);
    ctx.stroke();*/
    
    function  Point(event, target){
        this.x = event.offsetX;        
        this.y = event.offsetY;        
    }
    
    //Slide Control
    var slideCount = 0;
    var slideArray = [];
    var currentSlide = 1;
    $(".slide").each(function () {    
    	slideCount++;
    	$(this).addClass("hidden");
    	slideArray[slideCount] = $(this);    	
    });
    
    socket.emit('join');
    
    socket.on('drawSlide', function(data) {        
        positionSlide(data.idx);
    });
    
    /**키 바인딩..*/
    $(document).keyup(function(e) {    			
    	var KeyID = (window.event) ? event.keyCode : e.keyCode;
        switch(KeyID) {
    		case 37:    //the left arrow key        					
    			prevSlide();
    			break;            				           				
    		case 39:    // the right arrow key
    		case 32:    //the space key        					
    			nextSlide();
    			break;
    		case 35:    // the end key
                lastSlide();    			
    			break;            				
    		case 36:    // the home key    			
                firstSlide();
    			break;
    		}
    		e.returnValue = false;
        	return false;
    });			
    		
    function positionSlide(slide) {
    	if (slide > 0 && slide <= slideCount) {
    		slideArray[currentSlide].hide();
    		currentSlide = slide;
    		slideArray[currentSlide].show();
    	}
    }
    		
    function nextSlide() {        
        socket.emit('setCurrentSlide',{idx:currentSlide + 1});
    }
    
    function prevSlide() {
        socket.emit('setCurrentSlide',{idx:currentSlide - 1});    	
    }
    
    function lastSlide() {
        socket.emit('setCurrentSlide',{idx:slideCount});
    }
    
    function firstSlide() {
        socket.emit('setCurrentSlide',{idx:1});
    }
    
})(jQuery);
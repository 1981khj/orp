(function($) {
    //for develop
    //var socket = io.connect('http://p9chat.hjkim.c9.io');
    
    //for deploy
    var socket = io.connect('http://orp.hjkim.c9.io');
    
    //var socket = io.connect('/');
    var canvas, ctx, color = null;    
    var oldPoint, newPoint = null;
    var index = null;
    var isDown = false;
    

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
                socket.emit('draw',{
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
    
    socket.on('line', function(data) {
        //data.width, data.color
        canvas = $("#slideset .slide").find("canvas").eq(data.index).get(0);        
        ctx = canvas.getContext("2d");
        ctx.lineWidth = 1;
        ctx.strokeStyle = "blue";
        ctx.beginPath();
        ctx.moveTo(data.x1, data.y1);
        ctx.lineTo(data.x2, data.y2);
        ctx.stroke();
	});
    
})(jQuery);
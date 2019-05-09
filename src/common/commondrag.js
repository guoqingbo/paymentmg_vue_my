let dragobj={
    dragModal(e,dome){
        let mouseOffsetX=0;
        let mouseOffsetY=0;
        let isDraging=false;
        var e=e||window.event;
        mouseOffsetX=e.pageX-dome.offsetLeft;
        mouseOffsetY=e.pageY-dome.offsetTop;
        isDraging=true
        document.onmousemove=function(e){
            var e=e||window.event;
            var mouseX=e.pageX
            var mouseY=e.pageY
            var moveX=0
            var moveY=0
            if(isDraging===true){
                moveX=mouseX-mouseOffsetX
                moveY=mouseY-mouseOffsetY

                var pageWidth=document.documentElement.clientWidth
                var pageHeight=document.documentElement.clientHeight
                var BoxWidth=dome.offsetWidth
                var BoxHeight=dome.offsetHeight
                var maxX=pageWidth-BoxWidth
                var maxY=pageHeight-BoxHeight
                moveX=Math.max(0,moveX)
                moveX=Math.min(maxX,moveX)
                moveY=Math.max(0,moveY)
                moveY=Math.max(maxY,moveY)
                

                dome.style.left=moveX+'px'
                dome.style.top=moveY+'px'
            }
        }
        document.onmouseup=function(){
            isDraging=false
        }
    }
  
}

export default dragobj
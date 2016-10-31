 function getStyleAttr(obj,attr){
            var Styat=null;
            if(obj.currentStyle){mStyleAttr=obj.currentStyle[attr];}
            else{Styat=window.getComputedStyle(obj,false)[attr];} 
      //    attr=='opacity' ? return(parseFloat(mStyleAttr)*100): return(parseInt(mStyleAttr));
          attr=='opacity' ? Styat=Math.round(parseFloat(Styat)*100) : Styat=parseInt(Styat); 
       //Styat可能出现小数round四舍五入
      //console.log(Styat);
            return Styat;
            //console.log(Styat);//return 之后的代码不执行
            //if(attr=='opacity')
            }
       function startmove(obj,json,fn){
            clearInterval(obj.timer);
              var iCur=0;
        //设置标志，假设所有运动到达目标值
       //   var mId=document.getElementById('div1');
            obj.timer=window.setInterval(function(){
                var flag=true; 
                  for(var attr in json){
                    iCur=getStyleAttr(obj,attr); //当前属性值
                        speed=(json[attr]-iCur)/8;
                        speed>0?speed=Math.ceil(speed):speed=Math.floor(speed);
                        if(iCur!=json[attr]){
                              flag=false;}
                      var result=speed+iCur;
                        if(attr=='opacity'){
                          obj.style.opacity=result/100;
                           obj.style.filter='alpha(opacity:'+result+')';
                              //obj.style.opacity=(speed+iCur)/100;
                              //obj.style.filter='alpha(opacity:'+speed+iCur+')';
                        }else{
                              //obj.style[attr]=speed+iCur+'px';
                              obj.style[attr]=result+'px';
                        }
                    }
                    if(flag){  
                        clearInterval(obj.timer);
                       if(fn)
                        {fn();
                           }    
                           }
            },30);
       }
    
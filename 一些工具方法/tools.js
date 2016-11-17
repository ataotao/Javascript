// function getElementsByClassName(oParent, sClass)
// {
//     var aTmp=oParent.getElementsByTagName('*');
//     var aResult=[];
//     var i=0;

//     for(i=0;i<aTmp.length;i++)
//     {
//         if(aTmp[i].className==sClass)
//         {
//             aResult.push(aTmp[i]);
//         }
//     }

//     return aResult;
// }
var Tools = (function(){
    var obj = {};

    obj.getElementsByClassName = function(oParent, sClass){
        var aTmp=oParent.getElementsByTagName('*');
        var aResult=[];
        var i=0;

        for(i=0;i<aTmp.length;i++)
        {
            if(aTmp[i].className==sClass)
            {
                aResult.push(aTmp[i]);
            }
        }

        return aResult;
    };

    return obj;
}());

console.log(Tools.getElementsByClassName(document, 'a'));

//模态框调用初始化(必须设置)
$scope.msAlertModalConfig = {};
$scope.alertmodelOk = function() {
    $scope.msAlertModalConfig.isOpen = false;
}
$scope.alertmodelClose = function() {
    //取消动作
}


//模态框调用
$scope.msAlertModalConfig = {
    contentText: '<p class="font16 text-center">不错的公司介绍能给买家信任</p><p class="text-center">嗖嗖建议4 - 140字会更好</p>',
    sureText: '好的，知道了', //确定按钮
    cancelConfig: false, //是否包含取消按钮
    backdrop:true,     //设置是否可点击背景关闭
    sizeConfig: 'sm',
    isOpen: true
}



/**************************
 * 模态窗模板设置 
 **************************/
app.directive('msAlertModal', ['$rootScope', function($rootScope) {
    return {
        restrict: 'AECM',
        transclude: true,
        replace: false,
        templateUrl: 'template/modelTemp/alertmodelTemplate.html',
        link: function(scope, element, attrs, modalController) {
            scope.msAlertModalConstant = {
                titleText: '嗖嗖提醒',
                cancelText: '取消', //取消按钮
                sureText: '确定', //确定按钮
                backgroundConfig: true //设置是否遮罩背景
            }

            scope.getText = function(key) {
                return scope.msAlertModalConfig[key + 'Text'] || scope.msAlertModalConstant[key + 'Text'];
            }

            scope.setConfig = function(key) {
                return scope.msAlertModalConfig[key + 'Config'] || scope.msAlertModalConstant[key + 'Config'];
            }

            //为模态框赋上时间戳ID
            var _modalId = attrs.id ? attrs.id : "_modal" + (Date.now());
            scope.modalid = _modalId;

            scope.alertmodelClose = function(type) {
                scope.msAlertModalConfig.isOpen = false;
            }

            //设置点击背景是否关闭 true为可关闭，false为不能点击背景关闭
            scope.msAlertModalConfig.backdrop = false;

            element.on('click', function(event) {
                if (scope.msAlertModalConfig.backdrop == true && event.target.className == "show modalTip modal fade in") {
                    scope.$apply(
                        function() {
                            scope.alertmodelClose();
                        });
                }
            });
        }
    }
}])



<div id="{{modalid}}" class="show ng-hide modalTip" ng-class="{modal:true,fade:true,in:true }" ng-show="msAlertModalConfig.isOpen">
    <div ng-class="{'modal-dialog':true,'modal-sm':(setConfig('size')=='sm'),'modal-lg':(setConfig('size')=='lg')}">
        <div class="modal-content">
            <div class="modal-header">
                <button type="button" class="close" data-dismiss="modal" ng-click="alertmodelClose()">×</button>
                <h4 class="modal-title" id="{{modalid}}Labal">{{getText('title')}}</h4>
            </div>
            <div class="modal-body clearfix">
                <span ng-bind-html="getText('content') | to_trusted"></span>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-blue" ng-class="{'btn-block':!setConfig('cancel')}" ng-click="alertmodelOk();">{{getText('sure')}}</button>
                <button type="button" class="btn btn-default" ng-click="alertmodelClose()" ng-if="setConfig('cancel')">{{getText('cancel')}}</button>
            </div>
        </div>
    </div>
</div>
<div ng-class="{'modal-backdrop':true,fade:true,in:true}" ng-show="(setConfig('background') && msAlertModalConfig.isOpen)"></div>


    <!--通用模态框-->
    <ms-alert-modal></ms-alert-modal>
    <!--通用模态框 end-->



.modal.fade.in{animation:myfirst 0.5s; -webkit-animation:myfirst 0.5s; animation-fill-mode: forwards;}
@-webkit-keyframes myfirst{
0%    {top:0;}
100%  {top:40px;}
}
@keyframes fadeIn {
0%    {top:0;}
100%  {top:40px;}
}
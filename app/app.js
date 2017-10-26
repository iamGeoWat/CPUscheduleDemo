var event = require('events');
var eventEmitter = new events.EventEmitter();

// Declare app level module which depends on views, and components
var app = angular.module('myApp', ['ngAnimate', 'ngMaterial']);

app.controller('myCtrl', function ($scope) {
  $scope.isHide = false;
});

function Pcb(pid) {
  var obj = {};
  obj.pid = pid;
  //obj.status = status;
  //obj.priority = priority;
  return obj;
}

app.controller('ctrlBar', function ($scope) {
  $scope.howmanyjobs = 0;
  $scope.jobs = [];
  $scope.jobInfoList = [];
  //此控制器的全局变量
  
  $scope.createAJob = function () {
    var maxpcbnumber = 20;
    var howmanypcbs = Math.ceil(Math.random()*maxpcbnumber); //一个job里有随机个pcb，生成这个数字
    var PCBs = new Array([howmanypcbs]); //生成这个job里的所有pcb数组
    var pcbInfoList = new Array([howmanypcbs]); //生成所有pcb文字化的数组
    
    
    var randArrSize = 10000;
    var randArr = new Array([randArrSize]);
    var PIDNum = new Array([howmanypcbs]);
    for (var i=0; i<randArrSize; i++){
      randArr[i] = i;
    }
    randArr.sort(function () {
      return Math.random()>0.5 ? -1 : 1;
    });
    for (var i=0; i<howmanypcbs; i++){
      PIDNum[i] = randArr[i];
    }
    for (var i = 0; i<howmanypcbs; i++) {
      PCBs[i] = new Pcb(PIDNum[i]);
    }
    //生成一个job中所有pcb，并且拥有随机的pid数字
    
    
    for (var i = 0; i<howmanypcbs; i++){
      pcbInfoList[i] = {indexText: i + 1 + ".", pid: PCBs[i].pid}
    }//将一个job中所有的pcb文字化，方便显示
    
    $scope.jobs[$scope.howmanyjobs] = PCBs; //将一个job存入
    $scope.jobInfoList[$scope.howmanyjobs] = {jobIndex: $scope.howmanyjobs++, pcbInfo:pcbInfoList}; //将一个文字化的job存入，job计数加1
  };
  
  $scope.createTenJobs = function () {
    for (var i=0; i<10; i++){
      $scope.createAJob();
    }
  }
});
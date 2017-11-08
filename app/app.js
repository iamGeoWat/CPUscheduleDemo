document.write("<script src='outerFuncs.js'></script>'");

// Declare app level module which depends on views, and components
var app = angular.module('myApp', ['ngAnimate', 'ngMaterial']);

app.controller('myCtrl', function ($scope) {
  $scope.emptyPCB = new Pcb("Empty", 0000, 1, 0, 0, " ");
  $scope.howmanyjobs = 0;
  
  $scope.jobSubmitted = [];
  $scope.jobSubmittedInfo = new MyArr();
  
  $scope.jobReserved = [];
  $scope.jobReservedInfo = new MyArr();
  $scope.terminatedList = [];
  $scope.degrees = [$scope.emptyPCB, $scope.emptyPCB, $scope.emptyPCB, $scope.emptyPCB, $scope.emptyPCB, $scope.emptyPCB];
  $scope.cpuInfo = $scope.emptyPCB;
  $scope.suspendProcess = [];
  //$scope.relaxDegree = new Pcb("Relax", 0000, 1, 0, 0, " ");
  $scope.degreeClass = ["normal", "normal", "normal", "normal", "normal", "normal"];
  $scope.btnClass = ["btn-normal", "btn-normal", "btn-normal", "btn-normal", "btn-normal", "btn-normal"];
  $scope.btnName = ["suspend", "suspend", "suspend", "suspend", "suspend", "suspend"];
  //此控制器的全局变量
  
  $scope.createAJob = function () {
    var maxpcbnumber = 20;
    var howmanypcbs = Math.ceil(Math.random()*maxpcbnumber); //一个job里有随机个pcb，生成这个数字
    var PCBs = new Array([howmanypcbs]); //生成这个job里的所有pcb数组
    var pcbInfoList = new Array([howmanypcbs]); //生成所有pcb文字化的数组
    var thisJobName = getRandName();
    
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
      var runningTime = Math.ceil(Math.random()*10);
      var priority = Math.ceil(Math.random()*10);
      PCBs[i] = new Pcb(thisJobName, PIDNum[i], 0, runningTime, priority);
    }
    //生成一个job中所有pcb，并且拥有随机的pid数字
    
    
    for (var i = 0; i<howmanypcbs; i++){
      pcbInfoList[i] = {indexText: i + 1, jobName: PCBs[i].pidName, pid: PCBs[i].pid, status: PCBs[i].status, time: PCBs[i].time, priority: PCBs[i].priority, strStatus: PCBs[i].getStatus(PCBs[i].status)}
    }//将一个job中所有的pcb文字化，方便显示
  
    $scope.jobSubmitted[$scope.howmanyjobs] = PCBs; //将一个job存入
    $scope.jobSubmittedInfo.push({jobIndex: $scope.howmanyjobs++, jobName: thisJobName, pcbInfo:pcbInfoList}); //将一个文字化的job存入，job计数加1
  };
  
  $scope.createTenJobs = function () {
    for (var i=0; i<10; i++){
      $scope.createAJob();
    }
  };
  
  $scope.toggleSuspend = function ($index) {
    if ($scope.degreeClass[$index] === "normal") {
      $scope.degreeClass[$index] = "suspend";
      $scope.btnName[$index] = "cancel";
      $scope.degrees[$index].status = 3;
      $scope.degrees[$index].strStatus = "Suspend";
      //$scope.suspendProcess.unshift($scope.degrees[$index]);
      //$scope.degrees[$index] = $scope.relaxDegree;
    }
    else {
      $scope.degreeClass[$index] = "normal";
      $scope.btnName[$index] = "suspend";
      $scope.degrees[$index].status = 1;
      $scope.degrees[$index].strStatus = "Ready";
      $scope.sortDegrees();
      //$scope.suspendProcess.unshift($scope.degrees[$index]);
    }
  };
  
  $scope.sortDegrees = function () {
    var toBeSort = [];
    angular.forEach($scope.degrees, function (data) {
      if (data.status !== 3) {
        toBeSort.unshift(data);
      }
    });
    toBeSort.sort(function (a, b) {
      return b.priority-a.priority;
    });
    for (var i=0; i<6; i++) {
      if ($scope.degrees[i].status !== 3) {
        $scope.degrees[i] = toBeSort.shift();
      }
    }
  };//sort process in Degress
  
  $scope.startProc = function () {
    
    setInterval(function () {
      if ($scope.jobSubmittedInfo.top() !== undefined) {
        $scope.jobReservedInfo.push($scope.jobSubmittedInfo.shift());
      } //提交的放到保留里
  
      
      
      if ($scope.cpuInfo.pid !== "Empty0") {
        $scope.cpuInfo.time = $scope.cpuInfo.time - 1;
      }
      if ($scope.cpuInfo.time === 0) {
        if ($scope.cpuInfo.pid !== "Empty0") {
          $scope.terminatedList.push($scope.cpuInfo);
        }
        $scope.cpuInfo = $scope.emptyPCB;
      }//a running cpu
    }, 1000); //检测提交的job，把提交的job放到保留中
    
    setInterval(function () {
      for (var i=0; i<6; i++) {
        if ($scope.jobReservedInfo.top() !== undefined && $scope.degrees[i].pid === "Empty0") {
          $scope.jobReservedInfo.top().pcbInfo[0].status = 1;
          $scope.jobReservedInfo.top().pcbInfo[0].strStatus = "Ready";
          $scope.degrees[i] = $scope.jobReservedInfo.top().pcbInfo.shift();
          $scope.sortDegrees();
          if ($scope.jobReservedInfo.top().pcbInfo[0] === undefined) {
            $scope.jobReservedInfo.shift();
          }
        }
      }
    }, 100); //job schedule@FCFS
    
    setInterval(function () {
      
      for (var i=0; i<6; i++) {
        if ($scope.cpuInfo.pid === "Empty0" && $scope.degrees[i].pid !== "Empty0" && $scope.degrees[i].status !== 3) {
          $scope.cpuInfo = $scope.degrees[i];
          $scope.cpuInfo.strStatus = "Running";
          $scope.cpuInfo.status = 2;
          $scope.degrees[i] = $scope.emptyPCB;
          $scope.sortDegrees();
        }//if cpu is empty, move highest prior process to CPU.
      }
      
      $scope.$digest();
    }, 10);
  }
});

//改一下array的存放方式，把方法写在外面，让数据存在一个纯粹的数组里。
//get rid of the "empty0" detection.
//throw a notification when a process in cpu finished and terminated.
document.write("<script src='outerFuncs.js'></script>'");

function loadCss( url ){
  var link = document.createElement( "link" );
  link.type = "text/css";
  link.rel = "stylesheet";
  link.href = url;
  document.getElementsByTagName( "head" )[0].appendChild( link );
}

function browserRedirect() {
  var sUserAgent = navigator.userAgent.toLowerCase();
  var bIsIpad = sUserAgent.match(/ipad/i) == "ipad";
  var bIsIphoneOs = sUserAgent.match(/iphone os/i) == "iphone os";
  var bIsMidp = sUserAgent.match(/midp/i) == "midp";
  var bIsUc7 = sUserAgent.match(/rv:1.2.3.4/i) == "rv:1.2.3.4";
  var bIsUc = sUserAgent.match(/ucweb/i) == "ucweb";
  var bIsAndroid = sUserAgent.match(/android/i) == "android";
  var bIsCE = sUserAgent.match(/windows ce/i) == "windows ce";
  var bIsWM = sUserAgent.match(/windows mobile/i) == "windows mobile";
  //document.writeln("您的浏览设备为：");
  if (bIsIpad || bIsIphoneOs || bIsMidp || bIsUc7 || bIsUc || bIsAndroid || bIsCE || bIsWM) {
    loadCss( "appmobile.css" );
    //document.writeln("phone");
  } else {
    loadCss( "app.css" );
    //document.writeln("pc");
  }
}
browserRedirect();
// Declare app level module which depends on views, and components



var app = angular.module('myApp', ['ngAnimate', 'ngMaterial']);

app.controller('myCtrl', function ($scope) {
  {
    $scope.emptyPCB = new Pcb("Empty", 0000, 1, 0, 0, " ", 0);
    $scope.howmanyjobs = 0;
    
    $scope.jobSubmitted = [];
    $scope.jobSubmittedInfo = new MyArr();
    
    $scope.jobReserved = [];
    $scope.jobReservedInfo = new MyArr();
    $scope.terminatedList = [];
    $scope.degrees = [$scope.emptyPCB, $scope.emptyPCB, $scope.emptyPCB, $scope.emptyPCB, $scope.emptyPCB, $scope.emptyPCB];
    $scope.cpuInfo = $scope.emptyPCB;
    $scope.originalTime = 0;
    $scope.suspendProcess = [];
    //$scope.relaxDegree = new Pcb("Relax", 0000, 1, 0, 0, " ");
    $scope.degreeClass = ["normal", "normal", "normal", "normal", "normal", "normal"];
    $scope.btnClass = ["btn-normal", "btn-normal", "btn-normal", "btn-normal", "btn-normal", "btn-normal"];
    $scope.btnName = ["suspend", "suspend", "suspend", "suspend", "suspend", "suspend"];
    $scope.osRamSection = new RamSection(0, 3548, 1, "OS");
    $scope.freeRamSection = new RamSection(3549, 19600, 0, "Free");
    $scope.ramTable = [$scope.osRamSection, $scope.freeRamSection];
    $scope.clockSpeed = 100;
    $scope.ifBoost = false;
  }
  //此控制器的全局变量
  $scope.insertArray = function (item, array, index) {
    var left = array.slice(0, index);
    var right = array.slice(index, array.length);
    array = left.concat(item, right);
  };
  
  $scope.combineRam = function () {
    for (var i=1; i<$scope.ramTable.length-1; i++) {
      if ($scope.ramTable[i].status === 0 && $scope.ramTable[i+1].status === 0) {
        $scope.ramTable[i+1].start = $scope.ramTable[i].start;
        $scope.ramTable[i+1].class.width = (($scope.ramTable[i+1].end - $scope.ramTable[i+1].start) / 19600) * 100 + "%";
        $scope.ramTable.splice(i, 1);
        break;
      }
    }
    // var newRamTable = [];
    // newRamTable.push($scope.ramTable[0]);
    //
    // for (var i = 1; i<$scope.ramTable.length-1; i++) {
    //   if ($scope.ramTable[i].status === 0 && $scope.ramTable[i-1].status === 0) {
    //     newRamTable.push(new RamSection($scope.ramTable[i-1].start, $scope.ramTable[i].end, 0, "Free"));
    //   } else if ($scope.ramTable[i].status === 0 && $scope.ramTable[i+1].status === 0) {
    //     newRamTable.push(new RamSection($scope.ramTable[i].start, $scope.ramTable[i+1].end, 0, "Free"));
    //   } else {
    //     newRamTable.push($scope.ramTable[i]);
    //   }
    // }
    // newRamTable.push($scope.ramTable[$scope.ramTable.length-1]);
    //
    // for (var i = 1; i<newRamTable.length-1; i++) {
    //   if (newRamTable[i].status === 0 && newRamTable[i+1].status === 0) {
    //     newRamTable.splice(i+1);
    //   } else if (newRamTable[i].status === 0 && newRamTable[i-1].status === 0) {
    //     newRamTable.splice(i-1);
    //   }
    // }
    //
    // $scope.ramTable = newRamTable;
  };
  
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
      var ramSize = Math.ceil(Math.random()*1000 + 1500);
      PCBs[i] = new Pcb(thisJobName, PIDNum[i], 0, runningTime, priority, "", ramSize);
    }
    //生成一个job中所有pcb，并且拥有随机的pid数字
    
    
    for (var i = 0; i<howmanypcbs; i++){
      pcbInfoList[i] = {indexText: i + 1, jobName: PCBs[i].pidName, pid: PCBs[i].pid, status: PCBs[i].status, time: PCBs[i].time, priority: PCBs[i].priority, strStatus: PCBs[i].getStatus(PCBs[i].status), ramSize: PCBs[i].ramSize}
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
      
      for (var i = 0; i<$scope.ramTable.length; i++) {
        if ($scope.ramTable[i].name === $scope.degrees[$index].pid) {
          $scope.ramTable[i].status = 0;
          $scope.ramTable[i].class.backgroundcolor = "blue";
          $scope.ramTable[i].name = "Free";
          for (var k=0; k<5; k++){
            $scope.combineRam();
          }
          break;
        }
      }
      //move out of ram
      
      //$scope.suspendProcess.unshift($scope.degrees[$index]);
      //$scope.degrees[$index] = $scope.relaxDegree;
    }
    else {
      // var ifstop = true;
      // while (ifstop) {
      //   ifstop = !$scope.ramAllocation($scope.degrees[$index]);
      // }
      if ($scope.ramAllocation($scope.degrees[$index])) {
        $scope.degreeClass[$index] = "normal";
        $scope.btnName[$index] = "suspend";
        $scope.degrees[$index].status = 1;
        $scope.degrees[$index].strStatus = "Ready";
        $scope.sortDegrees();
      } else {
        $scope.degreeClass[$index] = "waiting";
        var tryReallocate = setInterval(function () {
          var ifstop = $scope.ramAllocation($scope.degrees[$index]);
          if (ifstop) {
            $scope.degreeClass[$index] = "normal";
            $scope.btnName[$index] = "suspend";
            $scope.degrees[$index].status = 1;
            $scope.degrees[$index].strStatus = "Ready";
            $scope.sortDegrees();
            clearInterval(tryReallocate);
          }
        }, $scope.clockSpeed/10);
      }
      
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
  
  $scope.ramAllocation = function (comingPCB) {
    for (var i=0; i<$scope.ramTable.length; i++) {
      if ($scope.ramTable[i].status === 0 && ($scope.ramTable[i].end - $scope.ramTable[i].start) >= comingPCB.ramSize) {
        var newRamSection = new RamSection($scope.ramTable[i].start, $scope.ramTable[i].start+comingPCB.ramSize, 1, comingPCB.pid);
        //$scope.insertArray(newRamSection, $scope.ramTable, i);
        var left = $scope.ramTable.slice(0, i);
        var right = $scope.ramTable.slice(i, $scope.ramTable.length);
        $scope.ramTable = left.concat(newRamSection, right);
        //renew ram
        $scope.ramTable[i+1].start = $scope.ramTable[i].end + 1;
        for (var j = 0; j<$scope.ramTable.length; j++) {
          $scope.ramTable[j].class.width = (($scope.ramTable[j].end - $scope.ramTable[j].start) / 19600) * 100 + "%";
        }
        //renew pcb
        comingPCB.ramStart = $scope.ramTable[i].start;
        comingPCB.ramEnd = $scope.ramTable[i].end;
        //combine ram
        for (var k=0; k<5; k++){
          $scope.combineRam();
        }
        return true;
      }
    }
    return false;
  };
  
  $scope.toggleBoost = function () {
    if ($scope.clockSpeed === 1000) {
      $scope.clockSpeed = 100;
    } else {
      $scope.clockSpeed = 1000;
    }
  };
  
  $scope.startProc = function () {
    
    setInterval(function () {
      
      if ($scope.jobSubmittedInfo.top() !== undefined) {
        $scope.jobReservedInfo.push($scope.jobSubmittedInfo.shift());
      } //提交的放到保留里
  
      
      
      if ($scope.cpuInfo.pid !== "Empty0") {
        $scope.cpuInfo.time = $scope.cpuInfo.time - 1;
      }
      if ($scope.cpuInfo.time === 0) {
        
        for (var i = 0; i<$scope.ramTable.length; i++) {
          if ($scope.ramTable[i].name === $scope.cpuInfo.pid) {
            $scope.ramTable[i].status = 0;
            $scope.ramTable[i].class.backgroundcolor = "blue";
            $scope.ramTable[i].name = "Free";
            for (var k=0; k<5; k++){
              $scope.combineRam();
            }
            break;
          }
        }
        //move out of ram
        
        if ($scope.cpuInfo.pid !== "Empty0") {
          $scope.terminatedList.push($scope.cpuInfo);
        }
        $scope.cpuInfo = $scope.emptyPCB;
      }//a running cpu
    }, $scope.clockSpeed);
    
    setInterval(function () {
      for (var i=0; i<6; i++) {
        if ($scope.jobReservedInfo.top() !== undefined && $scope.degrees[i].pid === "Empty0" && $scope.ramAllocation($scope.jobReservedInfo.top().pcbInfo[0])) {
          $scope.jobReservedInfo.top().pcbInfo[0].status = 1;
          $scope.jobReservedInfo.top().pcbInfo[0].strStatus = "Ready";
          $scope.degrees[i] = $scope.jobReservedInfo.top().pcbInfo.shift();
          $scope.sortDegrees();
          if ($scope.jobReservedInfo.top().pcbInfo[0] === undefined) {
            $scope.jobReservedInfo.shift();
          }
          break;
        }
      }
    }, $scope.clockSpeed/2); //job schedule@FCFS
    
    setInterval(function () {
      
      for (var i=0; i<6; i++) {
        if ($scope.cpuInfo.pid === "Empty0" && $scope.degrees[i].pid !== "Empty0" && $scope.degrees[i].status !== 3) {
          $scope.cpuInfo = $scope.degrees[i];
          $scope.cpuInfo.strStatus = "Running";
          $scope.cpuInfo.status = 2;
          $scope.originalTime = $scope.cpuInfo.time;
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
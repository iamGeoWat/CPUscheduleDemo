//document.write("<script src='app.js'></script>");
alert("hii");
if ($rootScope.jobSubmittedInfo[0] !== undefined) {
  alert("hi");
  setTimeout(function () {
    $rootScope.jobReservedInfo[0] = $rootScope.jobSubmittedInfo[0];
  }, 2000);
}
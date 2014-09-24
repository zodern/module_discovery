// global function 
addFinished = function (message) {
  Session.set("addStep3Message", message);
  Session.set("addStep3Loading", false);
};

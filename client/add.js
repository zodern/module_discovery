Session.setDefault("isAdding", false);
Session.setDefault("addStep1", true);
Session.setDefault("addStep2", false);
Session.setDefault("addStep3", false);
Session.setDefault("addStep3Loading", false);
function alert(message){
  console.log(message);
}
// gloabl function  
showRepos = function (){
     if (Meteor.user()) {
         Session.set("reposLoaded", false);
         var repositories;
         HTTP.call('get', 'https://api.github.com/users/' + Meteor.user().profile.name + '/repos', function (error, result) {
            repositories = result.data;
             console.log(result.data);
            // alert("results loaded");
             Session.set("reposLoaded", true);
             Session.set("userRepositories", result.data);
            });

     }
 };
    
    Template.addStep1.helpers({
        repositories: function () {
            if (Meteor.user()) {
                return Session.get("userRepositories");

            }
        }
    });
    Template.addStep1.events({
        'click .back' : function (event) {
            Session.set("home", true);
        },
        'click li' : function (event, template) {
          // prevent <span> from getting selected.
          if(event.target.tagName !== "SPAN"){
            $(event.target).toggleClass("selected");
           } else{
            $(event.currentTarget).toggleClass("selected");
          }
          
          // get github info on selected and go to step 2
          var githubInfo;
          template.$('ul li.selected').each(function (index){
              var id = $( this ).attr("info"); 
                
                Session.get("userRepositories").forEach(function(item, index, array){
                    // get the github repository for the selected item
                    if(id == item.id){
                        githubInfo = item;
                    }
                });
          });
          Session.set("addStep2", true);
          Session.set("addStep1", false);
          Session.set("addModule", githubInfo);
            
        },
        'click button' : function (event, template){
            Session.set("isAdding", true);
            var toAdd = [];
            // get selected elements
            template.$('ul li.selected').each(function (index){
              var id = $( this ).attr("info"); 
                var info;
                Session.get("userRepositories").forEach(function(item, index, array){
                    // get the github repository for the selected item
                    if(id == item.id){
                        info = item;
                    }
                });
                toAdd.push(info);
               
            });
           // Meteor.call("addRepositories", toAdd);
            Session.set("addStep2", true);
          Session.set("addStep1", false);
          Session.set("addModule", info);
        }
    });
    Template.addButton.helpers({
        user: function () {
            return Meteor.user() !== null;
        }
    });
Template.addPage.helpers({
    isAdding : function () {
        return Session.get("isAdding");
    },
    step1 : function () {
      return Session.get("addStep1");
    },
  step2 : function () {
    return Session.get("addStep2");
  },
  step3 : function () {
    return Session.get("addStep3");
  }
});
Template.addStep2.helpers({
  githubInfo : function () {
    alert("returned addModule");
    return Session.get("addModule");
  }
});
Template.addStep2.events({
  'click .back' : function () {
    Session.set("addStep2",false);
    Session.set("addStep1", true);
  },
  'click #add' : function (event, template) {
    
    var name = template.$("#name").val().trim();
    var description = template.$("#description").val().trim();
    alert(name);
    alert(description);
  
    Meteor.call("add", {
githubInfo : Session.get("addModule"),
name : name,
description : description
});
    Session.set("addStep1", false);
    Session.set("addStep2", false);
    Session.set("addStep3", true);
    Session.set("home", true);
  }
});

Template.addStep3.helpers({
  loading : function () {
    return Session.get("addStep3Loading");
  }
})
Template.addStep3.events({
  'click button' : function () {
    Session.set("addStep1", false);
    Session.set("addStep2", false);
    Session.set("addStep3", false);
    Session.set("home", true);
  }
})
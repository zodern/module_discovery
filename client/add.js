Session.setDefault("isAdding", false);
Session.setDefault("addStep1", true);
Session.setDefault("addStep2", false);
Session.setDefault("addStep3", false);
Session.setDefault("addStep3Loading", true);
Session.setDefault("userRepositories", []);
// gloabl function  
showRepos = function (){
     if (Meteor.user()) {
         Session.set("reposLoaded", false);
         var repositories;
         HTTP.call('get', 'https://api.github.com/users/' + Meteor.user().profile.name + '/repos', function (error, result) {
            repositories = result.data;
             console.log(result.data);
            
             Session.set("reposLoaded", true);
           
             Session.set("userRepositories", result.data.concat(Session.get("userRepositories")));
           
            });
       HTTP.call('get', "https://api.github.com/users/" + Meteor.user().profile.name +"/orgs", function (error, result){
         console.log(result);
         result.data.forEach(function (item, index){
         HTTP.call('get', result.data[index].repos_url, function (error, result){
             Session.set("userRepositories", result.data.concat(Session.get("userRepositories")));
         })})
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
          var info;
            template.$('ul li.selected').each(function (index){
              var id = $( this ).attr("info"); 
                
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
    
    
  
    Meteor.call("add", {
githubInfo : Session.get("addModule"),
name : name,
description : description
}, function (error, result) {
  
  addFinished(result);
});
    Session.set("addStep1", false);
    Session.set("addStep2", false);
    Session.set("addStep3", true);
    Session.set("home", false);
  }
});

Template.addStep3.helpers({
  isloading : function () {
    return Session.get("addStep3Loading");
  },
  message : function () {
    return Session.get("addStep3Message");
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
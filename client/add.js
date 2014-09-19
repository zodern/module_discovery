Session.setDefault("isAdding", false);
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
    
    Template.add.helpers({
        repositories: function () {
            if (Meteor.user()) {
                return Session.get("userRepositories");

            }
        }
    });
    Template.add.events({
        'click .back' : function (event) {
            Session.set("home", true);
        },
        'click li' : function (event) {
            //alert(JSON.stringify(event));
            $(event.target).toggleClass("selected");
            //event.target.style.background = "yellow";
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
            Meteor.call("addRepositories", toAdd);
            Session.set("home", true);
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
    }
});
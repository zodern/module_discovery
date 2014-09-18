mods = new Meteor.Collection("modules");
if (Meteor.isClient) {
    Session.setDefault("home", true);
    Meteor.loginWithGithub({
        requestPermissions: ['user', 'public_repo']
    }, function (err) {
        if (err)
            Session.set('errorMessage', err.reason || 'Unknown error');
    });
    Template.modules.helpers({
        modules: function () {
            return mods.find({}).fetch();
        }
    });
    // get user's public repositories
    function showRepos (){
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
//                var repositories;
//                 HTTP.call('get', 'https://api.github.com/users/' + Meteor.user().profile.name + '/repos', function (error, result) {
//                    repositories = result.data;
//                });
//                console.log(repositories);
//                return repositories;
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
            template.$('ul li.selected').each(function (index){
              var id = $( this ).attr("info"); 
                var info;
                Session.get("userRepositories").forEach(function(item, index, array){
                    console.log(item.id);
                    if(id == item.id){
                        info = item;
                    }
                });
                mods.insert({
                      _id: new Meteor.Collection.ObjectID()._str,
                      githubRepo : info.id,
                      name: info.name,
                      owner: info.owner.login,
                      description: info.description
            
                    });
                Session.set("home", true);
            });
            
        }
    });
    Template.addButton.helpers({
        user: function () {
            return Meteor.user() !== null;
        }
    });
    Template.page.helpers({
        home: function () {
            return Session.get("home");
        },
        loaded : function () {
            return Session.get("reposLoaded");
        }
    });

    Template.addButton.events({
        "click button": function () {
            Session.set("home", false);
         showRepos();
            //      console.log()
            //      var name = prompt("What is the name of your module on github?", "");
            //      if (name === null) {
            //        return false;
            //      }
            //      var owner = prompt("What is your github name that the module is under?", "");
            //      if (owner === null) {
            //        return false;
            //      }
            //      var version = prompt("What is the current version?", "");
            //      if (version === null) {
            //        return false;
            //      }
            //      var description = prompt("Please describe your module: ", "");
            //      if (description === null) {
            //        return false;
            //      }
            //
            //      var finish = confirm("Is this information correct? \n name: " + name + "\n owner: " + owner + "\n version: " + version + "\n description: " + description);
            //         if (finish === true) {
//                    mods.insert({
//                      _id: new Meteor.Collection.ObjectID()._str,
//                      name: name,
//                      owner: owner,
//                      version: version,
//                      description: description
//            
//                    });
            //        alert("Thank you.  The module should be added soon!");
            //      } else{
            //        alert("Please try again.");
            //        return false;
            //      }

        }
    });
    /*
  add: 
  mods.insert(
  {
    _id : new Meteor.Collection.ObjectID()._str,
    name : "mod_stats",
    owner : "breach",
    version : "0.1.4-alpha.5",
    description : "Stats & Usage aggregation module for Breach",
    */
    $(document).ready(function () {
        $("input:text").focus(function () {
            $(this).select();
        });
        $('input:text').mouseup(function (e) {
            return false;
        });
    });
}

if (Meteor.isServer) {
Meteor.methods({
  getRepositories: function (name) {
    check(name, String);
      this.unblock(); 
      var response = HTTP.call('get', 'https://api.github.com/users/' + name + '/repos');
      return response;
  }
});
    Accounts.onCreateUser(function (options, user) {
        console.log("options : " + JSON.stringify(options));
        options.profile.name = user.services.github.username;
        console.log("user name: " + options.profile.name);
        console.log("user : " + JSON.stringify(user));
        if (options.profile)
            user.profile = options.profile;
        return user;
    });
}
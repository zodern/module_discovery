//global variable
mods = new Meteor.Collection("modules");
if (Meteor.isClient) {
    
    Session.setDefault("home", true);
  
    Meteor.loginWithGithub({
        requestPermissions: ['user', 'public_repo']
    }, function (err) {
        if (err)
          // TODO show errors someplace in page
            Session.set('errorMessage', err.reason || 'Unknown error');
    });
    Template.modules.helpers({
        modules: function () {
            return mods.find({}).fetch();
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
            Session.set("isAdding", false)
         showRepos();
       
        }
    });
  
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
    
    Accounts.onCreateUser(function (options, user) {
        options.profile.name = user.services.github.username;
        if (options.profile)
            user.profile = options.profile;
        return user;
    });
}
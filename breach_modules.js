
mods = new Meteor.Collection("modules");
if (Meteor.isClient) {
  // counter starts at 0

  Template.modules.helpers({
    modules: function () {
      return mods.find({}).fetch();
    }
  });
  Template.add.helpers({
    user: function () {
      return Meteor.user() !== null;
    }
  });
  Template.add.events({
    "click button": function () {
      console.log()
      var name = prompt("What is the name of your module on github?", "");
      if (name === null) {
        return false;
      }
      var owner = prompt("What is your github name that the module is under?", "");
      if (owner === null) {
        return false;
      }
      var version = prompt("What is the current version?", "");
      if (version === null) {
        return false;
      }
      var description = prompt("Please describe your module: ", "");
      if (description === null) {
        return false;
      }

      var finish = confirm("Is this information correct? \n name: " + name + "\n owner: " + owner + "\n version: " + version + "\n description: " + description);
         if (finish === true) {
        mods.insert({
          _id: new Meteor.Collection.ObjectID()._str,
          name: name,
          owner: owner,
          version: version,
          description: description

        });
        alert("Thank you.  The module should be added soon!");
      } else{
        alert("Please try again.");
        return false;
      }

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
  Meteor.startup(function () {
    // code to run on server at startup
  });
}
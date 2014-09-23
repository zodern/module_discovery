Meteor.methods({
  addRepositories: function (toAdd) {
    check(toAdd, Array);
    var succeeded;
    var failed;
    toAdd.forEach(function (item, index) {
      var url = 'https://api.github.com/search/code?q=' 
                + '"breach_module":+repo:' 
                + Meteor.user().profile.name 
                + '/' + toAdd[0].name 
                + '+filename:package.json';
      console.log(url);
      var response = HTTP.call('get', url, {
        headers: {
          'User-Agent': 'zodern'
        }
      });
      
      if (response.data.total_count > 0) {
        succeeded += 1;
        mods.insert({
          _id: new Meteor.Collection.ObjectID()._str,
          githubRepo: item.id,
          name: item.name,
          owner: item.owner.login,
          description: item.description

        });

      }
      else{
        failed += 1;
      }
    });
    return {succeeded : succeeded, failed: failed};

  },
  // new function to add a module
  add : function (module) {
    /*
    module: 
    {
    githubInfo: githubInfo,
    name: user supplied name
    description: user supplied description
    organization : false or modules github organization
    }
    */
    
    if(module.githubInfo.owner.type === "Organization"){
      console.log("organization");
      // TODO verify the user is in the organization
      
    }
      
    
    var url = 'https://api.github.com/search/code?q=' 
                + '"breach_module":+repo:' 
                + module.githubInfo.owner.login
                + '/' + module.githubInfo.name
                + '+filename:package.json';
     
      var response = HTTP.call('get', url, {
        headers: {
          'User-Agent': 'zodern'
        }
      });
      if(response.total_count < 1){
     return "The github repository is not a module.  Make sure it has a package.js which lists breach_module as one of the dependencies.";
      }
       mods.insert({
          _id: new Meteor.Collection.ObjectID()._str,
          
          github: {
          githubRepo: module.githubInfo.id,
          name: module.githubInfo.name,
          owner: module.githubInfo.owner.login
        },
          name: module.name,
          description: module.description

        });
    console.log("added");
  return "Successfully added module!";
  }
});

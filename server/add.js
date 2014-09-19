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

  }
});
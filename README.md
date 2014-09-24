Discover mod_*
================

Web site to discover modules for Breach

##Goal

 - Our main goal is to make it easy to discover and install modules. 
 - My eventual plan is to make a module that will work with the web site.  If the user has it installed, they can click an install button on the website and the module will install it. 
 - Maybe we can even have the website suggest web apps in categories they don't have any.  For example, it could suggest a bookmark module if they don't have one.

**Why are you not searching NPM for modules?**

I had considered it, but right now there are only 2 on NPM and many more on Github.  I thought it made more sense to allow developers to manually add the modules so they can customize how it appears in the web site since the description and readme is usually focused  more toward developers instead of users.

##ToDo

 - Fix any bugs and simplify the Add Modules code.
 - Create a Developer Dashboard to view and manage added modules
 - Start making the installation module (name to be decided)
 - Add animations
 - Search 
 - Add catagories
 - Create full page view of modules that includes a long description and maybe images
 - Track information on modules, such as update frequency, number of views and downloads.
 - Reviews and ratings of modules.  

When we get a domain we can install the fast-render package which will greatly increase the loading time.  I removed it after reading the security problems it creates on shared domains.

##Bugs and Limitations

 - Modules owned by organizations (including Breach) can not be added.  I am working on this in the add-module  branch.
 - Forked repos can not be added as modules because of a limitation in the search api.

##Run Locally
1. Install [Meteor](http://meteor.com) ([Windows Version](http://win.meteor.com))
2. Clone the repository
3. Use the terminal to go to the directory
4. run $ meteor

Learn more about Meteor at [meteor.com](http://meteor.com) and [docs.meteor.com](http://docs.meteor.com)




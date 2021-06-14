# SKELETON API

### Production

In this API we can see the basic skeleton of a normal node.js API.

### The folder structure

Here is the node.js project structure that I'm talking about.

I use this in every node.js REST API service that I build, let's see in details what every component do.

```text
src
  │   app.js          # App entry point
  └───api             # Express route controllers for all the endpoints of the app
  └───config          # Environment variables and configuration related stuff
  └───jobs            # Jobs definitions for agenda.js
  └───loaders         # Split the startup process into modules
  └───models          # Database models
  └───services        # All the business logic is here
  └───subscribers     # Event handlers for async task
  └───types           # Type declaration files (d.ts) for Typescript
```

####References

-   [https://dillinger.io/] - Great example to do a readme.md!
-   [https://dev.to/santypk4/bulletproof-node-js-project-architecture-4epf#test] - Bulletproof node.js project architecture
#   p a r r a w s x  
 #   p a r r a w s x  
 #   p a r r a w s x  
 
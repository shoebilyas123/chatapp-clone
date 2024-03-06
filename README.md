# Chat App Clone Docs

This is a documentation of the development process of the version 2.0 of this Chat App which is a complete overhault of the original codebase that includes code refactoring, performance optimization, migrating to Typescript, unit and integrations tests for front-end, CI/CD pipeline with Github Actions and Redis for fast data caching. The [Dev Change Log](#Dev-Change-Log) section covers regular updates on this project.

## Dev Change Log

### 6th March 2024

    After researching and going through the codebase for hours, I found a lot of flaws and anti-pattern designs. I have decided rewrite the codebase of this project in Typescript with a lot of other improvements such as setting up the CI/CD pipeline and clean code. There are still many bugs and errors in the code as almost everything has broken because the codebase is in the midst of Typescript migration. The old javascript code still works but the program might throw errors in typescript code. Here are the changes I did today.
        - This part is true for all the upcoming changes. Rewrote the code in typescript. Though, a lot of code changes are still pending.
        - Rewriting the socket server with a class based approach.
        - Added a function for fetching env variables. You need to add the env in the ENV_CONFIG interface and the function will get only those env variables that are required during the runtime of the program.
        - Wrote types for middlewares, request handlers, user model and express async handler.

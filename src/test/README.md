# Tests

### _Unit Testing of Node.js Application_

Unit Testing is a software testing method where individual units/components are tested in isolation. A unit can be described as the smallest testable part of code in an application. Unit testing is generally carried out by developers during the development phase of an application.

In Node.js there are many frameworks available for running unit tests. Some of them are:

-   Mocha
-   Jest
-   Jasmine
-   AVA

#####Cypress vs Jest: What are the differences?

######What is Cypress?
Better, faster, and more reliable testing for anything that runs in a browser. Cypress is a front end automated testing application created for the modern web. Cypress is built on a new architecture and runs in the same run-loop as the application being tested. As a result Cypress provides better, faster, and more reliable testing for anything that runs in a browser. Cypress works on any front-end framework or website.

######What is Jest?
Painless JavaScript Unit Testing. Jest provides you with multiple layers on top of Jasmine.

Cypress and Jest belong to "Javascript Testing Framework" category of the tech stack.

Some of the features offered by Cypress are:

-   Time Travel
-   Debuggability
-   Automatic Waiting

On the other hand, Jest provides the following key features:

-   Familiar Approach: Built on top of the Jasmine test framework, using familiar expect(value).toBe(other) assertions
-   Mock by Default: Automatically mocks CommonJS modules returned by require(), making most existing code testable
-   Short Feedback Loop: DOM APIs are mocked and tests run in parallel via a small node.js command line utility

"Open source" is the primary reason why developers consider Cypress over the competitors, whereas "Open source" was stated as the key factor in picking Jest.

Jest is an open source tool with 26.4K GitHub stars and 3.57K GitHub forks. Here's a link to Jest's open source repository on GitHub.

According to the StackShare community, Jest has a broader approval, being mentioned in 271 company stacks & 161 developers stacks; compared to Cypress, which is listed in 59 company stacks and 44 developer stacks.

As we all know testing is an important part of any application. To assist with our testing we are going to use both Cypress and Jest. We feel these tools complement each other and will help us get good coverage of our code. We will use Cypress for our end to end testing as we've found it quite user friendly. Jest will be used for our unit tests because we've seen how many larger companies use it with great success.

#### References

-   [https://www.geeksforgeeks.org/unit-testing-of-node-js-application/#:~:text=29%20Jul%2C%202020-,Node.,components%20are%20tested%20in%20isolation.&text=In%20Node.,available%20for%20running%20unit%20tests] - Unit Testing of Node.js Application.
-   [https://stackshare.io/stackups/cypress-vs-jest] - Cypress vs Jest.
-   [https://www.genbeta.com/desarrollo/da-potencia-flexibilidad-tus-tests-jest] - Give power and flexibility to your tests with Jest.

Boilerplate Loopback Application
--------------------------------

Sample application to base larger projects on. Clone and fork to extend.

cd ROOT_OF_REPO
vagrant up

server is available at

http://localhost:3000/explorer

Test
-------

All of the tests that are created in this projects are located in the test/ folder. To run the tests, run the following command at the project root:

    npm test


Debug
_______

node-inspector is started along nodemon on port 9090:

http://localhost:9090/?port=5858
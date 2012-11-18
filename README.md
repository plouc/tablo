tablo
=====

A simple monitoring dashboard using Node.js.

Features
--------

* Monitor running processes (using ps)
* Monitor mySQL processes
* Easy installation and zero administration

Installing tablo
----------------

Clone the repository from GitHub and install dependencies using npm:

    > git clone git://github.com/plouc/tablo.git
    > npm install

Configure tablo:

    > cp config/default.yaml.sample config/default.yaml
    > vim config/default.yaml

Start the application using:

    > node app.js

License
-------

The tablo code is free to use and distribute, under the [MIT license](https://raw.github.com/plouc/tablo/master/LICENSE).

tablo uses third-party libraries:

* [NodeJS](http://nodejs.org/), licensed under the [MIT License](https://github.com/joyent/node/blob/master/LICENSE#L5-22),
* [Socket.io](http://socket.io/), licensed under the [MIT License](https://github.com/LearnBoost/socket.io/blob/master/Readme.md),
* [jQuery](http://jquery.com/), licensed under the [MIT License](http://jquery.org/license),
* [TwitterBootstrap](http://twitter.github.com/bootstrap/), licensed under the [Apache License v2.0](http://www.apache.org/licenses/LICENSE-2.0),
* [d3](http://http://d3js.org/), licensed under the [BSD License](https://raw.github.com/mbostock/d3/master/LICENSE),
* [underscorejs](http://http://d3js.org/), licensed under the [MIT License](https://raw.github.com/documentcloud/underscore/master/LICENSE).
If you like the software, please help improving it by contributing PRs on the [GitHub project](https://github.com/plouc/tablo)!
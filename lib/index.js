(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.vue_dsl = factory());
})(this, (function () { 'use strict';

  function ownKeys(object, enumerableOnly) {
    var keys = Object.keys(object);

    if (Object.getOwnPropertySymbols) {
      var symbols = Object.getOwnPropertySymbols(object);

      if (enumerableOnly) {
        symbols = symbols.filter(function (sym) {
          return Object.getOwnPropertyDescriptor(object, sym).enumerable;
        });
      }

      keys.push.apply(keys, symbols);
    }

    return keys;
  }

  function _objectSpread2(target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i] != null ? arguments[i] : {};

      if (i % 2) {
        ownKeys(Object(source), true).forEach(function (key) {
          _defineProperty(target, key, source[key]);
        });
      } else if (Object.getOwnPropertyDescriptors) {
        Object.defineProperties(target, Object.getOwnPropertyDescriptors(source));
      } else {
        ownKeys(Object(source)).forEach(function (key) {
          Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
        });
      }
    }

    return target;
  }

  function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) {
    try {
      var info = gen[key](arg);
      var value = info.value;
    } catch (error) {
      reject(error);
      return;
    }

    if (info.done) {
      resolve(value);
    } else {
      Promise.resolve(value).then(_next, _throw);
    }
  }

  function _asyncToGenerator(fn) {
    return function () {
      var self = this,
          args = arguments;
      return new Promise(function (resolve, reject) {
        var gen = fn.apply(self, args);

        function _next(value) {
          asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value);
        }

        function _throw(err) {
          asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err);
        }

        _next(undefined);
      });
    };
  }

  function _defineProperty(obj, key, value) {
    if (key in obj) {
      Object.defineProperty(obj, key, {
        value: value,
        enumerable: true,
        configurable: true,
        writable: true
      });
    } else {
      obj[key] = value;
    }

    return obj;
  }

  /**
  * Base Deploy: A class define deployments for vue_dsl.
  * @name 	base_deploy
  * @module 	base_deploy
  **/
  class base_deploy {
    constructor() {
      var {
        context = {},
        name = 'base_deploy'
      } = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
      this.context = context;
      this.name = name;
    }

    logo() {
      var _arguments = arguments,
          _this = this;

      return _asyncToGenerator(function* () {
        var {
          name = _this.name,
          config = {}
        } = _arguments.length > 0 && _arguments[0] !== undefined ? _arguments[0] : {};

        var cfonts = require('cfonts');

        cfonts.say(name, _objectSpread2(_objectSpread2({}, {
          font: 'block',
          gradient: 'red,blue'
        }), config));
      })();
    }

    run() {
      return _asyncToGenerator(function* () {
        return true;
      })();
    }

    deploy() {
      var _this2 = this;

      return _asyncToGenerator(function* () {
        var errors = [];

        _this2.context.x_console.spinner({
          message: "Deploying ".concat(_this2.name, " instance")
        }); //spinner.start('Deploying local instance');

        /*try {
            //launch in a new terminal
            await this.context.launchTerminal('npm',['run','dev'],this.context.x_state.dirs.app);
            //results.git_add = await spawn('npm',['run','dev'],{ cwd:this.x_state.dirs.app });
            spinner.succeed('NuxtJS launched successfully');
        } catch(gi) { 
            spinner.fail('Project failed to launch');
            errors.push(gi);
        }*/


        return errors;
      })();
    }

    base_build() {
      var _this3 = this;

      return _asyncToGenerator(function* () {
        // builds the project
        var spawn = require('await-spawn'),
            path = require('path'),
            fs = require('fs').promises; //let ora = require('ora');


        var node_modules_final = path.join(_this3.context.x_state.dirs.app, 'node_modules');
        var node_package = path.join(_this3.context.x_state.dirs.app, 'package.json');
        var npm = {},
            errors = [];

        _this3.context.x_console.out({
          message: "Building project",
          color: 'cyan'
        });

        var spinner = _this3.context.x_console.spinner({
          message: 'Building project'
        });

        var node_modules_exist = yield _this3.exists(node_modules_final);
        var node_package_exist = yield _this3.exists(node_package);

        if (node_modules_exist && node_package_exist) {
          //test if every package required is within node_modules
          spinner.start("Some npm packages where installed; checking ..");
          var pkg = JSON.parse(yield fs.readFile(node_package, 'utf-8'));
          var all_ok = true;

          for (var pk in pkg.dependencies) {
            var tst_dir = path.join(_this3.context.x_state.dirs.app, 'node_modules', pk);
            var tst_exist = yield _this3.exists(tst_dir);
            if (!tst_exist) all_ok = false;
          }

          node_modules_exist = all_ok;

          if (all_ok) {
            spinner.succeed('Using existing npm packages');
          } else {
            spinner.warn('Some packages are new, requesting them');
          }
        } // issue npm install (400mb)


        if (!node_modules_exist) {
          spinner.start("Installing npm packages"); //this.x_console.outT({ message:`Installing npm packages` });

          try {
            npm.install = yield spawn('npm', ['install'], {
              cwd: _this3.context.x_state.dirs.app
            }); //, stdio:'inherit'

            spinner.succeed("npm install succesfully");
          } catch (n) {
            npm.install = n;
            spinner.fail('Error installing npm packages');
            errors.push(n);
          }
        } // issue npm run build


        spinner.start("Building VueJS project");

        var ci = require('ci-info');

        try {
          if (ci.isCI == false) {
            npm.build = yield spawn('npm', ['run', 'build'], {
              cwd: _this3.context.x_state.dirs.app
            });
          } else {
            npm.build = yield spawn('npm', ['run', 'build'], {
              cwd: _this3.context.x_state.dirs.app,
              stdio: 'inherit'
            });
          }

          spinner.succeed('Project build successfully');
        } catch (nb) {
          npm.build = nb;
          spinner.fail('VueJS build failed');

          if (ci.isCI == false) {
            _this3.context.x_console.out({
              message: "Building VueJS again to show error in console",
              color: 'red'
            }); //build again with output redirected to console, to show it to user


            try {
              console.log('\n');
              npm.build = yield spawn('npm', ['run', 'dev'], {
                cwd: _this3.context.x_state.dirs.app,
                stdio: 'inherit',
                timeout: 15000
              });
            } catch (eg) {}
          } else {
            _this3.context.x_console.out({
              message: "CI system detected; please double-check your code locally before pushing!",
              color: 'red'
            });
          }

          errors.push(nb);
        }

        return errors;
      })();
    } //****************************
    // onPrepare and onEnd steps
    //****************************


    pre() {
      return _asyncToGenerator(function* () {})();
    }

    post() {
      return _asyncToGenerator(function* () {})();
    }

    modifyPackageJSON(data) {
      return _asyncToGenerator(function* () {
        return data;
      })();
    }

    modifyVueConfig(config) {
      return _asyncToGenerator(function* () {
        return config;
      })();
    } // HELPER methods


    exists(dir_or_file) {
      return _asyncToGenerator(function* () {
        var fs = require('fs').promises;

        try {
          yield fs.access(dir_or_file);
          return true;
        } catch (e) {
          return false;
        }
      })();
    }

    _isLocalServerRunning() {
      var _arguments2 = arguments,
          _this4 = this;

      return _asyncToGenerator(function* () {
        var port = _arguments2.length > 0 && _arguments2[0] !== undefined ? _arguments2[0] : _this4.context.x_state.central_config.port;

        var is_reachable = require('is-port-reachable');

        var resp = yield is_reachable(port);
        return resp;
      })();
    }

    launchTerminal(cmd) {
      var _arguments3 = arguments;
      return _asyncToGenerator(function* () {
        var args = _arguments3.length > 1 && _arguments3[1] !== undefined ? _arguments3[1] : [];
        var basepath = _arguments3.length > 2 ? _arguments3[2] : undefined;

        var spawn = require('await-spawn');

        var args_p = '';
        var resp = {
          error: false
        };

        if (basepath) {
          args_p = "sleep 2; clear; cd ".concat(basepath, " && ").concat(cmd, " ").concat(args.join(' '));
        } else {
          args_p = 'sleep 2; clear; ' + cmd + ' ' + args.join(' ');
        }

        try {
          resp = yield spawn('npx', ['terminal-tab', args_p]);
        } catch (e) {
          resp = _objectSpread2(_objectSpread2({}, e), {
            error: true
          });
        }

        return resp;
      })();
    }

  }

  class local extends base_deploy {
    constructor() {
      var {
        context = {}
      } = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
      super({
        context,
        name: 'Local'
      });
    }

    modifyPackageJSON(config) {
      return _asyncToGenerator(function* () {
        //little sass errors hack fix 13jun21
        //config.devDependencies['sass-migrator']='*';
        //config.scripts.hackfix = 'sass-migrator division node_modules/vuetify/**/*.sass && sass-migrator division node_modules/vuetify/**/*.scss';
        //config.scripts.dev = 'npm run hackfix && '+config.scripts.dev;
        return config;
      })();
    }

    modifyVueConfig(config) {
      return _asyncToGenerator(function* () {
        /*if (this.context.x_state.config_node.axios) {
            let ax_config = config.axios;
            if (this.context.x_state.config_node.axios.local) {
                ax_config.baseURL = this.context.x_state.config_node.axios.local;
                ax_config.browserBaseURL = this.context.x_state.config_node.axios.local;
                delete ax_config.local;
                if (this.context.x_state.config_node.axios.local.includes('127.0.0.1')) 
                    this.context.x_state.config_node.axios.https=false;
            }
            delete ax_config.deploy;
            config.axios = ax_config;
        }*/
        //
        return config;
      })();
    }

    deploy() {
      return _asyncToGenerator(function* () {
        /*
        let build={};
        if ((await this._isLocalServerRunning())==false) {
            this.context.x_console.title({ title:'Deploying Local NuxtJS instance', color:'green' });
            await this.logo();
            //only launch nuxt server if its not running already
            // builds the app
            build.try_build = await this.base_build(); 
            if (build.try_build.length>0) {
                this.x_console.outT({ message:`There was an error building the project.`, color:'red' });
                return false;
            }
            if (this.context.x_config.nodeploy && this.context.x_config.nodeploy==true) {
                this.context.x_console.outT({ message:`Aborting final deployment as requested`, color:'brightRed'});
                return true;
            } else {
                build.deploy_local = await this.run();
                if (build.deploy_local.length>0) {
                    this.context.x_console.outT({ message:`There was an error deploying locally.`, color:'red', data:build.deploy_local.toString()});
                    return false;
                }
            }
        } else {
            this.context.x_console.title({ title:'Updating local running NuxtJS instance', color:'green' });
            await this.logo();
            this.context.x_console.outT({ message:`Project updated.`, color:'green' });
        }*/
        return true;
      })();
    }

    run() {
      var _this = this;

      return _asyncToGenerator(function* () {
        //issue npm run dev
        var errors = [];

        require('await-spawn');

        var spinner = _this.context.x_console.spinner({
          message: 'Deploying local instance'
        }); //this.debug('Local deploy');


        spinner.start('Deploying local instance');

        try {
          //launch in a new terminal
          yield _this.launchTerminal('npm', ['run', 'dev'], _this.context.x_state.dirs.app); //results.git_add = await spawn('npm',['run','dev'],{ cwd:this.x_state.dirs.app });

          spinner.succeed('NuxtJS launched successfully');
        } catch (gi) {
          spinner.fail('Project failed to launch');
          errors.push(gi);
        }

        return errors;
      })();
    }

  }

  class remote extends base_deploy {
    constructor() {
      var {
        context = {}
      } = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
      super({
        context,
        name: 'Remote'
      });
    }

    modifyPackageJSON(config) {
      return _asyncToGenerator(function* () {
        //little sass errors hack fix 13jun21
        config.devDependencies['sass-migrator'] = '*';
        config.scripts.hackfix = 'sass-migrator division node_modules/vuetify/**/*.sass && sass-migrator division node_modules/vuetify/**/*.scss';
        config.scripts.dev = 'npm run hackfix && ' + config.scripts.dev;
        return config;
      })();
    }

    modifyPackageJSON(data) {
      var _this = this;

      return _asyncToGenerator(function* () {
        if (_this.context.x_state.central_config.deploy == 'remote' && !_this.context.x_state.central_config[':hostname']) {
          data.scripts.dev += " --hostname '0.0.0.0'";
        }

        return data;
      })();
    }

    modifyNuxtConfig(config) {
      var _this2 = this;

      return _asyncToGenerator(function* () {
        if (_this2.context.x_state.config_node.axios) {
          var ax_config = config.axios;

          if (_this2.context.x_state.config_node.axios.local) {
            ax_config.baseURL = _this2.context.x_state.config_node.axios.local;
            ax_config.browserBaseURL = _this2.context.x_state.config_node.axios.local;
            delete ax_config.local;
            if (_this2.context.x_state.config_node.axios.local.includes('127.0.0.1')) _this2.context.x_state.config_node.axios.https = false;
          }

          delete ax_config.deploy;
          config.axios = ax_config;
        } //force a static build


        config.ssr = false;
        config.target = 'static';
        config.performance.gzip = false; //return

        return config;
      })();
    }

    deploy() {
      var _this3 = this;

      return _asyncToGenerator(function* () {
        var build = {};

        if ((yield _this3._isLocalServerRunning()) == false) {
          _this3.context.x_console.title({
            title: 'Deploying NuxtJS instance with remote access',
            color: 'green'
          });

          yield _this3.logo(); //only launch nuxt server if its not running already
          // builds the app

          build.try_build = yield _this3.base_build();

          if (build.try_build.length > 0) {
            _this3.x_console.outT({
              message: "There was an error building the project.",
              color: 'red'
            });

            return false;
          }

          build.deploy_local = yield _this3.run();

          if (build.deploy_local.length > 0) {
            _this3.context.x_console.outT({
              message: "There was an error deploying locally.",
              color: 'red',
              data: build.deploy_local.toString()
            });

            return false;
          }
        } else {
          _this3.context.x_console.title({
            title: 'Updating local running NuxtJS instance',
            color: 'green'
          });

          yield _this3.logo();

          _this3.context.x_console.outT({
            message: "Project updated.",
            color: 'green'
          });
        }

        return true;
      })();
    }

    run() {
      var _this4 = this;

      return _asyncToGenerator(function* () {
        //issue npm run dev
        var errors = [];

        require('await-spawn');

        var sleep = function sleep(ms) {
          return new Promise(resolve => setTimeout(resolve, ms));
        };

        var spinner = _this4.context.x_console.spinner({
          message: 'Deploying Ngrok local instance'
        }); //this.debug('Local deploy');


        spinner.start('Deploying local instance');

        try {
          //launch in a new terminal
          yield _this4.launchTerminal('npm', ['run', 'dev'], _this4.context.x_state.dirs.app); //results.git_add = await spawn('npm',['run','dev'],{ cwd:this.x_state.dirs.app });

          spinner.succeed('NuxtJS launched successfully');
        } catch (gi) {
          spinner.fail('Project failed to launch');
          errors.push(gi);
        }

        spinner.start("Launching remote access for port ".concat(_this4.context.x_state.central_config.port));

        try {
          //launch ngrok in new terminal
          yield sleep(1000);
          yield _this4.launchTerminal('npx', ['localtunnel', '--port', _this4.context.x_state.central_config.port, '--subdomain', _this4.context.x_state.central_config.apptitle.toLowerCase()], _this4.context.x_state.dirs.app);
          spinner.succeed('Remote access requested successfully');
        } catch (ng) {
          spinner.fail('Remote access failed to launch');
          errors.push(ng);
        }

        return errors;
      })();
    }

  }

  class eb extends base_deploy {
    constructor() {
      var {
        context = {}
      } = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
      super({
        context,
        name: 'AWS EB'
      });
    }

    logo() {
      return _asyncToGenerator(function* () {
        var asciify = require('asciify-image'),
            path = require('path');

        var aws = path.join(__dirname, 'assets', 'aws.png');
        var logo_txt = yield asciify(aws, {
          fit: 'width',
          width: 25
        });
        console.log(logo_txt);
      })();
    }

    modifyNuxtConfig(config) {
      var _this = this;

      return _asyncToGenerator(function* () {
        if (_this.context.x_state.config_node.axios && _this.context.x_state.config_node.axios.deploy) {
          var ax_config = config.axios;
          ax_config.baseURL = _this.context.x_state.config_node.axios.deploy;
          ax_config.browserBaseURL = _this.context.x_state.config_node.axios.deploy;
          delete ax_config.deploy;
          config.axios = ax_config;
        }

        return config;
      })();
    }

    deploy() {
      var _this2 = this;

      return _asyncToGenerator(function* () {
        var build = {};

        _this2.context.x_console.title({
          title: 'Deploying to Amazon AWS Elastic Bean',
          color: 'green'
        });

        yield _this2.logo(); // builds the app

        build.try_build = yield _this2.base_build();

        if (build.try_build.length > 0) {
          _this2.context.x_console.outT({
            message: "There was an error building the project.",
            color: 'red'
          });

          return false;
        } // deploys to aws


        build.deploy_aws_eb = yield _this2.run(); //test if results.length>0 (meaning there was an error)

        if (build.deploy_aws_eb.length > 0) {
          _this2.context.x_console.outT({
            message: "There was an error deploying to Amazon AWS.",
            color: 'red',
            data: build.deploy_aws_eb.toString()
          });

          return false;
        }

        return true;
      })();
    }

    run() {
      var _this3 = this;

      return _asyncToGenerator(function* () {
        var spawn = require('await-spawn');

        var errors = []; //AWS EB deploy

        _this3.context.debug('AWS EB deploy');

        var eb_full = _this3.context.x_state.central_config.deploy.replaceAll('eb:', '');

        var eb_appname = eb_full;
        var eb_instance = "".concat(eb_appname, "-dev");

        if (_this3.context.x_state.central_config.deploy.includes(',')) {
          eb_appname = eb_full.split(',')[0];
          eb_instance = eb_full.split(',').splice(-1)[0];
        }

        if (eb_appname != '') {
          var spinner = _this3.context.x_console.spinner({
            message: 'Creating config files'
          }); //this.x_console.outT({ message:`Creating EB config yml: ${eb_appname} in ${eb_instance}`, color:'yellow' });


          var yaml = require('yaml');

          var data = {
            'branch-defaults': {
              master: {
                environment: eb_instance,
                group_suffix: null
              }
            },
            global: {
              application_name: eb_appname,
              branch: null,
              default_ec2_keyname: 'aws-eb',
              default_platform: 'Node.js 14 running on 64bit Amazon Linux 2',
              default_region: 'us-east-1',
              include_git_submodules: true,
              instance_profile: null,
              platform_name: null,
              platform_version: null,
              profile: null,
              repository: null,
              sc: 'git',
              workspace_type: 'Application'
            }
          }; //create .elasticbeanstalk directory

          var path = require('path'),
              fs = require('fs').promises;

          var eb_base = _this3.context.x_state.dirs.app;
          if (_this3.context.x_state.central_config.static) eb_base = path.join(eb_base, 'dist');
          var eb_dir = path.join(eb_base, '.elasticbeanstalk');

          try {
            yield fs.mkdir(eb_dir, {
              recursive: true
            });
          } catch (ef) {} //write .elasticbeanstalk/config.yml file with data


          yield _this3.context.writeFile(path.join(eb_dir, 'config.yml'), yaml.stringify(data)); //write .npmrc file

          yield _this3.context.writeFile(path.join(eb_base, '.npmrc'), 'unsafe-perm=true'); //create .ebignore file

          var eb_ig = "node_modules/\njspm_packages/\n.npm\n.node_repl_history\n*.tgz\n.yarn-integrity\n.editorconfig\n# Mac OSX\n.DS_Store\n# Elastic Beanstalk Files\n.elasticbeanstalk/*\n!.elasticbeanstalk/*.cfg.yml\n!.elasticbeanstalk/*.global.yml";
          yield _this3.context.writeFile(path.join(eb_base, '.ebignore'), eb_ig); //init git if not already

          spinner.succeed('EB config files created successfully');
          var results = {};

          if (!(yield _this3.exists(path.join(eb_base, '.git')))) {
            //git directory doesn't exist
            _this3.context.x_console.outT({
              message: 'CREATING .GIT DIRECTORY'
            });

            spinner.start('Initializing project git repository');
            spinner.text('Creating .gitignore file');
            var git_ignore = "# Mac System files\n.DS_Store\n.DS_Store?\n__MACOSX/\nThumbs.db\n# VUE files\nnode_modules/";
            yield _this3.context.writeFile(path.join(eb_base, '.gitignore'), git_ignore);
            spinner.succeed('.gitignore created');
            spinner.start('Initializing local git repository ..');

            try {
              results.git_init = yield spawn('git', ['init', '-q'], {
                cwd: eb_base
              });
              spinner.succeed('GIT initialized');
            } catch (gi) {
              results.git_init = gi;
              spinner.fail('GIT failed to initialize');
              errors.push(gi);
            }

            spinner.start('Adding files to local git ..');

            try {
              results.git_add = yield spawn('git', ['add', '.'], {
                cwd: eb_base
              });
              spinner.succeed('git added files successfully');
            } catch (gi) {
              results.git_add = gi;
              spinner.fail('git failed to add local files');
              errors.push(gi);
            }

            spinner.start('Creating first git commit ..');

            try {
              results.git_commit = yield spawn('git', ['commit', '-m', 'Inicial'], {
                cwd: eb_base
              });
              spinner.succeed('git created first commit successfully');
            } catch (gi) {
              results.git_commit = gi;
              spinner.fail('git failed to create first commit');
              errors.push(gi);
            }
          }

          if (_this3.context.x_state.central_config.static == true) {
            spinner.start('Deploying *static version* to AWS ElasticBean .. please wait');
          } else {
            spinner.start('Deploying to AWS ElasticBean .. please wait');
          } // execute eb deploy


          try {
            if (_this3.context.x_config.nodeploy && _this3.context.x_config.nodeploy == true) {
              spinner.succeed('EB ready to be deployed (nodeploy as requested)');

              _this3.context.x_console.outT({
                message: "Aborting final deployment as requested",
                color: 'brightRed'
              });
            } else {
              results.eb_deploy = yield spawn('eb', ['deploy', eb_instance], {
                cwd: eb_base
              }); //, stdio:'inherit'

              spinner.succeed('EB deployed successfully');
            }
          } catch (gi) {
            //test if eb failed because instance has not being created yet, if so create it
            results.eb_deploy = gi;
            spinner.warn('EB failed to deploy'); //this.x_console.outT({ message:gi.toString(), color:'red'});

            if (gi.code == 4) {
              // IAM credentials are invalid or instance hasn't being created (eb create is missing)
              spinner.start('Checking if AWS credentials are valid ..');

              try {
                results.eb_create = yield spawn('aws', ['sts', 'get-caller-identity'], {
                  cwd: eb_base
                }); //, stdio:'inherit'

                spinner.succeed('AWS credentials are ok');
              } catch (aws_cred) {
                spinner.fail('Current AWS credentials are invalid');
                errors.push(aws_cred);
              }

              if (errors.length == 0) {
                spinner.start('EB it seems this is a new deployment: issuing eb create');

                try {
                  //console.log('\n');
                  results.eb_create = yield spawn('eb', ['create', eb_instance], {
                    cwd: eb_base
                  }); //, stdio:'inherit'

                  spinner.succeed('EB created and deployed successfully');
                } catch (ec) {
                  _this3.context.x_console.outT({
                    message: gi.stdout.toString(),
                    color: 'red'
                  });

                  spinner.fail('EB creation failed');
                  errors.push(gi);
                }
              }
            } else {
              _this3.context.x_console.outT({
                message: 'error: eb create (exitcode:' + gi.code + '):' + gi.stdout.toString(),
                color: 'red'
              });

              errors.push(gi);
            }
          } //if errors.length==0 && this.x_state.central_config.debug=='true'


          if (errors.length == 0 && _this3.context.x_state.central_config.debug == true && !_this3.context.x_config.nodeploy) {
            //open eb logging console
            var ci = require('ci-info');

            if (ci.isCI == false) {
              spinner.start('Opening EB debug terminal ..');

              try {
                var abs_cmd = path.resolve(eb_base);
                var cmd = "clear; sleep 2; clear; cd ".concat(abs_cmd, " && clear && eb open ").concat(eb_instance);
                results.eb_log = yield spawn('npx', ['terminal-tab', cmd], {
                  cwd: abs_cmd
                }); //, detached:true

                spinner.succeed("EB logging opened on new tab successfully");
              } catch (ot) {
                results.eb_log = ot;
                spinner.fail("I was unable to open a new tab terminal window with the EB debugging console");
              }
            } else {
              spinner.warn("Omitting EB debug, because a CI env was detected.");
            }
          } // eb deploy done

        }

        return errors;
      })();
    } //****************************
    // onPrepare and onEnd steps
    //****************************


    post() {
      var _this4 = this;

      return _asyncToGenerator(function* () {
        var ci = require('ci-info'); //restores aws credentials if modified by onPrepare after deployment


        if (!_this4.context.x_state.central_config.componente && _this4.context.x_state.central_config.deploy && _this4.context.x_state.central_config.deploy.indexOf('eb:') != -1 && _this4.context.x_state.config_node.aws && ci.isCI == false) {
          // @TODO add this block to deploys/eb 'post' method and onPrepare to 'pre' 20-br-21
          // only execute after deploy and if user requested specific aws credentials on map
          var path = require('path'),
              copy = require('recursive-copy'),
              os = require('os');

          var fs = require('fs');

          var aws_bak = path.join(_this4.context.x_state.dirs.base, 'aws_backup.ini');
          var aws_file = path.join(os.homedir(), '/.aws/') + 'credentials'; // try to copy aws_bak over aws_ini_file (if bak exists)

          if (yield _this4.context.exists(aws_bak)) {
            yield copy(aws_bak, aws_file, {
              overwrite: true,
              dot: true,
              debug: false
            }); // remove aws_bak file

            yield fs.promises.unlink(aws_bak);
          }
        }
      })();
    }

    pre() {
      var _this5 = this;

      return _asyncToGenerator(function* () {
        var ci = require('ci-info');

        if (!_this5.context.x_state.central_config.componente && _this5.context.x_state.central_config.deploy && _this5.context.x_state.central_config.deploy.indexOf('eb:') != -1 && ci.isCI == false) {
          // if deploying to AWS eb:x, then recover/backup AWS credentials from local system
          var ini = require('ini'),
              path = require('path'),
              fs = require('fs').promises; // read existing AWS credentials if they exist


          var os = require('os');

          var aws_ini = '';
          var aws_ini_file = path.join(os.homedir(), '/.aws/') + 'credentials';

          try {
            //this.debug('trying to read AWS credentials:',aws_ini_file);
            aws_ini = yield fs.readFile(aws_ini_file, 'utf-8');

            _this5.context.debug('AWS credentials:', aws_ini);
          } catch (err_reading) {} // 


          if (_this5.context.x_state.config_node.aws) {
            // if DSL defines temporal AWS credentials for this app .. 
            // create backup of aws credentials, if existing previously
            if (aws_ini != '') {
              var aws_bak = path.join(_this5.context.x_state.dirs.base, 'aws_backup.ini');

              _this5.context.x_console.outT({
                message: "config:aws:creating .aws/credentials backup",
                color: 'yellow'
              });

              yield fs.writeFile(aws_bak, aws_ini, 'utf-8');
            } // debug


            _this5.context.x_console.outT({
              message: "config:aws:access ->".concat(_this5.context.x_state.config_node.aws.access)
            });

            _this5.context.x_console.outT({
              message: "config:aws:secret ->".concat(_this5.context.x_state.config_node.aws.secret)
            }); // transform config_node.aws keys into ini


            var to_ini = ini.stringify({
              aws_access_key_id: _this5.context.x_state.config_node.aws.access,
              aws_secret_access_key: _this5.context.x_state.config_node.aws.secret
            }, {
              section: 'default'
            });

            _this5.context.debug('Setting .aws/credentials from config node'); // save as .aws/credentials (ini file)


            yield fs.writeFile(aws_ini_file, to_ini, 'utf-8');
          } else if (aws_ini != '') {
            // if DSL doesnt define AWS credentials, use the ones defined within the local system.
            var parsed = ini.parse(aws_ini);
            if (parsed.default) _this5.context.debug('Using local system AWS credentials', parsed.default);
            _this5.context.x_state.config_node.aws = {
              access: '',
              secret: ''
            };
            if (parsed.default.aws_access_key_id) _this5.context.x_state.config_node.aws.access = parsed.default.aws_access_key_id;
            if (parsed.default.aws_secret_access_key) _this5.context.x_state.config_node.aws.secret = parsed.default.aws_secret_access_key;
          }
        }
      })();
    }

  }

  class s3 extends base_deploy {
    constructor() {
      var {
        context = {}
      } = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
      super({
        context,
        name: 'AWS S3'
      });
    }

    logo() {
      var _this = this;

      return _asyncToGenerator(function* () {
        var cfonts = require('cfonts');

        cfonts.say(_this.name, _objectSpread2({}, {
          font: '3d',
          colors: ['red', '#333']
        }));
      })();
    }

    modifyPackageJSON(config) {
      return _asyncToGenerator(function* () {
        //little sass errors hack fix 13jun21
        var ci = require('ci-info');

        if (ci.isCI == false) ;

        return config;
      })();
    }

    modifyNuxtConfig(config) {
      var _this2 = this;

      return _asyncToGenerator(function* () {
        if (_this2.context.x_state.config_node.axios && _this2.context.x_state.config_node.axios.deploy) {
          var ax_config = config.axios;
          ax_config.baseURL = _this2.context.x_state.config_node.axios.deploy;
          ax_config.browserBaseURL = _this2.context.x_state.config_node.axios.deploy;
          delete ax_config.deploy;
          config.axios = ax_config;
        }

        _this2.context.x_state.central_config.static = true; //force static mode

        return config;
      })();
    }

    deploy() {
      var _this3 = this;

      return _asyncToGenerator(function* () {
        var build = {};

        _this3.context.x_console.title({
          title: 'Deploying to Amazon AWS S3',
          color: 'green'
        });

        yield _this3.logo(); // builds the app

        build.try_build = yield _this3.base_build();

        if (build.try_build.length > 0) {
          _this3.context.x_console.outT({
            message: "There was an error building the project.",
            color: 'red'
          });

          return false;
        } // deploys to aws


        build.deploy_aws_s3 = yield _this3.run(); //test if results.length>0 (meaning there was an error)

        if (build.deploy_aws_s3.length > 0) {
          _this3.context.x_console.outT({
            message: "There was an error deploying to Amazon AWS.",
            color: 'red',
            data: build.deploy_aws_s3.toString()
          });

          return false;
        }

        return true;
      })();
    }

    run() {
      var _this4 = this;

      return _asyncToGenerator(function* () {
        var spawn = require('await-spawn');

        var path = require('path');

        var errors = [],
            results = {};

        var bucket = _this4.context.x_state.central_config.deploy.replaceAll('s3:', '').trim();

        var aliases = [];

        var ci = require('ci-info');

        var spa_opt = {
          cwd: _this4.context.x_state.dirs.base
        };
        var profile = ['--profile', 'default'];

        if (ci.isCI == true) {
          //spa_opt.stdio = 'inherit';
          profile = [];
        }

        if (_this4.context.x_state.central_config.dominio) {
          bucket = _this4.context.x_state.central_config.dominio.trim();
        } //support for domain aliases


        if (bucket.includes('<-') == true) {
          require('extractjs');

          aliases = bucket.split('<-').pop().split(',');
          bucket = bucket.split('<-')[0].replaceAll('s3:', '').trim();
        } //


        var region = 'us-east-1';
        if (_this4.context.x_state.config_node.aws.region) region = _this4.context.x_state.config_node.aws.region;
        var dist_folder = path.join(_this4.context.x_state.dirs.compile_folder, 'dist/'); //AWS S3 deploy        

        _this4.context.debug('AWS S3 deploy'); //MAIN
        //create bucket policy


        var spinner = _this4.context.x_console.spinner({
          message: "Creating policy for bucket:".concat(bucket)
        });

        var policy = {
          Version: '2012-10-17',
          Statement: [{
            Sid: 'PublicReadGetObject',
            Effect: 'Allow',
            Principal: '*',
            Action: 's3:GetObject',
            Resource: "arn:aws:s3:::".concat(bucket, "/*")
          }]
        };
        var policyFile = path.join(_this4.context.x_state.dirs.base, 'policy.json');

        try {
          yield _this4.context.writeFile(policyFile, JSON.stringify(policy));
          spinner.succeed('Bucket policy created');
        } catch (x1) {
          spinner.fail('Bucket policy creation failed');
          errors.push(x1);
        } //create bucket


        spinner.start('Creating bucket');

        try {
          results.create_bucket = yield spawn('aws', ['s3api', 'create-bucket', '--bucket', bucket, '--region', region, ...profile], spa_opt); //, stdio:'inherit'

          spinner.succeed("Bucket created in ".concat(region));
        } catch (x2) {
          spinner.fail('Bucket creation failed');
          errors.push(x2);
        } //add bucket policy
        //aws s3api put-bucket-policy --bucket www.happy-bunny.xyz --policy file:///tmp/bucket_policy.json --profile equivalent


        spinner.start('Adding bucket policy');

        try {
          results.adding_policy = yield spawn('aws', ['s3api', 'put-bucket-policy', '--bucket', bucket, '--policy', 'file://' + policyFile, ...profile], spa_opt); //, stdio:'inherit'

          spinner.succeed("Bucket policy added correctly");
        } catch (x3) {
          spinner.fail('Adding bucket policy failed');
          errors.push(x3);
        } //upload website files to bucket
        //aws s3 sync /tmp/SOURCE_FOLDER s3://www.happy-bunny.xyz/  --profile equivalent


        spinner.start('Uploading website files to bucket');

        try {
          results.website_upload = yield spawn('aws', ['s3', 'sync', dist_folder, 's3://' + bucket + '/', ...profile], spa_opt); //, stdio:'inherit'

          spinner.succeed("Website uploaded successfully");
        } catch (x4) {
          spinner.fail('Failed uploading website files');
          errors.push(x4);
        } //set s3 bucket as website, set index.html and error page
        //aws s3 website s3://www.happy-bunny.xyz/ --index-document index.html --error-document error.html --profile equivalent


        spinner.start('Setting S3 bucket as type website');

        try {
          results.set_as_website = yield spawn('aws', ['s3', 'website', 's3://' + bucket + '/', '--index-document', 'index.html', '--error-document', '200.html', ...profile], spa_opt);
          spinner.succeed("Bucket configured as website successfully");
        } catch (x5) {
          spinner.fail('Failed configuring bucket as website');
          errors.push(x5);
        } //ALIASES


        var fs = require('fs').promises;

        if (aliases.length > 0) {
          for (var alias of aliases) {
            var _spinner = _this4.context.x_console.spinner({
              message: "Creating policy for bucket alias:".concat(alias)
            });

            var _policy = {
              RedirectAllRequestsTo: {
                HostName: bucket
              }
            };

            var _policyFile = path.join(_this4.context.x_state.dirs.base, 'policy_alias.json');

            try {
              yield _this4.context.writeFile(_policyFile, JSON.stringify(_policy));

              _spinner.succeed("Bucket alias '".concat(alias, "' policy created"));
            } catch (x1) {
              _spinner.fail("Bucket alias '".concat(alias, "' policy creation failed"));

              errors.push(x1);
            } //create bucket


            _spinner.start("Creating bucket alias '".concat(alias, "'"));

            try {
              results.create_bucket = yield spawn('aws', ['s3api', 'create-bucket', '--bucket', alias, '--region', region, ...profile], spa_opt); //, stdio:'inherit'

              _spinner.succeed("Bucket alias '".concat(alias, "' created in ").concat(region));
            } catch (x2) {
              _spinner.fail("Bucket alias '".concat(alias, "' creation failed"));

              errors.push(x2);
            } //add bucket policy


            _spinner.start("Adding bucket alias '".concat(alias, "' policy"));

            try {
              results.adding_policy = yield spawn('aws', ['s3api', 'put-bucket-website', '--bucket', alias, '--website-configuration', 'file://policy_alias.json', ...profile], spa_opt); //, stdio:'inherit'

              _spinner.succeed("Bucket alias '".concat(alias, "' policy added correctly"));
            } catch (x2) {
              _spinner.fail("Adding bucket alias '".concat(alias, "' policy failed"));

              errors.push(x2);
            } //erase policy_alias.json file


            try {
              yield fs.unlink(_policyFile);
            } catch (err_erasepolicy_alias) {}
          }
        }

        if (errors.length == 0) {
          _this4.context.x_console.out({
            message: "Website ready at http://".concat(bucket, ".s3-website-").concat(region, ".amazonaws.com/"),
            color: 'brightCyan'
          });
        } //erase policy.json file


        try {
          yield fs.unlink(policyFile);
        } catch (err_erasepolicy) {} //ready


        return errors;
      })();
    } //****************************
    // onPrepare and onEnd steps
    //****************************


    post() {
      var _this5 = this;

      return _asyncToGenerator(function* () {
        var ci = require('ci-info'); //restores aws credentials if modified by onPrepare after deployment


        if (!_this5.context.x_state.central_config.componente && _this5.context.x_state.central_config.deploy && _this5.context.x_state.central_config.deploy.indexOf('s3:') != -1 && _this5.context.x_state.config_node.aws && ci.isCI == false) {
          // @TODO add this block to deploys/s3 'post' method and onPrepare to 'pre' 20-br-21
          // only execute after deploy and if user requested specific aws credentials on map
          var path = require('path'),
              copy = require('recursive-copy'),
              os = require('os');

          var fs = require('fs');

          var aws_bak = path.join(_this5.context.x_state.dirs.base, 'aws_backup.ini');
          var aws_file = path.join(os.homedir(), '/.aws/') + 'credentials'; // try to copy aws_bak over aws_ini_file (if bak exists)

          if (yield _this5.context.exists(aws_bak)) {
            yield copy(aws_bak, aws_file, {
              overwrite: true,
              dot: true,
              debug: false
            }); // remove aws_bak file

            yield fs.promises.unlink(aws_bak);
          }
        }
      })();
    }

    pre() {
      var _this6 = this;

      return _asyncToGenerator(function* () {
        var ci = require('ci-info');

        if (!_this6.context.x_state.central_config.componente && _this6.context.x_state.central_config.deploy && _this6.context.x_state.central_config.deploy.indexOf('s3:') != -1 && ci.isCI == false) {
          // if deploying to AWS s3:x, then recover/backup AWS credentials from local system
          var ini = require('ini'),
              path = require('path'),
              fs = require('fs').promises; // read existing AWS credentials if they exist


          var os = require('os');

          var aws_ini = '';
          var aws_ini_file = path.join(os.homedir(), '/.aws/') + 'credentials';

          try {
            //this.debug('trying to read AWS credentials:',aws_ini_file);
            aws_ini = yield fs.readFile(aws_ini_file, 'utf-8');

            _this6.context.debug('AWS credentials:', aws_ini);
          } catch (err_reading) {} // 


          if (_this6.context.x_state.config_node.aws) {
            // if DSL defines temporal AWS credentials for this app .. 
            // create backup of aws credentials, if existing previously
            if (aws_ini != '') {
              var aws_bak = path.join(_this6.context.x_state.dirs.base, 'aws_backup.ini');

              _this6.context.x_console.outT({
                message: "config:aws:creating .aws/credentials backup",
                color: 'yellow'
              });

              yield fs.writeFile(aws_bak, aws_ini, 'utf-8');
            } // debug


            _this6.context.x_console.outT({
              message: "config:aws:access ->".concat(_this6.context.x_state.config_node.aws.access)
            });

            _this6.context.x_console.outT({
              message: "config:aws:secret ->".concat(_this6.context.x_state.config_node.aws.secret)
            });

            if (_this6.context.x_state.config_node.aws.region) {
              _this6.context.x_console.outT({
                message: "config:aws:region ->".concat(_this6.context.x_state.config_node.aws.region)
              });
            } // transform config_node.aws keys into ini


            var to_aws = {
              aws_access_key_id: _this6.context.x_state.config_node.aws.access,
              aws_secret_access_key: _this6.context.x_state.config_node.aws.secret
            };

            if (_this6.context.x_state.config_node.aws.region) {
              to_aws.region = _this6.context.x_state.config_node.aws.region;
            }

            var to_ini = ini.stringify(to_aws, {
              section: 'default'
            });

            _this6.context.debug('Setting .aws/credentials from config node'); // save as .aws/credentials (ini file)


            yield fs.writeFile(aws_ini_file, to_ini, 'utf-8');
          } else if (aws_ini != '') {
            // if DSL doesnt define AWS credentials, use the ones defined within the local system.
            var parsed = ini.parse(aws_ini);
            if (parsed.default) _this6.context.debug('Using local system AWS credentials', parsed.default);
            _this6.context.x_state.config_node.aws = {
              access: '',
              secret: ''
            };
            if (parsed.default.aws_access_key_id) _this6.context.x_state.config_node.aws.access = parsed.default.aws_access_key_id;
            if (parsed.default.aws_secret_access_key) _this6.context.x_state.config_node.aws.secret = parsed.default.aws_secret_access_key;
            if (parsed.default.region) _this6.context.x_state.config_node.aws.region = parsed.default.region;
          }
        }
      })();
    }

  }

  class ghpages extends base_deploy {
    constructor() {
      var {
        context = {}
      } = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
      super({
        context,
        name: 'GH Pages'
      });
    }

    modifyNuxtConfig(config) {
      var _this = this;

      return _asyncToGenerator(function* () {
        // use axios deploy endpoint
        if (_this.context.x_state.config_node.axios && _this.context.x_state.config_node.axios.deploy) {
          var ax_config = config.axios;
          ax_config.baseURL = _this.context.x_state.config_node.axios.deploy;
          ax_config.browserBaseURL = _this.context.x_state.config_node.axios.deploy;
          delete ax_config.deploy;
          config.axios = ax_config;
        } //force a static build, since ghpages only support those


        config.ssr = false;
        config.target = 'static';
        config.performance.gzip = false;
        return config;
      })();
    }

    deploy() {
      var _this2 = this;

      return _asyncToGenerator(function* () {
        var build = {};

        _this2.context.x_console.title({
          title: 'Creating GH Workflow for deploying on ghpages on commit',
          color: 'green'
        });

        yield _this2.logo({
          config: {
            font: 'chrome',
            gradient: false,
            space: true,
            colors: ['#F2F3F4', '#0C70E0']
          }
        }); // builds the app; github can build the app

        /*
        build.try_build = await this.base_build(); 
        if (build.try_build.length>0) {
            this.context.x_console.outT({ message:`There was an error building the project.`, color:'red' });
            return false;
        }*/
        // creates github actions folder, and workflow

        build.create_ghp = yield _this2.run(); //test if results.length>0 (meaning there was an error)

        if (build.create_ghp.length > 0) {
          _this2.context.x_console.outT({
            message: "There was an error creating the github workflow.",
            color: 'red',
            data: build.create_ghp.toString()
          });

          return false;
        }

        return true;
      })();
    }

    run() {
      var _this3 = this;

      return _asyncToGenerator(function* () {
        var yaml = require('yaml'),
            errors = [];

        var spinner = _this3.context.x_console.spinner({
          message: 'Creating github workflow for building and publishing'
        });

        var data = {
          name: 'DSL Build and Publish',
          on: 'push',
          jobs: {
            build: {
              name: 'Build and publish',
              'runs-on': 'ubuntu-latest',
              steps: [{
                name: 'Downloads repo code',
                uses: 'actions/checkout@2',
                with: {
                  submodules: 'recursive'
                }
              }, {
                name: 'Install packages',
                run: 'npm install'
              }, {
                name: 'Builds static distribution',
                run: 'npm run build'
              }, {
                name: 'Publish dist to GHPages of current repo',
                uses: 'peaceiris/actions-gh-pages@v3',
                with: {
                  github_token: '${{ secrets.GITHUB_TOKEN }}',
                  publish_dir: './dist'
                }
              }]
            }
          }
        };
        var content = yaml.stringify(data);

        var path = require('path'),
            fs = require('fs').promises;

        var target = path.join(_this3.context.x_state.dirs.app, '.github', 'workflows'); // create .github/workflows directory if needed

        try {
          yield fs.mkdir(target, {
            recursive: true
          });
          target = path.join(target, "publish.yml");
          yield _this3.context.writeFile(target, content);
          spinner.succeed('Github workflow ready');
        } catch (errdir) {
          spinner.fail('Github workflow failed');
          errors.push('Github workflow failed');
        } // create /.gitignore file for built repo


        spinner.start('Writing repo .gitignore file ..');
        var git = 'dist\n';
        git += 'secrets\n';
        git += 'node_modules';
        target = path.join(_this3.context.x_state.dirs.app, '.gitignore');
        yield _this3.context.writeFile(target, git);
        spinner.succeed('Github .gitignore ready');
        return errors;
      })();
    } //****************************
    // onPrepare and onEnd steps
    //****************************


    post() {
      return _asyncToGenerator(function* () {})();
    }

    pre() {
      return _asyncToGenerator(function* () {})();
    }

  }

  var concepto = require('@concepto/interface'); //import { timingSafeEqual } from 'crypto';
  class vue_dsl extends concepto {
    constructor(file) {
      var config = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
      // we can get class name, from package.json name key (after its in its own project)
      var my_config = {
        class: 'vue',
        debug: true
      };

      var nuevo_config = _objectSpread2(_objectSpread2({}, my_config), config);

      super(file, nuevo_config); //,...my_config
      // custom dsl_git version

      this.x_config.dsl_git = /*#__PURE__*/function () {
        var _ref = _asyncToGenerator(function* (content) {
          //save git version
          var tmp = {},
              fs = require('fs').promises,
              path = require('path'); //SECRETS


          this.x_state.central_config = yield this._readCentralConfig();
          this.x_state.config_node = yield this._readConfig(false);

          if (this.x_flags.dsl.includes('_git.dsl')) {
            // if file is x_git.dsl, expand secrets
            this.x_console.outT({
              message: 'we are the git!',
              color: 'green'
            });
            this.x_state.config_node = yield this._restoreSecrets(this.x_state.config_node);
            delete this.x_state.config_node[':id'];
            delete this.x_state.config_node[':secrets'];
            delete this.x_state.config_node['::secrets']; //search and erase config->:secrets node
            //this.x_console.out({ message:'config read on git',data:this.x_state.config_node });
          } else {
            // if file is x.dsl,
            // write x_git.dsl
            tmp.dsl_path = path.dirname(path.resolve(this.x_flags.dsl));
            tmp.dsl_git = path.join(tmp.dsl_path, path.basename(this.x_flags.dsl).replace('.dsl', '_git.dsl'));
            yield fs.writeFile(tmp.dsl_git, content, 'utf-8');
            this.debug("custom dsl_git file saved as: ".concat(tmp.dsl_git)); // export secret keys as :secrets node to eb_git.dsl

            yield this._secretsToGIT(this.x_state.config_node);
          } //

        });

        return function (_x) {
          return _ref.apply(this, arguments);
        };
      }().bind(this); //

    } // SECRETS helpers (@todo move this to concepto class)


    _secretsToGIT(resp) {
      var _this = this;

      return _asyncToGenerator(function* () {
        var path = require('path'),
            fs = require('fs').promises;

        var encrypt = require('encrypt-with-password');

        var curr_dsl = path.basename(_this.x_flags.dsl); // secret nodes to _git.dsl file

        if (resp['::secrets'] && resp['::secrets'].length > 0 && !curr_dsl.includes('_git.')) {
          //encrypt existing secret (password) nodes and save them as config->:secrets within _git.dsl file version
          var password = '';
          if (_this.x_config.secrets_pass && _this.x_config.secrets_pass != '') password = _this.x_config.secrets_pass.trim();

          if (password == '') {
            //if a password was not given, invent a memorable one
            var gpass = require('password-generator');

            password = gpass();
            resp[':password'] = password; //inform a pass was created
          } //encrypt secrets object


          var to_secrets = encrypt.encryptJSON(resp['::secrets'], password); //create :secrets node within eb_git.dsl file

          var dsl_parser = require('@concepto/dsl_parser');

          var dsl = new dsl_parser({
            file: _this.x_flags.dsl.replace('.dsl', '_git.dsl'),
            config: {
              cancelled: true,
              debug: false
            }
          });

          try {
            yield dsl.process();
          } catch (d_err) {
            _this.x_console.out({
              message: "error: file ".concat(_this.x_flags.dsl.replace('.dsl', '_git.dsl'), " does't exist!"),
              data: d_err
            });

            return;
          }

          var new_content = yield dsl.addNode({
            parent_id: resp[':id'],
            node: {
              text: ':secrets',
              icons: ['password'],
              text_note: to_secrets
            }
          });
          var tmp = {};
          tmp.dsl_git_path = path.dirname(path.resolve(_this.x_flags.dsl));
          var git_target = path.join(tmp.dsl_git_path, path.basename(_this.x_flags.dsl).replace('.dsl', '_git.dsl')); //,path.basename(this.x_flags.dsl)

          yield fs.writeFile(git_target, new_content, 'utf-8');

          _this.debug("dsl_git file saved as: ".concat(git_target));

          if (resp[':password']) {
            _this.x_console.outT({
              message: "Password generated for DSL GIT secrets ->".concat(password),
              color: 'brightGreen'
            });
          } //

        }

        return resp;
      })();
    } // restore :secrets node info if it exists and a password was given


    _restoreSecrets(resp) {
      var _this2 = this;

      return _asyncToGenerator(function* () {
        var path = require('path'),
            fs = require('fs').promises;

        var encrypt = require('encrypt-with-password');

        var curr_dsl = path.basename(_this2.x_flags.dsl);

        if (curr_dsl.includes('_git.') && resp[':secrets']) {
          _this2.x_console.outT({
            message: "Secrets node detected!",
            color: 'brightCyan'
          });

          if (_this2.x_config.secrets_pass && _this2.x_config.secrets_pass != '') {
            _this2.x_console.outT({
              message: 'Decrypting config->secrets',
              color: 'brightGreen'
            });

            try {
              var from_secrets = encrypt.decryptJSON(resp[':secrets'], _this2.x_config.secrets_pass); // read nodes into resp struct

              for (var xs of from_secrets) {
                resp = _objectSpread2(_objectSpread2({}, resp), _this2.configFromNode(resp, xs));
              }

              var tmp = {};
              tmp.dsl_git_path = path.dirname(path.resolve(_this2.x_flags.dsl));
              tmp.non_target = path.join(tmp.dsl_git_path, path.basename(_this2.x_flags.dsl).replace('_git.dsl', '.dsl'));
              tmp.exists_non = yield _this2.exists(tmp.non_target);

              if (true) {
                //!tmp.exists_non
                _this2.x_console.outT({
                  message: 'Expanding secrets into ' + curr_dsl.replace('_git.dsl', '.dsl'),
                  color: 'cyan'
                }); // expand secret nodes into non _git.dsl version config key


                var dsl_parser = require('@concepto/dsl_parser');

                var dsl = new dsl_parser({
                  file: _this2.x_flags.dsl,
                  config: {
                    cancelled: true,
                    debug: false
                  }
                });

                try {
                  yield dsl.process();
                } catch (d_err) {
                  _this2.x_console.out({
                    message: "error: file ".concat(_this2.x_flags.dsl, " does't exist!"),
                    data: d_err
                  });

                  return;
                } // remove config->:secrets node if it exists


                var $ = dsl.getParser();
                var search = $("node[TEXT=config] node[TEXT=:secrets]").toArray();
                search.map(function (elem) {
                  $(elem).remove();
                }); //

                var new_content = '';

                for (var sn of from_secrets) {
                  new_content = yield dsl.addNode({
                    parent_id: resp[':id'],
                    node: sn
                  });
                } // save expanded x.dsl file (only if it doesnt exist)


                yield fs.writeFile(tmp.non_target, new_content, 'utf-8');

                _this2.debug("recovered dsl file saved as: ".concat(tmp.non_target));
              } //

            } catch (invpass) {
              //console.log(invpass);
              _this2.x_console.outT({
                message: 'Invalid --secret-pass value for map (check your password)',
                color: 'brightRed'
              });

              _this2.x_console.outT({
                message: 'WARNING: The process may fail if keys are needed',
                color: 'red'
              });
            }
          } else {
            _this2.x_console.outT({
              message: 'WARNING: file contains secrets, but no --secrets-pass arg was given',
              color: 'brightRed'
            });

            _this2.x_console.outT({
              message: 'WARNING: The process may fail if keys are needed',
              color: 'red'
            });
          }
        }

        return resp;
      })();
    } //
    // **************************
    // methods to be auto-called
    // **************************
    //Called after init method finishes


    onInit() {
      var _this3 = this;

      return _asyncToGenerator(function* () {
        // define and assign commands
        _this3.x_console.outT({
          message: "Vue Compiler",
          color: "brightCyan"
        }); //await this.addCommands(internal_commands);


        if (Object.keys(_this3.x_commands).length > 0) _this3.x_console.outT({
          message: "".concat(Object.keys(_this3.x_commands).length, " local x_commands loaded!"),
          color: "green"
        }); //this.debug('x_commands',this.x_commands);
        //this.x_crypto_key = require('crypto').randomBytes(32); // for hash helper method
        // init vue
        // set x_state defaults

        _this3.x_state = _objectSpread2(_objectSpread2({}, _this3.x_state), {
          plugins: {},
          npm: {},
          dev_npm: {},
          envs: {},
          functions: {},
          proxies: {},
          pages: {},
          current_func: '',
          current_folder: '',
          current_proxy: '',
          strings_i18n: {},
          stores: {},
          stores_types: {
            versions: {},
            expires: {}
          },
          global_head: {},
          // head scripts for index.html
          bootloader: {
            imports: {} // imports for bootloader.js (ex. vue plugins)

          },
          vue_config: {
            // custom vue.config.js
            lintOnSave: false,
            // disable eslint
            mfPlugin: {
              name: '',
              filename: 'remoteEntry.js',
              remotes: {},
              exposes: {},
              shared: {
                '{...deps}': '',
                vue: {
                  eager: true,
                  singleton: true,
                  requiredVersion: 'deps.vue'
                },
                "vue-router": {
                  eager: true,
                  singleton: true,
                  requiredVersion: 'deps["vue-router"]'
                },
                vuex: {
                  eager: true,
                  singleton: true,
                  requiredVersion: 'deps["vuex"]'
                }
              }
            }
          },
          nuxt_config: {
            head_script: {},
            build_modules: {},
            modules: {}
          }
        });
        if (!_this3.x_state.config_node) _this3.x_state.config_node = yield _this3._readConfig();
        _this3.x_state.central_config = yield _this3._readCentralConfig(); //this.debug('this.x_state',this.x_state);
        //if requested silence...

        if (_this3.x_config.silent) {
          _this3.x_console.outT({
            message: "silent mode requested",
            color: "dim"
          }); //this.x_console.setSilent(true);


          _this3.x_config.debug = false;
        } //if requested change deploy target


        if (_this3.x_config.deploy && _this3.x_config.deploy.trim() != '') {
          _this3.x_console.outT({
            message: "(as requested) force changing deploy target to: ".concat(_this3.x_config.deploy.trim()),
            color: "brightYellow"
          });

          _this3.x_state.central_config.deploy = _this3.x_config.deploy;
        }

        var compile_folder = _this3.x_state.central_config.apptitle;

        if (_this3.x_config.folder && _this3.x_config.folder.trim() != '') {
          compile_folder = _this3.x_config.folder.trim();
        }

        if (_this3.x_config.aws_region && _this3.x_config.aws_region.trim() != '') {
          if (!_this3.x_state.config_node.aws) _this3.x_state.config_node.aws = {};
          _this3.x_state.config_node.aws.region = _this3.x_config.aws_region.trim();
        } //this.debug('central_config',this.x_state.central_config);


        _this3.x_state.assets = yield _this3._readAssets(); //this.debug('assets_node',this.x_state.assets);

        var target_folders = {};
        target_folders = {
          'client': 'src/',
          'layouts': 'src/layouts/',
          'components': 'src/components/',
          'pages': 'src/pages/',
          'plugins': 'src/plugins/',
          'static': 'src/static/',
          'public': 'public/',
          'middleware': 'src/middleware/',
          'server': '',
          // not supported here 'src/server/',
          'assets': 'src/assets/',
          'css': 'src/assets/css/',
          'store': 'src/store/',
          'lang': 'src/lang/',
          'secrets': 'secrets/'
        };

        if (_this3.x_state.central_config.storybook == true) {
          target_folders['storybook'] = '.storybook/';
          target_folders['stories'] = 'stories2/';
          target_folders['stories_assets'] = 'stories2/assets/';
        }

        _this3.x_state.dirs = yield _this3._appFolders(target_folders, compile_folder); // read modelos node (virtual DB)

        _this3.x_state.models = yield _this3._readModelos(); //alias: database tables
        //is local server running? if so, don't re-launch it

        _this3.x_state.nuxt_is_running = yield _this3._isLocalServerRunning();

        _this3.debug('is Server Running: ' + _this3.x_state.nuxt_is_running); // init terminal diagnostics (not needed here)


        _this3.x_state.es6 = true; // copy sub-directories if defined in node 'config.copiar' key

        if (_this3.x_state.config_node.copiar) {
          var _path = require('path');

          var copy = require('recursive-copy');

          _this3.x_console.outT({
            message: "copying config:copiar directories to 'static' target folder",
            color: "yellow"
          });

          yield Object.keys(_this3.x_state.config_node.copiar).map( /*#__PURE__*/function () {
            var _ref2 = _asyncToGenerator(function* (key) {
              var abs = _path.join(this.x_state.dirs.base, key);

              try {
                yield copy(abs, this.x_state.dirs.static);
              } catch (err_copy) {
                if (err_copy.code != 'EEXIST') this.x_console.outT({
                  message: "error: copying directory ".concat(abs),
                  data: err_copy
                });
              } //console.log('copying ',{ from:abs, to:this.x_state.dirs.static });

            });

            return function (_x2) {
              return _ref2.apply(this, arguments);
            };
          }().bind(_this3));

          _this3.x_console.outT({
            message: "copying config:copiar directories ... READY",
            color: "yellow"
          });

          delete _this3.x_state.config_node.copiar;
        } // *********************************************
        // install requested modules within config node
        // *********************************************
        // NUXT:ICON


        if (_this3.x_state.config_node['nuxt:icon']) {
          //@TODO refactor this later nuxt:icon -> favicon (as is now for compatibility)
          // copy icon to static dir
          var _path2 = require('path');

          var source = _path2.join(_this3.x_state.dirs.base, _this3.x_state.config_node['nuxt:icon']);

          var target = _this3.x_state.dirs.static + 'icon.png';

          _this3.debug({
            message: "favicon dump (copy icon)",
            color: "yellow",
            data: source
          });

          var fs = require('fs').promises;

          try {
            yield fs.copyFile(source, target);
          } catch (err_fs) {
            _this3.x_console.outT({
              message: "error: copying favicon icon",
              data: err_fs
            });
          }
        } // GOOGLE:ADSENSE


        if (_this3.x_state.config_node['google:adsense']) {
          _this3.x_state.npm['vue-google-adsense'] = '*';
          _this3.x_state.npm['vue-script2'] = '*';
        } // GOOGLE:ANALYTICS


        if (_this3.x_state.config_node['google:analytics']) {
          _this3.x_state.npm['@nuxtjs/google-gtag'] = '*';
        } // ADD v-mask if latest Nuxt/Vuetify, because vuetify v2+ no longer includes masks support


        _this3.x_state.plugins['v-mask'] = {
          global: true,
          mode: 'client',
          npm: {
            'v-mask': '*'
          },
          customcode: "import Vue from 'vue';\nimport VueMask from 'v-mask';\nVue.directive('mask', VueMask.VueMaskDirective);\nVue.use(VueMask);",
          dev_npm: {}
        }; // DEFAULT NPM MODULES & PLUGINS

        _this3.x_console.outT({
          message: "vue initialized() ->"
        });

        _this3.x_state.npm['axios'] = '*'; // axios

        _this3.x_state.npm['axios-retry'] = '*';
        _this3.x_state.npm['underscore'] = '*'; // underscore

        _this3.x_state.dev_npm['vue-beautify-loader'] = '*'; // beautify
        // Add VueJS + Vuetify + MF support
        // dev packages

        _this3.x_state.dev_npm['@babel/core'] = '^7.15.8';
        _this3.x_state.dev_npm['@babel/eslint-parser'] = '^7.12.16';
        _this3.x_state.dev_npm['@babel/plugin-transform-runtime'] = '^7.15.8';
        _this3.x_state.dev_npm['@vue/cli-plugin-babel'] = '~5.0.0';
        _this3.x_state.dev_npm['@vue/cli-plugin-eslint'] = '~5.0.0';
        _this3.x_state.dev_npm['@vue/cli-service'] = '~5.0.0';
        _this3.x_state.dev_npm['eslint'] = '^7.32.0';
        _this3.x_state.dev_npm['eslint-plugin-vue'] = '^8.0.3';
        _this3.x_state.dev_npm['sass'] = '~1.32';
        _this3.x_state.dev_npm['sass-loader'] = '^10.0.0';
        _this3.x_state.dev_npm['vue-cli-plugin-vuetify'] = '~2.5.8';
        _this3.x_state.dev_npm['vue-template-compiler'] = '^2.6.14';
        _this3.x_state.dev_npm['vuetify-loader'] = '^1.7.0';
        _this3.x_state.dev_npm['vue-loader'] = '*';
        _this3.x_state.dev_npm['webpack'] = '^5.57.1';
        _this3.x_state.dev_npm['html-webpack-plugin'] = '^5.5.0'; // dep packages

        _this3.x_state.npm['core-js'] = '^3.8.3';
        _this3.x_state.npm['vue'] = '^2.6.14';
        _this3.x_state.npm['vuex'] = '^3.6.2';
        _this3.x_state.npm['vue-router'] = '^3.6.5';
        _this3.x_state.npm['vuetify'] = '^2.6.13'; // default plugins

        _this3.x_state.plugins['vue-moment'] = {
          global: true,
          mode: 'client',
          npm: {
            'vue-moment': '*'
          },
          extra_imports: ['moment'],
          requires: ['moment/locale/es'],
          config: '{ moment }'
        }; // express things
        //this.x_state.npm['express'] = '*';
        //this.x_state.npm['serverless-http'] = '*';
        //this.x_state.npm['serverless-apigw-binary'] = '*';
        // dev tools
        //this.x_state.dev_npm['serverless-prune-plugin'] = '*';
        //this.x_state.dev_npm['serverless-offline'] = '*';
        //

        /*
        if (this.x_state.central_config.dominio) {
            this.x_state.dev_npm['serverless-domain-manager'] = '*';
        }*/
        // serialize 'secret' config keys as json files in app secrets sub-directory (if any)
        // extract 'secret's from config keys; 

        /* */

        _this3.x_state.secrets = {}; //await _extractSecrets(config_node)

        var path = require('path');

        for (var key in _this3.x_state.config_node) {
          if (typeof key === 'string' && key.includes(':') == false) {
            if (_this3.x_state.config_node[key][':secret']) {
              var new_obj = _objectSpread2({}, _this3.x_state.config_node[key]);

              delete new_obj[':secret'];
              if (new_obj[':link']) delete new_obj[':link']; // set object keys to uppercase

              _this3.x_state.secrets[key] = {};
              var obj_keys = Object.keys(new_obj);

              for (var x in obj_keys) {
                _this3.x_state.secrets[key][x.toUpperCase()] = new_obj[x];
              }

              var _target = path.join(_this3.x_state.dirs.secrets, "".concat(key, ".json"));

              yield _this3.writeFile(_target, JSON.stringify(new_obj));
            }
          }
        } // set config keys as ENV accesible variables (ex. $config.childnode.attributename)


        var _loop = function _loop(_key) {
          // omit special config 'reserved' node keys
          if (['aurora', 'vpc', 'aws'].includes(_key) && typeof _this3.x_state.config_node[_key] === 'object') {
            Object.keys(_this3.x_state.config_node[_key]).map(function (attr) {
              this.x_state.envs["config.".concat(_key, ".").concat(attr)] = "process.env.".concat((_key + '_' + attr).toUpperCase());
            }.bind(_this3));
          }
        };

        for (var _key in _this3.x_state.config_node) {
          _loop(_key);
        } // show this.x_state contents
        //this.debug('x_state says',this.x_state);

      })();
    } //Called after parsing nodes


    onAfterProcess(processedNode) {
      return _asyncToGenerator(function* () {
        return processedNode;
      })();
    } //Called for defining the title of class/page by testing node.


    onDefineTitle(node) {
      var _this4 = this;

      return _asyncToGenerator(function* () {
        var resp = node.text;
        Object.keys(node.attributes).map(function (i) {
          if (i == 'title' || i == 'titulo') {
            resp = node.attributes[i];
            return false;
          }
        }.bind(_this4));
        /*
        for (i in node.attributes) {
        	if (['title','titulo'].includes(node.attributes[i])) {
        		resp = node.attributes[i];
        		break;
        	}
        }*/

        return resp;
      })();
    } //Called for naming filename of class/page by testing node.


    onDefineFilename(node) {
      return _asyncToGenerator(function* () {
        var resp = node.text; // @idea we could use some 'slug' method here

        resp = resp.replace(/\ /g, '_') + '.vue';

        if (node.icons.includes('gohome')) {
          resp = 'index.vue';
        } else if (node.icons.includes('desktop_new')) {
          if (node.text.indexOf('assets') != -1) {
            resp = 'internal_assets.omit';
          } else if (node.text.indexOf('store') != -1) {
            resp = 'internal_stores.omit';
          } else if (node.text.indexOf('proxy') != -1 || node.text.indexOf('proxies') != -1) {
            resp = 'internal_middleware.omit';
          } else if (node.text.indexOf('config') != -1) {
            resp = 'config.omit';
          } else if (node.text.indexOf('modelos') != -1) {
            resp = 'modelos.omit';
          } else if (['servidor', 'server', 'api'].includes(node.text)) {
            resp = 'server.omit';
          }
        } else if (node.text.indexOf('componente:') != -1) {
          resp = node.text.split(':')[node.text.split(':').length - 1] + '.vue';
        } else if (node.text.indexOf('layout:') != -1) {
          resp = node.text.split(':')[node.text.split(':').length - 1] + '.vue';
        } else if (node.icons.includes('list')) {
          resp = resp.replaceAll('.vue', '.group');
        }

        return resp;
      })();
    } //Called for naming the class/page by testing node.


    onDefineNodeName(node) {
      return _asyncToGenerator(function* () {
        return node.text.replace(' ', '_');
      })();
    } //Defines template for code given the processedNode of process() - for each level2 node


    onCompleteCodeTemplate(processedNode) {
      return _asyncToGenerator(function* () {
        return processedNode;
      })();
    } //Defines preparation steps before processing nodes.


    onPrepare() {
      var _this5 = this;

      return _asyncToGenerator(function* () {
        if (Object.keys(_this5.x_commands).length > 0) _this5.x_console.outT({
          message: "".concat(Object.keys(_this5.x_commands).length, " x_commands loaded!"),
          color: "green"
        });
        _this5.deploy_module = {
          pre: () => {},
          post: () => {},
          deploy: () => true
        };
        var deploy = _this5.x_state.central_config.deploy;

        if (deploy) {
          deploy += '';

          if (deploy.includes('eb:')) {
            _this5.deploy_module = new eb({
              context: _this5
            });
          } else if (deploy.includes('s3:')) {
            _this5.deploy_module = new s3({
              context: _this5
            });
          } else if (deploy == 'local') {
            _this5.deploy_module = new local({
              context: _this5
            }); //
          } else if (deploy == 'remote') {
            _this5.deploy_module = new remote({
              context: _this5
            });
          } else if (deploy == 'ghpages') {
            _this5.deploy_module = new ghpages({
              context: _this5
            });
          } else ;
        }

        yield _this5.deploy_module.pre();
      })();
    } //Executed when compiler founds an error processing nodes.


    onErrors(errors) {
      var _this6 = this;

      return _asyncToGenerator(function* () {
        _this6.errors_found = true;
      })();
    } //configNode helper


    generalConfigSetup() {
      var _this7 = this;

      return _asyncToGenerator(function* () {
        //this.x_state.dirs.base
        _this7.debug('Setting general configuration steps');

        _this7.debug('Declaring vue.config.js : initializing'); // default modules


        _this7.debug('Declaring vue.config.js : default modules'); //google analytics


        if (_this7.x_state.config_node['google:analytics']) {
          _this7.debug('Declaring Google Analytics: NOT SUPPORTED FOR NOW');
          /*
          this.x_state.nuxt_config.build_modules['@nuxtjs/google-gtag'] = {
              'id': this.x_state.config_node['google:analytics'].id,
              'debug': true,
              'disableAutoPageTrack': true
          };
          if (this.x_state.config_node['google:analytics'].local) this.x_state.nuxt_config.build_modules['@nuxtjs/google-gtag'].debug = this.x_state.config_node['google:analytics'].local;
          if (this.x_state.config_node['google:analytics'].auto && this.x_state.config_node['google:analytics'].auto == true) {
              delete this.x_state.nuxt_config.build_modules['@nuxtjs/google-gtag']['disableAutoPageTrack'];
          }*/

        } //medianet


        if (_this7.x_state.config_node['ads:medianet'] && _this7.x_state.config_node['ads:medianet']['cid']) {
          _this7.debug('Declaring MediaNet');

          _this7.x_state.global_head['z_ads_medianet_a'] = {
            'innerHTML': 'window._mNHandle = window._mNHandle || {}; window._mNHandle.queue = window._mNHandle.queue || []; medianet_versionId = "3121199";',
            'type': 'text/javascript'
          };
          _this7.x_state.global_head['z_ads_medianet_b'] = {
            'src': "https://contextual.media.net/dmedianet.js?cid=".concat(_this7.x_state.config_node['ads:medianet'][cid]),
            'async': true
          };
          _this7.x_state.plugins['vue-script2'] = {
            global: true,
            npm: {
              'vue-script2': '*'
            }
          };
        } //google Adsense


        if (_this7.x_state.config_node['google:adsense']) {
          _this7.debug('Declaring Google Adsense');

          if (_this7.x_state.config_node['google:adsense'].auto && _this7.x_state.config_node['google:adsense'].client) {
            _this7.x_state.global_head['google_adsense'] = {
              'src': 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js',
              'data-ad-client': _this7.x_state.config_node['google:adsense'].client,
              'async': true
            };
            _this7.x_state.plugins['adsense'] = {
              global: true,
              npm: {
                'vue-google-adsense': '*',
                'vue-script2': '*'
              },
              mode: 'client',
              customcode: "\n\t\t\t\t\timport Vue from \"vue\";\n\t\t\t\t\timport Ads from \"vue-google-adsense\";\n\n\t\t\t\t\tVue.use(require('vue-script2'));\n\t\t\t\t\tVue.use(Ads.AutoAdsense, { adClient: '".concat(_this7.x_state.config_node['google:adsense']['client'], "'});")
            };
          } else {
            _this7.x_state.plugins['adsense'] = {
              global: true,
              npm: {
                'vue-google-adsense': '*',
                'vue-script2': '*'
              },
              mode: 'client',
              customcode: "\n\t\t\t\t\timport Vue from \"vue\";\n\t\t\t\t\timport Ads from \"vue-google-adsense\";\n\n\t\t\t\t\tVue.use(require('vue-script2'));\n\t\t\t\t\tVue.use(Ads.Adsense);\n\t\t\t\t\tVue.use(Ads.InArticleAdsense);\n\t\t\t\t\tVue.use(Ads.InFeedAdsense);"
            };
          }
        } //nuxt:icon

        /*
        if (this.x_state.config_node['nuxt:icon']) {
            this.debug('Defining nuxt.config.js : module nuxtjs/pwa (nuxt:icon)');
            //this.x_state.nuxt_config.modules['@nuxtjs/pwa'] = {};
        }*/
        //idiomas i18n


        if (_this7.x_state.central_config['idiomas'].indexOf(',') != -1) {
          _this7.debug('Defining nuxt.config.js : module nuxt/i18n (idiomas) - NOT SUPPORTED FOR NOW');
          /*
          this.x_state.npm['nuxt-i18n'] = '*';
          this.x_state.npm['fs'] = '*';
          this.x_state.nuxt_config.modules['nuxt-i18n'] = {
              'defaultLocale': this.x_state.central_config['idiomas'].split(',')[0],
              'vueI18n': { 'fallbackLocale': this.x_state.central_config['idiomas'].split(',')[0] },
              'detectBrowserLanguage': {
                  'useCookie': true,
                  'alwaysRedirect': true
              },
              locales: [],
              lazy: true,
              langDir: 'lang/'
          };
          let self = this;
          this.x_state.central_config['idiomas'].split(',').map(function(lang) {
              if (lang == 'es') {
                  self.x_state.nuxt_config.modules['nuxt-i18n'].locales.push({
                      code: 'es',
                      iso: 'es-ES',
                      file: `${lang}.js`
                  });
              } else if (lang == 'en') {
                  self.x_state.nuxt_config.modules['nuxt-i18n'].locales.push({
                      code: 'en',
                      iso: 'en-US',
                      file: `${lang}.js`
                  });
              } else {
                  self.x_state.nuxt_config.modules['nuxt-i18n'].locales.push({
                      code: lang,
                      file: `${lang}.js`
                  });
              }
          }.bind(self));*/

        }
        /* @TODO ADD SUPPORT LATER 15-dic-22
        //local storage
        if (this.x_state.stores_types['local'] && Object.keys(this.x_state.stores_types['local']) != '') {
            this.debug('Defining nuxt.config.js : module nuxt-vuex-localstorage (store:local)');
            this.x_state.nuxt_config.modules['nuxt-vuex-localstorage'] = {
                mode: 'debug',
                'localStorage': Object.keys(this.x_state.stores_types['local'])
            };
        }
        //session storage
        if (this.x_state.stores_types['session'] && Object.keys(this.x_state.stores_types['session']) != '') {
            this.debug('Defining nuxt.config.js : module nuxt-vuex-localstorage (store:session)');
            let prev = {};
            // if vuex-localstorage was defined before, recover keys and just replace with news, without deleting previous
            if (this.x_state.nuxt_config.modules['nuxt-vuex-localstorage']) prev = this.x_state.nuxt_config.modules['nuxt-vuex-localstorage'];
            this.x_state.nuxt_config.modules['nuxt-vuex-localstorage'] = {...prev,
                ... {
                    mode: 'debug',
                    'sessionStorage': Object.keys(this.x_state.stores_types['session'])
                }
            };
        }*/
        //proxies

        /* @TODO: ADD SUPPORT LATER (maybe) 15-dic-22
        let has_proxies = false,
            proxies = {};
        let self = this;
        Object.keys(this.x_state.central_config).map(function(key) {
            if (key.indexOf('proxy:') != -1) {
                let just_key = key.split(':')[1];
                proxies[just_key] = self.x_state.central_config[key];
                has_proxies = true;
            }
        }.bind(self));
        if (has_proxies) {
            this.debug('Defining nuxt.config.js : module nuxtjs/proxy (central:proxy)');
            this.x_state.npm['@nuxtjs/proxy'] = '*';
            this.x_state.nuxt_config.modules['@nuxtjs/proxy'] = { 'proxy': proxies };
        }*/
        //end

      })();
    } //.gitignore helper


    createGitIgnore() {
      var _this8 = this;

      return _asyncToGenerator(function* () {
        _this8.debug('writing .gitignore files');

        var fs = require('fs').promises;
            require('path');

        _this8.x_console.out({
          message: 'writing /.gitignore file'
        });

        var git = "# Mac System files\n.DS_Store\n.DS_Store?\n_MACOSX/\nThumbs.db\n# NPM files\npackage.json\npackage-lock.json\nnode_modules/\n# AWS EB files\npolicy.json\n.ebextensions/\n.elasticbeanstalk/*\n!.elasticbeanstalk/*.cfg.yml\n!.elasticbeanstalk/*.global.yml\n# VUE files\n# Concepto files\n.concepto/\naws_backup.ini\nvue.dsl\nvue_diff.dsl\n.secrets-pass\nstore/\n".concat(_this8.x_state.dirs.compile_folder, "/");
        yield fs.writeFile("".concat(_this8.x_state.dirs.base, ".gitignore"), git, 'utf-8'); //.gitignore
      })();
    } //process .omit file 


    processOmitFile(thefile) {
      var _this9 = this;

      return _asyncToGenerator(function* () {
        //@TODO 13-mar-21 check if .toArray() is needed here (ref processInternalTags method)
        //internal_stores.omit
        var self = _this9;

        if (thefile.file == 'internal_stores.omit') {
          _this9.debug('processing internal_stores.omit');

          var cheerio = require('cheerio');

          var $ = cheerio.load(thefile.code, {
            ignoreWhitespace: false,
            xmlMode: true,
            decodeEntities: false
          });
          var nodes = $("store_mutation").toArray();
          nodes.map(function (elem) {
            var cur = $(elem);
            var store = cur.attr('store') ? cur.attr('store') : '';
            var mutation = cur.attr('mutation') ? cur.attr('mutation') : '';
            var params = cur.attr('params') ? cur.attr('params') : '';
            var code = cur.text();

            if (self.x_state.stores[store] && !(':mutations' in self.x_state.stores[store])) {
              self.x_state.stores[store][':mutations'] = {};
            }

            self.x_state.stores[store][':mutations'][mutation] = {
              code,
              params
            };
          });
        } //internal_middleware.omit


        if (thefile.file == 'internal_middleware.omit') {
          _this9.debug('processing internal_middleware.omit');

          var _cheerio = require('cheerio');

          var _$ = _cheerio.load(thefile.code, {
            ignoreWhitespace: false,
            xmlMode: true,
            decodeEntities: false
          });

          var _nodes = _$("proxy_code").toArray();

          _nodes.map(function (elem) {
            var cur = _$(elem);

            var name = cur.attr('name') ? cur.attr('name') : '';
            self.x_state.proxies[name].code = cur.text().trim();
          });
        } //server.omit - THIS ISNT'T SUPPORTED ON THIS VERSION


        if (thefile.file == 'server.omit') {
          _this9.debug('processing server.omit');

          var _cheerio2 = require('cheerio');

          var _$2 = _cheerio2.load(thefile.code, {
            ignoreWhitespace: false,
            xmlMode: true,
            decodeEntities: false
          });

          var _nodes2 = _$2("func_code").toArray();

          _nodes2.map(function (elem) {
            var cur = _$2(elem);

            var name = cur.attr('name') ? cur.attr('name') : '';
            self.x_state.functions[name].code = cur.text().trim();
          });
        }
      })();
    }

    getComponentStory(thefile) {
      var _this10 = this;

      return _asyncToGenerator(function* () {
        // {component}.stories.js file
        var js = {
          script: '',
          style: '',
          first: false
        };
        var page = _this10.x_state.pages[thefile.title];

        var camel = require('camelcase');

        if (page) {
          if (page.tipo == 'componente' && page.params != '') {
            var argType = {},
                title = thefile.title.split(':')[1].trim(),
                evts = ''; //prepare events

            var events = page.stories['_default'].events;

            for (var evt in events) {
              var on_name = camel("on_".concat(evt.replaceAll(':', '_')));
              evts += " v-on:".concat(evt, "=\"").concat(on_name, "\"");
              argType[on_name] = {
                action: 'clicked'
              };
            } //prepare component attributes (props)


            var isNumeric = function isNumeric(n) {
              return !isNaN(parseFloat(n)) && isFinite(n);
            }; //let props = []; // story attr control type


            var default_args = [];

            if (Object.keys(page.defaults) != '') {
              page.params.split(',').map(function (key) {
                var def_val = '';
                if (page.defaults[key]) def_val = page.defaults[key];

                if (def_val == 'true' || def_val == 'false') {
                  default_args.push("".concat(key, ": ").concat(def_val)); //props.push(`${key}: { type: Boolean, default: ${def_val}}`);
                } else if (isNumeric(def_val)) {
                  //if def_val is number or string with number
                  default_args.push("".concat(key, ": ").concat(def_val)); //props.push(`${key}: { type: Number, default: ${def_val}}`);
                } else if (def_val.indexOf('[') != -1 && def_val.indexOf(']') != -1) {
                  default_args.push("".concat(key, ": ").concat(def_val)); //props.push(`${key}: { type: Array, default: () => ${def_val}}`);
                } else if (def_val.indexOf('{') != -1 && def_val.indexOf('}') != -1) {
                  default_args.push("".concat(key, ": ").concat(def_val)); //props.push(`${key}: { type: Object, default: () => ${def_val}}`);
                } else if (def_val.indexOf("()") != -1) {
                  //ex. new Date()
                  default_args.push("".concat(key, ": ").concat(def_val)); //props.push(`${key}: { type: Object, default: () => ${def_val}}`);
                } else if (def_val.toLowerCase().indexOf("null") != -1) {
                  default_args.push("".concat(key, ": null")); //props.push(`${key}: { default: null }`);
                } else if (def_val.indexOf("'") != -1) {
                  default_args.push("".concat(key, ": ").concat(def_val)); //props.push(`${key}: { type: String, default: ${def_val}}`);
                } else {
                  default_args.push("".concat(key, ": '").concat(def_val, "'")); //props.push(`${key}: { default: '${def_val}' }`);
                }
              });
            } //write story code


            var compName = camel(title, {
              pascalCase: true
            });
            js.script += "import ".concat(compName, " from '../src/components/").concat(title, "/").concat(thefile.file.replace('.vue', '-story.vue'), "';\n\n");
            js.script += "export default {\n                    title: '".concat(camel(_this10.x_state.central_config.apptitle, {
              pascalCase: true
            }), "/").concat(title, "',\n                    component: ").concat(compName, ",\n                    argTypes: ").concat(JSON.stringify(argType), "\n                };\n\n");
            js.script += "const Template = (args, { argTypes }) => ({\n                    props: Object.keys(argTypes),\n                    components: { ".concat(compName, " },\n                    template: '<").concat(compName, " v-bind=\"$props\"").concat(evts, "/>'\n                });\n"); //default story

            js.script += "export const Default = Template.bind({});\n";
            js.script += "Default.args = {\n";
            js.script += "".concat(default_args.join(','), "\n};\n"); //additional defined stories
            //@todo
          }
        }

        return js;
      })();
    }

    getBasicVue(thefile) {
      var _this11 = this;

      return _asyncToGenerator(function* () {
        // write .VUE file
        var vue = {
          template: thefile.code,
          script: '',
          style: '',
          first: false
        };
        var page = _this11.x_state.pages[thefile.title];

        if (page) {
          // declare middlewares (proxies)
          if (page.proxies.indexOf(',') != -1) {
            _this11.debug('- declare middlewares');

            vue.script += "middleware: [".concat(page.proxies, "]");
            vue.first = true;
          } else if (page.proxies.trim() != '') {
            _this11.debug('- declare middlewares');

            vue.script += "middleware: '".concat(page.proxies, "'");
            vue.first = true;
          } // layout attr


          if (page.layout != '') {
            _this11.debug('- declare layout');

            if (vue.first) vue.script += ',\n';
            vue.first = true;
            vue.script += "layout: '".concat(page.layout.trim(), "'");
          } // declare components


          if (page.components != '') {
            _this11.debug('- declare components');

            if (vue.first) vue.script += ',\n';
            vue.first = true;
            vue.script += "components: {";
            var comps = [];
            Object.keys(page.components).map(function (key) {
              comps.push(" '".concat(key, "': ").concat(page.components[key]));
            }); //.bind(page,comps));

            vue.script += "".concat(comps.join(','), "\n\t}");
          } // declare directives


          if (page.directives != '') {
            _this11.debug('- declare directives');

            if (vue.first) vue.script += ',\n';
            vue.first = true;
            vue.script += "directives: {";
            var directs = [];
            Object.keys(page.directives).map(function (key) {
              if (key == page.directives[key]) {
                directs.push(key);
              } else {
                directs.push("'".concat(key, "': ").concat(page.directives[key]));
              }
            }); //.bind(page,directs));

            vue.script += "".concat(directs.join(','), "\n\t}");
          } // declare props (if page tipo componente)


          if (page.tipo == 'componente' && page.params != '') {
            _this11.debug('- declare componente:props');

            if (vue.first) vue.script += ',\n';
            vue.first = true;

            var isNumeric = function isNumeric(n) {
              return !isNaN(parseFloat(n)) && isFinite(n);
            };

            var props = [];

            if (Object.keys(page.defaults) != '') {
              page.params.split(',').map(function (key) {
                var def_val = '';
                if (page.defaults[key]) def_val = page.defaults[key];

                if (def_val == 'true' || def_val == 'false') {
                  props.push("".concat(key, ": { type: Boolean, default: ").concat(def_val, "}"));
                } else if (isNumeric(def_val)) {
                  //if def_val is number or string with number
                  props.push("".concat(key, ": { type: Number, default: ").concat(def_val, "}"));
                } else if (def_val.indexOf('[') != -1 && def_val.indexOf(']') != -1) {
                  props.push("".concat(key, ": { type: Array, default: () => ").concat(def_val, "}"));
                } else if (def_val.indexOf('{') != -1 && def_val.indexOf('}') != -1) {
                  props.push("".concat(key, ": { type: Object, default: () => ").concat(def_val, "}"));
                } else if (def_val.indexOf("()") != -1) {
                  //ex. new Date()
                  props.push("".concat(key, ": { type: Object, default: () => ").concat(def_val, "}"));
                } else if (def_val.toLowerCase().indexOf("null") != -1) {
                  props.push("".concat(key, ": { default: null }"));
                } else if (def_val.indexOf("'") != -1) {
                  props.push("".concat(key, ": { type: String, default: ").concat(def_val, "}"));
                } else {
                  props.push("".concat(key, ": { default: '").concat(def_val, "' }"));
                }
              });
              vue.script += "\tprops: {".concat(props.join(','), "}");
            } else {
              page.params.split(',').map(function (key) {
                props.push("'".concat(key, "'"));
              });
              vue.script += "\tprops: [".concat(props.join(','), "]");
            }
          } // declare meta data


          if (page.xtitle || page.meta.length > 0 || page.link.length > 0) {
            _this11.debug('- declare head() meta data');

            if (vue.first) vue.script += ',\n';
            vue.first = true;
            vue.script += " head() {\n return {\n"; // define title

            if (page.xtitle) {
              if (_this11.x_state.central_config.idiomas.indexOf(',') != -1) {
                // i18n title
                var crc32 = "t_".concat(yield _this11.hash(page.xtitle));

                var def_lang = _this11.x_state.central_config.idiomas.indexOf(',')[0].trim().toLowerCase();

                if (!_this11.x_state.strings_i18n[def_lang]) {
                  _this11.x_state.strings_i18n[def_lang] = {};
                }

                _this11.x_state.strings_i18n[def_lang][crc32] = page.xtitle;
                vue.script += "titleTemplate: this.$t('".concat(crc32, "')\n");
              } else {
                // normal title
                vue.script += "titleTemplate: ".concat(_this11.jsDump(page.xtitle), "\n");
              }
            } // define meta SEO


            if (page.meta.length > 0) {
              if (page.xtitle) vue.script += ","; //vue.script += `meta: ${JSON.stringify(page.meta)}\n`;

              vue.script += "meta: ".concat(_this11.jsDump(page.meta), "\n");
            } // define head LINK


            if (page.link.length > 0) {
              if (page.xtitle || page.meta.length > 0) vue.script += ",";
              vue.script += "link: ".concat(JSON.stringify(page.link), "\n");
            }

            vue.script += "};\n}";
          } // declare variables (data)


          if (Object.keys(page.variables) != '') {
            _this11.debug('- declare data() variables');

            if (vue.first) vue.script += ',\n';
            vue.first = true;

            require('util');

            vue.script += "data() {\n";
            vue.script += " return ".concat(_this11.jsDump(page.variables), "\n");
            vue.script += "}\n"; //this.debug('- declare data() variables dump',page.variables);
          }
        }

        return vue;
      })();
    }

    processInternalTags(vue, page) {
      var _this12 = this;

      return _asyncToGenerator(function* () {
        var cheerio = require('cheerio'); //console.log('PABLO beforeInteralTags:',{ template:vue.template, script:vue.script });


        var $ = cheerio.load(vue.template, {
          ignoreWhitespace: false,
          xmlMode: true,
          decodeEntities: false
        }); //console.log('PABLO after:',$.html()); 
        //return vue;
        //

        var nodes = $("server_asyncdata").toArray();
        if (nodes.length > 0) _this12.debug('post-processing server_asyncdata tag');
        if (nodes.length > 0 && vue.first) vue.script += ',\n';
        vue.first = true;
        nodes.map(function (elem) {
          var cur = $(elem);
          var name = cur.attr('return') ? cur.attr('return') : '';
          vue.script += "async asyncData({ req, res, params }) {\n";
          vue.script += " if (!process.server) { const req={}, res={}; }\n"; //vue.script += ` ${cur.text()}`;

          vue.script += " ".concat(elem.children[0].data);
          vue.script += " return ".concat(name, ";\n");
          vue.script += "}\n";
          cur.remove();
        });
        vue.template = $.html();
        if (nodes.length > 0) vue.script += "}\n"; // process ?mounted event

        nodes = $("vue_mounted").toArray();
        if (nodes.length > 0) _this12.debug('post-processing vue_mounted tag');
        if (nodes.length > 0 && vue.first) vue.script += ',\n';
        vue.first = true;
        var uses_await = false,
            mounted_content = '';
        nodes.map(function (elem) {
          var cur = $(elem); //console.log('valor vue_mounted',elem.children[0].data);

          if (elem.children[0].data.includes('await ')) {
            uses_await = true;
          }

          mounted_content += elem.children[0].data; //cur.text();
          //vue.script += elem.children[0].data; //cur.text();

          cur.remove();
        });

        if (nodes.length > 0) {
          if (uses_await) {
            vue.script += "async mounted() {\n";
            vue.script += "this.$nextTick(async function() {\n";
          } else {
            vue.script += "mounted() {\n";
          }

          vue.script += mounted_content;
        }

        vue.template = $.html();

        if (nodes.length > 0) {
          if (uses_await) {
            vue.script += "});\n}\n";
          } else {
            vue.script += "}\n";
          }
        } // process ?created event


        nodes = $("vue_created").toArray();
        if (nodes.length > 0) _this12.debug('post-processing vue_created tag');
        if (nodes.length > 0 && vue.first) vue.script += ',\n';
        vue.first = true;
        uses_await = false, mounted_content = '';
        nodes.map(function (elem) {
          var cur = $(elem); //console.log('valor vue_mounted',elem.children[0].data);

          if (elem.children[0].data.includes('await ')) {
            uses_await = true;
          }

          mounted_content += elem.children[0].data; //cur.text();
          //vue.script += elem.children[0].data; //cur.text();

          cur.remove();
        });

        if (nodes.length > 0) {
          if (uses_await) {
            vue.script += "async created() {\n";
            vue.script += "this.$nextTick(async function() {\n";
          } else {
            vue.script += "created() {\n";
          }

          vue.script += mounted_content;
        }

        vue.template = $.html();

        if (nodes.length > 0) {
          if (uses_await) {
            vue.script += "});\n}\n";
          } else {
            vue.script += "}\n";
          }
        } // process ?var (vue_computed)


        nodes = $('vue\_computed').toArray(); //this.debug('nodes',nodes);

        if (nodes.length > 0) _this12.debug('post-processing vue_computed tag');
        if (nodes.length > 0 && vue.first) vue.script += ',\n';
        vue.first = true;
        if (nodes.length > 0) vue.script += "computed: {\n";
        var computed = [];
        nodes.map(function (elem) {
          var cur = $(elem);
          var name = cur.attr('name');
          var code = elem.children[0].data; //cur.html();
          //console.log('PABLO debug code computed:',code);

          if (computed.includes("".concat(name, "() {").concat(code, "}")) == false) {
            computed.push("".concat(name, "() {").concat(code, "}"));
          }

          cur.remove(); //return elem;
        });
        vue.template = $.html();
        vue.script += computed.join(',');
        if (nodes.length > 0) vue.script += "}\n"; // process ?var (asyncComputed)

        nodes = $('vue_async_computed').toArray();
        if (nodes.length > 0) _this12.debug('post-processing vue_async_computed tag');
        if (nodes.length > 0 && vue.first) vue.script += ',\n';
        vue.first = true;
        if (nodes.length > 0) vue.script += "asyncComputed: {\n";
        var async_computed = [];
        nodes.map(function (elem) {
          var cur = $(elem);
          var code = elem.children[0].data; //cur.text();

          if (cur.attr('valor') || cur.attr('watch')) {
            var lazy = '';
            if (cur.attr('lazy')) lazy += ",lazy: ".concat(cur.attr('lazy'));
            var valor = '';

            if (cur.attr('valor')) {
              valor += ",";
              var test = cur.attr('valor');

              if (test.indexOf('[') != -1 && test.indexOf(']') != -1 || test.indexOf('{') != -1 && test.indexOf('}') != -1 || test.indexOf('(') != -1 && test.indexOf(')') != -1) {
                valor += "default: ".concat(test);
              } else {
                valor += "default: '".concat(test, "'");
              }
            }

            var watch = '';

            if (cur.attr('watch')) {
              watch += ',';

              var _test = cur.attr('watch');

              var test_n = [];

              _test.split(',').map(function (x) {
                var tmp = x.replaceAll('$variables.', '').replaceAll('$vars.', '').replaceAll('$params.', '').replaceAll('$store.', '$store.state.');
                test_n.push("'".concat(tmp, "'"));
              });

              watch += "watch: [".concat(test_n.join(','), "]");
            }

            async_computed.push("\n".concat(cur.attr('name'), ": {\n    async get() {\n        ").concat(code, "\n    }\n    ").concat(lazy, "\n    ").concat(valor, "\n    ").concat(watch, "\n}"));
          } else {
            async_computed.push("async ".concat(cur.attr('name'), "() {").concat(code, "}"));
          }

          cur.remove();
        });
        vue.template = $.html();
        vue.script += async_computed.join(',');
        if (nodes.length > 0) vue.script += "}\n"; // process var ?change -> vue_watched_var

        nodes = $('vue_watched_var').toArray();
        if (nodes.length > 0) _this12.debug('post-processing vue_async_computed tag');
        if (nodes.length > 0 && vue.first) vue.script += ',\n';
        vue.first = true;
        if (nodes.length > 0) vue.script += "watch: {\n";
        var watched = [];
        nodes.map(function (elem) {
          var cur = $(elem);
          var code = elem.children[0].data; //cur.text();

          if (cur.attr('deep')) {
            watched.push("\n\t\t\t\t'".concat(cur.attr('flat'), "': {\n\t\t\t\t\tasync handler(newVal, oldVal) {\n\t\t\t\t\t\tlet evento = { ").concat(cur.attr('newvar'), ":newVal, ").concat(cur.attr('oldvar'), ":oldVal };\n\t\t\t\t\t\t").concat(code, "\n\t\t\t\t\t},\n\t\t\t\t\tdeep: true\n\t\t\t\t}\n\t\t\t\t"));
          } else {
            watched.push("\n\t\t\t\t'".concat(cur.attr('flat'), "': async function (newVal, oldVal) {\n\t\t\t\t\tlet evento = { ").concat(cur.attr('newvar'), ":newVal, ").concat(cur.attr('oldvar'), ":oldVal };\n\t\t\t\t\t").concat(code, "\n\t\t\t\t}\n\t\t\t\t"));
          }

          cur.remove();
        });
        vue.template = $.html();
        vue.script += watched.join(',');
        if (nodes.length > 0) vue.script += "}\n"; // process vue_if tags
        // repeat upto 5 times (@todo transform this into a self calling method)

        for (var x of [1, 2, 3, 4, 5]) {
          nodes = $('vue_if').toArray();

          if (nodes.length > 0) {
            _this12.debug("post-processing vue_if tag ".concat(x, " (len:").concat(nodes.length, ")"));

            nodes.map(function (elem) {
              var cur = $(elem);
              var if_type = cur.attr('tipo');
              var if_test = cur.attr('expresion');

              if (cur.attr('target') != 'template') {
                //search refx ID tag
                var target = $("*[refx=\"".concat(cur.attr('target'), "\"]")).toArray();

                if (target.length > 0) {
                  var target_node = $(target[0]);

                  if (if_type == 'v-else') {
                    target_node.attr(if_type, 'xpropx');
                  } else {
                    target_node.attr(if_type, if_test);
                  } //erase if tag


                  cur.replaceWith(cur.html());
                }
              }
            });
          } else {
            break;
          }

          yield _this12.setImmediatePromise(); //@improved
        } //


        vue.template = $.html(); // process vue_for tags
        // repeat upto 5 times (@todo transform this into a self calling method)

        for (var _x3 of [1, 2, 3, 4, 5]) {
          nodes = $('vue_for').toArray();

          if (nodes.length > 0) {
            _this12.debug("post-processing vue_for tag ".concat(_x3, " (len:").concat(nodes.length, ")"));
            nodes.map(function (elem) {
              var cur = $(elem);
              var iterator = cur.attr('iterator').replaceAll('$variables.', '').replaceAll('$vars.', '').replaceAll('$params.', '').replaceAll('$store.', '$store.state.');

              if (cur.attr('use_index') && cur.attr('use_index') == 'false' && cur.attr('key') != 0) {
                iterator = "(".concat(cur.attr('item'), ", ").concat(cur.attr('key'), ") in ").concat(iterator);
              } else if (cur.attr('use_index') && cur.attr('use_index') == 'false' && cur.attr('key') == 0) {
                iterator = "".concat(cur.attr('item'), " in ").concat(iterator);
              } else if (cur.attr('key') && cur.attr('key') != 0 && cur.attr('use_index') != 'false') {
                iterator = "(".concat(cur.attr('item'), ", ").concat(cur.attr('key'), ", ").concat(cur.attr('use_index'), ") in ").concat(iterator);
              } else {
                iterator = "(".concat(cur.attr('item'), ", ").concat(cur.attr('use_index'), ") in ").concat(iterator);
              }

              if (cur.attr('target') != 'template') {
                //search refx ID tag
                var target = $("*[refx=\"".concat(cur.attr('target'), "\"]")).toArray();

                if (target.length > 0) {
                  var target_node = $(target[0]);
                  target_node.attr('v-for', iterator);
                  if (cur.attr('unique') != 0) target_node.attr(':key', cur.attr('unique'));
                  cur.replaceWith(cur.html());
                } //cur.replaceWith(cur.html()); // remove also if target node is not found

              } else {
                // transform <v_for>x</v_for> -> <template v-for='iterator'>x</template>
                // lookAt x=v_for_selector.html() and selector.replaceWith('<template v-for>'+x+'</template>')
                cur.replaceWith("<template v-for=\"".concat(iterator, "\">").concat(cur.html(), "</template>"));
              }
            });
          } else {
            break;
          }

          yield _this12.setImmediatePromise(); //@improved
        } //


        vue.template = $.html(); // process vue_event tags

        var common_methods = $('vue_event_method').toArray();
        var on_events = $('vue_event_element').toArray();

        if (common_methods.length > 0 || on_events.length > 0) {
          _this12.debug('post-processing methods (common, timer, and v-on element events methods)');

          if (vue.first) vue.script += ',\n';
          vue.first = true;
          var methods = [],
              _self = _this12; // event_methods

          common_methods.map(function (elem) {
            var cur = $(elem);
            var code = elem.children[0].data; //cur.text();

            var tmp = '';

            if (cur.attr('timer_time')) {
              _self.x_state.npm['vue-interval'] = '*';
              page.mixins['vueinterval'] = 'vue-interval/dist/VueInterval.common';
              var timer_prefix = '';

              if (cur.attr('timer_time') && cur.attr('timer_time') != '') {
                //always in ms; tranform into 1e2 notation
                var ceros = cur.attr('timer_time').length - 1;
                var first = cur.attr('timer_time')[0];
                timer_prefix = "INTERVAL__".concat(first, "e").concat(ceros, "$");
              }

              if (cur.attr('m_params')) {
                if (cur.attr('type') == 'async') {
                  tmp += "".concat(timer_prefix).concat(cur.attr('name'), ": async function(").concat(cur.attr('m_params'), ") {");
                } else {
                  tmp += "".concat(timer_prefix).concat(cur.attr('name'), ": function(").concat(cur.attr('m_params'), ") {");
                }
              } else {
                if (cur.attr('type') == 'async') {
                  tmp += "".concat(timer_prefix).concat(cur.attr('name'), ": async function() {");
                } else {
                  tmp += "".concat(timer_prefix).concat(cur.attr('name'), ": function() {");
                }
              }
            } else {
              if (cur.attr('m_params')) {
                if (cur.attr('type') == 'async') {
                  tmp += "".concat(cur.attr('name'), ": async function(params) {"); //${cur.attr('m_params')}
                } else {
                  tmp += "".concat(cur.attr('name'), ": function(params) {"); //${cur.attr('m_params')}
                }
              } else {
                if (cur.attr('type') == 'async') {
                  tmp += "".concat(cur.attr('name'), ": async function() {");
                } else {
                  tmp += "".concat(cur.attr('name'), ": function() {");
                }
              }
            }

            methods.push("".concat(tmp, "\n").concat(code, "\n}"));
            cur.remove();
          }); // events_methods

          on_events.map(function (elem) {
            var evt = $(elem); //search father node of event

            var origin = $($("*[refx=\"".concat(evt.attr('parent_id'), "\"]")).toArray()[0]);
            var event = evt.attr('event'); // declare call in origin node

            if (evt.attr('link')) {
              // event linked to another node; usually another existing method func
              var link = evt.attr('link');
              var method_name = link;

              if (evt.attr('link_id')) {
                var target = $("vue_event_element[id=\"".concat(evt.attr('link_id'), "\"]")).toArray();

                if (target.length > 0) {
                  var the_node = $(target[0]);
                  method_name = the_node.attr('friendly_name');
                }

                method_name = method_name.replaceAll(':', '_').replaceAll('.', '_').replaceAll('-', '_');
              } // plugin related events


              if (event == 'click-outside') {
                origin.attr('v-click-outside', method_name);
              } else if (event == 'visibility') {
                origin.attr('v-observe-visibility', method_name);
              } else if (event == ':rules') {
                origin.attr(':rules', "[".concat(method_name, "]"));
              } else if (event == 'resize') {
                origin.attr('v-resize', method_name);
              } else {
                // custom defined methods
                if (evt.attr('v_params')) {
                  // v-on with params
                  origin.attr("v-on:".concat(event), "".concat(method_name, "(").concat(evt.attr('v_params'), ")"));
                } else {
                  // without params
                  if (evt.attr('link_id')) {
                    origin.attr("v-on:".concat(event), "".concat(method_name, "($event)"));
                  } else {
                    origin.attr("v-on:".concat(event), method_name);
                  }
                } //

              } // @TODO check if this is needed/used: was on original CFC code, but it seems it just overwrites previous things
              //if (evt.attr('link_id')) { 	
              //	origin.attr(`v-on:${event}`,`${link}_${evt.attr('link_id')}($event)`);
              //}
              //

            } else {
              // create method function and script
              var tmp = '';
              var _method_name = event;
              if (evt.attr('friendly_name') != '') _method_name = "".concat(evt.attr('friendly_name')); //event_suffix

              _method_name = _method_name.replaceAll(':', '_').replaceAll('.', '_').replaceAll('-', '_');
              var method_code = elem.children[0].data; //evt.text();

              if (event == 'click-outside') {
                origin.attr("v-click-outside", _method_name);
                tmp = "".concat(_method_name, ": async function() {\n\t\t\t\t\t\t\t").concat(method_code, "\n\t\t\t\t\t\t}");
              } else if (event == 'visibility') {
                origin.attr("v-observe-visibility", _method_name);
                tmp = "".concat(_method_name, ": async function(estado, elemento) {\n\t\t\t\t\t\t\t").concat(method_code, "\n\t\t\t\t\t\t}");
              } else if (event == ':rules') {
                origin.attr(":rules", "[".concat(_method_name, "]"));
                tmp = "".concat(_method_name, ": function() {\n\t\t\t\t\t\t\t").concat(method_code, "\n\t\t\t\t\t\t}");
              } else if (event == 'resize') {
                origin.attr("v-resize", _method_name);
                tmp = "".concat(_method_name, ": async function() {\n\t\t\t\t\t\t\t").concat(method_code, "\n\t\t\t\t\t\t}");
              } else {
                if (evt.attr('v_params') && evt.attr('v_params') != '') {
                  origin.attr("v-on:".concat(event), "".concat(_method_name, "(").concat(evt.attr('v_params'), ")"));
                } else {
                  origin.attr("v-on:".concat(event), "".concat(_method_name, "($event)"));
                }

                if (evt.attr('n_params')) {
                  tmp = "".concat(_method_name, ": async function(").concat(evt.attr('n_params'), ") {\n\t\t\t\t\t\t\t\t").concat(method_code, "\n\t\t\t\t\t\t\t}");
                } else {
                  tmp = "".concat(_method_name, ": async function(evento) {\n\t\t\t\t\t\t\t\t").concat(method_code, "\n\t\t\t\t\t\t\t}");
                }
              } // push tmp to methods


              methods.push(tmp);
            } // remove original event tag node
            // ** evt.remove();

          }); //remove vue_event_element tags

          on_events.map(function (elem) {
            $(elem).remove();
          }); // apply methods and changes

          vue.script += "methods: {\n\t\t\t\t\t\t\t".concat(methods.join(','), "\n\t\t\t\t\t\t   }");
          vue.template = $.html(); // apply changes to template
        }
        /* */


        return vue;
      })();
    }

    processStyles(vue, page) {
      var cheerio = require('cheerio');

      var $ = cheerio.load(vue.template, {
        ignoreWhitespace: false,
        xmlMode: true,
        decodeEntities: false
      });
      var styles = $("page_estilos").toArray();

      if (styles.length > 0) {
        this.debug('post-processing styles');
        var node = $(styles[0]);

        if (node.attr('scoped') && node.attr('scoped') == 'true') {
          vue.style += "\n\t\t\t\t<style scoped>\n\t\t\t\t".concat(node.text(), "\n\t\t\t\t</style>");
        } else {
          vue.style += "\n\t\t\t\t<style>\n\t\t\t\t".concat(node.text(), "\n\t\t\t\t</style>");
        }

        node.remove();
      }

      vue.template = $.html(); // add page styles (defined in js) to style tag code

      if (Object.keys(page.styles).length > 0) {
        var jss = require('jss').default;

        var global_plug = require('jss-plugin-global').default;

        jss.use(global_plug());
        var sheet = jss.createStyleSheet({
          '@global': page.styles
        });
        if (!vue.style) vue.style = '';
        vue.style += "<style>\n".concat(sheet.toString(), "</style>"); //this.debug('JSS sheet',sheet.toString());
      }

      return vue;
    }

    processMixins(vue, page) {
      // call after processInternalTags
      if (page.mixins && Object.keys(page.mixins).length > 0) {
        this.debug('post-processing mixins');
        var close = '';
        if (vue.first) close += ',\n';
        vue.first = true;
        close += "mixins: [".concat(Object.keys(page.mixins).join(','), "]");
        var mixins = [];

        for (var key in page.mixins) {
          mixins.push("import ".concat(key, " from '").concat(page.mixins[key], "';"));
        }

        vue.script = vue.script.replaceAll('{concepto:mixins:import}', mixins.join(';'));
        vue.script = vue.script.replaceAll('{concepto:mixins:array}', close);
      } else {
        vue.script = vue.script.replaceAll('{concepto:mixins:import}', '').replaceAll('{concepto:mixins:array}', '');
      }

      return vue;
    }

    removeRefx(vue) {
      var cheerio = require('cheerio');

      var $ = cheerio.load(vue.template, {
        ignoreWhitespace: false,
        xmlMode: true,
        decodeEntities: false
      });
      var refx = $("*[refx]").toArray();

      if (refx.length > 0) {
        this.debug('removing refx attributes (internal)');
        refx.map(function (x) {
          $(x).attr('refx', null);
        });
        vue.template = $.html();
      }

      return vue;
    }

    fixVuePaths(vue, page) {
      for (var key in this.x_state.pages) {
        if (this.x_state.pages[key].path) {
          vue.script = vue.script.replaceAll("{vuepath:".concat(key, "}"), this.x_state.pages[key].path);
        } else {
          this.x_console.outT({
            message: "WARNING! path key doesn't exist for page ".concat(key),
            color: 'yellow'
          });
        }
      } // remove / when first char inside router push name


      vue.script = vue.script.replaceAll("this.$router.push({ name:'/", "this.$router.push({ name:'");
      return vue;
    }

    processLangPo(vue, page) {
      var _this13 = this;

      return _asyncToGenerator(function* () {
        // writes default lang.po file and converts alternatives to client/lang/iso.js
        if (_this13.x_state.central_config.idiomas.indexOf(',') != -1) {
          _this13.debug('process /lang/ po/mo files');

          var path = require('path'),
              fs = require('fs').promises; // .check and create directs if needed


          var lang_path = path.join(_this13.x_state.dirs.base, '/lang/');

          try {
            yield fs.mkdir(lang_path, {
              recursive: true
            });
          } catch (errdir) {} // .create default po file from strings_i18n


          _this13.x_state.central_config.idiomas.split(',')[0]; // .read other po/mo files from lang dir and convert to .js


          for (var idioma in _this13.x_state.central_config.idiomas.split(',')) {
          } //

        }

        return vue;
      })();
    }

    createVueXStores() {
      var _this14 = this;

      return _asyncToGenerator(function* () {
        if (Object.keys(_this14.x_state.stores).length > 0) {
          _this14.x_console.outT({
            message: "creating VueX store definitions",
            color: 'cyan'
          });

          var path = require('path');

          require('util');

          var safe = require('safe-eval'); //console.log('debug stores complete',this.x_state.stores);


          for (var store_name in _this14.x_state.stores) {
            var store = _this14.x_state.stores[store_name];
            var file = path.join(_this14.x_state.dirs.store, "".concat(store_name, ".js"));
            var def_types = {
              'integer': 0,
              'int': 0,
              'float': 0.0,
              'boolean': false,
              'array': []
            };
            var obj = {};
   // iterate each store field
            //this.debug(`store ${store_name}`,store);

            for (var field_name in store) {
              var field = store[field_name]; //this.debug({ message:`checking field ${field_name} within store ${i}` });

              if (field.default && field.default.trim() == '') {
                if (field.type in def_types) {
                  obj[field_name] = def_types[field.type];
                } else {
                  obj[field_name] = '';
                }
              } else {
                if ('integer,int,float,boolean,array'.split(',').includes[field.type]) {
                  obj[field_name] = safe(field.default);
                } else if ('true,false,0,1'.split(',').includes[field.default]) {
                  obj[field_name] = safe(field.default);
                } else {
                  obj[field_name] = '' + field.default;
                }
              }
            } // expires?


            if (store_name in _this14.x_state.stores_types['expires']) {
              obj['expire'] = parseInt(_this14.x_state.stores_types['expires'][store_name]);
            } // versions?


            if (store_name in _this14.x_state.stores_types['versions']) {
              obj['version'] = parseInt(_this14.x_state.stores_types['versions'][store_name]);
            } // write content


            delete obj[':mutations'];
            var content = "export const state = () => (".concat(_this14.jsDump(obj), ")\n"); // :mutations?

            if (':mutations' in store) {
              var muts = [];

              for (var mut_name in store[':mutations']) {
                var mutation = store[':mutations'][mut_name]; //console.log('mutation debug',{mutation, mut_name});

                var mut = {
                  params: ['state']
                };
                if (Object.keys(mutation.params).length > 0) mut.params.push('objeto');
                muts.push("".concat(mut_name, "(").concat(mut.params.join(','), ") {\n                            ").concat(mutation.code, "\n                        }"));
              }

              content += "\nexport const mutations = {".concat(muts.join(','), "}");
            } // write file


            _this14.writeFile(file, content);
          }
        }
      })();
    } //NOT SUPPORTED ON THIS VERSION


    createServerMethods() {
      var _this15 = this;

      return _asyncToGenerator(function* () {
        if (Object.keys(_this15.x_state.functions).length > 0) {
          _this15.x_console.outT({
            message: "creating NuxtJS server methods",
            color: 'green'
          });

          var path = require('path');

          var file = path.join(_this15.x_state.dirs.server, "api.js");
          var content = "\n            var express = require('express'), _ = require('underscore'), axios = require('axios');\n            var server = express();\n            var plugins = {\n                bodyParser: require('body-parser'),\n                cookieParser: require('cookie-parser')\n            };\n            server.disable('x-powered-by');\n            server.use(plugins.bodyParser.urlencoded({ extended: false,limit: '2gb' }));\n            server.use(plugins.bodyParser.json({ extended: false,limit: '2gb' }));\n            server.use(plugins.cookieParser());\n            "; //merge functions import's into a single struct

          var imps = {};

          for (var x in _this15.x_state.functions) {
            for (var imp in _this15.x_state.functions[x]) {
              imps[imp] = _this15.x_state.functions[x][imp];
              yield _this15.setImmediatePromise(); //@improved
            }

            yield _this15.setImmediatePromise(); //@improved
          } //declare imports


          content += "// app declared functions imports\n";

          for (var _x4 in imps) {
            content += "var ".concat(imps[_x4], " = require('").concat(_x4, "');\n");
          }

          content += "// app declared functions\n"; //declare app methods

          for (var func_name in _this15.x_state.functions) {
            var func = _this15.x_state.functions[func_name];
            var func_return = "";
            if (func.return != '') func_return = "res.send(".concat(func.return, ");");
            content += "server.".concat(func.method, "('").concat(func.path, "', async function(req,res) {\n                    var params = req.").concat(func.method == 'get' ? 'params' : 'body', ";\n                    ").concat(func.code, "\n                    ").concat(func_return, "\n                });\n");
          } //close


          content += "module.exports = server;\n"; //write file

          _this15.writeFile(file, content);

          _this15.x_console.outT({
            message: "NuxtJS server methods ready",
            color: 'green'
          });
        }
      })();
    }

    createMiddlewares() {
      var _this16 = this;

      return _asyncToGenerator(function* () {
        if (Object.keys(_this16.x_state.proxies).length > 0) {
          _this16.x_console.outT({
            message: "creating VueJS Middlewares",
            color: 'cyan'
          });

          var path = require('path');

          for (var proxy_name in _this16.x_state.proxies) {
            var proxy = _this16.x_state.proxies[proxy_name];
            var file = path.join(_this16.x_state.dirs.middleware, "".concat(proxy_name, ".js")); //add imports

            var content = "";

            for (var key in proxy.imports) {
              content += "import ".concat(proxy.imports[key], " from '").concat(key, "';\n");
            } //add proxy code


            content += "export default async function ({ route, store, redirect, $axios, $config }) {\n                    ".concat(proxy.code, "\n\n                }\n                "); //find and replace instances of strings {vuepath:targetnode}

            for (var page_name in _this16.x_state.pages) {
              if (page_name != '') {
                var page = _this16.x_state.pages[page_name];

                if (page.path) {
                  content = content.replaceAll("{vuepath:".concat(page_name, "}"), page.path);
                } else {
                  _this16.x_console.outT({
                    message: "Warning! path key doesn't exist for page ".concat(page_name),
                    color: 'yellow'
                  });
                }
              }

              yield _this16.setImmediatePromise(); //@improved
            } //write file


            _this16.writeFile(file, content);

            yield _this16.setImmediatePromise(); //@improved
          }

          _this16.x_console.outT({
            message: "VueJS Middlewares ready",
            color: 'cyan'
          });
        }
      })();
    }

    createGeneralFiles() {
      var _this17 = this;

      return _asyncToGenerator(function* () {
        //create general files (babel.config.js, src/bootloader.js, src/main.js, App.vue)
        var path = require('path'); //create vuetify plugin - later save vuetify theme here
        //add default material design icons support


        _this17.x_state.dev_npm['material-design-icons-iconfont'] = '*';
        var vuetify_plugin = path.join(_this17.x_state.dirs.plugins, 'vuetify.js');
        var vuetify_plugin_content = "\n        import 'material-design-icons-iconfont/dist/material-design-icons.css'\n        //import '@fortawesome/fontawesome-free/css/all.css';\n        import Vue from 'vue';\n        import Vuetify from 'vuetify/lib/framework';\n        \n        Vue.use(Vuetify);\n        \n        export default new Vuetify({\n            icons: {\n                iconfont: 'md',\n            },\n        });        \n        ";

        _this17.writeFile(vuetify_plugin, vuetify_plugin_content); // create src/main.js


        var main = path.join(_this17.x_state.dirs.client, 'main.js');
        var main_content = "import(\"./bootloader\");";

        _this17.writeFile(main, main_content); // create src/router.js
        // create routes for all pages within project
        //this.debug('this.x_state.pages',this.x_state.pages);


        var pages = {
          imports: "",
          routes: ""
        };

        for (var page_name in _this17.x_state.pages) {
          var page = _this17.x_state.pages[page_name];

          if (page.tipo == 'page') {
            pages.imports += "import ".concat(page_name, " from './pages/").concat(page.file_, "'");
            pages.routes += "{ path:'".concat(page.path, "', component:").concat(page_name, ", name:'").concat(page_name, "' },\n");
          }
        }

        var router = path.join(_this17.x_state.dirs.client, 'router.js');
        var router_content = "\n        import Vue from 'vue';\n        import VueRouter from 'vue-router';\n\n        //import pages\n        ".concat(pages.imports, "\n\n        Vue.use(VueRouter);\n\n        //specify routes of project here\n        const router = new VueRouter({\n            routes: [\n                ").concat(pages.routes, "\n            ],\n            mode: 'history'\n        });\n\n        export default router;\n        ");

        _this17.writeFile(router, router_content); // create src/bootloader.js


        require('camelcase');

        var plugins_ = "";

        for (var plugin_name in _this17.x_state.plugins) {
          if (plugin_name != 'vuetify') {
            //this.debug('plugin '+plugin_name,this.x_state.plugins[plugin_name]);
            var code_ = _this17.x_state.plugins[plugin_name].code;

            if (code_.includes('import Vue from \'vue\';')) {
              code_ = code_.replace('import Vue from \'vue\';', '');
            }

            code_ = code_.replaceAll('\n\n', '\n');
            plugins_ += "".concat(code_, "\n"); //plugins_ += `import ${camel(plugin_name)} from './plugins/${plugin_name}.js';\n`;
          }
        }

        var bootloader = path.join(_this17.x_state.dirs.client, 'bootloader.js');
        var bootloader_content = "\n        import Vue from \"vue\";\n        import App from \"./App.vue\";\n        import vuetify from './plugins/vuetify'\n        import router from './router'\n\n        //import plugins\n        ".concat(plugins_, "\n\n        //disable production message\n        Vue.config.productionTip = false;\n\n        //setup Vue instance\n        new Vue({\n        vuetify,\n        router,\n        render: h => h(App)\n        }).$mount('#app');        \n        ");

        _this17.writeFile(bootloader, bootloader_content); // create src/App.vue


        var app = path.join(_this17.x_state.dirs.client, 'App.vue');
        var app_content = "\n        <template>\n            <router-view />\n        </template>\n        ";

        _this17.writeFile(app, app_content); // create public/index.html & copy favicon there if it exists


        var index = path.join(_this17.x_state.dirs.public, 'index.html');
        var index_content = "\n        <!DOCTYPE html>\n        <html lang=\"en\">\n          <head>\n            <meta charset=\"utf-8\">\n            <meta http-equiv=\"X-UA-Compatible\" content=\"IE=edge\">\n            <meta name=\"viewport\" content=\"width=device-width,initial-scale=1.0\">\n            <link rel=\"icon\" href=\"./favicon.ico\">\n            <title>".concat(_this17.x_state.central_config.service_name, "</title>\n            <link rel=\"stylesheet\" href=\"https://fonts.googleapis.com/css?family=Roboto:100,300,400,500,700,900\">\n            <link rel=\"stylesheet\" href=\"https://cdn.jsdelivr.net/npm/@mdi/font@latest/css/materialdesignicons.min.css\">\n          </head>\n          <body>\n            <noscript>\n              <strong>We're sorry but this doesn't work properly without JavaScript enabled. Please enable it to continue.</strong>\n            </noscript>\n            <div id=\"app\"></div>\n            <!-- built files will be auto injected -->\n          </body>\n        </html>        \n        ");

        _this17.writeFile(index, index_content); // @todo save default favicon


        path.join(_this17.x_state.dirs.public, 'favicon.ico');
      })();
    } //NOT SUPPORTED ON THIS VERSION


    prepareServerFiles() {
      var _this18 = this;

      return _asyncToGenerator(function* () {
        var path = require('path');

        var index = "// index.js\n        const sls = require('serverless-http');\n        const binaryMimeTypes = require('./binaryMimeTypes');\n        const express = require('express');\n        const app = express();\n        const { Nuxt } = require('nuxt');\n        const path = require('path');\n        const config = require('./nuxt.config.js');\n\n        async function nuxtApp() {\n            app.use('/_nuxt', express.static(path.join(__dirname, '.nuxt', 'dist')));\n            const nuxt = new Nuxt(config);\n            await nuxt.ready();\n            app.use(nuxt.render);\n            return app;\n        }\n\n        module.exports.nuxt = async (event, context) => {\n            let nuxt_app = await nuxtApp();\n            let handler = sls(nuxt_app, { binary: binaryMimeTypes });\n            return await handler (event, context);\n        }\n        ";
        var index_file = path.join(_this18.x_state.dirs.app, "index.js");

        _this18.writeFile(index_file, index); // allowed binary mimetypes


        require('util');

        var allowed = ['application/javascript', 'application/json', 'application/octet-stream', 'application/xml', 'font/eot', 'font/opentype', 'font/otf', 'image/jpeg', 'image/png', 'image/svg+xml', 'text/comma-separated-values', 'text/css', 'text/html', 'text/javascript', 'text/plain', 'text/text', 'text/xml'];

        if (_this18.x_state.config_node['nuxt:mimetypes']) {
          var user_mimes = [];

          for (var usermime in _this18.x_state.config_node['nuxt:mimetypes']) {
            user_mimes.push(usermime);
          }

          var sum_mime = [...allowed, ...user_mimes];
          allowed = [...new Set(sum_mime)]; // clean duplicated values from array
        }

        var mime = "// binaryMimeTypes.js\n        module.exports = ".concat(_this18.jsDump(allowed), ";");
        var mime_file = path.join(_this18.x_state.dirs.app, "binaryMimeTypes.js");

        _this18.writeFile(mime_file, mime);
      })();
    }

    installRequiredPlugins() {
      var _this19 = this;

      return _asyncToGenerator(function* () {
        _this19.x_state.plugins['vuetify'] = {
          global: true,
          npm: {},
          dev_npm: {
            'vuetify': '^2.6.13'
          },
          vue_config: {
            vuetify: {
              theme: {
                dark: true,
                themes: {
                  dark: {
                    primary: 'colors.blue.darken2',
                    accent: 'colors.grey.darken3',
                    secondary: 'colors.amber.darken3',
                    info: 'colors.teal.lighten1',
                    warning: 'colors.amber.base',
                    error: 'colors.deepOrange.accent4',
                    success: 'colors.green.accent3'
                  }
                }
              }
            }
          }
        };
        _this19.x_state.bootloader.imports['vuetify'] = 'vuetify';
        _this19.x_state.plugins['aos'] = {
          //each plugin should automatically create a vue_bootloader.import key
          global: true,
          npm: {
            aos: '*'
          },
          mode: 'client',
          customcode: "import AOS from \"aos\";\n            import \"aos/dist/aos.css\";\n            export default ({app}) => {\n                app.AOS = new AOS.init({});\n            };"
        }; //support for tawk.io

        if (_this19.x_state.config_node.tawk && _this19.x_state.config_node.tawk.propertyId && _this19.x_state.config_node.tawk.widgetId) {
          _this19.x_state.plugins['tawk'] = {
            global: true,
            npm: {
              '@tawk.to/tawk-messenger-vue': '*'
            },
            mode: 'client',
            customcode: "import Vue from \"vue\";\n                import TawkMessengerVue from '@tawk.to/tawk-messenger-vue';\n\n                export default function () {\n                    Vue.use(TawkMessengerVue, {\n                        propertyId : '".concat(_this19.x_state.config_node.tawk.propertyId, "',\n                        widgetId : '").concat(_this19.x_state.config_node.tawk.widgetId, "'\n                    });\n                }")
          };
        }
      })();
    }

    createVuePlugins() {
      var _arguments = arguments,
          _this20 = this;

      return _asyncToGenerator(function* () {
        var write = _arguments.length > 0 && _arguments[0] !== undefined ? _arguments[0] : true;

        var path = require('path');

        var resp = {
          global_plugins: {},
          css_files: [],
          nuxt_config: [],
          stories: {}
        };

        for (var plugin_key in _this20.x_state.plugins) {
          var plugin = _this20.x_state.plugins[plugin_key];

          if (typeof plugin === 'object') {
            // copy x_state_plugins npm's into npm global imports (for future package.json)
            if (plugin.npm) _this20.x_state.npm = _objectSpread2(_objectSpread2({}, _this20.x_state.npm), plugin.npm);
            if (plugin.dev_npm) _this20.x_state.dev_npm = _objectSpread2(_objectSpread2({}, _this20.x_state.dev_npm), plugin.dev_npm);
            if (plugin.global && plugin.global == true) resp.global_plugins[plugin_key] = '*';

            if (plugin.styles) {
              for (var style_key in plugin.styles) {
                var style = plugin.styles[style_key];

                if (style.file.includes('/') == false) {
                  var target = path.join(_this20.x_state.dirs.css, style.file);
                  yield _this20.writeFile(target, style.content);
                  resp.css_files.push({
                    src: "@/assets/css/".concat(style.file),
                    lang: style.lang
                  });
                }
              }
            } // write the plugin code


            var import_as = '',
                _code = '';

            if (plugin.var) {
              import_as = plugin.var;
            } else {
              import_as = plugin_key.split('/').splice(-1)[0].replaceAll('-', '').replaceAll('_', '').toLowerCase().trim();
            }

            _code = "import Vue from 'vue';\n";

            if (plugin.as_star) {
              if (plugin.as_star == true) {
                _code += "import * as ".concat(import_as, " from '").concat(plugin_key, "';\n");
              } else {
                _code += "import ".concat(import_as, " from '").concat(plugin_key, "';\n");
              }
            } else {
              _code += "import ".concat(import_as, " from '").concat(plugin_key, "';\n");
            }

            if (plugin.custom) _code += "".concat(plugin.custom, "\n");

            if (plugin.extra_imports) {
              for (var extra in plugin.extra_imports) {
                var new_key = plugin.extra_imports[extra].replaceAll('-', '').replaceAll('_', '').replaceAll('/', '').replaceAll('.css', '').replaceAll('.', '_').toLowerCase().trim();
                _code += "import ".concat(new_key, " from '").concat(plugin.extra_imports[extra], "'\n");
              }
            }

            if (plugin.requires) {
              for (var req in plugin.requires) {
                _code += "require('".concat(plugin.requires[req], "');\n");
              }
            }

            if (plugin.styles) {
              for (var _style_key in plugin.styles) {
                var _style = plugin.styles[_style_key];

                if (_style.file.includes('/')) {
                  _code += "import '".concat(_style.file, "';\n");
                }
              }
            } // add config to plugin code if requested


            if (plugin.config) {
              if (typeof plugin.config === 'object') {
                _code += "const config = ".concat(_this20.jsDump(plugin.config), ";\n                        Vue.use(").concat(import_as, ",config);");
              } else {
                _code += "Vue.use(".concat(import_as, ",").concat(plugin.config, ");\n");
              }
            } else if (plugin.tag && plugin.customvar == '') {
              _code += "Vue.use(".concat(import_as, ",'").concat(plugin.tag, "');\n");
            } else if (plugin.tag) {
              _code += "Vue.component('".concat(plugin.tag, "',").concat(import_as, ");\n");
            } else if (plugin.customvar) {
              _code += "Vue.use(".concat(plugin.customvar, ");\n");
            } else {
              _code += "Vue.use(".concat(import_as, ");\n");
            } // if customcode overwrite 'code'


            if (plugin.customcode) {
              _code = plugin.customcode;
            } // write to disk and add to response


            if (import_as != 'vuetify') {
              // vuetify plugin is a little different thant the others so we created separately
              // everything is client mode here
              _this20.x_state.bootloader.imports[import_as] = "import ".concat(import_as, " from '@plugins/").concat(import_as, ".js';\n");

              var _target2 = path.join(_this20.x_state.dirs.plugins, "".concat(import_as, ".js"));

              if (write) yield _this20.writeFile(_target2, _code);
            } //10-ago-21 assign code to plugin registry (for storybook)


            resp.stories[plugin_key] = plugin;
            resp.stories[plugin_key].code = _code;
          } else {
            //simple plugin
            _this20.x_state.npm[plugin_key] = plugin;

            var _import_as = plugin_key.replaceAll('-', '').replaceAll('_', '').toLowerCase().trim();

            code += "import Vue from 'vue';\n                import ".concat(_import_as, " from '").concat(plugin_key, "';\n                Vue.use(").concat(_import_as, ");\n                "); // write to disk and add to response

            if (_import_as != 'vuetify') {
              _this20.x_state.bootloader.imports[_import_as] = "import ".concat(_import_as, " from '@plugins/").concat(_import_as, ".js';\n"); //resp.nuxt_config.push({ src:`~/plugins/${import_as}.js` });

              var _target3 = path.join(_this20.x_state.dirs.plugins, "".concat(_import_as, ".js"));

              if (write) yield _this20.writeFile(_target3, code);
            } //10-ago-21 assign code to plugin registry (for storybook)


            resp.stories[plugin_key] = plugin;
            resp.stories[plugin_key].code = code;
          }
        }

        return resp;
      })();
    }

    createVueConfig() {
      var _this21 = this;

      return _asyncToGenerator(function* () {
        //creates the file vue.config.js
        //define structure with defaults
        var path = require('path');

        var target = path.join(_this21.x_state.dirs.app, "vue.config.js");
        _this21.x_state.central_config.static == true ? 'static' : 'server'; //let deploy = this.x_state.central_config.deploy+'';

        var config = {
          lintOnSave: false,
          transpileDependencies: ['vuetify'],
          configureWebpack: {
            devServer: {
              port: _this21.x_state.central_config.port,
              historyApiFallback: true,
              compress: true,
              hot: true,
              headers: {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, PATCH, OPTIONS",
                "Access-Control-Allow-Headers": "X-Requested-With, content-type, Authorization"
              }
            },
            plugins: ['{mfPlugin}']
          }
        }; //nuxt vue config

        if (_this21.x_state.config_node['vue:config']) {
          var config_ = _this21.x_state.config_node['vue:config'];
          delete config_[':secret'];
          delete config_[':link'];
          config = _objectSpread2(_objectSpread2({}, config), config_);
        } //@TODO env vars now should go on /.env

        /*
        config.publicRuntimeConfig={};
        for (let node_key in this.x_state.config_node) {
            if (node_key.includes(':')==false) {
                if ('aurora,vpc,aws'.split(',').includes(node_key)==false) {
                    if (this.x_state.secrets[node_key]===undefined && typeof this.x_state.config_node[node_key] === 'object') {
                        config.publicRuntimeConfig[node_key.toLowerCase()]={...this.x_state.config_node[node_key]};
                    }
                }
            }
        }*/
        //23feb22: hack added support for vue2-google-map plugin (@todo make this controlled from the tag command)


        config.transpileDependencies.push(/^vue2-google-maps($|\/)/); //
        //we don't need webpack build rules in this edition:omit from cfc, so we are ready here
        //let util = require('util');
        //let content = util.inspect(config,{ depth:Infinity }).replaceAll("'`","`").replaceAll("`'","`");

        if (_this21.deploy_module.modifyVueConfig) {
          config = yield _this21.deploy_module.modifyVueConfig(config);
        }

        var dumpJS = content_ => {
          var tmp = _this21.jsDump(content_); //self.debug('dumpJS',self.jsDump(content_));


          if (tmp) {
            tmp = tmp.replaceAll("'`", "`").replaceAll("`'", "`");
          }

          return tmp;
        };
        /*
        let content = dumpJS(config);
        //POST: replace dynamic placeholders with vue_config key/values
        //@TODO think a better way of doing this (maybe if value is a string an contains a prefixcode like [eval], we could omit the quotes)
        content = content.replaceAll("'{...deps}': ''","...deps");
        for (let key in this.x_state.vue_config) {
            if (key=='mfPlugin') {
                let newMF = `new ModuleFederationPlugin({`+dumpJS(this.x_state.vue_config[key])+`})\n`;
                content = content.replaceAll(`{${key}}`,newMF);
            }
        }*/
        // generate template vue.config.js with vars


        var template = "//vue.config.js generated by Concepto DSL\n";
        template += "const ModuleFederationPlugin = require(\"webpack/lib/container/ModuleFederationPlugin\");\n        const { defineConfig } = require('@vue/cli-service')\n        const path = require(\"path\");\n        const deps = require(\"./package.json\").dependencies;\n        \n        module.exports = defineConfig({\n            lintOnSave: ".concat(dumpJS(config.lintOnSave), ",\n            transpileDependencies: ").concat(dumpJS(config.transpileDependencies), ",\n            configureWebpack: {\n                devServer: ").concat(dumpJS(config.configureWebpack.devServer), ",\n                resolve: {\n                    extensions: [\".tsx\", \".ts\", \".vue\", \".jsx\", \".js\", \".json\"],\n                    alias: {\n                      \"@\": path.resolve(__dirname,\"./src\"),\n                      \"@assets\": path.resolve(__dirname,\"./src/assets\")\n                    },\n                },\n                plugins: [\n                    new ModuleFederationPlugin({\n                        name: \"").concat(_this21.x_state.central_config.service_name, "\",\n                        filename: \"remoteEntry.js\",\n                        remotes: ").concat(dumpJS(_this21.x_state.vue_config.mfPlugin.remotes), ",\n                        exposes: ").concat(dumpJS(_this21.x_state.vue_config.mfPlugin.exposes), ",\n                        shared: {\n                            ...deps,\n                            vue: {\n                                eager: true,\n                                singleton: true,\n                                requiredVersion: deps.vue\n                              },\n                              \"vue-router\": {\n                                eager: true,\n                                singleton: true,\n                                requiredVersion: deps[\"vue-router\"]\n                              },\n                              vuex: {\n                                eager: true,\n                                singleton: true,\n                                requiredVersion: deps[\"vuex\"]\n                              },\n                        }\n                    })\n                ]\n\n            }\n        })\n        ");
        yield _this21.writeFile(target, template); //this.x_console.outT({ message:'future nuxt.config.js', data:data});
      })();
    }

    createPackageJSON() {
      var _this22 = this;

      return _asyncToGenerator(function* () {
        var data = {
          name: _this22.x_state.central_config.service_name,
          version: '',
          description: _this22.x_state.central_config[':description'],
          //main: 'index.js',
          dependencies: {},
          devDependencies: {},
          scripts: {
            dev: 'vue-cli-service serve',
            build: 'vue-cli-service build'
          },
          keywords: [],
          author: '',
          license: '',
          eslintConfig: {
            root: true,
            env: {
              node: true
            },
            extends: ['plugin:vue/essential', 'eslint:recommended'],
            parserOptions: {
              parser: '@babel/eslint-parser'
            },
            rules: {}
          }
        };
        if (_this22.x_state.central_config[':version']) data.version = _this22.x_state.central_config[':version'];
        if (_this22.x_state.central_config[':author']) data.author = _this22.x_state.central_config[':author'];
        if (_this22.x_state.central_config[':license']) data.license = _this22.x_state.central_config[':license'];

        if (_this22.x_state.central_config[':git']) {
          data.repository = {
            type: 'git',
            url: "git+".concat(_this22.x_state.central_config[':git'], ".git")
          };
          data.bugs = {
            url: "".concat(_this22.x_state.central_config[':git'], "/issues")
          };
          data.homepage = _this22.x_state.central_config[':git'];
        }

        if (_this22.x_state.central_config[':keywords']) data.keywords = _this22.x_state.central_config[':keywords'].split(','); //add dependencies

        for (var pack in _this22.x_state.npm) {
          if (_this22.x_state.npm[pack].includes('http') && _this22.x_state.npm[pack].includes('github.com')) {
            data.dependencies[pack] = "git+".concat(_this22.x_state.npm[pack]);
          } else {
            data.dependencies[pack] = _this22.x_state.npm[pack];
          }
        } //add devDependencies


        for (var _pack in _this22.x_state.dev_npm) {
          if (_this22.x_state.dev_npm[_pack].includes('http') && _this22.x_state.dev_npm[_pack].includes('github.com')) {
            data.devDependencies[_pack] = "git+".concat(_this22.x_state.dev_npm[_pack]);
          } else {
            data.devDependencies[_pack] = _this22.x_state.dev_npm[_pack];
          }
        } //storybook support

        /* */


        if (_this22.x_state.central_config.storybook == true) {
          data.devDependencies['@socheatsok78/storybook-addon-vuetify'] = '^0.1.8';
          /*
          data.devDependencies['@babel/core'] = '^7.15.0';
          data.devDependencies['@storybook/addon-actions'] = '^6.3.6';
          data.devDependencies['@storybook/addon-essentials'] = '^6.3.6';
          data.devDependencies['@storybook/addon-links'] = '^6.3.6';
          data.devDependencies['@storybook/vue'] = '^6.3.6';
          data.devDependencies['babel-loader'] = '^8.2.2';
          data.devDependencies['vue-loader'] = '^15.9.8';
          */

          data.scripts['storybook2'] = 'start-storybook -s ./stories/assets -p 6006';
          data.scripts['build-storybook2'] = 'build-storybook -s ./stories/assets';
        } //write to disk


        var path = require('path');

        var target = path.join(_this22.x_state.dirs.app, "package.json");

        if (_this22.deploy_module.modifyPackageJSON) {
          data = yield _this22.deploy_module.modifyPackageJSON(data);
        }

        var content = JSON.stringify(data);
        yield _this22.writeFile(target, content); //this.x_console.outT({ message:'future package.json', data:data});
      })();
    }

    createStorybookFiles() {
      var _this23 = this;

      return _asyncToGenerator(function* () {
        // creates Storybook required files
        if (_this23.x_state.central_config.storybook == true) {
          var path = require('path');

          var spawn = require('await-spawn');

          var spinner = _this23.x_console.spinner({
            message: 'Installing storybook'
          });

          try {
            var install = yield spawn('npx', ['sb', 'init', '-f'], {
              cwd: _this23.x_state.dirs.app
            });
            spinner.succeed("Storybook installed and initialized successfully");
          } catch (n) {
            spinner.fail('Storybook failed to initialize');
          } // creates .storybook/main.js file


          var data = {
            'stories': ['../stories/**/*.stories.mdx', '../stories/**/*.stories.@(js|jsx|ts|tsx)'],
            'addons': ["@storybook/addon-links", "@storybook/addon-essentials", '@socheatsok78/storybook-addon-vuetify']
          }; //write main.js to disk
          //this.x_console.outT({ message:'STORYBOOK dirs', color:'yellow', data:this.x_state.dirs });

          var target = path.join(_this23.x_state.dirs['storybook'], "main.js");
          var content = 'module.exports = ' + JSON.stringify(data);
          yield _this23.writeFile(target, content); // creates .storybook/preview.js

          content = "import { withVuetify } from '@socheatsok78/storybook-addon-vuetify/dist/decorators'\n\nexport const parameters = {\n    actions: { argTypesRegex: \"^on[A-Z].*\" },\n    controls: {\n        matchers: {\n            color: /(background|color)$/i,\n            date: /Date$/,\n        },\n    },\n}\n\nexport const decorators = [\n    withVuetify\n]"; // write preview.js to disk

          target = path.join(_this23.x_state.dirs['storybook'], "preview.js");
          yield _this23.writeFile(target, content); // creates/writes .storybook/preview-head.html

          content = "<link rel=\"stylesheet\" href=\"https://fonts.googleapis.com/css?family=Roboto:300,400,500,700|Material+Icons\">";
          target = path.join(_this23.x_state.dirs['storybook'], "preview-head.html");
          yield _this23.writeFile(target, content); // creates custom Theme
          // copy po logo

          var po_logo = path.join(__dirname, 'assets', 'po.png');
          var po_target = path.join(_this23.x_state.dirs['stories_assets'], 'po.png');

          var fs = require('fs-extra');

          yield fs.copy(po_logo, po_target); // remove original stories
          //let fso = require('fs').promises;

          yield fs.rmdir(_this23.x_state.dirs['stories'].replace('stories2', 'stories'), {
            recursive: true
          }); // copy stories2 to stories folder

          yield fs.copy(_this23.x_state.dirs['stories'], _this23.x_state.dirs['stories'].replace('stories2', 'stories'));
          yield fs.rmdir(_this23.x_state.dirs['stories'], {
            recursive: true
          }); //await fs.remove(path.resolve());
          // creates/writes .storybook/potheme.js

          var config = {
            base: 'light',
            brandTitle: 'Punto Origen SpA',
            brandUrl: 'http://www.puntorigen.com',
            brandImage: 'po.png',
            colorPrimary: '#E10106',
            colorSecondary: '#86CD46',
            // UI
            appBg: '#FFFFFF',
            appContentBg: '#F6F8FC',
            appBorderColor: 'grey',
            appBorderRadius: 1
          };
          content = "import { create } from '@storybook/theming'\n";
          content += "export default create(".concat(JSON.stringify(config), ");");
          target = path.join(_this23.x_state.dirs['storybook'], "po.js");
          yield _this23.writeFile(target, content); // creates/writes .storybook/manager.js

          content = "import { addons } from '@storybook/addons';\n";
          content += "import poTheme from './po';\n\n";
          content += "addons.setConfig({ theme: poTheme });";
          target = path.join(_this23.x_state.dirs['storybook'], "manager.js");
          yield _this23.writeFile(target, content);
        }
      })();
    }

    createVSCodeHelpers() {
      var _this24 = this;

      return _asyncToGenerator(function* () {
        // creates Visual Studio code common helpers
        var path = require('path'); // creates /jsconfig.json file for Vetur and IntelliSense


        var data = {
          include: ['./src/**/*'],
          compilerOptions: {
            baseUrl: './',
            module: 'es2015',
            moduleResolution: 'node',
            target: 'es5',
            sourceMap: true,
            paths: {
              '~/*': ['./src/*'],
              '@/*': ['./src/*'],
              '~~/*': ['./*'],
              '@@/*': ['./*']
            }
          },
          exclude: ['node_modules', 'dist', 'secrets']
        }; //write to disk

        var target = path.join(_this24.x_state.dirs.app, "jsconfig.json");
        var content = JSON.stringify(data);
        yield _this24.writeFile(target, content);
      })();
    } //NOT USED ON THIS VERSION


    createServerlessYML() {
      var _this25 = this;

      return _asyncToGenerator(function* () {
        var yaml = require('yaml'),
            data = {};

        var deploy = _this25.x_state.central_config.deploy + '';

        if (deploy.includes('eb:') == false && deploy.includes('s3:') == false && deploy != false && deploy != 'local') {
          data.service = _this25.x_state.central_config.service_name;
          data.custom = {
            prune: {
              automatic: true,
              includeLayers: true,
              number: 1
            },
            apigwBinary: {
              types: ['*/*']
            }
          }; //add 'secrets' config json keys - cfc:12895
          //this.x_state.secrets

          for (var secret in _this25.x_state.secrets) {
            data.custom[secret] = '${file(secrets/' + secret + '.json)}';
          } //domain info


          if (_this25.x_state.central_config.dominio) {
            data.custom.customDomain = {
              domainName: _this25.x_state.central_config.dominio
            };
            if (_this25.x_state.central_config.basepath) data.custom.customDomain.basePath = _this25.x_state.central_config.basepath;
            if (_this25.x_state.central_config.stage) data.custom.customDomain.stage = _this25.x_state.central_config.stage;
            data.custom.customDomain.createRoute53Record = true;
          } //nodejs env on aws


          data.provider = {
            name: 'aws',
            runtime: 'nodejs8.10',
            timeout: _this25.x_state.central_config.timeout
          };
          if (_this25.x_state.central_config.stage) data.provider.stage = _this25.x_state.central_config.stage; //env keys

          if (Object.keys(_this25.x_state.config_node) != '') {
            data.provider.enviroment = {};
            if (_this25.x_state.central_config.stage) data.provider.enviroment.STAGE = _this25.x_state.central_config.stage;

            if (_this25.x_state.config_node.vpc) {
              data.provider.vpc = {
                securityGroupIds: [_this25.x_state.config_node.vpc.security_group_id],
                subnetIDs: []
              };

              if (_this25.x_state.secrets.vpc) {
                data.provider.vpc.securityGroupIds = ['${self:custom.vpc.SECURITY_GROUP_ID}'];
              }

              if (_this25.x_state.config_node.vpc.subnet1_id) data.provider.vpc.subnetIDs.push('${self:custom.vpc.SUBNET1_ID}');
              if (_this25.x_state.config_node.vpc.subnet2_id) data.provider.vpc.subnetIDs.push('${self:custom.vpc.SUBNET2_ID}');
              if (_this25.x_state.config_node.vpc.subnet3_id) data.provider.vpc.subnetIDs.push('${self:custom.vpc.SUBNET3_ID}');
              if (_this25.x_state.config_node.vpc.subnet4_id) data.provider.vpc.subnetIDs.push('${self:custom.vpc.SUBNET4_ID}');
              if (_this25.x_state.config_node.vpc.subnet5_id) data.provider.vpc.subnetIDs.push('${self:custom.vpc.SUBNET5_ID}');
              if (_this25.x_state.config_node.vpc.subnet6_id) data.provider.vpc.subnetIDs.push('${self:custom.vpc.SUBNET6_ID}');
              if (_this25.x_state.config_node.vpc.subnet7_id) data.provider.vpc.subnetIDs.push('${self:custom.vpc.SUBNET7_ID}');
            }
          } //aws iam for s3 permissions (x_state.aws_iam) (@TODO later - cfc:12990)

          /*
          data.provider.iamRoleStatements = {
              Effect: 'Allow'
          };*/
          //nuxt handler


          data.functions = {
            nuxt: {
              handler: 'index.nuxt',
              events: [{
                'http': 'ANY /'
              }, {
                'http': 'ANY /{proxy+}'
              }]
            }
          };

          if (_this25.x_state.central_config['keep-warm']) {
            data.functions.nuxt.events.push({
              schedule: 'rate(20 minutes)'
            });
          } //aws resources for s3 (x_state.aws_resources) (@TODO later - no commands use them - cfc:13017)
          //serverless plugins


          data.plugins = ['serverless-apigw-binary', 'serverless-offline', 'serverless-prune-plugin'];
          if (_this25.x_state.central_config.dominio) data.plugins.push('serverless-domain-manager'); //write yaml to disk

          var content = yaml.stringify(data);

          var path = require('path');

          var target = path.join(_this25.x_state.dirs.app, "serverless.yml");
          yield _this25.writeFile(target, content); //debug
          //this.debug('future serverless.yml', content);
        }
      })();
    }

    onEnd() {
      var _this26 = this;

      return _asyncToGenerator(function* () {
        //execute deploy (npm install, etc) AFTER vue compilation (18-4-21: this is new)
        if (!_this26.errors_found) {
          //only deploy if no errors were found
          if (!(yield _this26.deploy_module.deploy()) && !_this26.x_state.central_config.componente) {
            _this26.x_console.outT({
              message: 'Something went wrong deploying, check the console, fix it and run again.',
              color: 'red'
            });

            yield _this26.deploy_module.post(); // found errors deploying

            process.exit(100);
          } else {
            yield _this26.deploy_module.post();
          }
        } else {
          //found errors compiling
          process.exit(50);
        }
      })();
    }

    exists(dir_or_file) {
      return _asyncToGenerator(function* () {
        var fs = require('fs').promises;

        try {
          yield fs.access(dir_or_file);
          return true;
        } catch (e) {
          return false;
        }
      })();
    }

    writeFile(file, content) {
      var _arguments2 = arguments,
          _this27 = this;

      return _asyncToGenerator(function* () {
        var encoding = _arguments2.length > 2 && _arguments2[2] !== undefined ? _arguments2[2] : 'utf-8';

        var fs = require('fs').promises,
            prettier = require('prettier');

        var ext = file.split('.').splice(-1)[0].toLowerCase(); //console.log('writeFile:'+file+' (ext:'+ext+')');

        /*let beautify = require('js-beautify');
        let beautify_js = beautify.js;
        let beautify_vue = beautify.html;
        let beautify_css = beautify.css;*/

        var resp = content;

        if (ext == 'js') {
          try {
            resp = prettier.format(resp, {
              parser: 'babel',
              useTabs: true,
              singleQuote: true
            });
          } catch (ee) {
            _this27.debug("error: could not format the JS file; trying js-beautify (".concat(file, ")"));

            var beautify = require('js-beautify');

            var beautify_js = beautify.js;
            resp = beautify_js(resp, {});
          }
        } else if (ext == 'json') {
          try {
            resp = prettier.format(resp, {
              parser: 'json'
            });
          } catch (ee) {
            _this27.debug("error: could not format the JSON file; trying js-beautify");

            var _beautify = require('js-beautify');

            var _beautify_js = _beautify.js;
            resp = _beautify_js(resp, {});
          }
        } else if (ext == 'vue') {
          /*
          let beautify = require('js-beautify');
          let beautify_vue = beautify.html;
          resp = beautify_vue(resp.replaceAll(`="xpropx"`,''),{});*/
          resp = resp.replaceAll("=\"xpropx\"", '');

          try {
            resp = prettier.format(resp, {
              parser: 'vue',
              htmlWhitespaceSensitivity: 'ignore',
              useTabs: true,
              printWidth: 2000,
              embeddedLanguageFormatting: 'auto',
              singleQuote: true,
              trailingComma: 'none'
            });
          } catch (ee) {
            _this27.debug("warning: could not format the vue file; trying vue-beautify", ee);

            var _beautify2 = require('js-beautify');

            var beautify_vue = _beautify2.html;
            resp = beautify_vue(resp, {});
          }
        } else if (ext == 'css') {
          resp = prettier.format(resp, {
            parser: 'css'
          });
        }
        /*
        
        let resp = content;
        if (ext=='js' || ext=='json') {
            resp = beautify_js(resp, { eval_code: false }).replaceAll(`\n\n`,'');
        } else if (ext=='vue') {
            resp = beautify_vue(resp.replaceAll(`="xpropx"`,''),{}); //{ indent_scripts: 'keep' }
        } else if (ext=='css') {
            resp = beautify_css(resp, { indent_scripts: 'keep' });
        }*/
        //12-dic-21: only write if target content is different from existing.


        var target_exists = yield _this27.exists(file);
        var same = false;

        if (target_exists) {
          var prev = yield fs.readFile(file, encoding);
          var prev_hash = yield _this27.hash(prev);
          var curr_hash = yield _this27.hash(resp); //this.debug('testing file writing hashes',{prev_hash,curr_hash});

          if (prev_hash == curr_hash) same = true;
        }

        if (!same) yield fs.writeFile(file, resp, encoding);
      })();
    } //Transforms the processed nodes into files.


    onCreateFiles(processedNodes) {
      var _this28 = this;

      return _asyncToGenerator(function* () {
        //this.x_console.out({ message:'onCreateFiles', data:processedNodes });
        //this.x_console.out({ message:'x_state.plugins', data:this.x_state.plugins });
        yield _this28.generalConfigSetup();
        yield _this28.createGitIgnore();
        var plugins_info4stories = yield _this28.createVuePlugins(false); //this.x_console.out({ message:'plugins_info4stories', data:plugins_info4stories });

        var add_plugins2story = function add_plugins2story(story_vue) {
          var plugins = plugins_info4stories.stories;
          var resp = story_vue;

          for (var plugin in plugins) {
            if (plugins[plugin].code.includes('vuetify') == false) {
              var nscript = "<script>\n";
              nscript += plugins[plugin].code.replace("import Vue from 'vue';", '');
              resp = resp.replace('<script>\n', nscript);
            }
          }

          return resp.replaceAll('\n\n', '\n');
        };

        _this28.debug('processing nodes');

        var fs = require('fs').promises,
            path = require('path'); // asign filenames to each this.x_state.pages


        for (var thefile_num in processedNodes) {
          var thefile = processedNodes[thefile_num]; // only level 2 nodes!

          var page = _this28.x_state.pages[thefile.title];

          if (page) {
            page.file_ = thefile.file;
          }
        } // loop for real


        for (var _thefile_num in processedNodes) {
          //await processedNodes.map(async function(thefile) {
          var _thefile = processedNodes[_thefile_num]; // only level 2 nodes!

          _thefile.code + '\n';

          var toDisk = /*#__PURE__*/function () {
            var _ref3 = _asyncToGenerator(function* (thefile) {
              //@todo transform this whole block into a function (so .grouped) can also called it per file
              this.debug('processing node ' + thefile.title);
              var page = this.x_state.pages[thefile.title];
              var vue = yield this.getBasicVue(thefile); // @TODO check the vue.template replacements (8-mar-21)
              // declare server:asyncData

              this.debug('post-processing internal custom tags');
              vue = yield this.processInternalTags(vue, page); // closure ...
              // **** **** start script wrap **** **** **** **** 

              var script_imports = ''; // header for imports

              if (page) {
                for (var key in page.imports) {
                  script_imports += "import ".concat(page.imports[key], " from '").concat(key, "';\n");
                } //);

              } // export default


              vue.script = "{concepto:mixins:import}\n                ".concat(script_imports, "\n                export default {\n                    ").concat(vue.script, "\n                    {concepto:mixins:array}\n                }"); // **** **** end script wrap **** **** 
              // process Mixins

              vue = this.processMixins(vue, page); // process Styles

              vue = this.processStyles(vue, page); // removes refx attributes

              vue = this.removeRefx(vue); // fix {vuepath:} placeholders

              vue = this.fixVuePaths(vue, page); // process lang files (po)

              vue = yield this.processLangPo(vue, page); // ********************************** //
              // beautify the script and template
              // ********************************** //

              vue.script = '<script>\n' + vue.script + '\n</script>';
              if (!vue.style) vue.style = '';
              vue.full = "".concat(vue.template, "\n").concat(vue.script, "\n").concat(vue.style); // ********************************** //
              // write files

              var w_path = path.join(this.x_state.dirs.pages, thefile.file);

              if (page.tipo == 'componente') {
                this.x_console.outT({
                  message: "writing vue 'component' file ".concat(thefile.file),
                  color: 'cyan'
                });
                w_path = path.join(this.x_state.dirs.components, thefile.file.replace('.vue', '')); //create individual 'component' directory

                var _fs = require('fs').promises;

                try {
                  yield _fs.mkdir(w_path, {
                    recursive: true
                  });
                } catch (errdir) {}

                if (this.x_state.central_config.storybook == true) {
                  //write {component}-story.vue alongside component file, with paths modified
                  var vue_story = vue.full;
                  var svue_path = path.join(w_path, thefile.file.replace('.vue', '-story.vue'));
                  vue_story = vue_story.replaceAll('@/assets', '../../assets');
                  vue_story = vue_story.replaceAll('@/components', '../../components');
                  vue_story = vue_story.replaceAll('.vue', '-story.vue');
                  vue_story = add_plugins2story(vue_story); // @todo apply sub-tags and plugins directly to .vue

                  /*if (vue.script.includes('asyncComputed')) {
                      let nscript = `<script>\n`;
                      nscript += `import vueasynccomputed from 'vue-async-computed';\n`;
                      nscript += `Vue.use(vueasynccomputed);\n`;
                      vue_story = vue_story.replace('<script>\n',nscript);
                  }*/
                  //put this after everything else

                  if (vue.script.includes("import Vue from 'vue'") == false) {
                    var nscript = "<script>\n";
                    nscript += "import Vue from 'vue';\n";
                    vue_story = vue_story.replace('<script>\n', nscript);
                  } //


                  yield this.writeFile(svue_path, vue_story); //
                  //if (vue.template.includes('<c-')==false && vue.template.includes(`~/assets/`)==false) {

                  this.x_console.outT({
                    message: "writing story 'component' for ".concat(thefile.file),
                    color: 'brightCyan'
                  });
                  var story = yield this.getComponentStory(thefile);
                  var story_file = thefile.file.replace('.vue', '.stories.js');
                  var story_full = path.join(this.x_state.dirs.stories, story_file);
                  yield this.writeFile(story_full, story.script); //}
                } //


                if (page.for_export) {
                  // save component version for publishing component as plugin
                  var djson = thefile.file.replace('.vue', '.json');
                  this.x_console.outT({
                    message: "writing dsl 'component' file ".concat(djson, " (for export)"),
                    color: 'brightCyan'
                  });
                  var dsl_file = path.join(w_path, djson);
                  yield this.writeFile(dsl_file, page.for_export);
                }

                w_path = path.join(w_path, thefile.file); //let inspect = require('util').inspect;
                //if (page.for_export) console.log('for export before writing',inspect(JSON.parse(page.for_export),{ depth:Infinity }));
              } else if (page.tipo == 'layout') {
                this.x_console.outT({
                  message: "writing vue 'layout' file ".concat(thefile.file),
                  color: 'cyan'
                });
                w_path = path.join(this.x_state.dirs.layouts, thefile.file);
              } else {
                this.x_console.outT({
                  message: "writing vue 'page' file ".concat(thefile.file),
                  color: 'cyan'
                });
              }

              yield this.writeFile(w_path, vue.full); //
              //this.x_console.out({ message: 'vue ' + thefile.title, data: { vue, page_style: page.styles } });
            });

            return function (_x5) {
              return _ref3.apply(this, arguments);
            };
          }().bind(_this28); //


          if (_thefile.file.split('.').slice(-1) == 'omit') {
            yield _this28.processOmitFile(_thefile); //process special non 'files'
          } else if (_thefile.file.includes('.group') == true) {
            yield* function* () {
              _this28.x_console.outT({
                message: "segmenting 'group' file ".concat(_thefile.file),
                color: 'cyan'
              }); //console.log('@TODO pending support for "grouped" componentes');
              //extract vue_file tags


              _this28.debug('processing group ' + _thefile.file + ' of files', _thefile);

              var cheerio = require('cheerio');

              var $ = cheerio.load(_thefile.code, {
                ignoreWhitespace: false,
                xmlMode: true,
                decodeEntities: false
              });
              var files_ = $("vue_file").toArray();
              var tobe_created = [];
              files_.map(function (file_) {
                var cur = $(file_);
                cur.attr('title') ? cur.attr('title') : '';
                var node_id = cur.attr('node_id') ? cur.attr('node_id') : '';
                var code = cur.html();
                tobe_created.push({
                  id: node_id,
                  code: code,
                  valid: true,
                  error: false,
                  hasChildren: true,
                  open: '',
                  close: '',
                  x_ids: ''
                });
              });

              for (var tobe of tobe_created) {
                var the_node = yield _this28.dsl_parser.getNode({
                  id: tobe.id,
                  recurse: false
                });
                tobe.title = yield _this28.onDefineTitle(the_node);
                tobe.file = yield _this28.onDefineFilename(the_node); //console.log('to create ',tobe);
                //console.log('the page',this.x_state.pages[tobe.title]);
                //process.exit(0);

                yield toDisk(tobe);
              } //await this.processOmitFile(thefile);
              //expand 'grouped' pages a sub-process them

            }();
          } else {
            yield toDisk(_thefile);
          } //this.x_console.out({ message:'pages debug', data:this.x_state.pages });


          yield _this28.setImmediatePromise(); //@improved
        } // *************************
        // copy/write related files
        // *************************
        // copy static required files for known NPMs packages (gif.js) @TODO improve this ugly hack  
        //this.x_state.npm['gif.js'] = '*';


        if (_this28.x_state.npm['gif.js']) {
          _this28.x_console.outT({
            message: "downloading required gif.worker.js file for gif.js npm package",
            color: 'yellow'
          });

          var fetch = require('node-fetch');

          var static_path = path.join(_this28.x_state.dirs.static, 'gif.worker.js');
          var worker = yield fetch('https://raw.githubusercontent.com/jnordberg/gif.js/master/dist/gif.worker.js');

          var _contenido = yield worker.text();

          yield fs.writeFile(static_path, _contenido, 'utf-8');
        } // copy assets


        if (Object.keys(_this28.x_state.assets).length > 0) {
          _this28.debug({
            message: "Copying assets",
            color: 'cyan'
          });

          var copy = require('recursive-copy');

          for (var i in _this28.x_state.assets) {
            //@TODO add support for i18n assets
            var asset = _this28.x_state.assets[i];

            if (!asset.i18n) {
              var source = path.join(_this28.x_state.dirs.base, asset.original);
              var target = path.join(_this28.x_state.dirs.assets, asset.original.split('/').slice(-1)[0]); //this.debug({ message: `Copying asset`, data:{source,target}, color:'cyan'});

              try {
                yield copy(source, target);
              } catch (e) {}
            }

            yield _this28.setImmediatePromise(); //@improved
          }

          _this28.debug({
            message: "Copying assets ready",
            color: 'cyan'
          });
        } // create VueJS template structure


        yield _this28.createVueXStores(); //await this.createServerMethods();

        yield _this28.createMiddlewares(); //create server files (nuxt express, mimetypes)
        //await this.prepareServerFiles();
        //declare required plugins

        yield _this28.installRequiredPlugins(); //create NuxtJS plugin definition files

        yield _this28.createVuePlugins(); //return plugin array list for nuxt.config.js
        //this.debug({ message:'MIGRATION DEBUG -> check nuxt_plugs CSS', data:nuxt_plugs.css_files })
        //this.x_state.nuxt_config.plugins = nuxt_plugs.nuxt_config;
        //this.x_state.nuxt_config.css = nuxt_plugs.css_files;
        //create nuxt.config.js file
        //await this.createNuxtConfig()
        //create vue.config.js file

        yield _this28.createVueConfig(); //create general files (babel.config.js, src/bootloader.js, src/main.js, App.vue)

        yield _this28.createGeneralFiles(); //create package.json

        yield _this28.createPackageJSON(); //create storybook related files

        yield _this28.createStorybookFiles(); //create VSCode helpers

        yield _this28.createVSCodeHelpers(); //create serverless.yml for deploy:sls - cfc:12881
        //await this.createServerlessYML();
        //execute deploy (npm install, etc) - moved to onEnd
      })();
    } // ************************
    // INTERNAL HELPER METHODS 
    // ************************

    /*
     * Returns true if a local server is running on the DSL defined port
     */


    _isLocalServerRunning() {
      var _this29 = this;

      return _asyncToGenerator(function* () {
        var is_reachable = require('is-port-reachable');

        var resp = yield is_reachable(_this29.x_state.central_config.port);
        return resp;
      })();
    }
    /*
     * Reads the node called modelos and creates tables definitions and managing code (alias:database).
     */


    _readModelos() {
      var _this30 = this;

      return _asyncToGenerator(function* () {
        // @IDEA this method could return the insert/update/delete/select 'function code generators'
        _this30.debug('_readModelos');

        _this30.debug_time({
          id: 'readModelos'
        });

        var modelos = yield _this30.dsl_parser.getNodes({
          text: 'modelos',
          level: 2,
          icon: 'desktop_new',
          recurse: true
        }); //nodes_raw:true	

        var tmp = {
          appname: _this30.x_state.config_node.name
        },
            fields_map = {};
        var resp = {
          tables: {},
          attributes: {},
          length: 0,
          doc: ''
        }; // map our values to real database values 

        var type_map = {
          id: {
            value: 'INT AUTOINCREMENT PRIMARY KEY',
            alias: ['identificador', 'autoid', 'autonum', 'key']
          },
          string: {
            value: 'STRING',
            alias: ['varchar', 'string', 'text']
          },
          int: {
            value: 'INTEGER',
            alias: ['numero chico', 'small int', 'numero']
          },
          float: {
            value: 'FLOAT',
            alias: ['decimal', 'real']
          },
          boolean: {
            value: 'BOOLEAN',
            alias: ['boleano', 'true/false']
          },
          date: {
            value: 'DATEONLY',
            alias: ['fecha']
          },
          datetime: {
            value: 'DATETIME',
            alias: ['fechahora']
          },
          blob: {
            value: 'BLOB',
            alias: ['binario', 'binary']
          }
        }; // expand type_map into fields_map

        Object.keys(type_map).map(function (x) {
          var aliases = type_map[x].alias;
          aliases.push(x);
          aliases.map(y => {
            fields_map[y] = type_map[x].value;
          });
        }); // parse nodes into tables with fields

        if (modelos.length > 0) {
          //modelos[0].attributes.map(x=>{ resp.attributes={...resp.attributes,...x} }); //modelos attributes
          resp.attributes = _objectSpread2({}, modelos[0].attributes);
          resp.doc = modelos[0].text_note;
          resp.length = modelos[0].nodes.length;

          for (var table of modelos[0].nodes) {
            var fields = _objectSpread2({}, table.attributes); //table.attributes.map(x=>{ fields={...fields,...x} }); //table attributes


            resp.tables[table.text] = {
              fields: {}
            }; //create table

            tmp.sql_fields = [];

            for (var field in fields) {
              resp.tables[table.text].fields[field] = fields_map[fields[field]]; //assign field with mapped value

              tmp.sql_fields.push(field + ' ' + fields_map[fields[field]]);
            }

            resp.tables[table.text].sql = "CREATE TABLE ".concat(table.text, "(").concat(tmp.sql_fields.join(','), ")");
            yield _this30.setImmediatePromise(); //@improved
          }
        }

        _this30.debug_timeEnd({
          id: 'readModelos'
        }); // install alaSQL plugin and define tables


        if (resp.length > 0) {
          // get tables sql create
          var ala_create = [];

          for (var _table in resp.tables) {
            ala_create.push("alasqlJs('".concat(resp.tables[_table].sql, "');"));
          } // set custom install code


          var ala_custom = "const alasql = {\n\t\t\t\tinstall (v) {\n\t\t\t\t\t// create tables from models\n\t\t\t\t\t".concat(ala_create.join('\n'), "\n\t\t\t\t\tVue.prototype.alasql = alasqlJs;\n\t\t\t\t}\n\t\t\t}"); // set plugin info in state

          _this30.x_state.plugins['../../node_modules/alasql/dist/alasql.min.js'] = {
            global: true,
            npm: {
              alasql: '*'
            },
            var: 'alasqlJs',
            mode: 'client',
            customvar: 'alasql',
            custom: ala_custom
          };
        } // return 


        return resp;
      })();
    }
    /*
     * Reads assets node, and returns object with info
     */


    _readAssets() {
      var _this31 = this;

      return _asyncToGenerator(function* () {
        var resp = {},
            path = require('path');

        _this31.debug('_readAssets');

        _this31.debug_time({
          id: '_readAssets'
        });

        var assets = yield _this31.dsl_parser.getNodes({
          text: 'assets',
          level: 2,
          icon: 'desktop_new',
          recurse: true
        }); //nodes_raw:true

        var sep = path.sep; //
        //this.debug('assets search',assets);

        if (assets.length > 0) {
          assets = assets[0]; // 15ms full

          for (var child of assets.nodes) {
            if (child.nodes.length == 1 && child.nodes[0].image != '') {
              // if there is just 1 grand-child and has an image defined
              resp[child.text.toLowerCase()] = {
                i18n: false,
                original: child.nodes[0].image,
                css: '@assets' + sep + path.basename(child.nodes[0].image),
                js: '@' + sep + 'assets' + sep + path.basename(child.nodes[0].image)
              };
            } else if (child.nodes.length > 1) {
              // if child has more than 1 child (grandchild), we'll assume its an image with i18n alternatives
              var key = child.text.toLowerCase();
              resp[key] = {
                i18n: true,
                i18n_keys: []
              };

              for (var i18n_node of child.nodes) {
                // expand node attributes
                var attrs = _objectSpread2({}, i18n_node.attributes);
                /*i18n_node.attributes.map(function(x) {
                	attrs = {...attrs,...x};
                });*/


                if (attrs.idioma && i18n_node.image != '') {
                  var lang = attrs.idioma.toLowerCase();
                  resp[key].i18n_keys.push(lang);
                  resp[key][lang] = {
                    original: i18n_node.image,
                    css: '@assets' + sep + path.basename(i18n_node.image),
                    js: '@' + sep + 'assets' + sep + path.basename(i18n_node.image)
                  };
                }
              } // transform i18n_keys to list


              resp[key].i18n_keys = resp[key].i18n_keys.join(',');
            } else if (child.link != '') {
              resp[child.text.toLowerCase()] = {
                original: child.link,
                css: '@assets' + sep + path.basename(child.link),
                js: '@' + sep + 'assets' + sep + path.basename(child.link)
              };
            } //console.log('child of asset '+assets.text,child);

          } // 12ms full

          /*let children = await assets.getNodes();
          for (let child of children) {
          	console.log('child of asset '+assets.text,children);
          }*/

        }

        _this31.debug_timeEnd({
          id: '_readAssets'
        });

        return resp;
      })();
    }
    /* 
     * Grabs central node configuration information
     */


    _readCentralConfig() {
      var _this32 = this;

      return _asyncToGenerator(function* () {
        _this32.debug('_readCentralConfig');

        var central = yield _this32.dsl_parser.getNodes({
          level: 1,
          recurse: false
        }); //this.debug('central search',central);
        // set defaults

        var resp = {
          cloud: 'aws',
          type: 'simple',
          i18n: false,
          log: 'console',
          debug: false,
          deploy: false,
          static: false,
          timeout: 30,
          modelos: 'aurora',
          componente: false,
          storybook: false,
          'keep-alive': true,
          'keep-warm': true,
          port: 3000,
          git: true,
          nuxt: 'latest',
          idiomas: 'es',
          ':cache': _this32.x_config.cache,
          ':mode': 'spa',
          ':keywords': '',
          ':author': 'Punto Origen SpA',
          ':license': 'MIT',
          ':github': '',
          ':version': '1.0.0',
          ':description': central[0].text_note,
          default_face: central[0].font.face,
          default_size: central[0].font.size,
          apptitle: central[0].text
        }; // overwrite default resp with info from central node
        //resp = {...resp, ...central[0].attributes };
        //bit slower but transforms string booleans (19-4-21)

        var values = {};

        for (var xz in central[0].attributes) {
          var x = central[0].attributes[xz];

          if (x == 'true') {
            x = true;
          } else if (x == 'false') {
            x = false;
          }

          values = _objectSpread2(_objectSpread2({}, values), {
            [xz]: x
          });
        }

        resp = _objectSpread2(_objectSpread2({}, resp), values);
        /*central[0].attributes.map(function(x) {
        	resp = {...resp,...x};
        });*/

        if (resp.dominio) {
          resp.service_name = resp.dominio.replace(/\./g, '').toLowerCase();
        } else {
          resp.service_name = resp.apptitle;
        }

        if (!resp[':cache']) _this32.x_config.cache = false; // disables cache when processing nodes (@todo)
        // return

        return resp;
      })();
    }
    /* helper for readConfig and secrets extraction */


    configFromNode(resp, key) {
      if (key.icons.includes('button_cancel') == false) {
        if (Object.keys(key.attributes).length > 0) {
          // prepare config key
          var config_key = key.text.toLowerCase().replace(/ /g, ''); //alt1 let values = {...key.attributes }; 
          //alt2, bit slower but considers booleans as string

          var values = {};

          for (var xz in key.attributes) {
            var x = key.attributes[xz];

            if (x == 'true') {
              x = true;
            } else if (x == 'false') {
              x = false;
            }

            values = _objectSpread2(_objectSpread2({}, values), {
              [xz]: x
            });
          }

          resp[config_key] = values; // mark secret status true if contains 'password' icon

          if (key.icons.includes('password')) {
            resp[config_key][':secret'] = true;
            if (!resp['::secrets']) resp['::secrets'] = [];
            resp['::secrets'].push(key); //add key as secret
          } // add link attribute if defined


          if (key.link != '') resp[config_key][':link'] = key.link;
        } else if (key.nodes.length > 0) {
          resp[key.text] = key.nodes[0].text;
        } else if (key.link != '') {
          resp[key.text] = key.link;
        } //


        if (key.text == ':secrets' && key.icons.includes('password')) {
          resp[':secrets'] = key.text_note.replaceAll('\n', '').trim();
        }
      }

      return resp;
    }
    /*
     * Grabs the configuration from node named 'config'
     */


    _readConfig() {
      var _arguments3 = arguments,
          _this33 = this;

      return _asyncToGenerator(function* () {
        var delete_secrets = _arguments3.length > 0 && _arguments3[0] !== undefined ? _arguments3[0] : true;

        _this33.debug('_readConfig');

        var resp = {
          id: '',
          meta: [],
          seo: {},
          secrets: {}
        },
            config_node = {};
        var search = yield _this33.dsl_parser.getNodes({
          text: 'config',
          level: 2,
          icon: 'desktop_new',
          recurse: true
        }); //this.debug({ message:'search says',data:search, prefix:'_readConfig,dim' });
        //

        if (search.length > 0) {
          config_node = search[0]; // define default font_face

          if (!delete_secrets) resp[':id'] = config_node.id;
          resp.default_face = config_node.font.face;
          resp.default_size = config_node.font.size; // apply children nodes as keys/value for resp

          for (var key of config_node.nodes) {
            if (key.text.toLowerCase() == 'meta') {
              for (var meta_child of key.nodes) {
                // apply grand_childs as meta tags
                if (meta_child.text.toLowerCase() == 'keywords') {
                  resp.seo['keywords'] = meta_child.nodes.map(x => x.text);
                  resp.meta.push({
                    hid: yield _this33.hash(meta_child.nodes[0].text),
                    name: 'keywords',
                    content: resp.seo['keywords'].join(',')
                  });
                } else if (meta_child.text.toLowerCase() == 'language') {
                  resp.seo['language'] = meta_child.nodes[0].text;
                  resp.meta.push({
                    hid: yield _this33.hash(meta_child.nodes[0].text),
                    lang: meta_child.nodes[0].text
                  });
                } else if (meta_child.text.toLowerCase() == 'charset') {
                  resp.seo['charset'] = meta_child.nodes[0].text;
                  resp.meta.push({
                    charset: meta_child.nodes[0].text
                  });
                } else {
                  resp.seo['charset'] = meta_child.nodes[0].text;

                  if (meta_child.text.indexOf(':') != -1) {
                    resp.meta.push({
                      property: meta_child.text,
                      vmid: meta_child.text,
                      content: meta_child.nodes[0].text
                    });
                  } else {
                    resp.meta.push({
                      hid: yield _this33.hash(meta_child.nodes[0].text),
                      name: meta_child.text,
                      content: meta_child.nodes[0].text
                    });
                  }
                } //

              }
            } else {
              // apply keys as config keys (standard config node by content types)
              resp = _objectSpread2(_objectSpread2({}, resp), _this33.configFromNode(resp, key)); //
            }
          } //map values that reference other nodes[attr]


          var safe_eval = require('safe-eval');

          var resp2 = JSON.parse(JSON.stringify(resp));
          var central2 = JSON.parse(JSON.stringify(_this33.x_state.central_config));

          for (var _key2 in resp) {
            if (typeof resp[_key2] === 'object') {
              for (var key2 in resp[_key2]) {
                if (typeof resp[_key2][key2] === 'string' && resp[_key2][key2].indexOf('${') != -1 && resp[_key2][key2].indexOf('}') != -1) {
                  var to_eval = resp[_key2][key2];
                  to_eval = to_eval.replaceAll('${', "'+").replaceAll('}', "+'");
                  to_eval = "'" + to_eval + "'";
                  if (central2.deploy != 'local') central2.deploy = 'deploy';
                  var eval_ = safe_eval(to_eval, {
                    config: resp2,
                    central: central2
                  });
                  resp[_key2][key2] = eval_; //console.log('config evaluated',{ to_eval,raw:resp[key][key2], eval_ });
                }
              }
            }
          }
        } // assign dsl file folder name+filename if node.name is not given


        if (!resp.name) {
          var path = require('path');

          var dsl_folder = path.dirname(path.resolve(_this33.x_flags.dsl));
          var parent_folder = path.resolve(dsl_folder, '../');
          var folder = dsl_folder.replace(parent_folder, '');
          resp.name = folder.replace('/', '').replace('\\', '') + '_' + path.basename(_this33.x_flags.dsl, '.dsl'); //console.log('folder:',{folder,name:resp.name});
          //this.x_flags.dsl
        } // create id if not given


        if (!resp.id) resp.id = 'com.puntorigen.' + resp.name; // *********************************************

        if (delete_secrets == true) delete resp[':secrets'];
        return resp;
      })();
    }

    getParentNodes() {
      var _arguments4 = arguments,
          _this34 = this;

      return _asyncToGenerator(function* () {
        var id = _arguments4.length > 0 && _arguments4[0] !== undefined ? _arguments4[0] : _this34.throwIfMissing('id');
        var exec = _arguments4.length > 1 && _arguments4[1] !== undefined ? _arguments4[1] : false;
        var parents = yield _this34.dsl_parser.getParentNodesIDs({
          id,
          array: true
        });
        var resp = [];

        for (var parent_id of parents) {
          var node = yield _this34.dsl_parser.getNode({
            id: parent_id,
            recurse: false
          });
          var command = yield _this34.findValidCommand({
            node,
            object: exec
          });
          if (command) resp.push(command);
          yield setImmediatePromise(); //@improved
        }

        return resp;
      })();
    } //gets the asset code for a given string like: assets:assetname


    getAsset() {
      var text = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : this.throwIfMissing('text');
      var type = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'js';
      //this.x_state.assets
      var resp = text.replaceAll('assets:', ''),
          type_o = type.replaceAll('jsfunc', 'js').toLowerCase();

      if (text.includes('assets:')) {
        if (resp in this.x_state.assets) {
          if (this.x_state.central_config.idiomas.indexOf(',') != -1 && this.x_state.assets[resp].i18n == true) {
            var first_key = this.x_state.assets[resp].i18n_keys.split(',')[0];
            resp = this.x_state.assets[resp][first_key][type_o];

            if (type.toLowerCase() == 'js') {
              resp = resp.replaceAll("/".concat(first_key, "/"), "/' + $i18n.locale + '/");
              resp = "require('".concat(resp, "')");
            } else if (type.toLowerCase() == 'jsfunc') {
              resp = resp.replaceAll("/".concat(first_key, "/"), "/' + this.$i18n.locale + '/");
              resp = "require('".concat(resp, "')");
            }
          } else if (resp in this.x_state.assets && type_o in this.x_state.assets[resp]) {
            resp = this.x_state.assets[resp][type_o];

            if (type_o == 'js') {
              resp = "require('".concat(resp, "')");
            }
          } else ;
        }
      }

      return resp;
    } //vue attributes tag version


    struct2params() {
      var struct = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : this.throwIfMissing('id');

      var resp = [],
          tmp = _objectSpread2({}, struct); // pre-process


      if ('aos' in tmp) {
        var aos_p = struct['aos'].split(',');

        if (aos_p.length == 3) {
          tmp['data-aos'] = aos_p[0];
          tmp['data-aos-duration'] = aos_p[1];
          tmp['data-aos-delay'] = aos_p[2];
        } else {
          tmp['data-aos'] = aos_p[0];
          tmp['data-aos-duration'] = aos_p[1];
        }

        delete tmp['aos'];
      } // process


      for (var [key, value] of Object.entries(tmp)) {
        if (value == null) {
          //needed cause cheerio assigns empty values to props, and vue props don't have values
          //little hack that works together with writeFile method
          resp.push("".concat(key, "=\"xpropx\""));
        } else if (typeof value !== 'object' && typeof value !== 'function' && typeof value !== 'undefined') {
          resp.push("".concat(key, "=\"").concat(value, "\""));
        } else if (typeof value === 'object') {
          //serialize value
          resp.push("".concat(key, "=\"").concat(this.jsDump(value), "\""));
        }
      }

      return resp.join(' ');
    } //serializes the given obj escaping quotes from values containing js code


    jsDump(obj) {
      var resp = '';

      var isNumeric = function isNumeric(n) {
        return !isNaN(parseFloat(n)) && isFinite(n);
      };

      var escape = function escape(obi) {
        var nuevo = '',
            ob = obi; //special escapes first

        if (typeof ob === 'string' && ob == '{null}') ob = null;
        if (typeof ob === 'string') ob = ob.replaceAll('{now}', 'new Date()'); //

        if (typeof ob === 'number') {
          nuevo += ob;
        } else if (ob == null) {
          nuevo = null;
        } else if (typeof ob === 'boolean') {
          nuevo += ob;
        } else if (typeof ob === 'string' && ob.substr(0, 2) == '**' && ob.substr(ob.length - 2) == '**') {
          nuevo += ob.replaceAll('**', ''); //escape single ** vars 21-abr-21
        } else if (typeof ob === 'string' && (ob.charAt(0) == '!' || ob.indexOf('this.') != -1 || ob.indexOf('new ') != -1 || ob.indexOf('require(') != -1 || ob.indexOf("'") != -1 || ob.indexOf('`') != -1 || ob.charAt(0) != '0' && isNumeric(ob) || ob == '0' || ob == 'true' || ob == 'false')) {
          nuevo += ob;
        } else if (!isNaN(ob) && ob.toString().indexOf('.') != -1) {
          nuevo += ob;
        } else if (typeof ob === 'string') {
          nuevo += "'".concat(ob, "'");
        } else {
          nuevo += ob;
        }

        return nuevo;
      };

      if (Array.isArray(obj)) {
        var tmp = [];
        var resx = '[';

        for (var item in obj) {
          tmp.push(this.jsDump(obj[item]));

          if (resx == '[') {
            resx += tmp[item];
          } else {
            resx += ',' + tmp[item];
          }
        }

        resp = resx + ']'; //resp = `[${tmp.join(',')}]`;
      } else if (typeof obj === 'object' && obj != null) {
        var _tmp = []; //23feb22 test if object if regEx type

        if (obj.toString()[0] == '/' && obj.toString()[obj.toString().length - 1] == '/') {
          //regEx type
          resp = obj.toString();
        } else {
          //
          for (var llave in obj) {
            var llavet = llave;
            if (llavet.includes('-') && llavet.includes("'") == false) llavet = "'".concat(llave, "'");
            var nuevo = "".concat(llavet, ": ");
            var valor = obj[llave];

            if (typeof valor === 'object' || Array.isArray(valor)) {
              nuevo += this.jsDump(valor);
            } else {
              nuevo += escape(valor);
            }

            _tmp.push(nuevo);
          }

          resp = "{\n".concat(_tmp.join(','), "\n}");
        }
      } else if (typeof obj === 'string') {
        resp = escape(obj);
      } else {
        resp = obj;
      }

      return resp;
    } // hash helper method


    hash(thing) {
      var _this35 = this;

      return _asyncToGenerator(function* () {
        var resp = yield _this35.dsl_parser.hash(thing);
        /*const {sha1} = require('crypto-hash');
        let resp = await sha1(thing,{ outputFormat:'hex' });*/

        return resp;
      })();
    }
    /*
    hash(thing) {
        // returns a hash of the given object, using google highwayhash (fastest)
        //this.debug_time({ id:`hash ${thing}` });
        const highwayhash = require('highwayhash');
        let input;
        if (typeof thing === 'string') {
            input = Buffer.from(thing);
        } else if (typeof thing === 'object') {
            // serialize object into buffer first
            input = Buffer.from(JSON.stringify(thing));
        }
        let resp = highwayhash.asHexString(this.x_crypto_key, input);
        //this.debug_timeEnd({ id:`hash ${thing}` });;
        return resp;
    }*/
    // atLeastNode


    atLeastNode(r) {
      var n = process.versions.node.split('.').map(x => parseInt(x, 10));
      r = r.split('.').map(x => parseInt(x, 10));
      return n[0] > r[0] || n[0] === r[0] && (n[1] > r[1] || n[1] === r[1] && n[2] >= r[2]);
    }

    setImmediatePromise() {
      //for preventing freezing node thread within loops (fors)
      return new Promise(resolve => {
        setImmediate(() => resolve());
      });
    }
    /*
    CONCEPTO CLI methods
    */
    //create newMap; args = cli args, ex. { _: [ 'APP_PATH' ], type: 'vue', cmd_: 'app_path' }


    concepto_cli_create(args) {
      var _arguments5 = arguments,
          _this36 = this;

      return _asyncToGenerator(function* () {
        var prompts_ = _arguments5.length > 1 && _arguments5[1] !== undefined ? _arguments5[1] : null;
        //creates a new map and returns obj with xml content to be written to file
        var prompts = yield _this36.returnPromps();
        if (prompts_) prompts = _objectSpread2(_objectSpread2({}, prompts), prompts_);
        var config = {
          type: args.type ? args.type : 'vue_nuxt',
          name: args._.length > 0 ? args._[0] : '',
          static: true,
          deploy: 'local'
        };
        if (config.name != '') config.name = config.name.split('/').pop(); // complete config

        if (config.name == '') config.name = yield prompts.ask("What's the application's name:");

        if (!args.yes || args.yes == false) {
          //only ask details if not in yes mode
          config.type = yield prompts.choose("Choose a type", [{
            title: 'Vue',
            value: 'vue',
            description: "Simple HTML VueJS app"
          }, {
            title: 'Vue Component',
            value: 'vue_component',
            description: "Simple VueJS Component"
          }, {
            title: 'Vue Component Library',
            value: 'vue_component_mf',
            description: "VueJS Component library with Module Federation support"
          }, {
            title: 'NuxtJS + Vue',
            value: 'vue_nuxt',
            description: "VueJS Web App builder (default)"
          }], 3); //deploy

          if (config.type == 'vue_component_mf') {
            config.deploy = yield prompts.choose("Where do you plan to host this library?", [{
              title: 'Just local for now',
              value: 'local'
            }, {
              title: 'Amazon Web Services',
              value: 'aws'
            }]);
          } else if (config.type == 'vue_component') {
            config.deploy = 'local';
          } else {
            config.deploy = yield prompts.choose("Where do you plan to deploy/host this app?", [{
              title: 'Just local for now',
              value: 'local'
            }, {
              title: 'Amazon Web Services',
              value: 'aws'
            }, {
              title: 'Github Pages',
              value: 'gh-pages'
            }]);
          } //static ?
          //if (config.deploy=='gh-pages') config.static = true;


          if (config.deploy == 'aws') {
            config.aws_service = yield prompts.choose("In what AWS service do you plan to host it?", [{
              title: 'Elasticbean',
              value: 'eb'
            }, {
              title: 'S3',
              value: 's3'
            }], 1);
            if (config.aws_service == 'eb') config.static = false;

            if (config.aws_service == 's3') {
              //@todo: do you plan on using a domain for the s3 bucket?
              config.s3_bucket = yield prompts.ask("Enter AWS S3 bucket name");
            }
          } else if (config.deploy == 'local' && config.type == 'vue_nuxt') {
            config.static = yield prompts.choose("Do you want to generate a static web app ?", [{
              title: 'Yes',
              value: true
            }, {
              title: 'No',
              value: false
            }], 0);
          }
        } //create xml map


        var xml = "<map version=\"1.1.3\">\n        <!-- Diagrama de Concepto DSL. Para ver este archivo use Punto Origen Concepto DSL de http://www.puntorigen.com -->\n        <node CREATED=\"1552681669876\" ID=\"ID_247237303\" MODIFIED=\"1628032505691\" TEXT=\"".concat(config.name, "\">\n        <attribute_layout NAME_WIDTH=\"76\" VALUE_WIDTH=\"70\"/>\n        <attribute NAME=\"deploy\" VALUE=\"local\"/>\n        <attribute NAME=\"static\" VALUE=\"true\"/>\n        </node>\n        </map>");

        var dsl_parser = require('@concepto/dsl_parser');

        var dsl = new dsl_parser({
          source: xml,
          config: {
            cancelled: true,
            debug: false
          }
        });
        var central_attributes = {};
        if (config.deploy) central_attributes.deploy = config.deploy;
        if (config.static) central_attributes.static = config.static;
        yield dsl.process();
        yield dsl.editNode({
          node_id: 'ID_247237303',
          data: {
            attributes: central_attributes
          }
        }); //test if 'config' node exists 
        //test if 'home' node exists
        //

        xml = dsl.getParser().html();
        return {
          xml: xml,
          config: config,
          dsl: dsl
        };
      })();
    }

    concepto_cli_add() {
      return _asyncToGenerator(function* () {})();
    }

  }

  return vue_dsl;

}));

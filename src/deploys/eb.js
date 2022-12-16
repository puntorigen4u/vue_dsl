/**
* EB Deploy: A class to help deploy vue_dsl to AWS EB.
* @name 	eb
* @module 	eb
**/
import base_deploy from './base_deploy'

export default class eb extends base_deploy {

    constructor({ context={} }={}) {
        super({ context, name:'AWS EB' });
    }

    async logo() {
        let asciify = require('asciify-image'), path = require('path');
        let aws = path.join(__dirname,'assets','aws.png');
        let logo_txt = await asciify(aws, 
            { 
                fit:'width',
                width:25
            }
        );
        console.log(logo_txt);
    }

    async modifyNuxtConfig(config) {
        if (this.context.x_state.config_node.axios && this.context.x_state.config_node.axios.deploy) {
            let ax_config = config.axios;
            ax_config.baseURL = this.context.x_state.config_node.axios.deploy;
            ax_config.browserBaseURL = this.context.x_state.config_node.axios.deploy;
            delete ax_config.deploy;
            config.axios = ax_config;
        }
        return config;
    }

    async deploy() {
        let build={};
        this.context.x_console.title({ title:'Deploying to Amazon AWS Elastic Bean', color:'green' });
        await this.logo();
        // builds the app
        build.try_build = await this.base_build(); 
        if (build.try_build.length>0) {
            this.context.x_console.outT({ message:`There was an error building the project.`, color:'red' });
            return false;
        }
        // deploys to aws
        build.deploy_aws_eb = await this.run(); //test if results.length>0 (meaning there was an error)
        if (build.deploy_aws_eb.length>0) {
            this.context.x_console.outT({ message:`There was an error deploying to Amazon AWS.`, color:'red', data:build.deploy_aws_eb.toString()});
            return false;
        }
        return true;
    }

    async run() {
        let spawn = require('await-spawn');
        let errors = [];
        //AWS EB deploy
        this.context.debug('AWS EB deploy');
        let eb_full = this.context.x_state.central_config.deploy.replaceAll('eb:','');
        let eb_appname = eb_full;
        let eb_instance = `${eb_appname}-dev`;
        if (this.context.x_state.central_config.deploy.includes(',')) {
            eb_appname = eb_full.split(',')[0];
            eb_instance = eb_full.split(',').splice(-1)[0];
        }
        if (eb_appname!='') {
            let spinner = this.context.x_console.spinner({ message:'Creating config files' });
            //this.x_console.outT({ message:`Creating EB config yml: ${eb_appname} in ${eb_instance}`, color:'yellow' });
            let yaml = require('yaml');
            let data = {
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
            };
            //create .elasticbeanstalk directory
            let path = require('path'), fs = require('fs').promises;
            let eb_base = this.context.x_state.dirs.app;
            if (this.context.x_state.central_config.static) eb_base = path.join(eb_base,'dist');
            let eb_dir = path.join(eb_base,'.elasticbeanstalk');
            try { await fs.mkdir(eb_dir, { recursive: true }); } catch(ef) {}
            //write .elasticbeanstalk/config.yml file with data
            await this.context.writeFile(path.join(eb_dir,'config.yml'),yaml.stringify(data));
            //write .npmrc file
            await this.context.writeFile(path.join(eb_base,'.npmrc'),'unsafe-perm=true');
            //create .ebignore file
let eb_ig = `node_modules/
jspm_packages/
.npm
.node_repl_history
*.tgz
.yarn-integrity
.editorconfig
# Mac OSX
.DS_Store
# Elastic Beanstalk Files
.elasticbeanstalk/*
!.elasticbeanstalk/*.cfg.yml
!.elasticbeanstalk/*.global.yml`;
            await this.context.writeFile(path.join(eb_base,'.ebignore'),eb_ig);
            //init git if not already
            spinner.succeed('EB config files created successfully');
            let results = {};
            if (!(await this.exists(path.join(eb_base,'.git')))) {
                //git directory doesn't exist
                this.context.x_console.outT({ message:'CREATING .GIT DIRECTORY' });
                spinner.start('Initializing project git repository');
                spinner.text('Creating .gitignore file');
let git_ignore=`# Mac System files
.DS_Store
.DS_Store?
__MACOSX/
Thumbs.db
# VUE files
node_modules/`;
                
                await this.context.writeFile(path.join(eb_base,'.gitignore'),git_ignore);
                spinner.succeed('.gitignore created');
                spinner.start('Initializing local git repository ..');
                try {
                    results.git_init = await spawn('git',['init','-q'],{ cwd:eb_base });
                    spinner.succeed('GIT initialized');
                } catch(gi) { 
                    results.git_init = gi; 
                    spinner.fail('GIT failed to initialize');
                    errors.push(gi);
                }
                spinner.start('Adding files to local git ..');
                try {
                    results.git_add = await spawn('git',['add','.'],{ cwd:eb_base });
                    spinner.succeed('git added files successfully');
                } catch(gi) { 
                    results.git_add = gi; 
                    spinner.fail('git failed to add local files');
                    errors.push(gi);
                }
                spinner.start('Creating first git commit ..');
                try {
                    results.git_commit = await spawn('git',['commit','-m','Inicial'],{ cwd:eb_base });
                    spinner.succeed('git created first commit successfully');
                } catch(gi) { 
                    results.git_commit = gi; 
                    spinner.fail('git failed to create first commit');
                    errors.push(gi);
                }

            }
            if (this.context.x_state.central_config.static==true) {
                spinner.start('Deploying *static version* to AWS ElasticBean .. please wait');
            } else {
                spinner.start('Deploying to AWS ElasticBean .. please wait');
            }
            // execute eb deploy
            try {
                if (this.context.x_config.nodeploy && this.context.x_config.nodeploy==true) {
                    spinner.succeed('EB ready to be deployed (nodeploy as requested)');
                    this.context.x_console.outT({ message:`Aborting final deployment as requested`, color:'brightRed'});
                } else {
                    results.eb_deploy = await spawn('eb',['deploy',eb_instance],{ cwd:eb_base }); //, stdio:'inherit'
                    spinner.succeed('EB deployed successfully');
                }
            } catch(gi) { 
                //test if eb failed because instance has not being created yet, if so create it
                results.eb_deploy = gi; 
                spinner.warn('EB failed to deploy');
                //this.x_console.outT({ message:gi.toString(), color:'red'});
                if (gi.code==4) {
                    // IAM credentials are invalid or instance hasn't being created (eb create is missing)
                    spinner.start('Checking if AWS credentials are valid ..');
                    try {
                        results.eb_create = await spawn('aws',['sts','get-caller-identity'],{ cwd:eb_base }); //, stdio:'inherit'
                        spinner.succeed('AWS credentials are ok');
                    } catch(aws_cred) {
                        spinner.fail('Current AWS credentials are invalid');
                        errors.push(aws_cred);
                    }
                    if (errors.length==0) {
                        spinner.start('EB it seems this is a new deployment: issuing eb create');
                        try {
                            //console.log('\n');
                            results.eb_create = await spawn('eb',['create',eb_instance],{ cwd:eb_base }); //, stdio:'inherit'
                            spinner.succeed('EB created and deployed successfully');
                        } catch(ec) {
                            this.context.x_console.outT({ message:gi.stdout.toString(), color:'red'});
                            spinner.fail('EB creation failed');
                            errors.push(gi);
                        }
                    }
                } else {
                    this.context.x_console.outT({ message:'error: eb create (exitcode:'+gi.code+'):'+gi.stdout.toString(), color:'red'});
                    errors.push(gi);
                }
            }
            //if errors.length==0 && this.x_state.central_config.debug=='true'
            if (errors.length==0 && this.context.x_state.central_config.debug==true && !this.context.x_config.nodeploy) {
                //open eb logging console
                let ci = require('ci-info');              
                if (ci.isCI==false) {
                    spinner.start('Opening EB debug terminal ..');
                    try {
                        let abs_cmd = path.resolve(eb_base);
                        let cmd = `clear; sleep 2; clear; cd ${abs_cmd} && clear && eb open ${eb_instance}`;
                        results.eb_log = await spawn('npx',['terminal-tab',cmd],{ cwd:abs_cmd }); //, detached:true
                        spinner.succeed(`EB logging opened on new tab successfully`);
                    } catch(ot) { 
                        results.eb_log = ot;
                        spinner.fail(`I was unable to open a new tab terminal window with the EB debugging console`);
                    }
                } else {
                    spinner.warn(`Omitting EB debug, because a CI env was detected.`);
                }
            }
            // eb deploy done
        }
        return errors;
    }

    //****************************
    // onPrepare and onEnd steps
    //****************************
    async post() {
        let ci = require('ci-info');
        //restores aws credentials if modified by onPrepare after deployment
        if (!this.context.x_state.central_config.componente && 
            this.context.x_state.central_config.deploy && 
            this.context.x_state.central_config.deploy.indexOf('eb:') != -1 && 
            this.context.x_state.config_node.aws && ci.isCI==false) {
            // @TODO add this block to deploys/eb 'post' method and onPrepare to 'pre' 20-br-21
            // only execute after deploy and if user requested specific aws credentials on map
            let path = require('path'), copy = require('recursive-copy'), os = require('os');
            let fs = require('fs');
            let aws_bak = path.join(this.context.x_state.dirs.base, 'aws_backup.ini');
            let aws_file = path.join(os.homedir(), '/.aws/') + 'credentials';
            // try to copy aws_bak over aws_ini_file (if bak exists)
            let exists = s => new Promise(r=>fs.access(s, fs.constants.F_OK, e => r(!e)));
            if ((await this.context.exists(aws_bak))) {
                await copy(aws_bak,aws_file,{ overwrite:true, dot:true, debug:false });
                // remove aws_bak file
                await fs.promises.unlink(aws_bak);
            }
        }
    }

    async pre() {
        let ci = require('ci-info');
        if (!this.context.x_state.central_config.componente && 
             this.context.x_state.central_config.deploy && 
             this.context.x_state.central_config.deploy.indexOf('eb:') != -1 &&
             ci.isCI==false) {
            // if deploying to AWS eb:x, then recover/backup AWS credentials from local system
            let ini = require('ini'),
                path = require('path'),
                fs = require('fs').promises;
            // read existing AWS credentials if they exist
            let os = require('os');
            let aws_ini = '';
            let aws_ini_file = path.join(os.homedir(), '/.aws/') + 'credentials';
            try {
                //this.debug('trying to read AWS credentials:',aws_ini_file);
                aws_ini = await fs.readFile(aws_ini_file, 'utf-8');
                this.context.debug('AWS credentials:',aws_ini);
            } catch (err_reading) {}
            // 
            if (this.context.x_state.config_node.aws) {
                // if DSL defines temporal AWS credentials for this app .. 
                // create backup of aws credentials, if existing previously
                if (aws_ini != '') {
                    let aws_bak = path.join(this.context.x_state.dirs.base, 'aws_backup.ini');
                    this.context.x_console.outT({ message: `config:aws:creating .aws/credentials backup`, color: 'yellow' });
                    await fs.writeFile(aws_bak, aws_ini, 'utf-8');
                }
                // debug
                this.context.x_console.outT({ message: `config:aws:access ->${this.context.x_state.config_node.aws.access}` });
                this.context.x_console.outT({ message: `config:aws:secret ->${this.context.x_state.config_node.aws.secret}` });
                // transform config_node.aws keys into ini
                let to_ini = ini.stringify({
                    aws_access_key_id: this.context.x_state.config_node.aws.access,
                    aws_secret_access_key: this.context.x_state.config_node.aws.secret
                }, { section: 'default' });
                this.context.debug('Setting .aws/credentials from config node');
                // save as .aws/credentials (ini file)
                await fs.writeFile(aws_ini_file, to_ini, 'utf-8');

            } else if (aws_ini != '') {
                // if DSL doesnt define AWS credentials, use the ones defined within the local system.
                let parsed = ini.parse(aws_ini);
                if (parsed.default) this.context.debug('Using local system AWS credentials', parsed.default);
                this.context.x_state.config_node.aws = { access: '', secret: '' };
                if (parsed.default.aws_access_key_id) this.context.x_state.config_node.aws.access = parsed.default.aws_access_key_id;
                if (parsed.default.aws_secret_access_key) this.context.x_state.config_node.aws.secret = parsed.default.aws_secret_access_key;
            }
        }
    }
}
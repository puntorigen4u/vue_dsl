/**
* S3 Deploy: A class to help deploy vue_dsl to AWS S3.
* @name 	s3
* @module 	s3
**/
import base_deploy from './base_deploy'

export default class s3 extends base_deploy {

    constructor({ context={} }={}) {
        super({ context, name:'AWS S3' });
    }

    async logo() {
        let cfonts = require('cfonts');
        cfonts.say(this.name, {...{ font:'3d', colors:['red','#333'] }});
    }

    async modifyPackageJSON(config) {
        //little sass errors hack fix 13jun21
        let ci = require('ci-info');
        if (ci.isCI==false) {
            //config.devDependencies['sass-migrator']='*';
            //config.scripts.hackfix = 'sass-migrator division node_modules/vuetify/**/*.sass && sass-migrator division node_modules/vuetify/**/*.scss';
            //config.scripts.dev = 'npm run hackfix && '+config.scripts.dev;
            //config.scripts.build = 'npm run hackfix && '+config.scripts.build;
        }
        return config;
    }

    async modifyNuxtConfig(config) {
        if (this.context.x_state.config_node.axios && this.context.x_state.config_node.axios.deploy) {
            let ax_config = config.axios;
            ax_config.baseURL = this.context.x_state.config_node.axios.deploy;
            ax_config.browserBaseURL = this.context.x_state.config_node.axios.deploy;
            delete ax_config.deploy;
            config.axios = ax_config;
        }
        this.context.x_state.central_config.static=true; //force static mode
        return config;
    }

    async deploy() {
        let build={};
        this.context.x_console.title({ title:'Deploying to Amazon AWS S3', color:'green' });
        await this.logo();
        // builds the app
        build.try_build = await this.base_build(); 
        if (build.try_build.length>0) {
            this.context.x_console.outT({ message:`There was an error building the project.`, color:'red' });
            return false;
        }
        // deploys to aws
        build.deploy_aws_s3 = await this.run(); //test if results.length>0 (meaning there was an error)
        if (build.deploy_aws_s3.length>0) {
            this.context.x_console.outT({ message:`There was an error deploying to Amazon AWS.`, color:'red', data:build.deploy_aws_s3.toString()});
            return false;
        }
        return true;
    }

    async run() {
        let spawn = require('await-spawn');
        let path = require('path');
        let errors = [], results={};
        let bucket = this.context.x_state.central_config.deploy.replaceAll('s3:','').trim();
        let aliases = [];
        let ci = require('ci-info');
        let spa_opt = { cwd:this.context.x_state.dirs.base };
        let profile = ['--profile','default'];
        if (ci.isCI==true) {
            //spa_opt.stdio = 'inherit';
            profile = [];
        }
        if (this.context.x_state.central_config.dominio) {
            bucket = this.context.x_state.central_config.dominio.trim();
        }
        //support for domain aliases
        if (bucket.includes('<-')==true) {
            let extract = require('extractjs');
            aliases = bucket.split('<-').pop().split(',');
            bucket = bucket.split('<-')[0].replaceAll('s3:','').trim();
        }
        //
        let region = 'us-east-1';
        if (this.context.x_state.config_node.aws.region) region = this.context.x_state.config_node.aws.region;
        let dist_folder = path.join(this.context.x_state.dirs.compile_folder,'dist/');
        //AWS S3 deploy        
        this.context.debug('AWS S3 deploy');
        //MAIN
        //create bucket policy
        let spinner = this.context.x_console.spinner({ message:`Creating policy for bucket:${bucket}` });
        let policy = {
            Version: '2012-10-17',
            Statement: [
                {
                    Sid: 'PublicReadGetObject',
                    Effect: 'Allow',
                    Principal: '*',
                    Action: 's3:GetObject',
                    Resource: `arn:aws:s3:::${bucket}/*`
                }
            ]
        };
        let policyFile = path.join(this.context.x_state.dirs.base,'policy.json');
        try {
            await this.context.writeFile(policyFile,JSON.stringify(policy));
            spinner.succeed('Bucket policy created');    
        } catch(x1) {
            spinner.fail('Bucket policy creation failed');
            errors.push(x1);
        }
        //create bucket
        spinner.start('Creating bucket');
        try {
            results.create_bucket = await spawn('aws',['s3api','create-bucket','--bucket',bucket,'--region',region,...profile],spa_opt); //, stdio:'inherit'
            spinner.succeed(`Bucket created in ${region}`);
        } catch(x2) { 
            spinner.fail('Bucket creation failed');
            errors.push(x2);
        }
        //add bucket policy
        //aws s3api put-bucket-policy --bucket www.happy-bunny.xyz --policy file:///tmp/bucket_policy.json --profile equivalent
        spinner.start('Adding bucket policy');
        try {
            results.adding_policy = await spawn('aws',['s3api','put-bucket-policy','--bucket',bucket,'--policy','file://'+policyFile,...profile],spa_opt); //, stdio:'inherit'
            spinner.succeed(`Bucket policy added correctly`);
        } catch(x3) { 
            spinner.fail('Adding bucket policy failed');
            errors.push(x3);
        }
        //upload website files to bucket
        //aws s3 sync /tmp/SOURCE_FOLDER s3://www.happy-bunny.xyz/  --profile equivalent
        spinner.start('Uploading website files to bucket');
        try {
            results.website_upload = await spawn('aws',['s3','sync',dist_folder,'s3://'+bucket+'/',...profile],spa_opt); //, stdio:'inherit'
            spinner.succeed(`Website uploaded successfully`);
        } catch(x4) { 
            spinner.fail('Failed uploading website files');
            errors.push(x4);
        }
        //set s3 bucket as website, set index.html and error page
        //aws s3 website s3://www.happy-bunny.xyz/ --index-document index.html --error-document error.html --profile equivalent
        spinner.start('Setting S3 bucket as type website');
        try {
            results.set_as_website = await spawn('aws',
                [   's3','website',
                    's3://'+bucket+'/',
                    '--index-document','index.html',
                    '--error-document','200.html',
                    ...profile],
                    spa_opt);
            spinner.succeed(`Bucket configured as website successfully`);
        } catch(x5) { 
            spinner.fail('Failed configuring bucket as website');
            errors.push(x5);
        }
        //ALIASES
        let fs = require('fs').promises;
        if (aliases.length>0) {
            for (let alias of aliases) {            
                let spinner = this.context.x_console.spinner({ message:`Creating policy for bucket alias:${alias}` });
                let policy = {
                    RedirectAllRequestsTo: {
                        HostName: bucket
                    }
                };
                let policyFile = path.join(this.context.x_state.dirs.base,'policy_alias.json');
                try {
                    await this.context.writeFile(policyFile,JSON.stringify(policy));
                    spinner.succeed(`Bucket alias '${alias}' policy created`);    
                } catch(x1) {
                    spinner.fail(`Bucket alias '${alias}' policy creation failed`);
                    errors.push(x1);
                }
                //create bucket
                spinner.start(`Creating bucket alias '${alias}'`);
                try {
                    results.create_bucket = await spawn('aws',['s3api','create-bucket','--bucket',alias,'--region',region,...profile],spa_opt); //, stdio:'inherit'
                    spinner.succeed(`Bucket alias '${alias}' created in ${region}`);
                } catch(x2) { 
                    spinner.fail(`Bucket alias '${alias}' creation failed`);
                    errors.push(x2);
                }
                //add bucket policy
                spinner.start(`Adding bucket alias '${alias}' policy`);
                try {
                    results.adding_policy = await spawn('aws',['s3api','put-bucket-website','--bucket',alias,'--website-configuration','file://policy_alias.json',...profile],spa_opt); //, stdio:'inherit'
                    spinner.succeed(`Bucket alias '${alias}' policy added correctly`);
                } catch(x2) { 
                    spinner.fail(`Adding bucket alias '${alias}' policy failed`);
                    errors.push(x2);
                }
                //erase policy_alias.json file
                try {
                    await fs.unlink(policyFile);
                } catch(err_erasepolicy_alias) {
                }
            }
        }
        if (errors.length==0) {
            this.context.x_console.out({ message:`Website ready at http://${bucket}.s3-website-${region}.amazonaws.com/`, color:'brightCyan'});
        }
        //erase policy.json file
        try {
            await fs.unlink(policyFile);
        } catch(err_erasepolicy) {
        }
        //ready
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
            this.context.x_state.central_config.deploy.indexOf('s3:') != -1 && 
            this.context.x_state.config_node.aws && ci.isCI==false) {
            // @TODO add this block to deploys/s3 'post' method and onPrepare to 'pre' 20-br-21
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
             this.context.x_state.central_config.deploy.indexOf('s3:') != -1 &&
             ci.isCI==false) {
            // if deploying to AWS s3:x, then recover/backup AWS credentials from local system
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
                if (this.context.x_state.config_node.aws.region) {
                    this.context.x_console.outT({ message: `config:aws:region ->${this.context.x_state.config_node.aws.region}` });
                }
                // transform config_node.aws keys into ini
                let to_aws = {
                    aws_access_key_id: this.context.x_state.config_node.aws.access,
                    aws_secret_access_key: this.context.x_state.config_node.aws.secret
                };
                if (this.context.x_state.config_node.aws.region) {
                    to_aws.region = this.context.x_state.config_node.aws.region;
                }
                let to_ini = ini.stringify(to_aws, { section: 'default' });
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
                if (parsed.default.region) this.context.x_state.config_node.aws.region = parsed.default.region; 
            }
        }
    }
}
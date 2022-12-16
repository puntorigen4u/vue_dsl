/**
* Local Deploy: A class to help deploy vue_dsl locally.
* @name 	local
* @module 	local
**/
import base_deploy from './base_deploy'
//const base_deploy = require('./base_deploy');

export default class local extends base_deploy {

    constructor({ context={} }={}) {
        super({ context, name:'Local' });
    }

    async modifyPackageJSON(config) {
        //little sass errors hack fix 13jun21
        //config.devDependencies['sass-migrator']='*';
        //config.scripts.hackfix = 'sass-migrator division node_modules/vuetify/**/*.sass && sass-migrator division node_modules/vuetify/**/*.scss';
        //config.scripts.dev = 'npm run hackfix && '+config.scripts.dev;
        return config;
    }

    async modifyVueConfig(config) {
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
    }

    async deploy() {
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
    }

    async run() {
        //issue npm run dev
        let errors=[];
        let spawn = require('await-spawn');
        let spinner = this.context.x_console.spinner({ message:'Deploying local instance' });
        //this.debug('Local deploy');
        spinner.start('Deploying local instance');
        try {
            //launch in a new terminal
            await this.launchTerminal('npm',['run','dev'],this.context.x_state.dirs.app);
            //results.git_add = await spawn('npm',['run','dev'],{ cwd:this.x_state.dirs.app });
            spinner.succeed('NuxtJS launched successfully');
        } catch(gi) { 
            spinner.fail('Project failed to launch');
            errors.push(gi);
        }
        return errors;
    }

}
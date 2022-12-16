/**
* GHPages Deploy: A class to help auto-deploy ghpages on build repo commit.
* @name 	ghpages
* @module 	ghpages
**/
import base_deploy from './base_deploy'

export default class ghpages extends base_deploy {

    constructor({ context={} }={}) {
        super({ context, name:'GH Pages' });
    }

    async modifyNuxtConfig(config) {
        // use axios deploy endpoint
        if (this.context.x_state.config_node.axios && this.context.x_state.config_node.axios.deploy) {
            let ax_config = config.axios;
            ax_config.baseURL = this.context.x_state.config_node.axios.deploy;
            ax_config.browserBaseURL = this.context.x_state.config_node.axios.deploy;
            delete ax_config.deploy;
            config.axios = ax_config;
        }
        //force a static build, since ghpages only support those
        config.ssr = false;
        config.target = 'static';
        config.performance.gzip = false;
        return config;
    }

    async deploy() {
        let build={};
        this.context.x_console.title({ title:'Creating GH Workflow for deploying on ghpages on commit', color:'green' });
        await this.logo({ config:{ font:'chrome', gradient:false, space:true, colors:['#F2F3F4','#0C70E0'] } });
        // builds the app; github can build the app
        /*
        build.try_build = await this.base_build(); 
        if (build.try_build.length>0) {
            this.context.x_console.outT({ message:`There was an error building the project.`, color:'red' });
            return false;
        }*/
        // creates github actions folder, and workflow
        build.create_ghp = await this.run(); //test if results.length>0 (meaning there was an error)
        if (build.create_ghp.length>0) {
            this.context.x_console.outT({ message:`There was an error creating the github workflow.`, color:'red', data:build.create_ghp.toString()});
            return false;
        }
        return true;
    }

    async run() {
        let yaml = require('yaml'), errors=[];
        let spinner = this.context.x_console.spinner({ message:'Creating github workflow for building and publishing' });
        let data = {
            name: 'DSL Build and Publish',
            on: 'push',
            jobs: {
                build: {
                    name: 'Build and publish',
                    'runs-on': 'ubuntu-latest',
                    steps: [
                        {
                            name: 'Downloads repo code',
                            uses: 'actions/checkout@2',
                            with: {
                                submodules: 'recursive'
                            }
                        },
                        {
                            name: 'Install packages',
                            run: 'npm install'
                        },
                        {
                            name: 'Builds static distribution',
                            run: 'npm run build'
                        },
                        {
                            name: 'Publish dist to GHPages of current repo',
                            uses: 'peaceiris/actions-gh-pages@v3',
                            with: {
                                github_token: '${{ secrets.GITHUB_TOKEN }}',
                                publish_dir: './dist'
                            }
                        }
                    ]
                }
            }  
        };
        let content = yaml.stringify(data);
        let path = require('path'), fs = require('fs').promises;
        let target = path.join(this.context.x_state.dirs.app,'.github','workflows');
        // create .github/workflows directory if needed
        try {
            await fs.mkdir(target, { recursive:true });
            target = path.join(target,`publish.yml`);
            await this.context.writeFile(target,content);
            spinner.succeed('Github workflow ready');
        } catch(errdir) {
            spinner.fail('Github workflow failed');
            errors.push('Github workflow failed');
        }
        // create /.gitignore file for built repo
        spinner.start('Writing repo .gitignore file ..');
        let git = 'dist\n';
        git += 'secrets\n';
        git += 'node_modules';
        target = path.join(this.context.x_state.dirs.app,'.gitignore');
        await this.context.writeFile(target,git);
        spinner.succeed('Github .gitignore ready');
        return errors;
    }

    //****************************
    // onPrepare and onEnd steps
    //****************************
    async post() {
    }

    async pre() {
    }

}
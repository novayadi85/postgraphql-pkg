const chalk = require('chalk');
const clear = require('clear');
const figlet = require('figlet');

const files = require('./lib/files');
const fs = require('fs')
const touch = require("touch")
const replace = require('replace-in-file');
// index.js
const ncp = require('ncp').ncp;
 
ncp.limit = 16;
const source = './temp'
const destination ='../ylp/packages/service_gateway/plugins'

clear();

console.log(
  chalk.yellow(
    figlet.textSync('YLP 2020', { horizontalLayout: 'default' }),
  )
);

if (files.directoryExists('.git')) {
    console.log(chalk.red('Ylp team 2020!'));
    //process.exit();
}

const inquirer  = require('./lib/inquirer');
const CLI = require('clui');
const Spinner = CLI.Spinner;
const _ = require('lodash');

let promise = (dest) => {
    const result =  new Promise((resolve, reject) => {
        try{
            let target = `${destination}/${dest}`
            //console.log(target)
            if (!fs.existsSync(target)){
                if(fs.mkdirSync(target)){
                    resolve({
                        error: false,
                        destination: `${target}`
                    }) 
                }
                resolve({
                    error: false,
                    destination: `${target}`
                }) 
            }

            resolve({
                error: false,
                destination: `${target}`
            }) 
        }
        catch {
            reject(new Error("Whoops!"))
        }
        
    })
    return result
}

const run = async () => {
  const credentials = await inquirer.askPackageCredentials();
  const status = new Spinner('Creating your pkg, please wait...');
    status.start();
   // console.log(credentials);
    //const filelist = _.without(fs.readdirSync('.'), 'test');
    //touch( 'Test.js' );
    try{
        if(credentials.package){
            const promises = []
            const spinner = new Spinner('Creating your pkg, please wait...');
            spinner.start();
            await promise(credentials.package).then(async value => {
                ncp(source, value.destination, async function (err) {
                    if (err) {
                        return console.error(err);
                    }
                    else{
                        const pattentToReplaces = [
                            {
                                from: '::resolverType::',
                                to: `random${credentials.package}`
                            },
                            
                            {
                                from: '::tableAlias::',
                                to: `${credentials.package}`
                            },
                            
                            {
                                from: '::tableName::',
                                to: `${credentials.table}`
                            },
                            {
                                from: '::resolverName::',
                                to: `${credentials.resolver}`
                            }
                            
                        ]
                    
                        pattentToReplaces.forEach(async item => {
                            new Promise(async (resolve, reject) => {
                                let newRegex = new RegExp(item.from, 'g')
                                let exec = newRegex.exec(item.from)
                                if(exec.input != 'undefined'){
                                    let options = {
                                        files: [
                                            `${value.destination}/*.js`,
                                            //`${value.destination}/resolver.js`,
                                        ],
                                        from: newRegex,
                                        to: `${item.to}`,
                                        
                                    }

                                    if(credentials.shield === false){
                                        options = {
                                            ...options,
                                            ignore: [
                                                `${value.destination}/permission.js`,
                                              ]
                                        }
                                    }
                                   

                                    promises.push(replace.sync(options))
                                   
                                }
                            })
                            

                        })

                        Promise.all(promises).then(function(values) {
                            values.map(value => {
                                const changedFiles = value
                                .filter(result => result.hasChanged)
                                .map(result => result.file);
                                //console.log(changedFiles);
                            })
                            
                        });
                        
                    }
                    
                    const entries = Object.entries(credentials)
                    entries[0].forEach((item, key) => {
                        //console.log(chalk.green('%s'), key);
                        //console.log(chalk.green(' %s'), item);
                    })

                    
                    //console.log('Your pkg is done!');
                   // status.stop()
                });
            })

            
            setTimeout(() => {
                status.stop();
                spinner.stop();
            }, 3000)
            
        }
    }
    catch(err){
        throw new Error(err.message)
    }

    status.stop();
};

run();
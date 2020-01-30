const inquirer = require('inquirer');
const _ = require('lodash');
const fs = require('fs')
const files = require('./files');
const filelist = _.without(fs.readdirSync('.'), '.git', '.gitignore');
module.exports = {
  askPackageCredentials: () => {
    const questions = [
      {
        name: 'package',
        type: 'input',
        message: 'Enter your pacakge:',
        validate: function( value ) {
          let letters = /^[A-Za-z]+$/;
          if(!value.match(letters))
          {
            return 'Please only use character.';
          }
          else if (value.length) {
            return true;
          } else {
            return 'Please enter your package name.';
          }
        }
      },
      {
        name: 'table',
        type: 'input',
        message: 'What is the table name? ',
        validate: function( value) {
            let letters = /^[A-Za-z]+$/;
            if(!value.match(letters))
            {
              return 'Please only use character.';
            }
            else if (value.length) {
              return true;
            } else {
              return 'Please input your table name';
            }
          }
      },
      {
        name: 'resolver',
        type: 'input',
        message: 'What is the resolver name? ',
        validate: function( value ) {
          let letters = /^[A-Za-z]+$/;
            if(!value.match(letters))
            {
              return 'Please only use character.';
            }
            else if (value.length) {
              return true;
            } else {
              return 'You input the resolver name';
            }
          }
      },
      {
        name: 'shield',
        type: 'confirm',
        message: 'Do you want to create shield? :',
        choises: ['y','n'],
        default: ['y', 'n'],
        validate: function( value ) {
            if (value.length) {
              return true;
            } else {
              return 'You dont make any choise.';
            }
          }
      }
    ];
    return inquirer.prompt(questions);
  },
};
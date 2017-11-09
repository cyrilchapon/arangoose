const arangojs = require('arangojs');
const _ = require('lodash');
const util = require('util');
const Joi = require('joi');

class Model {
  constructor(arangoose, modelName, schema) {
    if(!schema) {
      throw new Error(util.format('Schema should be set'));
    }

    if(!schema.isJoi) {
      throw new Error(util.format('Schema "%s" should be a joi object', schema));
    }

    this.arangoose = arangoose;
    this.name = modelName;
    this.schema = schema;

    this.collection = null;
  }

  validate() {
    return Joi.validate(this, this.schema);
  }

  findOne(example) {
    if(!_.isObject(example)) {
      throw new Error(util.format('Example "%s" should be an object', example));
    }

    return this.collection.firstExample(example)
    .catch((err) => {
      if(err.errorNum === 404) {
        return null;
      }
      throw err;
    });
  }
}

module.exports = Model;

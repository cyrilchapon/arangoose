const arangojs = require('arangojs');
const util = require('util');
const _ = require('lodash');

const DocumentModel = require('./documentModel');
const EdgeModel = require('./edgeModel');

class Arangoose {
  constructor() {
    this.modelTypes = require('./modelTypes');
    this._models = {};
  }

  modelNames() {
    return _.keys(this._models);
  }

  connect(...opts) {
    this.db = new arangojs.Database(...opts);

    _.each(this._models, (model, key) => {
      model.collection = this.db.collection(key);
    });
  }

  model(modelName, schema, type) {
    if(!schema) {
      return this.getModel(modelName);
    }
    return this.setModel(modelName, schema, type);
  }

  setModel(modelName, schema, type) {
    if(this._models[modelName]) {
      throw new Error(util.format('Model with name "%s" is already defined', modelName));
    }

    if(!_.isString(modelName)) {
      throw new Error(util.format('Model name "%s" should be a string', modelName));
    }

    if(!_(this.modelTypes).values().includes(type)) {
      throw new Error(util.format('Type "%s" should be one of %j', this.modelTypes));
    }

    let model;
    switch(type) {
      case this.modelTypes.DOCUMENT:
        model = new DocumentModel(this, modelName, schema);
        break;
      case this.modelTypes.EDGE:
        model = new EdgeModel(this, modelName, schema);
        break;
      default:
        throw new Error(util.format('Type "%s" is not implemented yet'));
    }

    this._models[modelName] = model;
    return this._models[modelName];
  }

  getModel(modelName) {
    return this._models[modelName];
  }
}

Arangoose.prototype.Arangoose = Arangoose;

module.exports = new Arangoose();

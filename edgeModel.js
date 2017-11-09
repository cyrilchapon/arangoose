const _ = require('lodash');

const Model = require('./model');

class EdgeModel extends Model {
  constructor(...opts) {
    super(...opts);
  }

  findOneById(documentHandle) {
    return this.collection.edge(documentHandle)
    .catch((err) => {
      if(err.errorNum === 1202) {
        return null;
      }
      throw err;
    });
  }

  associate(from, to, data) {
    const fromId = _.isString(from) ? from : from._id;
    const toId = _.isString(to) ? to : to._id;

    return this.collection.save(_.merge({}, data, {
      _from: fromId,
      _to: toId
    }));
  }
}

module.exports = EdgeModel;

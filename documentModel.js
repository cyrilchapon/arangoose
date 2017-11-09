const Model = require('./model');

class DocumentModel extends Model {
  constructor(...opts) {
    super(...opts);
  }

  findOneById(documentHandle) {
    return this.collection.document(documentHandle)
    .catch((err) => {
      if(err.errorNum === 1202) {
        return null;
      }
      throw err;
    });
  }
}

module.exports = DocumentModel;

class Phone {
  constructor(name, method, returnedTags){
    this.method = method;
    this.body = {
      [method]:{ name: name }
    };
    if (returnedTags) {
      this.body[method].returnedTags = returnedTags;
    }
  }
}

class GetPhone extends Phone{
  constructor(name, returnedTags) {
    super(name, "ns:getPhone", returnedTags);
  }
}

class UpdatePhone extends Phone{
  constructor(name) {
    super(name, "ns:updatePhone", null);
  }

  newName(newName) {
    this.body[this.method].newName = newName;
  }
}

class RemovePhone extends Phone{
  constructor(name) {
    super(name, "ns:removePhone", null);
  }
}

class PhoneOperations {
  constructor() {}

  getPhone(name, returnedTags) {
      return new GetPhone(name, returnedTags).body;
  }

  updatePhone(name) {
      return new UpdatePhone(name);
  }

  removePhone(name) {
      return new RemovePhone(name).body;
  }
}

module.exports = PhoneOperations;

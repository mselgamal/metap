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
  constructor(name, returnedTags) {
    super(name, "ns:updatePhone", returnedTags);
  }

  newName(newName) {
    this.body[this.method].newName = newName;
  }
}

class RemovePhone extends Phone{
  constructor(name) {
    super(name, "ns:removePhone", None);
  }
}

class PhoneOperations {
  constructor(name=null, returnedTags={}) {
    this.name = name;
    this.returnedTags = returnedTags
  }

  getPhone() {
      return new GetPhone(this.name, this.returnedTags).body;
  }

  updatePhone() {
      return new UpdatePhone(this.name, this.returnedTags);
  }

  removePhone() {
      return new RemovePhone(this.name).body;
  }
}

module.exports = PhoneOperations;

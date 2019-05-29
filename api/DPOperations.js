
class UpdateDevicePool {
    constructor(name) {
        this.body = {
            'ns:updateDevicePool':{
                name:name
            }
        }
    }

    setCallManagerGroupName(value) {
        this.body['ns:updateDevicePool'].callManagerGroupName = value;
    }

    setMediaResourceListName(value) {
        this.body['ns:updateDevicePool'].mediaResourceListName = value;
    }

    setLocalRouteGroup(value) {
        this.body['ns:updateDevicePool'].localRouteGroup = {};
        this.body['ns:updateDevicePool'].localRouteGroup.name = "Standard Local Route Group";
        this.body['ns:updateDevicePool'].localRouteGroup.value = value;
    }
}

class GetDevicePool {
    constructor(name,returnedTags=null) {
        this.body = {
            'ns:getDevicePool':{
                name:name
            }
        }
        this.body['ns:getDevicePool'].returnedTags = returnedTags
    }
}

class DPOperations {
    constructor() {}

    getDevicePool(name, returnedTags=null) {
        return new GetDevicePool(name,returnedTags).body;
    }

    updateDevicePool(name) {
        return new UpdateDevicePool(name);
    }
}

module.exports = DPOperations;
class AddPT {
    constructor(name,description) {
        this.body = {
            'ns:addRoutePartition': {
                routePartition:{
                    name: name,
                    description:description
                }
            }
        }
    }

}

class GetPT {
    constructor(name) {
        this.body = {
            'ns:getRoutePartition': {
                name: name,
                returnedTags: {
                    name: {}
                }
            }
        }
    }

}

class ListPT {
    constructor(name,returnedTags) {
        this.body = {
            'ns:listRoutePartition': {
                searchCriteria: {
                    name: name
                },
                returnedTags: returnedTags
            }
        }
    }

}

class PTOperations {
    constructor() {}
    addPartition(name, description) {
        return new AddPT(name,description).body;
    }

    getPartition(name) {
        return new GetPT(name).body;
    }

    listPartition(name,returnedTags) {
        return new ListPT(name,returnedTags).body;
    }
}

module.exports = PTOperations;
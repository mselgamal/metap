
class ListRoutePattern {
    constructor(partition, returnedTags) {
        this.body = {
            'ns:listRoutePattern': {
                searchCriteria: {
                    routePartitionName: partition
                },
                returnedTags: returnedTags
            }
        }
    }
}

class UpdateRoutePattern {
    constructor() {
        this.body = {
            'ns:updateRoutePattern': {}
        }
    }

    /**
     * @param {string} value
     */
    set pattern(value) {
        this.body['ns:updateRoutePattern'].pattern = value;
    }

    /**
     * @param {string} value
     */
    set description(value) {
        this.body['ns:updateRoutePattern'].description = value;
    }

    /**
     * @param {string} value
     */
    set routePartitionName(value) {
        this.body['ns:updateRoutePattern'].routePartitionName = value;
    }

    /**
     * @param {string} value
     */
    set newRoutePartitionName(value) {
        this.body['ns:updateRoutePattern'].newRoutePartitionName = value;
    }

}

class RPOperations {
    constructor() {}

    listRoutePattern(partition, returnedTags) {
        return new ListRoutePattern(partition, returnedTags).body;
    }

    updateRoutePattern() {
        return new UpdateRoutePattern();
    }
}

module.exports = RPOperations;
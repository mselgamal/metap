class AddTransPattern {
    constructor() {
        this.body = {
            'ns:addTransPattern': {
                transPattern: {}
            }
        }
    }

    /**
     * @param {string} value
     */
    set usage(value) {
        this.body['ns:addTransPattern'].transPattern.usage = value;
    }

    /**
     * @param {string} value
     */
    set pattern(value) {
        this.body['ns:addTransPattern'].transPattern.pattern = value;
    }

    /**
     * @param {string} value
     */
    set description(value) {
        this.body['ns:addTransPattern'].transPattern.description = value;
    }

    /**
     * @param {string} value
     */
    set routePartitionName(value) {
        this.body['ns:addTransPattern'].transPattern.routePartitionName = value;
    }

    /**
     * @param {string} value
     */
    set callingPartyTransformationMask(value) {
        this.body['ns:addTransPattern'].transPattern.callingPartyTransformationMask = value;
    }

    /**
     * @param {string} value
     */
    set useCallingPartyPhoneMask(value) {
        this.body['ns:addTransPattern'].transPattern.useCallingPartyPhoneMask = value;
    }

    /**
     * @param {string} value
     */
    set digitDiscardInstructionName(value) {
        this.body['ns:addTransPattern'].transPattern.digitDiscardInstructionName = value;
    }

    /**
     * @param {string} value
     */
    set callingSearchSpaceName(value) {
        this.body['ns:addTransPattern'].transPattern.callingSearchSpaceName = value;
    }

    /**
     * @param {string} value
     */
    set patternUrgency(value) {
        this.body['ns:addTransPattern'].transPattern.patternUrgency = value;
    }

}

class ListTransPattern {
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

class TransPatternOperations {
    constructor() {}
    
    addTransPattern() {
        return new AddTransPattern();
    }
}

module.exports = TransPatternOperations;
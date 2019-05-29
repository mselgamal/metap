
class GetLine {
  constructor(pattern, partition, returnedTags) {
    this.body = {
      'ns:getLine': {
        pattern: pattern,
        routePartitionName: partition,
        returnedTags: returnedTags
      }
    }
  }
}

class LineOperations {
  constructor() {}
  getLine(pattern, partition, returnedTags) {
    return new GetLine(pattern, partition, returnedTags).body;
  }
}

module.exports = LineOperations;

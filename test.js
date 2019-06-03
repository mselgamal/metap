let assert = require('assert');
let path = require('path');
let fs = require('fs');

describe('RequestRegister.js tests', function() {
    let rootPath = path.join(__dirname,'lib','xcc');
    describe('file can be imported',()=> {
        it("Should not throw errors when require('RequestRegister.js') statement is called",()=> {
            assert.doesNotThrow(()=>{
                let RequestRegister = require(rootPath+'/RequestRegister.js');
                new RequestRegister();
            },Error);
        })
    });
});

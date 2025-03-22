const chai = require("chai");
const expect = chai.expect;

it('should add 2 numbers currectly', function(){
    const a = 2;
    const b = 22;
    expect(a+b).to.equal(24);
})

it('should not add 2 numbers currectly', function(){
    const a = 2;
    const b = 22;
    expect(a+b).not.to.equal(241);
})
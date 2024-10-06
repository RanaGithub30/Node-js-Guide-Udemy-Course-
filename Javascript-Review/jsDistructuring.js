/**
 * Object Distructting
*/

const user = {
    name: 'User1',
    age: 25,
    phone: 8979809876,
}

const {name, age, phone} = user;
console.log(name);
console.log(age);
console.log(phone);

/** Array Distructring */

const colors = ['red', 'green', 'blue'];
const [firstColor, secondColor, thirdColor] = colors;

console.log(firstColor);
console.log(secondColor);
console.log(thirdColor);
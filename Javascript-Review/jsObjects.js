let person = {
    'name': 'Rana',
    'age': 32,
    greet() {  // this way we can declare methods in a js object
          console.log('Hi I am -'+this.name+', My age is -'+this.age);
    }
}

person.greet();
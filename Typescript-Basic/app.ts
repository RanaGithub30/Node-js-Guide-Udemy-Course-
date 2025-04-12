(() => {
    const num1 = document.getElementById('num1') as HTMLInputElement;
    const num2 = document.getElementById('num2') as HTMLInputElement;
    const res = document.getElementById('res');
    const buttonElement = document.querySelector('button');
  
    function add(num1: number, num2: number): number {
      return num1 + num2;
    }
  
    buttonElement?.addEventListener('click', () => {
      const value1 = +num1.value;
      const value2 = +num2.value;
  
      const result = add(value1, value2);
  
      if (res) {
        console.log(result);
        res.innerHTML = result.toString();
      }
    });
})();  
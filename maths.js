exports.add = (x, y) => { return x + y; }
exports.sub = (x, y) => { return x - y; }
exports.mul = (x, y) => { return x * y; }
exports.div = (x, y) => { return x / y; }
exports.mod = (x, y) => { return x % y; }
exports.factorial = factorial;
exports.isPrime = isPrime;
exports.findPrime = findPrime;

function factorial(n) {
    if(n===0||n===1){
        return 1;
      }
      return n*factorial(n-1);
}

function isPrime(value) {
    for(var i = 2; i < value; i++) {
        if(value % i === 0) {
            return false;
        }
    }
    return value > 1;
}

function findPrime(index) {
    let primeNumer = 0;
    for ( let i=0; i < index; i++){
        primeNumer++;
        while (!isPrime(primeNumer)){
            primeNumer++;
        }
    }
    return primeNumer;
}


function eval() {
  // Do not use eval!!!
  return;
}

function getArrayToken(expr, arrToken) {
  if (expr.split("(").length - 1 != expr.split(")").length - 1)
    throw Error("ExpressionError: Brackets must be paired");
  else {
    let str = expr.replace(/\s+/g, "");
    str += ")";
    let container = "-+*/()";
    let pointerEnd = 0;
    let pointerStart = 0;

    while (pointerEnd < str.length) {
      if (container.split(str[pointerEnd]).length - 1 == 1) {
        if (pointerStart == pointerEnd) arrToken.push(str[pointerEnd]);
        else {
          arrToken.push(str.slice(pointerStart, pointerEnd));
          arrToken.push(str[pointerEnd]);
        }
        pointerStart = pointerEnd + 1;
      }
      pointerEnd++;
    }
    arrToken.pop();
  }
}
function getPriority(char) {
  switch (char) {
    case "+":
      return 1;
    case "-":
      return 1;
    case "*":
      return 2;
    case "/":
      return 2;
    case "(":
      return -100;
    case ")":
      return -101;
    default:
      throw new Error("Not a number is encountered and not ( ,  ), +, -, *, /");
  }
}
function calculate(stackNumbers, stackOperation) {
  let o = stackOperation.pop();
  let last = stackNumbers.pop();
  let penultimate = stackNumbers.pop();
  switch (o) {
    case "+":
      stackNumbers.push(penultimate + last);
      break;
    case "-":
      stackNumbers.push(penultimate - last);
      break;
    case "*":
      stackNumbers.push(penultimate * last);
      break;
    case "/":
      if (last != 0) stackNumbers.push(penultimate / last);
      else throw new Error("TypeError: Division by zero.");
      break;
  }
}
function calculateMain(arrayToken) {
  let stackNumbers = [];
  let stackOperation = [];
  let pointer = 0;
  let flag = true;
  while (pointer < arrayToken.length || flag) {
    if (pointer >= arrayToken.length) {
      if (stackNumbers.length == 1 && stackOperation.length == 0) flag = false;
      else calculate(stackNumbers, stackOperation);
    } else {
      if (Number(arrayToken[pointer]) || Number(arrayToken[pointer]) === 0) {
        stackNumbers.push(Number(arrayToken[pointer]));
        pointer++;
      } else {
        switch (getPriority(arrayToken[pointer])) {
          case -100:
            stackOperation.push(arrayToken[pointer]);
            pointer++;
            break;
          case -101:
            if (stackOperation[stackOperation.length - 1] == "(") {
              stackOperation.pop();
              pointer++;
            } else {
              while (stackOperation[stackOperation.length - 1] != "(")
                calculate(stackNumbers, stackOperation);
            }
            break;
          default:
            if (stackOperation.length == 0) {
              stackOperation.push(arrayToken[pointer]);
              pointer++;
            } else {
              if (
                getPriority(arrayToken[pointer]) >
                getPriority(stackOperation[stackOperation.length - 1])
              ) {
                stackOperation.push(arrayToken[pointer]);
                pointer++;
              } else {
                if (
                  getPriority(arrayToken[pointer]) <=
                  getPriority(stackOperation[stackOperation.length - 1])
                ) {
                  calculate(stackNumbers, stackOperation);
                }
              }
            }
            break;
        }
      }
    }
  }
  return stackNumbers[0];
}

function expressionCalculator(expr) {
  let arrToken = [];
  getArrayToken(expr, arrToken);
  return calculateMain(arrToken);
}

module.exports = {
  expressionCalculator
};

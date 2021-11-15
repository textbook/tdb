function interpreter(code) {
    const stack = [];
    let output = "", skipping = false;

    for (let instruction of code) {
        if (skipping) {
            skipping = false;
            continue;
        }
        if (instruction === "@") {
            break;
        } else if (instruction === "#") {
            skipping = true;
        } else if (instruction === ".") {
            output += `${stack.pop() || 0}`;
        } else if ("0123456789".indexOf(instruction) >= 0) {
            stack.push(parseInt(instruction, 10));
        }
    }
    return output;
}

module.exports.interpreter = interpreter;

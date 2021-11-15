function interpreter(code) {
    const stack = [];
    let output = "", position = 0;

    while (true) {
        const instruction = code[position];
        if (instruction === "@") {
            break;
        } else if (instruction === "#") {
            position += 1;
        } else if (instruction === ".") {
            output += `${stack.pop() || 0}`;
        } else if ("0123456789".indexOf(instruction) >= 0) {
            stack.push(parseInt(instruction, 10));
        }
        position += 1;
    }
    return output;
}

module.exports.interpreter = interpreter;

function interpreter(code) {
    const stack = [];
    let direction = 1, output = "", position = 0;

    while (true) {
        const instruction = code[position];
        if (instruction === "@") {
            break;
        } else if (instruction === "#") {
            position += direction;
        } else if (instruction === "<") {
            direction = -1;
        } else if (instruction === ".") {
            output += `${stack.pop() || 0}`;
        } else if ("0123456789".indexOf(instruction) >= 0) {
            stack.push(parseInt(instruction, 10));
        }
        position += direction;
    }
    return output;
}

module.exports.interpreter = interpreter;

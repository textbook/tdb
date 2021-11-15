function interpreter(code) {
    const stack = [];
    let direction = Direction.RIGHT, output = "", position = 0;

    while (true) {
        const instruction = code[position];
        if (instruction === "@") {
            break;
        } else if (instruction === "#") {
            position += direction;
        } else if (instruction === "<") {
            direction = Direction.LEFT;
        } else if (instruction === ".") {
            output += `${stack.pop() || 0}`;
        } else if ("0123456789".indexOf(instruction) >= 0) {
            stack.push(parseInt(instruction, 10));
        }
        position += direction;
    }
    return output;
}

const Direction = {
    LEFT: -1,
    RIGHT: 1,
};

module.exports.interpreter = interpreter;

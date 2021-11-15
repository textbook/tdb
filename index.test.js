const { expect } = require("chai");

const { interpreter } = require(".");

describe("Befunge", () => {
    describe("Level 1 - horizontal movement", () => {
        it("ends an empty program", () => {
            expect(interpreter("   @")).to.equal("");
        });

        it("pops 0 from an empty stack", () => {
            expect(interpreter(".@")).to.equal("0");
            expect(interpreter(" . . @")).to.equal("00");
            expect(interpreter("@..")).to.equal("");
        });

        it("pushes digits to the stack", () => {
            expect(interpreter("1234567890..........@")).to.equal("0987654321");
        });

        it("can skip a cell", () => {
            expect(interpreter("123..#.@")).to.equal("32");
        });

        it("can change direction to right-to-left", () => {
            expect(interpreter("123.#@.#.<")).to.equal("321");
        });

        it("can conditionally change direction", () => {
            expect(interpreter("1#@_")).to.equal("");
            expect(interpreter("#@_.1<")).to.equal("01");
        });

        it("can change direction to left-to-right", () => {
            expect(interpreter("11>._@")).to.equal("100");
        });

        it("can wrap horizontally", () => {
            expect(interpreter("1<@.")).to.equal("1");
            expect(interpreter("1_@>.#")).to.equal("1");
        });
    });

    describe("Level 2 - stack manipulation", () => {
        it("can discard the value at the top of the stack", () => {
            expect(interpreter("12$..@")).to.equal("10");
        });

        it("can invert the value at the top of the stack", () => {
            expect(interpreter("1!.@")).to.equal("0");
            expect(interpreter("!.@")).to.equal("1");
        });

        it("can duplicate the value at the top of the stack", () => {
            expect(interpreter("1:..@")).to.equal("11");
            expect(interpreter(":..@")).to.equal("00");
        });

        it.skip("can swap the values at the top of the stack", () => {
            expect(interpreter("12\\..@")).to.equal("12");
        });
    });

    describe("Level 3 - arithmetic", () => {
        it.skip("can perform addition", () => {
            expect(interpreter("42+.@")).to.equal("6");
        });

        it.skip("can perform multiplication", () => {
            expect(interpreter("42*.@")).to.equal("8")
        });

        it.skip("can perform subtraction", () => {
            expect(interpreter("42-.@")).to.equal("2");
        });

        it.skip("can perform division (integer, rounded towards 0)", () => {
            expect(interpreter("42/.@")).to.equal("2");
            expect(interpreter("52/.@")).to.equal("2");
            expect(interpreter("27-2/.@")).to.equal("-2");
        });

        it.skip("can perform modulo", () => {
            expect(interpreter("42%.@")).to.equal("0");
            expect(interpreter("52%.@")).to.equal("1");
        });

        it.skip("can perform comparison", () => {
            expect(interpreter("83`.@")).to.equal("1");
            expect(interpreter("38`.@")).to.equal("0");
            expect(interpreter("33`.@")).to.equal("0");
        });
    });

    describe("Level 4 - vertical movement", () => {
        it.skip("can change direction to top-to-bottom", () => {
            expect(interpreter("1 v\n@.<\n  @")).to.equal("1");
        });

        it.skip("can change direction to bottom-to-top", () => {
            expect(interpreter("#@1v\n .  \n@^2<\n @  ")).to.equal("2");
        });

        it.skip("can wrap vertically", () => {
            expect(interpreter("98^\n  @\n  .")).to.equal("8")
            expect(interpreter("v@.\n5 @\n> v")).to.equal("5");
        });

        it.skip("can conditionally move vertically", () => {
            expect(interpreter("74 |\n   @\n   #\n   .")).to.equal("7");
        });

        it.skip("can move randomly", function () {
            this.timeout(100);
            const code = "#@ #. #1?2.@\n        0   \n        .   \n        @   \n        .   \n        3   ";
            const directions = { 0: "down", 1: "left", 2: "right", 3: "up" };
            const results = new Array(100).fill(null).map(() => interpreter(code));
            Object.keys(directions).forEach((outcome) => {
                expect(results).to.include(outcome, `missing outcome: ${directions[outcome]}`);
            });
            results.forEach((result, index) => {
                expect(Object.keys(directions)).to.include(result, `unexpected result ${result} at ${index}`);
            });
        });
    });

    describe("Level 5 - string mode", () => {
        it.skip("can store characters as ASCII codes", () => {
            expect(interpreter('"@".@')).to.equal("64");
        });

        it.skip("can output ASCII codes as characters", () => {
            expect(interpreter('"oof">:#,_@')).to.equal("foo");
            expect(interpreter("88*,@")).to.equal("@");
        });
    });

    describe("Level 6 - store and retrieve", () => {
        it.skip("can output a character from the program itself", () => {
            expect(interpreter("g.@")).to.equal("103");
            expect(interpreter("40g.@")).to.equal("64");
        });

        it.skip("can update a character in the program itself", () => {
            expect(interpreter('"!,"70p @')).to.equal("!");
        });
    });
});

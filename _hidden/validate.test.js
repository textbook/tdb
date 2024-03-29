const { expect } = require("chai");

const { interpreter } = require("..");

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

        it("can swap the values at the top of the stack", () => {
            expect(interpreter("12\\..@")).to.equal("12");
        });
    });

    describe("Level 3 - arithmetic", () => {
        it("can perform addition", () => {
            expect(interpreter("42+.@")).to.equal("6");
        });

        it("can perform multiplication", () => {
            expect(interpreter("42*.@")).to.equal("8")
        });

        it("can perform subtraction", () => {
            expect(interpreter("52-.@")).to.equal("3");
        });

        it("can perform division (integer, rounded towards 0)", () => {
            expect(interpreter("42/.@")).to.equal("2");
            expect(interpreter("52/.@")).to.equal("2");
            expect(interpreter("27-2/.@")).to.equal("-2");
        });

        it("can perform modulo", () => {
            expect(interpreter("42%.@")).to.equal("0");
            expect(interpreter("52%.@")).to.equal("1");
        });

        it("can perform comparison", () => {
            expect(interpreter("83`.@")).to.equal("1");
            expect(interpreter("38`.@")).to.equal("0");
            expect(interpreter("33`.@")).to.equal("0");
        });
    });

    describe("Level 4 - vertical movement", () => {
        it("can change direction to top-to-bottom", () => {
            expect(interpreter("1 v\n@.<\n  @")).to.equal("1");
        });

        it("can change direction to bottom-to-top", () => {
            expect(interpreter("#@1v\n .  \n@^2<\n @  ")).to.equal("2");
        });

        it("can wrap vertically", () => {
            expect(interpreter("98^\n  @\n  .")).to.equal("8")
            expect(interpreter("v@.\n5 @\n> v")).to.equal("5");
        });

        it("can conditionally move vertically", () => {
            expect(interpreter("74 |\n   @\n   #\n   .")).to.equal("7");
        });

        it("can move randomly", function () {
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
        it("can store characters as ASCII codes", () => {
            expect(interpreter('"@".@')).to.equal("64");
        });

        it("can output ASCII codes as characters", () => {
            expect(interpreter('"oof">:#,_@')).to.equal("foo");
            expect(interpreter("88*,@")).to.equal("@");
        });
    });

    describe("Level 6 - store and retrieve", () => {
        it("can output a character from the program itself", () => {
            expect(interpreter("g.@")).to.equal("103");
            expect(interpreter("40g.@")).to.equal("64");
        });

        it("can update a character in the program itself", () => {
            expect(interpreter('"!,"70p @')).to.equal("!");
        });
    });

    describe("integration suite", () => {
        it("can say 'Hello, world!'", () => {
            expect(interpreter(' >25*"!dlrow ,olleH":v\n                  v:,_@\n                  >  ^'))
                .to.equal("Hello, world!\n");
        });

        it("can calculate a factorial", () => {
            expect(interpreter("4>:1-:v v *_$.@ \n ^    _$>\\:^")).to.equal("24");
            expect(interpreter("5>:1-:v v *_$.@ \n ^    _$>\\:^")).to.equal("120");
            expect(interpreter("6>:1-:v v *_$.@ \n ^    _$>\\:^")).to.equal("720");
        });

        it("can find the first 22 prime numbers", function () {
            this.timeout(100);
            expect(interpreter(`
2>:3g" "-!v\\  g30          <
 |!\`"O":+1_:.:03p>03g+:"O"\`|
 @               ^  p3\\" ":<
2 234567890123456789012345678901234567890123456789012345678901234567890123456789
            `.trim())).to.equal("2357111317192329313741434753596167717379");
        });
    });
});

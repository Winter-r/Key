import Parser from "./src/parser.ts";
import { Evaluate } from "./src/runtime/interpreter.ts";

repl();

function repl() 
{
    const parser = new Parser();

    console.log("\nWelcome to the REPL v0.1!")
    while (true)
    {
        const input = prompt(">>> ");

        if (!input || input.includes("exit"))
        {
            Deno.exit(1);
        }

        const program = parser.ProduceAST(input);

        const result = Evaluate(program);
        console.log(result);
    }
}
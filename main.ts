import Parser from "./src/parser.ts";
import Environment from "./src/runtime/environment.ts";
import { Evaluate } from "./src/runtime/interpreter.ts";
import { MakeNumber, MakeNull, MakeBool } from "./src/runtime/values.ts";

repl();

function repl() 
{
    const parser = new Parser();
    const env = new Environment();
    env.DeclareVariable("x", MakeNumber(100));
    env.DeclareVariable("true", MakeBool(true));
    env.DeclareVariable("false", MakeBool(false));
    env.DeclareVariable("null", MakeNull());

    console.log("\nWelcome to the REPL v0.1!")
    while (true)
    {
        const input = prompt(">>> ");

        if (!input || input.includes("exit"))
        {
            Deno.exit(1);
        }

        const program = parser.ProduceAST(input);

        const result = Evaluate(program, env);
        console.log(result);
    }
}
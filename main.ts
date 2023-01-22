import Parser from "./src/parser.ts";
import Environment from "./src/runtime/environment.ts";
import { Evaluate } from "./src/runtime/interpreter.ts";

// repl();
run("./Examples/test.key");

async function run(filename: string)
{
    const parser = new Parser();
    const env = new Environment();

    const input = await Deno.readTextFile(filename);
    const program = parser.ProduceAST(input);
    const result = Evaluate(program, env);
    console.log(result);
}

function repl() 
{
    const parser = new Parser();
    const env = new Environment();

    console.log("\nWelcome to the REPL v0.1!")
    while (true)
    {
        const input = prompt(">>> ");

        if (!input || input.includes("exit"))
        {
            Deno.exit(1);
        }

        if (input.includes("clear"))
        {
            console.clear();
            continue;
        }

        const program = parser.ProduceAST(input);

        const result = Evaluate(program, env);
        console.log(result);
    }
}

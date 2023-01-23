import Parser from "./src/parser.ts";
import { Evaluate } from "./src/runtime/interpreter.ts";
import { CreateGlobalScope } from "./src/runtime/environment.ts";

// repl();
run("./Examples/test.ky");

async function run(filename: string)
{
    const parser = new Parser();
    const env = CreateGlobalScope();

    const input = await Deno.readTextFile(filename);
    const program = parser.ProduceAST(input);
    const result = Evaluate(program, env);
    console.log(result);
}

// function repl() 
// {
//     const parser = new Parser();
//     const env = CreateGlobalScope();

//     console.log("\nWelcome to the REPL v0.1!")
//     while (true)
//     {
//         const input = prompt(">>> ");

//         if (!input || input.includes("exit"))
//         {
//             Deno.exit(1);
//         }

//         if (input.includes("clear"))
//         {
//             console.clear();
//             continue;
//         }

//         const program = parser.ProduceAST(input);

//         const result = Evaluate(program, env);
//         console.log(result);
//     }
// }
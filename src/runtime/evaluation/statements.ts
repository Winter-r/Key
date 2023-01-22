import { Node, NumericLiteral, Program, VariableDeclaration } from "../../AST.ts";
import Environment from "../environment.ts";
import { Evaluate } from "../interpreter.ts";
import { RuntimeValue, MakeNull, NumberValue } from "../values.ts";

export function EvaluateProgram(astNode: Node, env: Environment): RuntimeValue
{
    let result: RuntimeValue = MakeNull();

    for (const statement of (astNode as Program).body)
    {
        result = Evaluate(statement, env);
    }

    return result;
}

export function EvaluateNumericLiteral(astNode: Node): RuntimeValue
{
    return {
        type: "number",
        value: (astNode as NumericLiteral).value
    } as NumberValue;
}

export function EvaluateVariableDeclaration(astNode: Node, env: Environment): RuntimeValue
{
    const declaration = astNode as VariableDeclaration;
    const value = declaration.value
        ? Evaluate(declaration.value, env)
        : MakeNull();

    return env.DeclareVariable(declaration.identifier, value, declaration.const);
}
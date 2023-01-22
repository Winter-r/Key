import { RuntimeValue, NumberValue, MakeNull } from "./values.ts";
import { Node, NumericLiteral, Program, BinaryExpression, Identifier } from "../AST.ts";
import Environment from "./environment.ts";

export function Evaluate(astNode: Node, env: Environment): RuntimeValue
{
    switch (astNode.type)
    {
        case "Program":
            return EvaluateProgram(astNode, env);
        case "NumericLiteral":
            return EvaluateNumericLiteral(astNode);
        case "BinaryExpression":
            return EvaluateBinaryExpression(astNode, env);
        case "Identifier":
            return EvaluateIdentifier(astNode, env);
        default:
            throw ("Unknown node type: " + astNode.type);
    }
}

function EvaluateProgram(astNode: Node, env: Environment): RuntimeValue
{
    let result: RuntimeValue = MakeNull();

    for (const statement of (astNode as Program).body)
    {
        result = Evaluate(statement, env);
    }

    return result;
}

function EvaluateNumericLiteral(astNode: Node): RuntimeValue
{
    return {
        type: "number",
        value: (astNode as NumericLiteral).value
    } as NumberValue;
}

function EvaluateBinaryExpression(astNode: Node, env: Environment): RuntimeValue
{
    const binop = astNode as BinaryExpression;
    const left: RuntimeValue = Evaluate((binop).left, env);
    const right: RuntimeValue = Evaluate((binop).right, env);

    if (left.type !== right.type)
    {
        throw ("Cannot operate on different types");
    }

    switch (left.type)
    {
        case "number":
            return EvaluateNumericBinaryExpression(left as NumberValue, right as NumberValue, (binop).operator);
        default:
            throw ("Unknown value type: " + left.type);
    }
}

function EvaluateNumericBinaryExpression(left: NumberValue, right: NumberValue, operator: string): RuntimeValue
{
    switch (operator)
    {
        case "+":
            return {
                type: "number",
                value: left.value + right.value
            } as NumberValue;
        case "-":
            return {
                type: "number",
                value: left.value - right.value
            } as NumberValue;
        case "*":
            return {
                type: "number",
                value: left.value * right.value
            } as NumberValue;
        case "/":
            // TODO: Check for division by zero
            return {
                type: "number",
                value: left.value / right.value
            } as NumberValue;
        case "%":
            return {
                type: "number",
                value: left.value % right.value
            } as NumberValue;
        default:
            throw ("Unknown operator: " + operator);
    }
}

function EvaluateIdentifier(astNode: Node, env: Environment): RuntimeValue
{
    const identifier = astNode as Identifier;

    const value = env.GetVariable(identifier.name);

    if (!value)
    {
        throw ("Undefined variable: " + identifier.name);
    }

    return value;
}
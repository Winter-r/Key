// deno-lint-ignore-file no-unreachable
import { RuntimeValue, NumberValue, NullValue } from "./values.ts";
import { Node, NumericLiteral, Program, BinaryExpression } from "../AST.ts";


export function Evaluate(astNode: Node): RuntimeValue
{
    switch (astNode.type)
    {
        case "NumericLiteral":
            return EvaluateNumericLiteral(astNode);
        case "NullLiteral":
            return EvaluateNullLiteral();
        case "BinaryExpression":
            return EvaluateBinaryExpression(astNode);
        case "Program":
            return EvaluateProgram(astNode);
        default:
            throw new Error("Unknown node type: " + astNode.type);
            Deno.exit(1);
    }
}

function EvaluateNumericLiteral(astNode: Node): RuntimeValue
{
    return {
        type: "number",
        value: (astNode as NumericLiteral).value
    } as NumberValue;
}

function EvaluateNullLiteral(): RuntimeValue
{
    return {
        type: "null",
        value: "null"
    } as NullValue;
}

function EvaluateBinaryExpression(astNode: Node): RuntimeValue
{
    const left: RuntimeValue = Evaluate((astNode as BinaryExpression).left);
    const right: RuntimeValue = Evaluate((astNode as BinaryExpression).right);

    if (left.type !== right.type)
    {
        throw new Error("Cannot operate on different types");
        Deno.exit(1);
    }

    switch (left.type)
    {
        case "number":
            return EvaluateNumericBinaryExpression(left as NumberValue, right as NumberValue, (astNode as BinaryExpression).operator);
        default:
            throw new Error("Unknown value type: " + left.type);
            Deno.exit(1);
    }

    return { type: "null", value: "null" } as NullValue;
}

function EvaluateProgram(astNode: Node): RuntimeValue
{
    let result: RuntimeValue = {
        type: "null",
        value: "null"
    } as NullValue;

    for (const statement of (astNode as Program).body)
    {
        result = Evaluate(statement);
    }

    return result;
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
            throw new Error("Unknown operator: " + operator);
            Deno.exit(1);
    }
}
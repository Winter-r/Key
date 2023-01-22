import { Node, BinaryExpression, Identifier } from "../../AST.ts";
import Environment from "../environment.ts";
import { Evaluate } from "../interpreter.ts";
import { RuntimeValue, NumberValue } from "../values.ts";

export function EvaluateBinaryExpression(astNode: Node, env: Environment): RuntimeValue
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

export function EvaluateIdentifier(astNode: Node, env: Environment): RuntimeValue
{
    const identifier = astNode as Identifier;

    const value = env.GetVariable(identifier.name);

    if (!value)
    {
        throw ("Undefined variable: " + identifier.name);
    }

    return value;
}

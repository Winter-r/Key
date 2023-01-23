import { Node, BinaryExpression, Identifier, NumericLiteral, AssignmentExpression, ObjectLiteral, CallExpression } from "../../AST.ts";
import Environment from "../environment.ts";
import { Evaluate } from "../interpreter.ts";
import { RuntimeValue, NumberValue, ObjectValue, NativeFunctionValue } from "../values.ts";

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

export function EvaluateObjectExpression(astNode: Node, env: Environment): RuntimeValue
{
    const object = astNode as ObjectLiteral;
    const objectValue = { type: "object", properties: new Map() } as ObjectValue;

    for (const { key, value } of object.properties)
    {
        const runtimeValue = (value == undefined) ? env.GetVariable(key) : Evaluate(value, env);
        objectValue.properties.set(key, runtimeValue);
    }

    return objectValue;
}

export function EvaluateCallExpression(astNode: Node, env: Environment): RuntimeValue
{
    const expression = astNode as CallExpression;
    const args = expression.args.map((arg) => Evaluate(arg, env));
    const _function = Evaluate(expression.callee, env);

    if (_function.type !== "native-function")
    {
        throw ("Cannot call non-native function: " + JSON.stringify(_function));
    }

    let result = (_function as NativeFunctionValue).call(args, env);
    return result;
}

export function EvaluateNumericLiteral(astNode: Node): RuntimeValue
{
    return {
        type: "number",
        value: (astNode as NumericLiteral).value
    } as NumberValue;
}

export function EvaluateAssignmentExpression(astNode: Node, env: Environment): RuntimeValue
{
    const node = astNode as AssignmentExpression;

    if (node.assignee.type !== "Identifier")
    {
        throw `Cannot assign to ${ JSON.stringify(node.assignee) }`;
    }

    const name = (node.assignee as Identifier).name;
    return env.AssignVariable(name, Evaluate(node.value, env));
}
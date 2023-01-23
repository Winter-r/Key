import Environment from "./environment.ts";
export type ValueType = "null" | "number" | "bool" | "object" | "native-function";

export interface RuntimeValue
{
    type: ValueType;
}

export interface NullValue extends RuntimeValue
{
    type: "null";
    value: null;
}

export function MakeNull()
{
    return { type: "null", value: null } as NullValue;
}

export interface NumberValue extends RuntimeValue
{
    type: "number";
    value: number;
}

export function MakeNumber(n = 0)
{
    return { type: "number", value: n } as NumberValue;
}

export interface BooleanValue extends RuntimeValue
{
    type: "bool";
    value: boolean;
}

export function MakeBool(b = true)
{
    return { type: "bool", value: b } as BooleanValue;
}

export interface ObjectValue extends RuntimeValue
{
    type: "object";
    properties: Map<string, RuntimeValue>;
}

export type FunctionCall = (args: RuntimeValue[], env: Environment) => RuntimeValue;
export interface NativeFunctionValue extends RuntimeValue
{
    type: "native-function";
    call: FunctionCall;
}

export function MakeNativeFunction(call: FunctionCall)
{
    return { type: "native-function", call } as NativeFunctionValue;
}
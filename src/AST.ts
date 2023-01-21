export type NodeType =
    | "Program"
    | "NumericLiteral"
    | "NullLiteral"
    | "Identifier"
    | "Variable"
    | "Assignment"
    | "BinaryExpression"
    | "CallExpression"
    | "UnaryExpression"
    | "FunctionDeclaration"
    | "ReturnStatement"
    | "IfStatement"
    | "WhileStatement"
    | "Block"
    ;

export interface Node
{
    type: NodeType;
}

export interface Program extends Node
{
    type: "Program";
    body: Node[];
}

// deno-lint-ignore no-empty-interface
export interface Expression extends Node { }

export interface BinaryExpression extends Expression
{
    type: "BinaryExpression";
    left: Expression;
    right: Expression;
    operator: string;
}

export interface Identifier extends Expression
{
    type: "Identifier";
    name: string;
}

export interface NumericLiteral extends Expression
{
    type: "NumericLiteral";
    value: number;
}

export interface NullLiteral extends Expression
{
    type: "NullLiteral";
    value: "null";
}
export type NodeType =
    // STATEMENTS
    | "Program"
    | "VariableDeclaration"
    // EXPRESSIONS
    | "AssignmentExpression"
    | "NumericLiteral"
    | "Identifier"
    | "BinaryExpression";

export interface Node
{
    type: NodeType;
}

export interface Program extends Node
{
    type: "Program";
    body: Node[];
}

export interface VariableDeclaration extends Node
{
    type: "VariableDeclaration";
    const: boolean;
    identifier: string;
    value?: Expression;
}

// deno-lint-ignore no-empty-interface
export interface Expression extends Node { }

export interface AssignmentExpression extends Expression
{
    type: "AssignmentExpression";
    assignee: Expression;
    value: Expression;
}

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
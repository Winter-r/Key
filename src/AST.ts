export type NodeType =
    // STATEMENTS
    | "Program"
    | "VariableDeclaration"
    | "FunctionDeclaration"

    // EXPRESSIONS
    | "AssignmentExpression"
    | "MemberExpression"
    | "CallExpression"

    // LITERALS
    | "Property"
    | "ObjectLiteral"
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

export interface FunctionDeclaration extends Node
{
    type: "FunctionDeclaration";
    params: string[];
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

export interface MemberExpression extends Expression
{
    type: "MemberExpression";
    object: Expression;
    property: Expression;
    computed: boolean;
}

export interface CallExpression extends Expression
{
    type: "CallExpression";
    args: Expression[];
    callee: Expression;
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

export interface Property extends Expression
{
    type: "Property";
    key: string;
    value?: Expression;
}

export interface ObjectLiteral extends Expression
{
    type: "ObjectLiteral";
    properties: Property[];
}
import { EvaluateProgram, EvaluateVariableDeclaration } from "./evaluation/statements.ts";
import { EvaluateAssignmentExpression, EvaluateBinaryExpression, EvaluateCallExpression, EvaluateIdentifier, EvaluateNumericLiteral, EvaluateObjectExpression } from "./evaluation/expressions.ts";
import { RuntimeValue } from "./values.ts";
import { CallExpression, Node } from "../AST.ts";
import Environment from "./environment.ts";

export function Evaluate(astNode: Node, env: Environment): RuntimeValue
{
    switch (astNode.type)
    {
        case "Program":
            return EvaluateProgram(astNode, env);
        case "NumericLiteral":
            return EvaluateNumericLiteral(astNode);
        case "AssignmentExpression":
            return EvaluateAssignmentExpression(astNode, env);
        case "BinaryExpression":
            return EvaluateBinaryExpression(astNode, env);
        case "Identifier":
            return EvaluateIdentifier(astNode, env);
        case "ObjectLiteral":
            return EvaluateObjectExpression(astNode, env);
        case "CallExpression":
            return EvaluateCallExpression(astNode as CallExpression, env);
        case "VariableDeclaration":
            return EvaluateVariableDeclaration(astNode, env);
        default:
            console.error(
                "Interpreter Error:\n",
                "Unknown AST node type:",
                astNode
            );
            Deno.exit(0);
    }
}
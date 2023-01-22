import { EvaluateProgram, EvaluateVariableDeclaration } from "./evaluation/statements.ts";
import { EvaluateAssignmentExpression, EvaluateBinaryExpression, EvaluateIdentifier, EvaluateNumericLiteral } from "./evaluation/expressions.ts";
import { RuntimeValue } from "./values.ts";
import { Node } from "../AST.ts";
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
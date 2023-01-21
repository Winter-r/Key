// deno-lint-ignore-file no-explicit-any
import
{
    Node,
    Program,
    Expression,
    BinaryExpression,
    NumericLiteral,
    Identifier,
    NullLiteral
} from "./AST.ts";

import
{
    Tokenize,
    Token,
    TokenType
} from "./lexer.ts";

export default class Parser
{
    private tokens: Token[] = [];

    private NotEOF(): boolean
    {
        return this.tokens[0].type != TokenType.EOF;
    }

    private At()
    {
        return this.tokens[0] as Token;
    }

    private Eat()
    {
        const prev = this.tokens.shift() as Token;
        return prev;
    }

    private Expect(type: TokenType, err: any)
    {
        const prev = this.tokens.shift() as Token;

        if (!prev || prev.type != type)
        {
            console.error("Parser Error:\n", err, prev, "- Expecting:", type);
            Deno.exit(1);
        }

        return prev;
    }

    public ProduceAST(sourceCode: string): Program
    {
        this.tokens = Tokenize(sourceCode);

        const program: Program = {
            type: "Program",
            body: []
        };

        // Parse until we reach the end of the file
        while (this.NotEOF())
        {
            program.body.push(this.ParseNode());
        }

        return program;
    }

    private ParseNode(): Node
    {
        // skip to parse_expression
        return this.ParseExpression();
    }

    private ParseExpression(): Expression
    {
        return this.ParseAdditiveExpression();
    }

    private ParseAdditiveExpression(): Expression
    {
        let left = this.ParseMultiplicativeExpression();

        while (this.At().value == "+" || this.At().value == "-")
        {
            const operator = this.Eat().value;
            const right = this.ParseMultiplicativeExpression();

            left = {
                type: "BinaryExpression",
                left,
                right,
                operator
            } as BinaryExpression;
        }

        return left;
    }

    private ParseMultiplicativeExpression(): Expression
    {
        let left = this.ParsePrimaryExpression();

        while (this.At().value == "*" || this.At().value == "/" || this.At().value == "%")
        {
            const operator = this.Eat().value;
            const right = this.ParsePrimaryExpression();

            left = {
                type: "BinaryExpression",
                left,
                right,
                operator
            } as BinaryExpression;
        }

        return left;
    }

    private ParsePrimaryExpression(): Expression
    {
        const token = this.At().type;

        switch (token)
        {
            case TokenType.Identifier:
                return {
                    type: "Identifier",
                    name: this.Eat().value
                } as Identifier;

            case TokenType.Null:
                this.Eat();
                return {
                    type: "NullLiteral",
                    value: "null"
                } as NullLiteral;

            case TokenType.Number:
                return {
                    type: "NumericLiteral",
                    value: parseFloat(this.Eat().value)
                } as NumericLiteral;

            case TokenType.OpenParen: {
                this.Eat();
                const expression = this.ParseExpression();
                this.Expect(TokenType.CloseParen, "Expected closing parenthesis");
                return expression;
            }

            default:
                console.error("Parser Error:\n", "Unexpected token:", this.At());
                Deno.exit(1);
        }
    }
}
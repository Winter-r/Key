// deno-lint-ignore-file no-explicit-any
import
{
    Node,
    Program,
    Expression,
    BinaryExpression,
    NumericLiteral,
    Identifier,
    VariableDeclaration,
    AssignmentExpression,
    Property,
    ObjectLiteral,
    CallExpression,
    MemberExpression
} from "./AST.ts";

import
{
    Tokenize,
    Token,
    TokenType
} from "./lexer.ts";

// ORDER OF PRECEDENCE
// 1. Assignment
// 2. Object
// 3. Additive
// 4. Multiplicative
// 5. Call
// 6. Member
// 7. Primary


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
            console.error("Parser Error:\n ", err, prev, "- Expecting:", type);
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
        switch (this.At().type)
        {
            case TokenType.Let:
            case TokenType.Const:
                return this.ParseVariableDeclaration();
            default:
                return this.ParseExpression();
        }
    }

    private ParseVariableDeclaration(): Node
    {
        const isConst = this.Eat().type == TokenType.Const;
        const identifier = this.Expect(
            TokenType.Identifier, "Expected identifier"
        ).value;

        if (this.At().type == TokenType.Semicolon)
        {
            this.Eat();
            if (isConst)
            {
                throw `Parser Error: Expected an assignment for const variable: ${ identifier }`;
            }
            return {
                type: "VariableDeclaration",
                const: isConst,
                identifier,
                value: undefined
            } as VariableDeclaration;
        }

        this.Expect(
            TokenType.Assign,
            "Expected assignment operator"
        );

        const declaration = {
            type: "VariableDeclaration",
            const: isConst,
            identifier,
            value: this.ParseExpression()
        } as VariableDeclaration;

        // Check for semicolon
        this.Expect(TokenType.Semicolon, "Expected semicolon");

        return declaration;
    }

    private ParseExpression(): Expression
    {
        return this.ParseAssignmentExpression();
    }

    private ParseAssignmentExpression(): Expression
    {
        const left = this.ParseObjectExpression();
        if (this.At().type == TokenType.Assign)
        {
            this.Eat(); // Eat the assignment operator
            const value = this.ParseAssignmentExpression();
            return { type: "AssignmentExpression", assignee: left, value } as AssignmentExpression;
        }

        // check for semicolon
        return left;
    }

    private ParseObjectExpression(): Expression
    {
        // { key: value, key: value }
        if (this.At().type !== TokenType.OpenBrace)
        {
            return this.ParseAdditiveExpression();
        }

        this.Eat(); // Eat the opening brace
        const properties = new Array<Property>();

        while (this.NotEOF() && this.At().type !== TokenType.CloseBrace)
        {
            const key = this.Expect(TokenType.Identifier, "Expected identifier").value;

            // Allows shorthand syntax
            if (this.At().type == TokenType.Comma)
            {
                this.Eat(); // Eat the comma
                properties.push({ type: "Property", key, value: undefined });
                continue;
            }
            // Allow { key }
            else if (this.At().type == TokenType.CloseBrace)
            {
                properties.push({ type: "Property", key, value: undefined });
                continue;
            }

            // { key: value, key: value }
            this.Expect(TokenType.Colon, "Expected colon");
            const value = this.ParseExpression();

            properties.push({ type: "Property", key, value });

            if (this.At().type != TokenType.CloseBrace)
            {
                this.Expect(TokenType.Comma, "Expected comma");
            }
        }

        this.Expect(TokenType.CloseBrace, "Expected closing brace");
        return { type: "ObjectLiteral", properties } as ObjectLiteral;
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
        let left = this.ParseCallMemberExpression();

        while (this.At().value == "*" || this.At().value == "/" || this.At().value == "%")
        {
            const operator = this.Eat().value;
            const right = this.ParseCallMemberExpression();

            left = {
                type: "BinaryExpression",
                left,
                right,
                operator
            } as BinaryExpression;
        }

        return left;
    }

    private ParseCallMemberExpression(): Expression
    {
        const member = this.ParseMemberExpression();

        if (this.At().type == TokenType.OpenParen)
        {
            return this.ParseCallExpression(member);
        }

        return member;
    }

    private ParseCallExpression(callee: Expression): Expression
    {
        let callExpression: Expression = {
            type: "CallExpression",
            callee,
            args: this.ParseArgs()
        } as CallExpression;

        if (this.At().type == TokenType.OpenParen)
        {
            callExpression = this.ParseCallExpression(callExpression); // Recurse foo.x()()
        }

        // 
        return callExpression;
    }

    // function foo(x, y, z) { }
    private ParseArgs(): Expression[]
    {
        this.Expect(TokenType.OpenParen, "Expected open parenthesis");
        const args = this.At().type == TokenType.CloseParen
            ? []
            : this.ParseArgsList();

        this.Expect(
            TokenType.CloseParen,
            "Expected closing parenthesis",
        );
        
        return args;
    }

    private ParseArgsList(): Expression[]
    {
        const args = [this.ParseAssignmentExpression()];

        while (this.At().type == TokenType.Comma && this.Eat())
        {
            args.push(this.ParseAssignmentExpression());
        }

        return args;
    }

    private ParseMemberExpression(): Expression
    {
        let object = this.ParsePrimaryExpression();

        while (
            this.At().type == TokenType.Dot || this.At().type == TokenType.OpenBracket
        )
        {
            const operator = this.Eat();
            let property: Expression;
            let computed: boolean;

            // non-computed values aka obj.expr
            if (operator.type == TokenType.Dot)
            {
                computed = false;
                // get identifier
                property = this.ParsePrimaryExpression();
                if (property.type != "Identifier")
                {
                    throw `Expected identifier, got ${ property.type }`
                }
            } else
            { // this allows obj[computedValue]
                computed = true;
                property = this.ParseExpression();
                this.Expect(
                    TokenType.CloseBracket,
                    "Expected closing bracket",
                );
            }

            object = {
                type: "MemberExpression",
                object,
                property,
                computed,
            } as MemberExpression;
        }

        return object;
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
                console.error("Parser Error:\n Unexpected token:", this.At());
                Deno.exit(1);
        }
    }
}
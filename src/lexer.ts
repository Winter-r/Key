export enum TokenType
{
  Number,
  Identifier,
  Equals,
  OpenParen,
  CloseParen,
  BinaryOperator,
  Let,
}
const KEYWORDS: Record<string, TokenType> = {
  let: TokenType.Let,
};

export interface Token
{
  value: string;
  type: TokenType;
}

function Token(value = "", type: TokenType): Token
{
  return { value, type };
}

function IsAlpha(src: string)
{
  return src.toUpperCase() != src.toLowerCase();
}

function IsSkippable(str: string)
{
  return str == " " || str == "\n" || str == "\t";
}

function IsInt(str: string)
{
  const c = str.charCodeAt(0);
  const bounds = ["0".charCodeAt(0), "9".charCodeAt(0)];
  return c >= bounds[0] && c <= bounds[1];
}

export function Tokenize(sourceCode: string): Token[]
{
  const tokens = new Array<Token>();
  const src = sourceCode.toString().split("");

  while (src.length > 0)
  {
    if (src[0] == "(")
    {
      tokens.push(Token(src.shift(), TokenType.OpenParen));
    }
    else if (src[0] == ")")
    {
      tokens.push(Token(src.shift(), TokenType.CloseParen));
    }
    else if (
      src[0] == "+" || src[0] == "-" || src[0] == "*" || src[0] == "/"
    )
    {
      tokens.push(Token(src.shift(), TokenType.BinaryOperator));
    }
    else if (src[0] == "=")
    {
      tokens.push(Token(src.shift(), TokenType.Equals));
    } else
    {
      if (IsInt(src[0]))
      {
        let num = "";
        while (src.length > 0 && IsInt(src[0]))
        {
          num += src.shift();
        }

        tokens.push(Token(num, TokenType.Number));
      }
      else if (IsAlpha(src[0]))
      {
        let ident = "";
        while (src.length > 0 && IsAlpha(src[0]))
        {
          ident += src.shift();
        }

        const reserved = KEYWORDS[ident];

        if (reserved)
        {
          tokens.push(Token(ident, reserved));
        }
        else
        {
          tokens.push(Token(ident, TokenType.Identifier));
        }
      }
      else if (IsSkippable(src[0]))
      {
        src.shift();
      }
      else
      {
        console.error(
          `Unreconized character found in source: ${ src[0].charCodeAt(0) } (${ src[0]
          })`,
        );
        Deno.exit(1);
      }
    }
  }
  return tokens;
}

const source = await Deno.readTextFile("./Examples/test.txt");
for (const token of Tokenize(source))
{
  console.log(token);
}

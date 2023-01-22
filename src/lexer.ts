export enum TokenType
{
  Number,
  String,
  Identifier,
  Assign,
  Semicolon,
  OpenParen,
  CloseParen,
  BinaryOperator,
  Let,
  Const,
  EOF // End of file
}

const KEYWORDS: Record<string, TokenType> = {
  let: TokenType.Let,
  const: TokenType.Const
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
      src[0] == "+" || src[0] == "-" || src[0] == "*" || src[0] == "/" || src[0] == "%"
    )
    {
      tokens.push(Token(src.shift(), TokenType.BinaryOperator));
    }
    else if (src[0] == "=")
    {
      tokens.push(Token(src.shift(), TokenType.Assign));
    }
    else if (src[0] == ";")
    {
      tokens.push(Token(src.shift(), TokenType.Semicolon));
    }
    else
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

        if (typeof reserved == "number")
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
        throw `Unreconized character found in source: ${ src[0].charCodeAt(0) } (${ src[0] })`;
      }
    }
  }

  tokens.push({ type: TokenType.EOF, value: "EndOfFile" });
  return tokens;
}
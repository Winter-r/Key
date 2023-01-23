export enum TokenType
{
  // Literals
  Number,
  Identifier,

  // Keywords
  Let, // let
  Const, // const

  // Operators
  Assign, // <-
  BinaryOperator, // + - * / %

  // Grouping
  OpenParen, // (
  CloseParen, // )
  OpenBrace, // {
  CloseBrace, // }

  // Misc
  Semicolon, // ;
  Colon, // :
  Comma, // ,
  EOF // EndOfFile
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
  return str == " " || str == "\n" || str == "\t" || str == "\r";
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
    // Handle grouping
    if (src[0] == "(")
    {
      tokens.push(Token(src.shift(), TokenType.OpenParen));
    }
    else if (src[0] == ")")
    {
      tokens.push(Token(src.shift(), TokenType.CloseParen));
    }
    else if (src[0] == "{")
    {
      tokens.push(Token(src.shift(), TokenType.OpenBrace));
    }
    else if (src[0] == "}")
    {
      tokens.push(Token(src.shift(), TokenType.CloseBrace));
    }

    // Handle binary operators
    else if (
      src[0] == "+" || src[0] == "-" || src[0] == "*" || src[0] == "/" || src[0] == "%"
    )
    {
      tokens.push(Token(src.shift(), TokenType.BinaryOperator));
    }

    // Handle assignment operator <-
    else if (src[0] == "<" && src[1] == "-")
    {
      src.shift();
      src.shift();
      tokens.push(Token("<-", TokenType.Assign));
    }
    
    // Handle misc
    else if (src[0] == ";")
    {
      tokens.push(Token(src.shift(), TokenType.Semicolon));
    }
    else if (src[0] == ":")
    {
      tokens.push(Token(src.shift(), TokenType.Colon));
    }
    else if (src[0] == ",")
    {
      tokens.push(Token(src.shift(), TokenType.Comma));
    }
    else // Handle literals
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

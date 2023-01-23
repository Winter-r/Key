import { MakeBool, RuntimeValue, MakeNull } from "./values.ts";

export function CreateGlobalScope()
{
    const env = new Environment();
    // Default Global Variables
    env.DeclareVariable("true", MakeBool(true), true);
    env.DeclareVariable("false", MakeBool(false), true);
    env.DeclareVariable("null", MakeNull(), true);

    return env;
}

export default class Environment
{
    private parent?: Environment;
    private variables: Map<string, RuntimeValue>;
    private consts: Set<string>;

    constructor(parentENV?: Environment)
    {
        this.parent = parentENV;
        this.variables = new Map();
        this.consts = new Set();
    }

    public DeclareVariable(name: string, value: RuntimeValue, constant: boolean): RuntimeValue
    {
        if (this.variables.has(name))
        {
            throw `Cannot declare variable \`${ name }\` twice in the same scope.`;
        }

        this.variables.set(name, value);

        if (constant)
        {
            this.consts.add(name);
        }
        return value;
    }

    public AssignVariable(name: string, value: RuntimeValue): RuntimeValue
    {
        const env = this.ResolveVariable(name);

        if (env.consts.has(name))
        {
            throw `Cannot assign to constant variable \`${ name }\`.`;
        }
        env.variables.set(name, value);
        return value;
    }

    public GetVariable(name: string): RuntimeValue
    {
        const env = this.ResolveVariable(name);
        return env.variables.get(name) as RuntimeValue;
    }

    public ResolveVariable(name: string): Environment
    {
        if (this.variables.has(name))
        {
            return this;
        }
        if (this.parent == undefined)
        {
            throw `Cannot resolve variable \`${ name }\` in current scope.`;
        }

        return this.parent.ResolveVariable(name);
    }
}
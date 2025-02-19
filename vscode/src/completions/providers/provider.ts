import { Completion } from '..'
import { ReferenceSnippet } from '../context'

export interface ProviderConfig {
    /**
     * A factory to create instances of the provider. This pattern allows us to
     * inject provider specific parameters outside of the callers of the
     * factory.
     */
    create(options: ProviderOptions): Provider

    /**
     * The maximum number of unicode characters that should be included in the
     * context window. Note that these are not tokens as the definition can vary
     * between models.
     *
     * This value is used for determining the length of prefix, suffix, and
     * snippets and can be validated by the provider implementing it.
     */
    maximumContextCharacters: number

    /**
     * When set, multi-line completions will trigger more often. This is
     */
    enableExtendedMultilineTriggers: boolean

    /**
     * A string identifier for the provider config used in event logs.
     */
    identifier: string
}

export interface ProviderOptions {
    /** A unique and descriptive identifier for the provider. */
    id: string

    prefix: string
    suffix: string
    fileName: string
    languageId: string
    multiline: boolean
    // Relative length to `maximumContextCharacters`
    responsePercentage: number
    prefixPercentage: number
    suffixPercentage: number
    // Number of parallel LLM requests per completion.
    n: number
}

export abstract class Provider {
    public readonly id: string
    protected prefix: string
    protected suffix: string
    protected fileName: string
    protected languageId: string
    protected multiline: boolean
    protected responsePercentage: number
    protected prefixPercentage: number
    protected suffixPercentage: number
    protected n: number

    constructor({
        id,
        prefix,
        suffix,
        fileName,
        languageId,
        multiline,
        responsePercentage,
        prefixPercentage,
        suffixPercentage,
        n = 1,
    }: ProviderOptions) {
        this.id = id
        this.prefix = prefix
        this.suffix = suffix
        this.fileName = fileName
        this.languageId = languageId
        this.multiline = multiline
        this.responsePercentage = responsePercentage
        this.prefixPercentage = prefixPercentage
        this.suffixPercentage = suffixPercentage
        this.n = n
    }

    public abstract generateCompletions(abortSignal: AbortSignal, snippets: ReferenceSnippet[]): Promise<Completion[]>
}

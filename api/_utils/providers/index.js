import { GreenAPIProvider } from './greenapi.js'
import { EvolutionProvider } from './evolution.js'

/**
 * Provider Registry
 * Factory pattern for getting the correct WhatsApp provider
 */

const providers = {
    'green-api': GreenAPIProvider,
    'evolution': EvolutionProvider
}

/**
 * Get provider instance based on number row from database
 * @param {Object} numberRow - Database row from `numbers` table
 * @returns {BaseProvider}
 */
export function getProvider(numberRow) {
    const providerName = numberRow?.provider || 'green-api'
    const ProviderClass = providers[providerName]

    if (!ProviderClass) {
        throw new Error(`Unknown provider: ${providerName}`)
    }

    // Pass any provider-specific config from numberRow.settings
    const config = {
        ...numberRow?.settings,
        instanceId: numberRow?.instance_id,
        apiToken: numberRow?.api_token
    }

    return new ProviderClass(config)
}

/**
 * Get provider by name (for admin operations)
 * @param {string} providerName - 'green-api' or 'evolution'
 * @param {Object} config - Optional config overrides
 * @returns {BaseProvider}
 */
export function getProviderByName(providerName, config = {}) {
    const ProviderClass = providers[providerName]

    if (!ProviderClass) {
        throw new Error(`Unknown provider: ${providerName}`)
    }

    return new ProviderClass(config)
}

/**
 * List all available providers
 * @returns {string[]}
 */
export function listProviders() {
    return Object.keys(providers)
}

/**
 * Register a new provider (for extensibility)
 * @param {string} name
 * @param {typeof BaseProvider} ProviderClass
 */
export function registerProvider(name, ProviderClass) {
    providers[name] = ProviderClass
}

export { GreenAPIProvider, EvolutionProvider }

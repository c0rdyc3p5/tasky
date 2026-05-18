export function buildErrorObj(code: string | number, message: string, details?: {}) {
    return {
        "error": {
            "code": code,
            "message": `${code}: ${message}`,
            "details": {
                ...details,
                timestamp: Date.now() // Dans un contexte en prod, permet de binder facilement une erreur client sur un log serveur
            },
        }
    }
}
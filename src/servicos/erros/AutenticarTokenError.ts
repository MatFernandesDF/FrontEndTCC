export class AutenticarTokenError extends Error {
    constructor(){
        super('Erro de autenticação de token')
    }
}
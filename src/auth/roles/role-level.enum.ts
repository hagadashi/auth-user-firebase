export enum RoleLevel {
    ADMIN = 'ADMIN',  // Pode fornecer permissão
    OWNER = 'OWNER',  // Pode CRUD completo
    WRITER = 'WRITER', // Pode ler e inserir e alterar
    READER = 'READER', // Pode ler
}

export enum RoleNumber {
    ADMIN = 0,  // Pode fornecer permissão
    OWNER = 1,  // Pode CRUD completo
    WRITER = 2, // Pode ler e inserir e alterar
    READER = 3, // Pode ler
}
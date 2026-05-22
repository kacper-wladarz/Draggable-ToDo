interface UserData {
    id: number
    name: string
    login: string
    created_at: string
    updated_at: string
}

interface UserLoginCredentials {
    login: string
    password: string
}

interface UserRegistrationCredentials {
    name: string
    login: string
    password: string
    password_confirmation: string
}
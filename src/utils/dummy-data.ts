import { FMProfile } from "../interfaces";

export const dummyUser: FMProfile = {
    id: "12345", // Ensure this is always a string
    email: "example@example.com",
    verified_email: "true",
    name: "John Doe",
    given_name: "John",
    family_name: "Doe",
    picture: "url_to_picture",
    locale: "en-US",
    created_date: "2023-09-19",
    last_login: "2023-09-19",
    language: "en",
    role: "user",
    access: "full",
    active: true,
    rejected: false,
}
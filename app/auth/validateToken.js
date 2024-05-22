import { jwtVerify, base64url } from "jose";

export async function verifyJwtToken(token) {
    try {
        const secret = base64url.decode('zH4NRP1HMALxxCFnRZABFA7GOJtzU_gIj02alfL1lvI')
        const key = new TextEncoder().encode(secret);
        const verified = await jwtVerify(
            token,
            key
        );
        return true;
    } catch (error) {
        return false
    }
}
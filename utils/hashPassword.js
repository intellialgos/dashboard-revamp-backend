import crypto from 'crypto';

export async function hashPassword(password) {
    if ( !password ) { return null }
    // Compute MD5 hash
    const hash = await crypto.createHash('md5').update(password).digest('hex');
    // Convert to lowercase
    return hash.toLowerCase();
}
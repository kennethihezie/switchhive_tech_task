import * as argon2 from "argon2";

/*
 The Helpers class is used to expose reuseable functions.
 */

export class Helpers {
    static async hashData(data: string): Promise<string> {
        const hash = await argon2.hash(data)        
        return hash
    }

    static async verifyData(hashedData: string, data: string): Promise<boolean> {
        const isMatch = await argon2.verify(hashedData, data);        
        return isMatch
    }
}
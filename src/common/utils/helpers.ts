import * as bcrypt from 'bcrypt';

/*
 The Helpers class is used to expose reuseable functions.
 */

export class Helpers {
    static async hashData(data: string): Promise<string> {
        const saltOrRounds = 10;
        const hash = await bcrypt.hash(data, saltOrRounds);

        return hash
    }

    static async verifyData(existingData: string, incomingData: string): Promise<boolean> {
        const isMatch = await bcrypt.compare(incomingData, existingData);
        return isMatch
    }

    static parseDateString(dateString: string): Date {
        const [day, month, year] = dateString.split('-').map(part => parseInt(part, 10));
        return new Date(year, month - 1, day); // Month is 0-based in JavaScript Date
    }

    static formatDate(date: Date): string {
        const day = date.getDate().toString().padStart(2, '0');
        const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Month is 0-based
        const year = date.getFullYear();
        return `${day}-${month}-${year}`;
    }

    static generateRandomDigitNumber(length: number = 6): number {
        const min = length === 6 ? 100000 : 1000000000 // Minimum value (inclusive)
        const max = length === 6 ? 999999 : 9999999999 // Maximum value (inclusive)
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
}
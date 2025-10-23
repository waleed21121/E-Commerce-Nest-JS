import { Injectable } from '@nestjs/common';
import { HashingProvider } from './hashing.provider';
import * as bcrypt from 'bcrypt';

@Injectable()
export class BcryptProvider extends HashingProvider {
    async hash(password: string): Promise<string> {
        const salt = await bcrypt.genSalt();
        return await bcrypt.hash(password, salt);
    }

    async compare(plainPassword: string, password: string): Promise<boolean> {
        return await bcrypt.compare(plainPassword, password);
    }
}

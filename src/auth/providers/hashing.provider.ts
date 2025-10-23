import { Injectable } from '@nestjs/common';

@Injectable()
export abstract class HashingProvider {
    abstract hash(text: string, ): Promise<string>;
    abstract compare(plainText: string, text: string): Promise<boolean>
}

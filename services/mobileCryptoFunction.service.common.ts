import { CryptoFunctionService } from 'jslib/abstractions/cryptoFunction.service';

import { Utils } from 'jslib/misc/utils';

import { SymmetricCryptoKey } from 'jslib/models/domain/symmetricCryptoKey';
import { DecryptParameters } from 'jslib/models/domain/decryptParameters';

export abstract class MobileCryptoFunctionService implements CryptoFunctionService {
    pbkdf2(password: string | ArrayBuffer, salt: string | ArrayBuffer, algorithm: 'sha256' | 'sha512',
        iterations: number): Promise<ArrayBuffer> {
        throw new Error('Not implemented');
    }

    hash(value: string | ArrayBuffer, algorithm: 'sha1' | 'sha256' | 'sha512' | 'md5'): Promise<ArrayBuffer> {
        throw new Error('Not implemented');
    }

    hmac(value: ArrayBuffer, key: ArrayBuffer, algorithm: 'sha1' | 'sha256' | 'sha512'): Promise<ArrayBuffer> {
        throw new Error('Not implemented');
    }

    async compare(a: ArrayBuffer, b: ArrayBuffer): Promise<boolean> {
        const key = await this.randomBytes(32);
        const mac1 = await this.hmac(a, key, 'sha256');
        const mac2 = await this.hmac(b, key, 'sha256');
        if (mac1.byteLength !== mac2.byteLength) {
            return false;
        }

        const arr1 = new Uint8Array(mac1);
        const arr2 = new Uint8Array(mac2);
        for (let i = 0; i < arr2.length; i++) {
            if (arr1[i] !== arr2[i]) {
                return false;
            }
        }

        return true;
    }

    hmacFast(value: ArrayBuffer, key: ArrayBuffer, algorithm: 'sha1' | 'sha256' | 'sha512'): Promise<ArrayBuffer> {
        return this.hmac(value, key, algorithm);
    }

    compareFast(a: ArrayBuffer, b: ArrayBuffer): Promise<boolean> {
        return this.compare(a, b);
    }

    aesEncrypt(data: ArrayBuffer, iv: ArrayBuffer, key: ArrayBuffer): Promise<ArrayBuffer> {
        throw new Error('Not implemented');
    }

    aesDecryptFastParameters(data: string, iv: string, mac: string, key: SymmetricCryptoKey):
        DecryptParameters<ArrayBuffer> {
        const p = new DecryptParameters<ArrayBuffer>();
        p.encKey = key.encKey;
        p.data = Utils.fromB64ToArray(data).buffer;
        p.iv = Utils.fromB64ToArray(iv).buffer;

        const macData = new Uint8Array(p.iv.byteLength + p.data.byteLength);
        macData.set(new Uint8Array(p.iv), 0);
        macData.set(new Uint8Array(p.data), p.iv.byteLength);
        p.macData = macData.buffer;

        if (key.macKey != null) {
            p.macKey = key.macKey;
        }
        if (mac != null) {
            p.mac = Utils.fromB64ToArray(mac).buffer;
        }

        return p;
    }

    async aesDecryptFast(parameters: DecryptParameters<ArrayBuffer>): Promise<string> {
        const decBuf = await this.aesDecrypt(parameters.data, parameters.iv, parameters.encKey);
        return Utils.fromBufferToUtf8(decBuf);
    }

    aesDecrypt(data: ArrayBuffer, iv: ArrayBuffer, key: ArrayBuffer): Promise<ArrayBuffer> {
        throw new Error('Not implemented');
    }

    rsaEncrypt(data: ArrayBuffer, publicKey: ArrayBuffer, algorithm: 'sha1' | 'sha256'): Promise<ArrayBuffer> {
        throw new Error('Not implemented');
    }

    rsaDecrypt(data: ArrayBuffer, privateKey: ArrayBuffer, algorithm: 'sha1' | 'sha256'): Promise<ArrayBuffer> {
        throw new Error('Not implemented');
    }

    rsaExtractPublicKey(privateKey: ArrayBuffer): Promise<ArrayBuffer> {
        throw new Error('Not implemented');
    }

    async rsaGenerateKeyPair(length: 1024 | 2048 | 4096): Promise<[ArrayBuffer, ArrayBuffer]> {
        throw new Error('Not implemented');
    }

    randomBytes(length: number): Promise<ArrayBuffer> {
        throw new Error('Not implemented');
    }
}
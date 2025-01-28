import { Injectable } from '@nestjs/common';

@Injectable()
export class HookService {

    processNotification(requestBody : any) {
        console.log(requestBody);
        const res = "Done";
        return res;
    }
}

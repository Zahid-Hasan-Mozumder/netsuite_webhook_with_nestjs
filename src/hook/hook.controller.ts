import { Body, Controller, Post } from '@nestjs/common';
import { HookService } from './hook.service';

@Controller('hook')
export class HookController {

    constructor(private hookService : HookService) {}

    // Here the request is basically the response from the hooked server
    @Post('webhook')
    processNotification(@Body() requestBody : any) {
        return this.hookService.processNotification(requestBody);
    }
}

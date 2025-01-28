import { Module } from '@nestjs/common';
import { HookModule } from './hook/hook.module';

@Module({
  imports: [HookModule]
})
export class AppModule {}

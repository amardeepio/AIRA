import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PropertiesModule } from './properties/properties.module';
import { ChatModule } from './chat/chat.module';
import { AdvisorModule } from './advisor/advisor.module';

@Module({
  imports: [PropertiesModule, ChatModule, AdvisorModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

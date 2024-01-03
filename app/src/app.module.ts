import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { TasksModule } from './tasks/tasks.module';
import { MyJwtModule } from './jwt/jwt.module';
import { AuthModule } from './auth/auth.module';
import { SeederService } from './database/seed/seeder.service';
import { Task, TaskSchema } from './tasks/tasks.model'; 
import { ConfigModule } from '@nestjs/config';


@Module( {
  imports: [
    MongooseModule.forRoot( process.env.MONGO_URI || 'mongodb://localhost:27017/demo_db' ),
    MongooseModule.forFeature( [ { name: Task.name, schema: TaskSchema } ] ), 
    TasksModule,
    MyJwtModule,
    AuthModule,
    ConfigModule.forRoot(), 
  ],
  controllers: [ AppController ],
  providers: [ AppService, SeederService ],
} )
export class AppModule { }

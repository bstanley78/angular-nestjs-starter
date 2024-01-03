import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Task } from '../../tasks/tasks.model';

@Injectable()
export class SeederService implements OnApplicationBootstrap {
   constructor ( @InjectModel( Task.name ) private readonly tasksModel: Model<Task> ) { }

   async onApplicationBootstrap (): Promise<void> {
      const existingTasks = await this.tasksModel.find().exec();

      if ( existingTasks.length === 0 ) {
         await this.seedTasks();
      }
   }

   private async seedTasks (): Promise<void> {
      const tasksToSeed = [
         { "title": "Book 1", "description": "Description 1" },
         { "title": "Book 2", "description": "Description 2" },
         { "title": "Book 3", "description": "Description 3" },
         { "title": "Book 4", "description": "Description 4" },
         { "title": "Book 5", "description": "Description 5" },
         { "title": "Book 6", "description": "Description 6" },
         { "title": "Book 7", "description": "Description 7" },
         { "title": "Book 8", "description": "Description 8" },
         { "title": "Book 9", "description": "Description 9" },
         { "title": "Book 10", "description": "Description 10" },
         { "title": "Book 11", "description": "Description 11" },
         { "title": "Book 12", "description": "Description 12" },
         { "title": "Book 13", "description": "Description 13" },
         { "title": "Book 14", "description": "Description 14" },
         { "title": "Book 15", "description": "Description 15" }
      ];

      await this.tasksModel.create( tasksToSeed );
      console.log( 'Books seeded successfully!' );
   }
}

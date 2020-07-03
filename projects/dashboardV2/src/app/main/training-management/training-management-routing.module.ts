import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TrainingManagementComponent } from './training-management.component';

const routes: Routes = [
    {
        path: '',
        component: TrainingManagementComponent
    },
    { path: 'titute', loadChildren: () => import('./titute/titute.module').then(m => m.TituteModule) },
    { path: 'yeareducation', loadChildren: () => import('./yeareducation/yeareducation.module').then(m => m.YeareducationModule) },
    { path: 'grade', loadChildren: () => import('./grade/grade.module').then(m => m.GradeModule) },
    { path: 'class', loadChildren: () => import('./class/class.module').then(m => m.ClassModule) },
    { path: 'days-of-week', loadChildren: () => import('./days-of-week/days-of-week.module').then(m => m.DaysOfWeekModule) },
    { path: 'time-schedule', loadChildren: () => import('./time-schedule/time-schedule.module').then(m => m.TimeScheduleModule) },
    { path: 'teacher', loadChildren: () => import('./teacher/teacher.module').then(m => m.TeacherModule) },
    { path: 'course', loadChildren: () => import('./course/course.module').then(m => m.CourseModule) }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class TrainingManagementRoutingModule { }

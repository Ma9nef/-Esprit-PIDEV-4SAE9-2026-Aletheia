import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AdminDashboardComponent } from './admin-dashboard/admin-dashboard.component';
import { TrainerDashboardComponent } from './trainer-dashboard/trainer-dashboard.component';
import { ManageUsersComponent } from './manage-users/manage-users.component';
import { TrainerCoursesComponent } from './trainer-courses/trainer-courses.component';
import { ManageLibraryComponent } from './manage-library/manage-library.component';
import { ManageCoursesComponent } from './manage-courses/manage-courses.component';
import { TrainerHomeComponent } from './trainer-home/trainer-home.component';
import { CreateCourseComponent } from './create-course/create-course.component';
import { CreateLessonComponent } from './create-lesson/create-lesson.component';
import { CourseBuilderComponent } from './courses/course-builder/course-builder.component';
import { EditCourseComponent } from './edit-course/edit-course.component';

const routes: Routes = [
  {
    path: 'admin',
    component: AdminDashboardComponent,
    children: [
      { path: 'manage-library', component: ManageLibraryComponent },

      // ✅ AJOUT
      { path: 'courses', component: ManageCoursesComponent }
    ]
  },
  {
    path: 'trainer',
    component: TrainerDashboardComponent,
    children: [
      { path: '', component: TrainerHomeComponent },

      { path: 'manage-courses', component: ManageCoursesComponent },

      { path: 'create-course', component: CreateCourseComponent },

      {
        path: 'courses/:courseId/lessons/create',
        component: CreateLessonComponent
      },
      { path: 'courses/:courseId/builder', component: CourseBuilderComponent },
      { path: 'courses/:courseId/lessons/create', component: CreateLessonComponent },
      { path: 'courses/:id/edit', component: EditCourseComponent }
    ]
  },

  { path: 'trainer', component: TrainerDashboardComponent },
  { path: 'manage-users', component: ManageUsersComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BackOfficeRoutingModule {}

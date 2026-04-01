"use strict";
(self["webpackChunkaletheia_frontEnd"] = self["webpackChunkaletheia_frontEnd"] || []).push([["src_app_back-office_back-office_module_ts"],{

/***/ 8906:
/*!***********************************************************!*\
  !*** ./src/app/back-office/back-office-routing.module.ts ***!
  \***********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   BackOfficeRoutingModule: () => (/* binding */ BackOfficeRoutingModule)
/* harmony export */ });
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! @angular/router */ 5072);
/* harmony import */ var _admin_dashboard_admin_dashboard_component__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./admin-dashboard/admin-dashboard.component */ 5821);
/* harmony import */ var _trainer_dashboard_trainer_dashboard_component__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./trainer-dashboard/trainer-dashboard.component */ 7817);
/* harmony import */ var _manage_users_manage_users_component__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./manage-users/manage-users.component */ 2251);
/* harmony import */ var _trainer_courses_trainer_courses_component__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./trainer-courses/trainer-courses.component */ 5385);
/* harmony import */ var _manage_library_manage_library_component__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./manage-library/manage-library.component */ 7449);
/* harmony import */ var _manage_courses_manage_courses_component__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./manage-courses/manage-courses.component */ 2999);
/* harmony import */ var _trainer_home_trainer_home_component__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./trainer-home/trainer-home.component */ 2065);
/* harmony import */ var _create_course_create_course_component__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./create-course/create-course.component */ 5681);
/* harmony import */ var _create_lesson_create_lesson_component__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./create-lesson/create-lesson.component */ 8062);
/* harmony import */ var _courses_course_builder_course_builder_component__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./courses/course-builder/course-builder.component */ 5160);
/* harmony import */ var _edit_course_edit_course_component__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ./edit-course/edit-course.component */ 1909);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! @angular/core */ 7580);














const routes = [{
  path: 'admin',
  component: _admin_dashboard_admin_dashboard_component__WEBPACK_IMPORTED_MODULE_0__.AdminDashboardComponent,
  children: [{
    path: 'manage-library',
    component: _manage_library_manage_library_component__WEBPACK_IMPORTED_MODULE_4__.ManageLibraryComponent
  }, {
    path: 'manage-users',
    component: _manage_users_manage_users_component__WEBPACK_IMPORTED_MODULE_2__.ManageUsersComponent
  }, {
    path: 'courses',
    component: _manage_courses_manage_courses_component__WEBPACK_IMPORTED_MODULE_5__.ManageCoursesComponent
  }]
}, {
  path: 'trainer',
  component: _trainer_dashboard_trainer_dashboard_component__WEBPACK_IMPORTED_MODULE_1__.TrainerDashboardComponent,
  children: [{
    path: '',
    component: _trainer_home_trainer_home_component__WEBPACK_IMPORTED_MODULE_6__.TrainerHomeComponent
  }, {
    path: 'manage-courses',
    component: _manage_courses_manage_courses_component__WEBPACK_IMPORTED_MODULE_5__.ManageCoursesComponent
  }, {
    path: 'create-course',
    component: _create_course_create_course_component__WEBPACK_IMPORTED_MODULE_7__.CreateCourseComponent
  }, {
    path: 'courses/:courseId/lessons/create',
    component: _create_lesson_create_lesson_component__WEBPACK_IMPORTED_MODULE_8__.CreateLessonComponent
  }, {
    path: 'courses/:courseId/builder',
    component: _courses_course_builder_course_builder_component__WEBPACK_IMPORTED_MODULE_9__.CourseBuilderComponent
  }, {
    path: 'courses/:id/edit',
    component: _edit_course_edit_course_component__WEBPACK_IMPORTED_MODULE_10__.EditCourseComponent
  }]
}, {
  path: 'manage-users',
  component: _manage_users_manage_users_component__WEBPACK_IMPORTED_MODULE_2__.ManageUsersComponent
}, {
  path: 'trainer-courses',
  component: _trainer_courses_trainer_courses_component__WEBPACK_IMPORTED_MODULE_3__.TrainerCoursesComponent
}, {
  path: 'trainer/courses',
  component: _trainer_courses_trainer_courses_component__WEBPACK_IMPORTED_MODULE_3__.TrainerCoursesComponent
}];
class BackOfficeRoutingModule {
  static {
    this.ɵfac = function BackOfficeRoutingModule_Factory(t) {
      return new (t || BackOfficeRoutingModule)();
    };
  }
  static {
    this.ɵmod = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵdefineNgModule"]({
      type: BackOfficeRoutingModule
    });
  }
  static {
    this.ɵinj = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵdefineInjector"]({
      imports: [_angular_router__WEBPACK_IMPORTED_MODULE_12__.RouterModule.forChild(routes), _angular_router__WEBPACK_IMPORTED_MODULE_12__.RouterModule]
    });
  }
}
(function () {
  (typeof ngJitMode === "undefined" || ngJitMode) && _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵsetNgModuleScope"](BackOfficeRoutingModule, {
    imports: [_angular_router__WEBPACK_IMPORTED_MODULE_12__.RouterModule],
    exports: [_angular_router__WEBPACK_IMPORTED_MODULE_12__.RouterModule]
  });
})();

/***/ }),

/***/ 7555:
/*!***************************************************!*\
  !*** ./src/app/back-office/back-office.module.ts ***!
  \***************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   BackOfficeModule: () => (/* binding */ BackOfficeModule)
/* harmony export */ });
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(/*! @angular/common */ 316);
/* harmony import */ var _angular_forms__WEBPACK_IMPORTED_MODULE_16__ = __webpack_require__(/*! @angular/forms */ 4456);
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_17__ = __webpack_require__(/*! @angular/router */ 5072);
/* harmony import */ var _admin_dashboard_admin_dashboard_component__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./admin-dashboard/admin-dashboard.component */ 5821);
/* harmony import */ var _manage_users_manage_users_component__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./manage-users/manage-users.component */ 2251);
/* harmony import */ var _trainer_dashboard_trainer_dashboard_component__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./trainer-dashboard/trainer-dashboard.component */ 7817);
/* harmony import */ var _back_office_routing_module__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./back-office-routing.module */ 8906);
/* harmony import */ var _trainer_courses_trainer_courses_component__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./trainer-courses/trainer-courses.component */ 5385);
/* harmony import */ var _manage_library_manage_library_component__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./manage-library/manage-library.component */ 7449);
/* harmony import */ var _manage_certificates_manage_certificates_component__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./manage-certificates/manage-certificates.component */ 3509);
/* harmony import */ var _assessment_form_assessment_form_component__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./assessment-form/assessment-form.component */ 5641);
/* harmony import */ var _manage_assessments_manage_assessments_component__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./manage-assessments/manage-assessments.component */ 717);
/* harmony import */ var _filter_pipe__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ../filter.pipe */ 5406);
/* harmony import */ var _create_course_create_course_component__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ./create-course/create-course.component */ 5681);
/* harmony import */ var _create_lesson_create_lesson_component__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ./create-lesson/create-lesson.component */ 8062);
/* harmony import */ var _courses_course_builder_course_builder_component__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ./courses/course-builder/course-builder.component */ 5160);
/* harmony import */ var _edit_course_edit_course_component__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! ./edit-course/edit-course.component */ 1909);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! @angular/core */ 7580);


















class BackOfficeModule {
  static {
    this.ɵfac = function BackOfficeModule_Factory(t) {
      return new (t || BackOfficeModule)();
    };
  }
  static {
    this.ɵmod = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵdefineNgModule"]({
      type: BackOfficeModule
    });
  }
  static {
    this.ɵinj = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵdefineInjector"]({
      imports: [_angular_common__WEBPACK_IMPORTED_MODULE_15__.CommonModule, _angular_forms__WEBPACK_IMPORTED_MODULE_16__.ReactiveFormsModule, _angular_forms__WEBPACK_IMPORTED_MODULE_16__.FormsModule, _back_office_routing_module__WEBPACK_IMPORTED_MODULE_3__.BackOfficeRoutingModule, _angular_router__WEBPACK_IMPORTED_MODULE_17__.RouterModule]
    });
  }
}
(function () {
  (typeof ngJitMode === "undefined" || ngJitMode) && _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵsetNgModuleScope"](BackOfficeModule, {
    declarations: [_admin_dashboard_admin_dashboard_component__WEBPACK_IMPORTED_MODULE_0__.AdminDashboardComponent, _manage_users_manage_users_component__WEBPACK_IMPORTED_MODULE_1__.ManageUsersComponent, _trainer_dashboard_trainer_dashboard_component__WEBPACK_IMPORTED_MODULE_2__.TrainerDashboardComponent, _trainer_courses_trainer_courses_component__WEBPACK_IMPORTED_MODULE_4__.TrainerCoursesComponent, _manage_library_manage_library_component__WEBPACK_IMPORTED_MODULE_5__.ManageLibraryComponent, _manage_certificates_manage_certificates_component__WEBPACK_IMPORTED_MODULE_6__.ManageCertificatesComponent, _assessment_form_assessment_form_component__WEBPACK_IMPORTED_MODULE_7__.AssessmentFormComponent, _manage_assessments_manage_assessments_component__WEBPACK_IMPORTED_MODULE_8__.ManageAssessmentsComponent, _filter_pipe__WEBPACK_IMPORTED_MODULE_9__.FilterPipe, _create_course_create_course_component__WEBPACK_IMPORTED_MODULE_10__.CreateCourseComponent, _create_lesson_create_lesson_component__WEBPACK_IMPORTED_MODULE_11__.CreateLessonComponent, _courses_course_builder_course_builder_component__WEBPACK_IMPORTED_MODULE_12__.CourseBuilderComponent, _edit_course_edit_course_component__WEBPACK_IMPORTED_MODULE_13__.EditCourseComponent],
    imports: [_angular_common__WEBPACK_IMPORTED_MODULE_15__.CommonModule, _angular_forms__WEBPACK_IMPORTED_MODULE_16__.ReactiveFormsModule, _angular_forms__WEBPACK_IMPORTED_MODULE_16__.FormsModule, _back_office_routing_module__WEBPACK_IMPORTED_MODULE_3__.BackOfficeRoutingModule, _angular_router__WEBPACK_IMPORTED_MODULE_17__.RouterModule]
  });
})();

/***/ }),

/***/ 5160:
/*!********************************************************************************!*\
  !*** ./src/app/back-office/courses/course-builder/course-builder.component.ts ***!
  \********************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   CourseBuilderComponent: () => (/* binding */ CourseBuilderComponent)
/* harmony export */ });
/* harmony import */ var _angular_common_http__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/common/http */ 6443);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ 7580);
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/router */ 5072);
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/common */ 316);





function CourseBuilderComponent_div_12_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](0, "div", 9)(1, "span", 10);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](2, "!");
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](3, "div", 11);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](4);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]()();
  }
  if (rf & 2) {
    const ctx_r0 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](4);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtextInterpolate"](ctx_r0.error);
  }
}
function CourseBuilderComponent_div_13_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](0, "div", 12);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](1, "div", 13)(2, "div", 14)(3, "div", 14);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
  }
}
function CourseBuilderComponent_div_14_div_47_Template(rf, ctx) {
  if (rf & 1) {
    const _r6 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](0, "div", 40)(1, "div", 41);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](2, "\uD83D\uDCDA");
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](3, "div", 42);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](4, "No lessons yet");
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](5, "div", 43);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](6, "Click ");
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](7, "b");
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](8, "Add Lesson");
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](9, " to create your first lesson.");
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](10, "button", 5);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵlistener"]("click", function CourseBuilderComponent_div_14_div_47_Template_button_click_10_listener() {
      _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵrestoreView"](_r6);
      const ctx_r5 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnextContext"](2);
      return _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵresetView"](ctx_r5.goCreateLesson());
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](11, " + Create first lesson ");
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]()();
  }
}
function CourseBuilderComponent_div_14_div_48_div_1_span_8_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](0, "span", 55);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](1, "span", 56);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](2, " YouTube ");
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
  }
}
function CourseBuilderComponent_div_14_div_48_div_1_span_9_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](0, "span", 55);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](1, "span", 57);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](2, " PDF ");
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
  }
}
const _c0 = function (a1) {
  return ["/back-office/trainer/lessons", a1];
};
function CourseBuilderComponent_div_14_div_48_div_1_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](0, "div", 46)(1, "div", 47)(2, "div", 48);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](4, "div", 49)(5, "div", 50);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](6);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](7, "div", 51);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtemplate"](8, CourseBuilderComponent_div_14_div_48_div_1_span_8_Template, 3, 0, "span", 52);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtemplate"](9, CourseBuilderComponent_div_14_div_48_div_1_span_9_Template, 3, 0, "span", 52);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]()()();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](10, "div", 53)(11, "a", 54);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](12, " View ");
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]()()();
  }
  if (rf & 2) {
    const l_r8 = ctx.$implicit;
    const i_r9 = ctx.index;
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtextInterpolate"](i_r9 + 1);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtextInterpolate"](l_r8.title);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("ngIf", l_r8.youtubeVideoId);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("ngIf", l_r8.hasPdf);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("routerLink", _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵpureFunction1"](5, _c0, l_r8.id));
  }
}
function CourseBuilderComponent_div_14_div_48_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](0, "div", 44);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtemplate"](1, CourseBuilderComponent_div_14_div_48_div_1_Template, 13, 7, "div", 45);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const ctx_r4 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnextContext"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("ngForOf", ctx_r4.lessons);
  }
}
function CourseBuilderComponent_div_14_Template(rf, ctx) {
  if (rf & 1) {
    const _r13 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](0, "div", 15)(1, "section", 16)(2, "div", 17)(3, "img", 18);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵlistener"]("error", function CourseBuilderComponent_div_14_Template_img_error_3_listener($event) {
      _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵrestoreView"](_r13);
      const ctx_r12 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnextContext"]();
      return _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵresetView"](ctx_r12.onImageError($event));
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](4, "div", 19)(5, "span", 20);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](6);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]()()();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](7, "div", 21)(8, "h3", 22);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](9);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](10, "p", 23);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](11);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](12, "div", 24)(13, "div", 25)(14, "div", 26);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](15, "Price");
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](16, "div", 27);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](17);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](18, "span", 28);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](19, "DT");
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]()()();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](20, "div", 25)(21, "div", 26);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](22, "Duration");
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](23, "div", 27);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](24);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](25, "span", 28);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](26, "h");
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]()()();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](27, "div", 25)(28, "div", 26);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](29, "Lessons");
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](30, "div", 27);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](31);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]()()();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](32, "div", 29)(33, "button", 30);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵlistener"]("click", function CourseBuilderComponent_div_14_Template_button_click_33_listener() {
      _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵrestoreView"](_r13);
      const ctx_r14 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnextContext"]();
      return _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵresetView"](ctx_r14.goCreateLesson());
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](34, " + Add a lesson to this course ");
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](35, "div", 31);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](36, " Tip: keep lessons short and ordered (1, 2, 3\u2026). ");
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]()()()();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](37, "section", 32)(38, "div", 33)(39, "div", 34)(40, "h3");
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](41, "Lessons");
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](42, "p", 35);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](43, "Reorder and manage your content here.");
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]()();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](44, "div", 36)(45, "span", 37);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](46);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]()()();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtemplate"](47, CourseBuilderComponent_div_14_div_47_Template, 12, 0, "div", 38);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtemplate"](48, CourseBuilderComponent_div_14_div_48_Template, 2, 1, "div", 39);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]()();
  }
  if (rf & 2) {
    const ctx_r2 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("src", ctx_r2.course.imageUrl || "assets/images/course-placeholder.jpg", _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵsanitizeUrl"]);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵclassProp"]("cb-pill--pending", ctx_r2.course.archived)("cb-pill--active", !ctx_r2.course.archived);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtextInterpolate1"](" ", ctx_r2.course.archived ? "Pending validation" : "Active", " ");
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtextInterpolate"](ctx_r2.course.title);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtextInterpolate"](ctx_r2.course.description);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](6);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtextInterpolate1"]("", ctx_r2.course.price, " ");
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](7);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtextInterpolate1"]("", ctx_r2.course.durationHours, " ");
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](7);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtextInterpolate"](ctx_r2.lessons.length);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](15);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtextInterpolate"](ctx_r2.lessons.length);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("ngIf", ctx_r2.lessons.length === 0);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("ngIf", ctx_r2.lessons.length > 0);
  }
}
class CourseBuilderComponent {
  constructor(route, router, http) {
    this.route = route;
    this.router = router;
    this.http = http;
    this.loading = false;
    this.error = null;
    this.course = null;
    this.lessons = [];
    this.COURSE_API = '/api/instructor/courses'; // from your Course controller
    this.LESSONS_BY_COURSE_API = '/api/lesson/instructor/by-course';
  }
  ngOnInit() {
    this.courseId = Number(this.route.snapshot.paramMap.get('courseId'));
    if (!this.courseId || Number.isNaN(this.courseId)) {
      this.error = 'Missing courseId in route.';
      return;
    }
    this.loadAll();
  }
  authHeaders() {
    const token = localStorage.getItem('token');
    let headers = new _angular_common_http__WEBPACK_IMPORTED_MODULE_1__.HttpHeaders();
    if (token) headers = headers.set('Authorization', `Bearer ${token}`);
    return headers;
  }
  loadAll() {
    this.loading = true;
    this.error = null;
    // Load course details
    this.http.get(`${this.COURSE_API}/${this.courseId}`, {
      headers: this.authHeaders()
    }).subscribe({
      next: c => {
        this.course = c;
        // Load lessons after course loads
        this.http.get(`${this.LESSONS_BY_COURSE_API}/${this.courseId}`, {
          headers: this.authHeaders()
        }).subscribe({
          next: list => {
            this.lessons = Array.isArray(list) ? list : [];
            this.loading = false;
          },
          error: err => {
            this.loading = false;
            this.error = err?.error?.message || err?.message || 'Failed to load lessons.';
          }
        });
      },
      error: err => {
        this.loading = false;
        this.error = err?.error?.message || err?.message || 'Failed to load course.';
      }
    });
  }
  goCreateLesson() {
    this.router.navigate(['/back-office/trainer/courses', this.courseId, 'lessons', 'create']);
  }
  backToCourses() {
    this.router.navigate(['/back-office/trainer/manage-courses']);
  }
  onImageError(event) {
    event.target.src = 'assets/images/course-placeholder.jpg';
  }
  static {
    this.ɵfac = function CourseBuilderComponent_Factory(t) {
      return new (t || CourseBuilderComponent)(_angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdirectiveInject"](_angular_router__WEBPACK_IMPORTED_MODULE_2__.ActivatedRoute), _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdirectiveInject"](_angular_router__WEBPACK_IMPORTED_MODULE_2__.Router), _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdirectiveInject"](_angular_common_http__WEBPACK_IMPORTED_MODULE_1__.HttpClient));
    };
  }
  static {
    this.ɵcmp = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdefineComponent"]({
      type: CourseBuilderComponent,
      selectors: [["app-course-builder"]],
      decls: 15,
      vars: 3,
      consts: [[1, "cb"], [1, "cb-header"], [1, "cb-title"], [1, "cb-actions"], ["type", "button", 1, "cb-btn", "cb-btn--ghost", 3, "click"], ["type", "button", 1, "cb-btn", "cb-btn--primary", 3, "click"], ["class", "cb-alert cb-alert--error", 4, "ngIf"], ["class", "cb-skeleton", 4, "ngIf"], ["class", "cb-grid", 4, "ngIf"], [1, "cb-alert", "cb-alert--error"], [1, "cb-alert__icon"], [1, "cb-alert__text"], [1, "cb-skeleton"], [1, "cb-skel", "cb-skel--title"], [1, "cb-skel", "cb-skel--card"], [1, "cb-grid"], [1, "cb-card", "cb-card--course"], [1, "cb-courseCover"], ["alt", "Course cover", "loading", "lazy", 3, "src", "error"], [1, "cb-coverOverlay"], [1, "cb-pill"], [1, "cb-courseBody"], [1, "cb-courseTitle"], [1, "cb-courseDesc"], [1, "cb-metaGrid"], [1, "cb-meta"], [1, "cb-metaLabel"], [1, "cb-metaValue"], [1, "cb-metaUnit"], [1, "cb-courseFooter"], ["type", "button", 1, "cb-btn", "cb-btn--primary", "cb-btn--full", 3, "click"], [1, "cb-footNote"], [1, "cb-card", "cb-card--lessons"], [1, "cb-cardHead"], [1, "cb-cardHeadLeft"], [1, "cb-muted"], [1, "cb-cardHeadRight"], [1, "cb-count"], ["class", "cb-empty", 4, "ngIf"], ["class", "cb-list", 4, "ngIf"], [1, "cb-empty"], [1, "cb-emptyIcon"], [1, "cb-emptyTitle"], [1, "cb-emptyText"], [1, "cb-list"], ["class", "cb-row", 4, "ngFor", "ngForOf"], [1, "cb-row"], [1, "cb-rowLeft"], [1, "cb-index"], [1, "cb-rowMain"], [1, "cb-rowTitle"], [1, "cb-rowBadges"], ["class", "cb-badge", 4, "ngIf"], [1, "cb-rowRight"], [1, "cb-btn", "cb-btn--ghost", "cb-btn--sm", 3, "routerLink"], [1, "cb-badge"], [1, "cb-dot", "cb-dot--video"], [1, "cb-dot", "cb-dot--pdf"]],
      template: function CourseBuilderComponent_Template(rf, ctx) {
        if (rf & 1) {
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](0, "div", 0)(1, "header", 1)(2, "div", 2)(3, "h2");
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](4, "Course Builder");
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](5, "p");
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](6, "Manage course details and build lessons step-by-step.");
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]()();
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](7, "div", 3)(8, "button", 4);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵlistener"]("click", function CourseBuilderComponent_Template_button_click_8_listener() {
            return ctx.backToCourses();
          });
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](9, " \u2190 Back to Courses ");
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](10, "button", 5);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵlistener"]("click", function CourseBuilderComponent_Template_button_click_10_listener() {
            return ctx.goCreateLesson();
          });
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](11, " + Add Lesson ");
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]()()();
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtemplate"](12, CourseBuilderComponent_div_12_Template, 5, 1, "div", 6);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtemplate"](13, CourseBuilderComponent_div_13_Template, 4, 0, "div", 7);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtemplate"](14, CourseBuilderComponent_div_14_Template, 49, 14, "div", 8);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        }
        if (rf & 2) {
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](12);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("ngIf", ctx.error);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](1);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("ngIf", ctx.loading);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](1);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("ngIf", ctx.course && !ctx.loading);
        }
      },
      dependencies: [_angular_common__WEBPACK_IMPORTED_MODULE_3__.NgForOf, _angular_common__WEBPACK_IMPORTED_MODULE_3__.NgIf, _angular_router__WEBPACK_IMPORTED_MODULE_2__.RouterLink],
      styles: ["\n\n.cb[_ngcontent-%COMP%]{\n    max-width: 1180px;\n    margin: 0 auto;\n    padding: 28px 22px 56px;\n    font-family: system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif;\n    color: #0f172a;\n  }\n  \n  .cb-header[_ngcontent-%COMP%]{\n    display:flex;\n    align-items:flex-end;\n    justify-content:space-between;\n    gap:16px;\n    margin-bottom:18px;\n  }\n  \n  .cb-title[_ngcontent-%COMP%]   h2[_ngcontent-%COMP%]{\n    margin:0;\n    font-size: 38px;\n    letter-spacing: -0.02em;\n    line-height: 1.1;\n  }\n  \n  .cb-title[_ngcontent-%COMP%]   p[_ngcontent-%COMP%]{\n    margin:10px 0 0;\n    color:#64748b;\n    font-size: 15px;\n  }\n  \n  .cb-actions[_ngcontent-%COMP%]{\n    display:flex;\n    gap:10px;\n    align-items:center;\n  }\n  \n  .cb-btn[_ngcontent-%COMP%]{\n    border:1px solid transparent;\n    border-radius: 12px;\n    padding: 10px 14px;\n    font-weight: 650;\n    font-size: 14px;\n    cursor:pointer;\n    transition: transform .06s ease, box-shadow .12s ease, background .12s ease, border-color .12s ease;\n    -webkit-user-select:none;\n            user-select:none;\n    white-space: nowrap;\n  }\n  \n  .cb-btn[_ngcontent-%COMP%]:active{ transform: translateY(1px); }\n  \n  .cb-btn--primary[_ngcontent-%COMP%]{\n    background:#2563eb;\n    color:#fff;\n    box-shadow: 0 10px 18px rgba(37,99,235,.18);\n  }\n  \n  .cb-btn--primary[_ngcontent-%COMP%]:hover{\n    box-shadow: 0 14px 26px rgba(37,99,235,.24);\n  }\n  \n  .cb-btn--ghost[_ngcontent-%COMP%]{\n    background:#fff;\n    color:#0f172a;\n    border-color:#e2e8f0;\n  }\n  \n  .cb-btn--ghost[_ngcontent-%COMP%]:hover{\n    border-color:#cbd5e1;\n    box-shadow: 0 10px 20px rgba(15,23,42,.06);\n  }\n  \n  .cb-btn--sm[_ngcontent-%COMP%]{\n    padding: 8px 12px;\n    border-radius: 10px;\n    font-size: 13px;\n  }\n  \n  .cb-btn--full[_ngcontent-%COMP%]{\n    width:100%;\n    justify-content:center;\n  }\n  \n  .cb-alert[_ngcontent-%COMP%]{\n    display:flex;\n    align-items:flex-start;\n    gap:12px;\n    border-radius: 14px;\n    padding: 12px 14px;\n    margin: 14px 0 16px;\n    border:1px solid;\n  }\n  \n  .cb-alert__icon[_ngcontent-%COMP%]{\n    width: 22px;\n    height: 22px;\n    border-radius: 999px;\n    display:flex;\n    align-items:center;\n    justify-content:center;\n    font-weight: 900;\n    margin-top: 1px;\n  }\n  \n  .cb-alert--error[_ngcontent-%COMP%]{\n    background: #fff1f2;\n    border-color: #fecdd3;\n    color:#9f1239;\n  }\n  \n  .cb-alert--error[_ngcontent-%COMP%]   .cb-alert__icon[_ngcontent-%COMP%]{\n    background:#ffe4e6;\n    color:#9f1239;\n  }\n  \n  .cb-alert__text[_ngcontent-%COMP%]{\n    font-size: 14px;\n    line-height: 1.4;\n  }\n  \n  .cb-skeleton[_ngcontent-%COMP%]{ margin-top: 14px; }\n  .cb-skel[_ngcontent-%COMP%]{\n    background: linear-gradient(90deg, #eef2f7, #f7f9fc, #eef2f7);\n    background-size: 200% 100%;\n    animation: _ngcontent-%COMP%_cbShimmer 1.3s infinite linear;\n    border-radius: 16px;\n    border:1px solid #e2e8f0;\n    margin-bottom: 12px;\n  }\n  .cb-skel--title[_ngcontent-%COMP%]{ height: 22px; width: 260px; }\n  .cb-skel--card[_ngcontent-%COMP%]{ height: 220px; width: 100%; }\n  @keyframes _ngcontent-%COMP%_cbShimmer{\n    0%{ background-position: 200% 0; }\n    100%{ background-position: -200% 0; }\n  }\n  \n  .cb-grid[_ngcontent-%COMP%]{\n    display:grid;\n    grid-template-columns: 420px 1fr;\n    gap: 16px;\n    align-items:start;\n  }\n  \n  .cb-card[_ngcontent-%COMP%]{\n    background:#fff;\n    border:1px solid #e2e8f0;\n    border-radius: 18px;\n    box-shadow: 0 16px 34px rgba(15,23,42,.06);\n    overflow:hidden;\n  }\n  \n  .cb-card--course[_ngcontent-%COMP%]{ position: sticky; top: 18px; }\n  \n  .cb-courseCover[_ngcontent-%COMP%]{\n    position:relative;\n    height: 210px;\n    background: #f1f5f9;\n    border-bottom:1px solid #e2e8f0;\n  }\n  \n  .cb-courseCover[_ngcontent-%COMP%]   img[_ngcontent-%COMP%]{\n    width:100%;\n    height:100%;\n    object-fit: cover;\n    display:block;\n  }\n  \n  .cb-coverOverlay[_ngcontent-%COMP%]{\n    position:absolute;\n    inset: 0;\n    display:flex;\n    justify-content:flex-end;\n    padding: 12px;\n    pointer-events:none;\n  }\n  \n  .cb-pill[_ngcontent-%COMP%]{\n    display:inline-flex;\n    align-items:center;\n    gap:8px;\n    padding: 8px 10px;\n    border-radius: 999px;\n    font-size: 12px;\n    font-weight: 800;\n    letter-spacing: .02em;\n    border:1px solid transparent;\n    background: rgba(255,255,255,.88);\n    color:#0f172a;\n  }\n  \n  .cb-pill--pending[_ngcontent-%COMP%]{\n    border-color:#fed7aa;\n    color:#9a3412;\n    background: rgba(255,247,237,.92);\n  }\n  \n  .cb-pill--active[_ngcontent-%COMP%]{\n    border-color:#bbf7d0;\n    color:#166534;\n    background: rgba(240,253,244,.92);\n  }\n  \n  .cb-courseBody[_ngcontent-%COMP%]{\n    padding: 16px 16px 18px;\n  }\n  \n  .cb-courseTitle[_ngcontent-%COMP%]{\n    margin: 0;\n    font-size: 22px;\n    letter-spacing: -0.02em;\n  }\n  \n  .cb-courseDesc[_ngcontent-%COMP%]{\n    margin: 10px 0 14px;\n    color:#475569;\n    font-size: 14px;\n    line-height: 1.55;\n    max-height: 90px;\n    overflow: hidden;\n  }\n  \n  .cb-metaGrid[_ngcontent-%COMP%]{\n    display:grid;\n    grid-template-columns: repeat(3, 1fr);\n    gap: 10px;\n  }\n  \n  .cb-meta[_ngcontent-%COMP%]{\n    border:1px solid #e2e8f0;\n    background:#f8fafc;\n    border-radius: 14px;\n    padding: 10px 10px;\n  }\n  \n  .cb-metaLabel[_ngcontent-%COMP%]{\n    font-size: 12px;\n    color:#64748b;\n    font-weight: 700;\n    margin-bottom: 4px;\n  }\n  \n  .cb-metaValue[_ngcontent-%COMP%]{\n    font-size: 16px;\n    font-weight: 900;\n    color:#0f172a;\n  }\n  \n  .cb-metaUnit[_ngcontent-%COMP%]{\n    font-size: 12px;\n    color:#64748b;\n    font-weight: 800;\n    margin-left: 2px;\n  }\n  \n  .cb-courseFooter[_ngcontent-%COMP%]{\n    margin-top: 14px;\n    display:flex;\n    flex-direction:column;\n    gap: 10px;\n  }\n  \n  .cb-footNote[_ngcontent-%COMP%]{\n    font-size: 12px;\n    color:#94a3b8;\n    text-align:center;\n  }\n  \n  .cb-cardHead[_ngcontent-%COMP%]{\n    display:flex;\n    justify-content:space-between;\n    align-items:flex-start;\n    gap: 12px;\n    padding: 16px 16px 12px;\n    border-bottom:1px solid #e2e8f0;\n  }\n  \n  .cb-cardHead[_ngcontent-%COMP%]   h3[_ngcontent-%COMP%]{\n    margin:0;\n    font-size: 20px;\n    letter-spacing:-0.02em;\n  }\n  \n  .cb-muted[_ngcontent-%COMP%]{\n    margin: 6px 0 0;\n    color:#64748b;\n    font-size: 13px;\n  }\n  \n  .cb-count[_ngcontent-%COMP%]{\n    min-width: 34px;\n    height: 34px;\n    border-radius: 12px;\n    display:flex;\n    align-items:center;\n    justify-content:center;\n    font-weight: 900;\n    background:#f1f5f9;\n    border:1px solid #e2e8f0;\n    color:#0f172a;\n  }\n  \n  .cb-empty[_ngcontent-%COMP%]{\n    padding: 26px 16px 20px;\n    display:flex;\n    flex-direction:column;\n    align-items:center;\n    text-align:center;\n    gap: 10px;\n  }\n  \n  .cb-emptyIcon[_ngcontent-%COMP%]{\n    font-size: 34px;\n  }\n  \n  .cb-emptyTitle[_ngcontent-%COMP%]{\n    font-size: 18px;\n    font-weight: 900;\n  }\n  \n  .cb-emptyText[_ngcontent-%COMP%]{\n    color:#64748b;\n    font-size: 14px;\n    max-width: 420px;\n  }\n  \n  .cb-list[_ngcontent-%COMP%]{\n    padding: 10px 12px 14px;\n    display:flex;\n    flex-direction:column;\n    gap: 10px;\n  }\n  \n  .cb-row[_ngcontent-%COMP%]{\n    display:flex;\n    align-items:center;\n    justify-content:space-between;\n    gap: 12px;\n    padding: 12px 12px;\n    border:1px solid #e2e8f0;\n    background:#fff;\n    border-radius: 14px;\n    transition: box-shadow .12s ease, border-color .12s ease, transform .06s ease;\n  }\n  \n  .cb-row[_ngcontent-%COMP%]:hover{\n    border-color:#cbd5e1;\n    box-shadow: 0 14px 26px rgba(15,23,42,.08);\n  }\n  \n  .cb-rowLeft[_ngcontent-%COMP%]{\n    display:flex;\n    align-items:center;\n    gap: 12px;\n    min-width: 0;\n  }\n  \n  .cb-index[_ngcontent-%COMP%]{\n    width: 34px;\n    height: 34px;\n    border-radius: 12px;\n    display:flex;\n    align-items:center;\n    justify-content:center;\n    background:#f8fafc;\n    border:1px solid #e2e8f0;\n    font-weight: 900;\n    color:#0f172a;\n    flex: 0 0 auto;\n  }\n  \n  .cb-rowMain[_ngcontent-%COMP%]{ min-width:0; }\n  \n  .cb-rowTitle[_ngcontent-%COMP%]{\n    font-weight: 900;\n    font-size: 14px;\n    color:#0f172a;\n    white-space: nowrap;\n    overflow: hidden;\n    text-overflow: ellipsis;\n    max-width: 520px;\n  }\n  \n  .cb-rowBadges[_ngcontent-%COMP%]{\n    display:flex;\n    gap: 8px;\n    margin-top: 6px;\n    flex-wrap: wrap;\n  }\n  \n  .cb-badge[_ngcontent-%COMP%]{\n    display:inline-flex;\n    align-items:center;\n    gap: 8px;\n    font-size: 12px;\n    font-weight: 800;\n    padding: 6px 10px;\n    border-radius: 999px;\n    background:#f8fafc;\n    border:1px solid #e2e8f0;\n    color:#334155;\n  }\n  \n  .cb-dot[_ngcontent-%COMP%]{\n    width: 8px;\n    height: 8px;\n    border-radius: 999px;\n  }\n  \n  .cb-dot--video[_ngcontent-%COMP%]{ background:#2563eb; }\n  .cb-dot--pdf[_ngcontent-%COMP%]{ background:#16a34a; }\n  \n  .cb-rowRight[_ngcontent-%COMP%]{\n    display:flex;\n    gap: 8px;\n    align-items:center;\n    flex: 0 0 auto;\n  }\n  \n  .cb-iconBtn[_ngcontent-%COMP%]{\n    width: 36px;\n    height: 36px;\n    border-radius: 12px;\n    border:1px solid #e2e8f0;\n    background:#fff;\n    cursor:pointer;\n  }\n  \n  .cb-iconBtn--danger[_ngcontent-%COMP%]{\n    border-color:#fecdd3;\n    background:#fff1f2;\n  }\n  \n  @media (max-width: 1100px){\n    .cb-grid[_ngcontent-%COMP%]{ grid-template-columns: 1fr; }\n    .cb-card--course[_ngcontent-%COMP%]{ position: static; }\n    .cb-rowTitle[_ngcontent-%COMP%]{ max-width: 360px; }\n  }\n  \n  @media (max-width: 620px){\n    .cb-header[_ngcontent-%COMP%]{ flex-direction: column; align-items:flex-start; }\n    .cb-actions[_ngcontent-%COMP%]{ width:100%; }\n    .cb-btn[_ngcontent-%COMP%]{ width:100%; justify-content:center; }\n    .cb-metaGrid[_ngcontent-%COMP%]{ grid-template-columns: 1fr; }\n  }\n/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8uL3NyYy9hcHAvYmFjay1vZmZpY2UvY291cnNlcy9jb3Vyc2UtYnVpbGRlci9jb3Vyc2UtYnVpbGRlci5jb21wb25lbnQuY3NzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLGlDQUFpQztBQUNqQztJQUNJLGlCQUFpQjtJQUNqQixjQUFjO0lBQ2QsdUJBQXVCO0lBQ3ZCLDBFQUEwRTtJQUMxRSxjQUFjO0VBQ2hCOztFQUVBO0lBQ0UsWUFBWTtJQUNaLG9CQUFvQjtJQUNwQiw2QkFBNkI7SUFDN0IsUUFBUTtJQUNSLGtCQUFrQjtFQUNwQjs7RUFFQTtJQUNFLFFBQVE7SUFDUixlQUFlO0lBQ2YsdUJBQXVCO0lBQ3ZCLGdCQUFnQjtFQUNsQjs7RUFFQTtJQUNFLGVBQWU7SUFDZixhQUFhO0lBQ2IsZUFBZTtFQUNqQjs7RUFFQTtJQUNFLFlBQVk7SUFDWixRQUFRO0lBQ1Isa0JBQWtCO0VBQ3BCOztFQUVBO0lBQ0UsNEJBQTRCO0lBQzVCLG1CQUFtQjtJQUNuQixrQkFBa0I7SUFDbEIsZ0JBQWdCO0lBQ2hCLGVBQWU7SUFDZixjQUFjO0lBQ2QsbUdBQW1HO0lBQ25HLHdCQUFnQjtZQUFoQixnQkFBZ0I7SUFDaEIsbUJBQW1CO0VBQ3JCOztFQUVBLGdCQUFnQiwwQkFBMEIsRUFBRTs7RUFFNUM7SUFDRSxrQkFBa0I7SUFDbEIsVUFBVTtJQUNWLDJDQUEyQztFQUM3Qzs7RUFFQTtJQUNFLDJDQUEyQztFQUM3Qzs7RUFFQTtJQUNFLGVBQWU7SUFDZixhQUFhO0lBQ2Isb0JBQW9CO0VBQ3RCOztFQUVBO0lBQ0Usb0JBQW9CO0lBQ3BCLDBDQUEwQztFQUM1Qzs7RUFFQTtJQUNFLGlCQUFpQjtJQUNqQixtQkFBbUI7SUFDbkIsZUFBZTtFQUNqQjs7RUFFQTtJQUNFLFVBQVU7SUFDVixzQkFBc0I7RUFDeEI7O0VBRUE7SUFDRSxZQUFZO0lBQ1osc0JBQXNCO0lBQ3RCLFFBQVE7SUFDUixtQkFBbUI7SUFDbkIsa0JBQWtCO0lBQ2xCLG1CQUFt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Q2YsZ0JBQWdCO0lBQ2hCLGlCQUFpQjtJQUNqQixvQkFBb0I7SUFDcEIsa0JBQWtCO0lBQ2xCLHdCQUF3QjtJQUN4QixhQUFhO0VBQ2Y7O0VBRUE7SUFDRSxVQUFVO0lBQ1YsV0FBVztJQUNYLG9CQUFvQjtFQUN0Qjs7RUFFQSxnQkFBZ0Isa0JBQWtCLEVBQUU7RUFDcEMsY0FBYyxrQkFBa0IsRUFBRTs7RUFFbEM7SUFDRSxZQUFZO0lBQ1osUUFBUTtJQUNSLGtCQUFrQjtJQUNsQixjQUFjO0VBQ2hCOztFQUVBO0lBQ0UsV0FBVztJQUNYLFlBQVk7SUFDWixtQkFBbUI7SUFDbkIsd0JBQXdCO0lBQ3hCLGVBQWU7SUFDZixjQUFjO0VBQ2hCOztFQUVBO0lBQ0Usb0JBQW9CO0lBQ3BCLGtCQUFrQjtFQUNwQjs7RUFFQTtJQUNFLFVBQVUsMEJBQTBCLEVBQUU7SUFDdEMsa0JBQWtCLGdCQUFnQixFQUFFO0lBQ3BDLGNBQWMsZ0JBQWdCLEVBQUU7RUFDbEM7O0VBRUE7SUFDRSxZQUFZLHNCQUFzQixFQUFFLHNCQUFzQixFQUFFO0lBQzVELGFBQWEsVUFBVSxFQUFFO0lBQ3pCLFNBQVMsVUFBVSxFQUFFLHNCQUFzQixFQUFFO0lBQzdDLGNBQWMsMEJBQTBCLEVBQUU7RUFDNUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKiBjb3Vyc2UtYnVpbGRlci5jb21wb25lbnQuY3NzICovXHJcbi5jYntcclxuICAgIG1heC13aWR0aDogMTE4MHB4O1xyXG4gICAgbWFyZ2luOiAwIGF1dG87XHJcbiAgICBwYWRkaW5nOiAyOHB4IDIycHggNTZweDtcclxuICAgIGZvbnQtZmFtaWx5OiBzeXN0ZW0tdWksIC1hcHBsZS1zeXN0ZW0sIFNlZ29lIFVJLCBSb2JvdG8sIEFyaWFsLCBzYW5zLXNlcmlmO1xyXG4gICAgY29sb3I6ICMwZjE3MmE7XHJcbiAgfVxyXG4gIFxyXG4gIC5jYi1oZWFkZXJ7XHJcbiAgICBkaXNwbGF5OmZsZXg7XHJcbiAgICBhbGlnbi1pdGVtczpmbGV4LWVuZDtcclxuICAgIGp1c3RpZnktY29udGVudDpzcGFjZS1iZXR3ZWVuO1xyXG4gICAgZ2FwOjE2cHg7XHJcbiAgICBtYXJnaW4tYm90dG9tOjE4cHg7XHJcbiAgfVxyXG4gIFxyXG4gIC5jYi10aXRsZSBoMntcclxuICAgIG1hcmdpbjowO1xyXG4gICAgZm9udC1zaXplOiAzOHB4O1xyXG4gICAgbGV0dGVyLXNwYWNpbmc6IC0wLjAyZW07XHJcbiAgICBsaW5lLWhlaWdodDogMS4xO1xyXG4gIH1cclxuICBcclxuICAuY2ItdGl0bGUgcHtcclxuICAgIG1hcmdpbjoxMHB4IDAgMDtcclxuICAgIGNvbG9yOiM2NDc0OGI7XHJcbiAgICBmb250LXNpemU6IDE1cHg7XHJcbiAgfVxyXG4gIFxyXG4gIC5jYi1hY3Rpb25ze1xyXG4gICAgZGlzcGxheTpmbGV4O1xyXG4gICAgZ2FwOjEwcHg7XHJcbiAgICBhbGlnbi1pdGVtczpjZW50ZXI7XHJcbiAgfVxyXG4gIFxyXG4gIC5jYi1idG57XHJcbiAgICBib3JkZXI6MXB4IHNvbGlkIHRyYW5zcGFyZW50O1xyXG4gICAgYm9yZGVyLXJhZGl1czogMTJweDtcclxuICAgIHBhZGRpbmc6IDEwcHggMTRweDtcclxuICAgIGZvbnQtd2VpZ2h0OiA2NTA7XHJcbiAgICBmb250LXNpemU6IDE0cHg7XHJcbiAgICBjdXJzb3I6cG9pbnRlcjtcclxuICAgIHRyYW5zaXRpb246IHRyYW5zZm9ybSAuMDZzIGVhc2UsIGJveC1zaGFkb3cgLjEycyBlYXNlLCBiYWNrZ3JvdW5kIC4xMnMgZWFzZSwgYm9yZGVyLWNvbG9yIC4xMnMgZWFzZTtcclxuICAgIHVzZXItc2VsZWN0Om5vbmU7XHJcbiAgICB3aGl0ZS1zcGFjZTogbm93cmFwO1xyXG4gIH1cclxuICBcclxuICAuY2ItYnRuOmFjdGl2ZXsgdHJhbnNmb3JtOiB0cmFuc2xhdGVZKDFweCk7IH1cclxuICBcclxuICAuY2ItYnRuLS1wcmltYXJ5e1xyXG4gICAgYmFja2dyb3VuZDojMjU2M2ViO1xyXG4gICAgY29sb3I6I2ZmZjtcclxuICAgIGJveC1zaGFkb3c6IDAgMTBweCAxOHB4IHJnYmEoMzcsOTksMjM1LC4xOCk7XHJcbiAgfVxyXG4gIFxyXG4gIC5jYi1idG4tLXByaW1hcnk6aG92ZXJ7XHJcbiAgICBib3gtc2hhZG93OiAwIDE0cHggMjZweCByZ2JhKDM3LDk5LDIzNSwuMjQpO1xyXG4gIH1cclxuICBcclxuICAuY2ItYnRuLS1naG9zdHtcclxuICAgIGJhY2tncm91bmQ6I2ZmZjtcclxuICAgIGNvbG9yOiMwZjE3MmE7XHJcbiAgICBib3JkZXItY29sb3I6I2UyZThmMDtcclxuICB9XHJcbiAgXHJcbiAgLmNiLWJ0bi0tZ2hvc3Q6aG92ZXJ7XHJcbiAgICBib3JkZXItY29sb3I6I2NiZDVlMTtcclxuICAgIGJveC1zaGFkb3c6IDAgMTBweCAyMHB4IHJnYmEoMTUsMjMsNDIsLjA2KTtcclxuICB9XHJcbiAgXHJcbiAgLmNiLWJ0bi0tc217XHJcbiAgICBwYWRkaW5nOiA4cHggMTJweDtcclxuICAgIGJvcmRlci1yYWRpdXM6IDEwcHg7XHJcbiAgICBmb250LXNpemU6IDEzcHg7XHJcbiAgfVxyXG4gIFxyXG4gIC5jYi1idG4tLWZ1bGx7XHJcbiAgICB3aWR0aDoxMDAlO1xyXG4gICAganVzdGlmeS1jb250ZW50OmNlbnRlcjtcclxuICB9XHJcbiAgXHJcbiAgLmNiLWFsZXJ0e1xyXG4gICAgZGlzcGxheTpmbGV4O1xyXG4gICAgYWxpZ24taXRlbXM6ZmxleC1zdGFydDtcclxuICAgIGdhcDoxMnB4O1xyXG4gICAgYm9yZGVyLXJhZGl1czogMTRweDtcclxuICAgIHBhZGRpbmc6IDEycHggMTRweDtcclxuICAgIG1hcmdpbjogMTRweCAwIDE2cHg7XHJcbiAgICBib3JkZXI6MXB4IHNvbGlkO1xyXG4gIH1cclxuICBcclxuICAuY2ItYWxlcnRfX2ljb257XHJcbiAgICB3aWR0aDogMjJweDtcclxuICAgIGhlaWdodDogMjJweDtcclxuICAgIGJvcmRlci1yYWRpdXM6IDk5OXB4O1xyXG4gICAgZGlzcGxheTpmbGV4O1xyXG4gICAgYWxpZ24taXRlbXM6Y2VudGVyO1xyXG4gICAganVzdGlmeS1jb250ZW50OmNlbnRlcjtcclxuICAgIGZvbnQtd2VpZ2h0OiA5MDA7XHJcbiAgICBtYXJnaW4tdG9wOiAxcHg7XHJcbiAgfVxyXG4gIFxyXG4gIC5jYi1hbGVydC0tZXJyb3J7XHJcbiAgICBiYWNrZ3JvdW5kOiAjZmZmMWYyO1xyXG4gICAgYm9yZGVyLWNvbG9yOiAjZmVjZGQzO1xyXG4gICAgY29sb3I6IzlmMTIzOTtcclxuICB9XHJcbiAgXHJcbiAgLmNiLWFsZXJ0LS1lcnJvciAuY2ItYWxlcnRfX2ljb257XHJcbiAgICBiYWNrZ3JvdW5kOiNmZmU0ZTY7XHJcbiAgICBjb2xvcjojOWYxMjM5O1xyXG4gIH1cclxuICBcclxuICAuY2ItYWxlcnRfX3RleHR7XHJcbiAgICBmb250LXNpemU6IDE0cHg7XHJcbiAgICBsaW5lLWhlaWdodDogMS40O1xyXG4gIH1cclxuICBcclxuICAuY2Itc2tlbGV0b257IG1hcmdpbi10b3A6IDE0cHg7IH1cclxuICAuY2Itc2tlbHtcclxuICAgIGJhY2tncm91bmQ6IGxpbmVhci1ncmFkaWVudCg5MGRlZywgI2VlZjJmNywgI2Y3ZjlmYywgI2VlZjJmNyk7XHJcbiAgICBiYWNrZ3JvdW5kLXNpemU6IDIwMCUgMTAwJTtcclxuICAgIGFuaW1hdGlvbjogY2JTaGltbWVyIDEuM3MgaW5maW5pdGUgbGluZWFyO1xyXG4gICAgYm9yZGVyLXJhZGl1czogMTZweDtcclxuICAgIGJvcmRlcjoxcHggc29saWQgI2UyZThmMDtcclxuICAgIG1hcmdpbi1ib3R0b206IDEycHg7XHJcbiAgfVxyXG4gIC5jYi1za2VsLS10aXRsZXsgaGVpZ2h0OiAyMnB4OyB3aWR0aDogMjYwcHg7IH1cclxuICAuY2Itc2tlbC0tY2FyZHsgaGVpZ2h0OiAyMjBweDsgd2lkdGg6IDEwMCU7IH1cclxuICBAa2V5ZnJhbWVzIGNiU2hpbW1lcntcclxuICAgIDAleyBiYWNrZ3JvdW5kLXBvc2l0aW9uOiAyMDAlIDA7IH1cclxuICAgIDEwMCV7IGJhY2tncm91bmQtcG9zaXRpb246IC0yMDAlIDA7IH1cclxuICB9XHJcbiAgXHJcbiAgLmNiLWdyaWR7XHJcbiAgICBkaXNwbGF5OmdyaWQ7XHJcbiAgICBncmlkLXRlbXBsYXRlLWNvbHVtbnM6IDQyMHB4IDFmcjtcclxuICAgIGdhcDogMTZweDtcclxuICAgIGFsaWduLWl0ZW1zOnN0YXJ0O1xyXG4gIH1cclxuICBcclxuICAuY2ItY2FyZHtcclxuICAgIGJhY2tncm91bmQ6I2ZmZjtcclxuICAgIGJvcmRlcjoxcHggc29saWQgI2UyZThmMDtcclxuICAgIGJvcmRlci1yYWRpdXM6IDE4cHg7XHJcbiAgICBib3gtc2hhZG93OiAwIDE2cHggMzRweCByZ2JhKDE1LDIzLDQyLC4wNik7XHJcbiAgICBvdmVyZmxvdzpoaWRkZW47XHJcbiAgfVxyXG4gIFxyXG4gIC5jYi1jYXJkLS1jb3Vyc2V7IHBvc2l0aW9uOiBzdGlja3k7IHRvcDogMThweDsgfVxyXG4gIFxyXG4gIC5jYi1jb3Vyc2VDb3ZlcntcclxuICAgIHBvc2l0aW9uOnJlbGF0aXZlO1xyXG4gICAgaGVpZ2h0OiAyMTBweDtcclxuICAgIGJhY2tncm91bmQ6ICNmMWY1Zjk7XHJcbiAgICBib3JkZXItYm90dG9tOjFweCBzb2xpZCAjZTJlOGYwO1xyXG4gIH1cclxuICBcclxuICAuY2ItY291cnNlQ292ZXIgaW1ne1xyXG4gICAgd2lkdGg6MTAwJTtcclxuICAgIGhlaWdodDoxMDAlO1xyXG4gICAgb2JqZWN0LWZpdDogY292ZXI7XHJcbiAgICBkaXNwbGF5OmJsb2NrO1xyXG4gIH1cclxuICBcclxuICAuY2ItY292ZXJPdmVybGF5e1xyXG4gICAgcG9zaXRpb246YWJzb2x1dGU7XHJcbiAgICBpbnNldDogMDtcclxuICAgIGRpc3BsYXk6ZmxleDtcclxuICAgIGp1c3RpZnktY29udGVudDpmbGV4LWVuZDtcclxuICAgIHBhZGRpbmc6IDEycHg7XHJcbiAgICBwb2ludGVyLWV2ZW50czpub25lO1xyXG4gIH1cclxuICBcclxuICAuY2ItcGlsbHtcclxuICAgIGRpc3BsYXk6aW5saW5lLWZsZXg7XHJcbiAgICBhbGlnbi1pdGVtczpjZW50ZXI7XHJcbiAgICBnYXA6OHB4O1xyXG4gICAgcGFkZGluZzogOHB4IDEwcHg7XHJcbiAgICBib3JkZXItcmFkaXVzOiA5OTlweDtcclxuICAgIGZvbnQtc2l6ZTogMTJweDtcclxuICAgIGZvbnQtd2VpZ2h0OiA4MDA7XHJcbiAgICBsZXR0ZXItc3BhY2luZzogLjAyZW07XHJcbiAgICBib3JkZXI6MXB4IHNvbGlkIHRyYW5zcGFyZW50O1xyXG4gICAgYmFja2dyb3VuZDogcmdiYSgyNTUsMjU1LDI1NSwuODgpO1xyXG4gICAgY29sb3I6IzBmMTcyYTtcclxuICB9XHJcbiAgXHJcbiAgLmNiLXBpbGwtLXBlbmRpbmd7XHJcbiAgICBib3JkZXItY29sb3I6I2ZlZDdhYTtcclxuICAgIGNvbG9yOiM5YTM0MTI7XHJcbiAgICBiYWNrZ3JvdW5kOiByZ2JhKDI1NSwyNDcsMjM3LC45Mik7XHJcbiAgfVxyXG4gIFxyXG4gIC5jYi1waWxsLS1hY3RpdmV7XHJcbiAgICBib3JkZXItY29sb3I6I2JiZjdkMDtcclxuICAgIGNvbG9yOiMxNjY1MzQ7XHJcbiAgICBiYWNrZ3JvdW5kOiByZ2JhKDI0MCwyNTMsMjQ0LC45Mik7XHJcbiAgfVxyXG4gIFxyXG4gIC5jYi1jb3Vyc2VCb2R5e1xyXG4gICAgcGFkZGluZzogMTZweCAxNnB4IDE4cHg7XHJcbiAgfVxyXG4gIFxyXG4gIC5jYi1jb3Vyc2VUaXRsZXtcclxuICAgIG1hcmdpbjogMDtcclxuICAgIGZvbnQtc2l6ZTogMjJweDtcclxuICAgIGxldHRlci1zcGFjaW5nOiAtMC4wMmVtO1xyXG4gIH1cclxuICBcclxuICAuY2ItY291cnNlRGVzY3tcclxuICAgIG1hcmdpbjogMTBweCAwIDE0cHg7XHJcbiAgICBjb2xvcjojNDc1NTY5O1xyXG4gICAgZm9udC1zaXplOiAxNHB4O1xyXG4gICAgbGluZS1oZWlnaHQ6IDEuNTU7XHJcbiAgICBtYXgtaGVpZ2h0OiA5MHB4O1xyXG4gICAgb3ZlcmZsb3c6IGhpZGRlbjtcclxuICB9XHJcbiAgXHJcbiAgLmNiLW1ldGFHcmlke1xyXG4gICAgZGlzcGxheTpncmlkO1xyXG4gICAgZ3JpZC10ZW1wbGF0ZS1jb2x1bW5zOiByZXBlYXQoMywgMWZyKTtcclxuICAgIGdhcDogMTBweDtcclxuICB9XHJcbiAgXHJcbiAgLmNiLW1ldGF7XHJcbiAgICBib3JkZXI6MXB4IHNvbGlkICNlMmU4ZjA7XHJcbiAgICBiYWNrZ3JvdW5kOiNmOGZhZmM7XHJcbiAgICBib3JkZXItcmFkaXVzOiAxNHB4O1xyXG4gICAgcGFkZGluZzogMTBweCAxMHB4O1xyXG4gIH1cclxuICBcclxuICAuY2ItbWV0YUxhYmVse1xyXG4gICAgZm9udC1zaXplOiAxMnB4O1xyXG4gICAgY29sb3I6IzY0NzQ4YjtcclxuICAgIGZvbnQtd2VpZ2h0OiA3MDA7XHJcbiAgICBtYXJnaW4tYm90dG9tOiA0cHg7XHJcbiAgfVxyXG4gIFxyXG4gIC5jYi1tZXRhVmFsdWV7XHJcbiAgICBmb250LXNpemU6IDE2cHg7XHJcbiAgICBmb250LXdlaWdodDogOTAwO1xyXG4gICAgY29sb3I6IzBmMTcyYTtcclxuICB9XHJcbiAgXHJcbiAgLmNiLW1ldGFVbml0e1xyXG4gICAgZm9udC1zaXplOiAxMnB4O1xyXG4gICAgY29sb3I6IzY0NzQ4YjtcclxuICAgIGZvbnQtd2VpZ2h0OiA4MDA7XHJcbiAgICBtYXJnaW4tbGVmdDogMnB4O1xyXG4gIH1cclxuICBcclxuICAuY2ItY291cnNlRm9vdGVye1xyXG4gICAgbWFyZ2luLXRvcDogMTRweDtcclxuICAgIGRpc3BsYXk6ZmxleDtcclxuICAgIGZsZXgtZGlyZWN0aW9uOmNvbHVtbjtcclxuICAgIGdhcDogMTBweDtcclxuICB9XHJcbiAgXHJcbiAgLmNiLWZvb3ROb3Rle1xyXG4gICAgZm9udC1zaXplOiAxMnB4O1xyXG4gICAgY29sb3I6Izk0YTNiODtcclxuICAgIHRleHQtYWxpZ246Y2VudGVyO1xyXG4gIH1cclxuICBcclxuICAuY2ItY2FyZEhlYWR7XHJcbiAgICBkaXNwbGF5OmZsZXg7XHJcbiAgICBqdXN0aWZ5LWNvbnRlbnQ6c3BhY2UtYmV0d2VlbjtcclxuICAgIGFsaWduLWl0ZW1zOmZsZXgtc3RhcnQ7XHJcbiAgICBnYXA6IDEycHg7XHJcbiAgICBwYWRkaW5nOiAxNnB4IDE2cHggMTJweDtcclxuICAgIGJvcmRlci1ib3R0b206MXB4IHNvbGlkICNlMmU4ZjA7XHJcbiAgfVxyXG4gIFxyXG4gIC5jYi1jYXJkSGVhZCBoM3tcclxuICAgIG1hcmdpbjowO1xyXG4gICAgZm9udC1zaXplOiAyMHB4O1xyXG4gICAgbGV0dGVyLXNwYWNpbmc6LTAuMDJlbTtcclxuICB9XHJcbiAgXHJcbiAgLmNiLW11dGVke1xyXG4gICAgbWFyZ2luOiA2cHggMCAwO1xyXG4gICAgY29sb3I6IzY0NzQ4YjtcclxuICAgIGZvbnQtc2l6ZTogMTNweDtcclxuICB9XHJcbiAgXHJcbiAgLmNiLWNvdW50e1xyXG4gICAgbWluLXdpZHRoOiAzNHB4O1xyXG4gICAgaGVpZ2h0OiAzNHB4O1xyXG4gICAgYm9yZGVyLXJhZGl1czogMTJweDtcclxuICAgIGRpc3BsYXk6ZmxleDtcclxuICAgIGFsaWduLWl0ZW1zOmNlbnRlcjtcclxuICAgIGp1c3RpZnktY29udGVudDpjZW50ZXI7XHJcbiAgICBmb250LXdlaWdodDogOTAwO1xyXG4gICAgYmFja2dyb3VuZDojZjFmNWY5O1xyXG4gICAgYm9yZGVyOjFweCBzb2xpZCAjZTJlOGYwO1xyXG4gICAgY29sb3I6IzBmMTcyYTtcclxuICB9XHJcbiAgXHJcbiAgLmNiLWVtcHR5e1xyXG4gICAgcGFkZGluZzogMjZweCAxNnB4IDIwcHg7XHJcbiAgICBkaXNwbGF5OmZsZXg7XHJcbiAgICBmbGV4LWRpcmVjdGlvbjpjb2x1bW47XHJcbiAgICBhbGlnbi1pdGVtczpjZW50ZXI7XHJcbiAgICB0ZXh0LWFsaWduOmNlbnRlcjtcclxuICAgIGdhcDogMTBweDtcclxuICB9XHJcbiAgXHJcbiAgLmNiLWVtcHR5SWNvbntcclxuICAgIGZvbnQtc2l6ZTogMzRweDtcclxuICB9XHJcbiAgXHJcbiAgLmNiLWVtcHR5VGl0bGV7XHJcbiAgICBmb250LXNpemU6IDE4cHg7XHJcbiAgICBmb250LXdlaWdodDogOTAwO1xyXG4gIH1cclxuICBcclxuICAuY2ItZW1wdHlUZXh0e1xyXG4gICAgY29sb3I6IzY0NzQ4YjtcclxuICAgIGZvbnQtc2l6ZTogMTRweDtcclxuICAgIG1heC13aWR0aDogNDIwcHg7XHJcbiAgfVxyXG4gIFxyXG4gIC5jYi1saXN0e1xyXG4gICAgcGFkZGluZzogMTBweCAxMnB4IDE0cHg7XHJcbiAgICBkaXNwbGF5OmZsZXg7XHJcbiAgICBmbGV4LWRpcmVjdGlvbjpjb2x1bW47XHJcbiAgICBnYXA6IDEwcHg7XHJcbiAgfVxyXG4gIFxyXG4gIC5jYi1yb3d7XHJcbiAgICBkaXNwbGF5OmZsZXg7XHJcbiAgICBhbGlnbi1pdGVtczpjZW50ZXI7XHJcbiAgICBqdXN0aWZ5LWNvbnRlbnQ6c3BhY2UtYmV0d2VlbjtcclxuICAgIGdhcDogMTJweDtcclxuICAgIHBhZGRpbmc6IDEycHggMTJweDtcclxuICAgIGJvcmRlcjoxcHggc29saWQgI2UyZThmMDtcclxuICAgIGJhY2tncm91bmQ6I2ZmZjtcclxuICAgIGJvcmRlci1yYWRpdXM6IDE0cHg7XHJcbiAgICB0cmFuc2l0aW9uOiBib3gtc2hhZG93IC4xMnMgZWFzZSwgYm9yZGVyLWNvbG9yIC4xMnMgZWFzZSwgdHJhbnNmb3JtIC4wNnMgZWFzZTtcclxuICB9XHJcbiAgXHJcbiAgLmNiLXJvdzpob3ZlcntcclxuICAgIGJvcmRlci1jb2xvcjojY2JkNWUxO1xyXG4gICAgYm94LXNoYWRvdzogMCAxNHB4IDI2cHggcmdiYSgxNSwyMyw0MiwuMDgpO1xyXG4gIH1cclxuICBcclxuICAuY2Itcm93TGVmdHtcclxuICAgIGRpc3BsYXk6ZmxleDtcclxuICAgIGFsaWduLWl0ZW1zOmNlbnRlcjtcclxuICAgIGdhcDogMTJweDtcclxuICAgIG1pbi13aWR0aDogMDtcclxuICB9XHJcbiAgXHJcbiAgLmNiLWluZGV4e1xyXG4gICAgd2lkdGg6IDM0cHg7XHJcbiAgICBoZWlnaHQ6IDM0cHg7XHJcbiAgICBib3JkZXItcmFkaXVzOiAxMnB4O1xyXG4gICAgZGlzcGxheTpmbGV4O1xyXG4gICAgYWxpZ24taXRlbXM6Y2VudGVyO1xyXG4gICAganVzdGlmeS1jb250ZW50OmNlbnRlcjtcclxuICAgIGJhY2tncm91bmQ6I2Y4ZmFmYztcclxuICAgIGJvcmRlcjoxcHggc29saWQgI2UyZThmMDtcclxuICAgIGZvbnQtd2VpZ2h0OiA5MDA7XHJcbiAgICBjb2xvcjojMGYxNzJhO1xyXG4gICAgZmxleDogMCAwIGF1dG87XHJcbiAgfVxyXG4gIFxyXG4gIC5jYi1yb3dNYWlueyBtaW4td2lkdGg6MDsgfVxyXG4gIFxyXG4gIC5jYi1yb3dUaXRsZXtcclxuICAgIGZvbnQtd2VpZ2h0OiA5MDA7XHJcbiAgICBmb250LXNpemU6IDE0cHg7XHJcbiAgICBjb2xvcjojMGYxNzJhO1xyXG4gICAgd2hpdGUtc3BhY2U6IG5vd3JhcDtcclxuICAgIG92ZXJmbG93OiBoaWRkZW47XHJcbiAgICB0ZXh0LW92ZXJmbG93OiBlbGxpcHNpcztcclxuICAgIG1heC13aWR0aDogNTIwcHg7XHJcbiAgfVxyXG4gIFxyXG4gIC5jYi1yb3dCYWRnZXN7XHJcbiAgICBkaXNwbGF5OmZsZXg7XHJcbiAgICBnYXA6IDhweDtcclxuICAgIG1hcmdpbi10b3A6IDZweDtcclxuICAgIGZsZXgtd3JhcDogd3JhcDtcclxuICB9XHJcbiAgXHJcbiAgLmNiLWJhZGdle1xyXG4gICAgZGlzcGxheTppbmxpbmUtZmxleDtcclxuICAgIGFsaWduLWl0ZW1zOmNlbnRlcjtcclxuICAgIGdhcDogOHB4O1xyXG4gICAgZm9udC1zaXplOiAxMnB4O1xyXG4gICAgZm9udC13ZWlnaHQ6IDgwMDtcclxuICAgIHBhZGRpbmc6IDZweCAxMHB4O1xyXG4gICAgYm9yZGVyLXJhZGl1czogOTk5cHg7XHJcbiAgICBiYWNrZ3JvdW5kOiNmOGZhZmM7XHJcbiAgICBib3JkZXI6MXB4IHNvbGlkICNlMmU4ZjA7XHJcbiAgICBjb2xvcjojMzM0MTU1O1xyXG4gIH1cclxuICBcclxuICAuY2ItZG90e1xyXG4gICAgd2lkdGg6IDhweDtcclxuICAgIGhlaWdodDogOHB4O1xyXG4gICAgYm9yZGVyLXJhZGl1czogOTk5cHg7XHJcbiAgfVxyXG4gIFxyXG4gIC5jYi1kb3QtLXZpZGVveyBiYWNrZ3JvdW5kOiMyNTYzZWI7IH1cclxuICAuY2ItZG90LS1wZGZ7IGJhY2tncm91bmQ6IzE2YTM0YTsgfVxyXG4gIFxyXG4gIC5jYi1yb3dSaWdodHtcclxuICAgIGRpc3BsYXk6ZmxleDtcclxuICAgIGdhcDogOHB4O1xyXG4gICAgYWxpZ24taXRlbXM6Y2VudGVyO1xyXG4gICAgZmxleDogMCAwIGF1dG87XHJcbiAgfVxyXG4gIFxyXG4gIC5jYi1pY29uQnRue1xyXG4gICAgd2lkdGg6IDM2cHg7XHJcbiAgICBoZWlnaHQ6IDM2cHg7XHJcbiAgICBib3JkZXItcmFkaXVzOiAxMnB4O1xyXG4gICAgYm9yZGVyOjFweCBzb2xpZCAjZTJlOGYwO1xyXG4gICAgYmFja2dyb3VuZDojZmZmO1xyXG4gICAgY3Vyc29yOnBvaW50ZXI7XHJcbiAgfVxyXG4gIFxyXG4gIC5jYi1pY29uQnRuLS1kYW5nZXJ7XHJcbiAgICBib3JkZXItY29sb3I6I2ZlY2RkMztcclxuICAgIGJhY2tncm91bmQ6I2ZmZjFmMjtcclxuICB9XHJcbiAgXHJcbiAgQG1lZGlhIChtYXgtd2lkdGg6IDExMDBweCl7XHJcbiAgICAuY2ItZ3JpZHsgZ3JpZC10ZW1wbGF0ZS1jb2x1bW5zOiAxZnI7IH1cclxuICAgIC5jYi1jYXJkLS1jb3Vyc2V7IHBvc2l0aW9uOiBzdGF0aWM7IH1cclxuICAgIC5jYi1yb3dUaXRsZXsgbWF4LXdpZHRoOiAzNjBweDsgfVxyXG4gIH1cclxuICBcclxuICBAbWVkaWEgKG1heC13aWR0aDogNjIwcHgpe1xyXG4gICAgLmNiLWhlYWRlcnsgZmxleC1kaXJlY3Rpb246IGNvbHVtbjsgYWxpZ24taXRlbXM6ZmxleC1zdGFydDsgfVxyXG4gICAgLmNiLWFjdGlvbnN7IHdpZHRoOjEwMCU7IH1cclxuICAgIC5jYi1idG57IHdpZHRoOjEwMCU7IGp1c3RpZnktY29udGVudDpjZW50ZXI7IH1cclxuICAgIC5jYi1tZXRhR3JpZHsgZ3JpZC10ZW1wbGF0ZS1jb2x1bW5zOiAxZnI7IH1cclxuICB9Il0sInNvdXJjZVJvb3QiOiIifQ== */"]
    });
  }
}

/***/ }),

/***/ 5681:
/*!**********************************************************************!*\
  !*** ./src/app/back-office/create-course/create-course.component.ts ***!
  \**********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   CreateCourseComponent: () => (/* binding */ CreateCourseComponent)
/* harmony export */ });
/* harmony import */ var _angular_forms__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/forms */ 4456);
/* harmony import */ var _angular_common_http__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/common/http */ 6443);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ 7580);
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/router */ 5072);
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @angular/common */ 316);







function CreateCourseComponent_div_10_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](0, "div", 45);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const ctx_r0 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtextInterpolate"](ctx_r0.error);
  }
}
function CreateCourseComponent_div_11_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](0, "div", 46);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtextInterpolate"](ctx_r1.success);
  }
}
function CreateCourseComponent_small_23_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](0, "small", 47);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](1, " Title is required (min 3 characters). ");
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
  }
}
function CreateCourseComponent_small_28_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](0, "small", 47);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](1, " Description is required (min 10 characters). ");
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
  }
}
function CreateCourseComponent_option_36_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](0, "option", 48);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const c_r16 = ctx.$implicit;
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("value", c_r16.key);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtextInterpolate1"](" ", c_r16.key, " ");
  }
}
function CreateCourseComponent_small_38_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](0, "small", 47);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](1, " Category is required. ");
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
  }
}
function CreateCourseComponent_option_45_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](0, "option", 48);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const s_r17 = ctx.$implicit;
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("value", s_r17);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtextInterpolate1"](" ", s_r17, " ");
  }
}
function CreateCourseComponent_small_46_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](0, "small", 47);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](1, " SubCategory is required. ");
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
  }
}
function CreateCourseComponent_small_47_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](0, "small", 40);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](1, " No sub-categories available for this category. ");
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
  }
}
function CreateCourseComponent_small_48_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](0, "small", 40);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](1, " Choose a category first. ");
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
  }
}
function CreateCourseComponent_small_54_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](0, "small", 47);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](1, " Price must be \u2265 0. ");
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
  }
}
function CreateCourseComponent_small_59_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](0, "small", 47);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](1, " Duration must be \u2265 1 hour. ");
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
  }
}
function CreateCourseComponent_div_74_Template(rf, ctx) {
  if (rf & 1) {
    const _r19 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](0, "div", 49);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](1, "img", 50);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](2, "button", 51);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵlistener"]("click", function CreateCourseComponent_div_74_Template_button_click_2_listener() {
      _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵrestoreView"](_r19);
      const ctx_r18 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnextContext"]();
      return _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵresetView"](ctx_r18.removeImage());
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](3, " Remove ");
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]()();
  }
  if (rf & 2) {
    const ctx_r12 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("src", ctx_r12.imagePreview, _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵsanitizeUrl"]);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("disabled", ctx_r12.uploadingImage || ctx_r12.saving);
  }
}
function CreateCourseComponent_ng_template_75_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](0, "div", 52)(1, "div", 53);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](2, "No image selected");
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]()();
  }
}
function CreateCourseComponent_div_83_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](0, "div", 54);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](1, " Uploading image\u2026 Please wait. ");
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
  }
}
class CreateCourseComponent {
  constructor(fb, http, router) {
    this.fb = fb;
    this.http = http;
    this.router = router;
    this.saving = false;
    this.uploadingImage = false;
    this.error = null;
    this.success = null;
    this.imagePreview = null;
    /** Uses Angular proxy */
    this.API_URL = '/api/instructor/courses';
    /** Cloudinary (Unsigned Upload) */
    this.CLOUDINARY_CLOUD_NAME = 'doobtx5fl';
    this.CLOUDINARY_UPLOAD_PRESET = 'courses_unsigned';
    this.CLOUDINARY_UPLOAD_URL = `https://api.cloudinary.com/v1_1/${this.CLOUDINARY_CLOUD_NAME}/image/upload`;
    /**
     * Catalogue (simple). Remplace-le par un API plus tard si tu veux.
     * category -> subCategories[]
     */
    this.categoryCatalog = {
      Development: ['Python', 'Java', 'Spring Boot', 'Node.js', 'C#', 'C++'],
      'Web Development': ['Angular', 'React', 'Vue', 'Symfony', 'Laravel'],
      'Mobile Development': ['Flutter', 'Android', 'iOS', 'React Native'],
      'Data & AI': ['Data Analysis', 'Machine Learning', 'Deep Learning']
    };
    this.subCategories = [];
  }
  ngOnInit() {
    this.form = this.fb.group({
      title: ['', [_angular_forms__WEBPACK_IMPORTED_MODULE_1__.Validators.required, _angular_forms__WEBPACK_IMPORTED_MODULE_1__.Validators.minLength(3), _angular_forms__WEBPACK_IMPORTED_MODULE_1__.Validators.maxLength(120)]],
      description: ['', [_angular_forms__WEBPACK_IMPORTED_MODULE_1__.Validators.required, _angular_forms__WEBPACK_IMPORTED_MODULE_1__.Validators.minLength(10), _angular_forms__WEBPACK_IMPORTED_MODULE_1__.Validators.maxLength(2000)]],
      price: [0, [_angular_forms__WEBPACK_IMPORTED_MODULE_1__.Validators.required, _angular_forms__WEBPACK_IMPORTED_MODULE_1__.Validators.min(0)]],
      durationHours: [1, [_angular_forms__WEBPACK_IMPORTED_MODULE_1__.Validators.required, _angular_forms__WEBPACK_IMPORTED_MODULE_1__.Validators.min(1), _angular_forms__WEBPACK_IMPORTED_MODULE_1__.Validators.max(999)]],
      // ✅ NEW
      category: ['', [_angular_forms__WEBPACK_IMPORTED_MODULE_1__.Validators.required, _angular_forms__WEBPACK_IMPORTED_MODULE_1__.Validators.maxLength(120)]],
      subCategory: [{
        value: '',
        disabled: true
      }, [_angular_forms__WEBPACK_IMPORTED_MODULE_1__.Validators.required, _angular_forms__WEBPACK_IMPORTED_MODULE_1__.Validators.maxLength(120)]],
      imageUrl: ['']
    });
    // auto-update subCategory choices when category changes
    this.form.get('category')?.valueChanges.subscribe(() => this.onCategoryChange());
  }
  onCategoryChange() {
    const cat = String(this.form.get('category')?.value || '').trim();
    this.subCategories = this.categoryCatalog[cat] ?? [];
    const subCtrl = this.form.get('subCategory');
    if (!subCtrl) return;
    subCtrl.reset('', {
      emitEvent: false
    });
    if (this.subCategories.length) {
      subCtrl.enable({
        emitEvent: false
      });
    } else {
      subCtrl.disable({
        emitEvent: false
      });
    }
  }
  authHeaders() {
    const token = localStorage.getItem('token');
    let headers = new _angular_common_http__WEBPACK_IMPORTED_MODULE_2__.HttpHeaders();
    if (token) headers = headers.set('Authorization', `Bearer ${token}`);
    return headers;
  }
  submit() {
    this.error = null;
    this.success = null;
    if (this.uploadingImage) {
      this.error = 'Please wait until the image upload finishes.';
      return;
    }
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.saving = true;
    // getRawValue() pour inclure subCategory même si disabled parfois
    const raw = this.form.getRawValue();
    const payload = {
      title: String(raw.title || '').trim(),
      description: String(raw.description || '').trim(),
      price: Math.max(0, Number(raw.price ?? 0)),
      durationHours: Math.max(1, Number(raw.durationHours ?? 1)),
      // ✅ NEW
      category: String(raw.category || '').trim(),
      subCategory: String(raw.subCategory || '').trim(),
      imageUrl: raw.imageUrl ? String(raw.imageUrl).trim() : null
    };
    this.http.post(this.API_URL, payload, {
      headers: this.authHeaders()
    }).subscribe({
      next: created => {
        this.saving = false;
        this.success = 'Course created successfully. Redirecting to lesson creation...';
        const courseId = created?.id;
        if (!courseId || Number.isNaN(Number(courseId))) {
          this.error = 'Course created but no ID was returned by the server.';
          return;
        }
        setTimeout(() => {
          this.router.navigate(['/back-office/trainer/courses', courseId, 'lessons', 'create']);
        }, 600);
      },
      error: err => {
        this.saving = false;
        const msg = err?.error?.message || err?.error?.error || (typeof err?.error === 'string' ? err.error : null) || err?.message || 'Failed to create course.';
        this.error = msg;
      }
    });
  }
  resetForm() {
    this.form.reset({
      title: '',
      description: '',
      price: 0,
      durationHours: 1,
      category: '',
      subCategory: '',
      imageUrl: ''
    });
    this.subCategories = [];
    this.form.get('subCategory')?.disable({
      emitEvent: false
    });
    this.imagePreview = null;
    this.error = null;
    this.success = null;
  }
  removeImage() {
    this.imagePreview = null;
    this.form.patchValue({
      imageUrl: ''
    }, {
      emitEvent: false
    });
  }
  onImageSelected(event) {
    const input = event.target;
    const file = input?.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      this.error = 'Please select a valid image file.';
      input.value = '';
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      this.imagePreview = typeof reader.result === 'string' ? reader.result : null;
    };
    reader.readAsDataURL(file);
    this.uploadingImage = true;
    this.error = null;
    this.success = null;
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', this.CLOUDINARY_UPLOAD_PRESET);
    formData.append('folder', 'courses');
    this.http.post(this.CLOUDINARY_UPLOAD_URL, formData).subscribe({
      next: res => {
        const uploadedUrl = res?.secure_url || res?.url || null;
        if (!uploadedUrl) {
          this.error = 'Upload succeeded but no image URL was returned.';
          this.uploadingImage = false;
          return;
        }
        this.form.patchValue({
          imageUrl: uploadedUrl
        }, {
          emitEvent: false
        });
        this.uploadingImage = false;
        this.success = 'Image uploaded successfully.';
      },
      error: err => {
        this.uploadingImage = false;
        this.error = err?.error?.error?.message || err?.error?.message || 'Image upload failed.';
      }
    });
  }
  static {
    this.ɵfac = function CreateCourseComponent_Factory(t) {
      return new (t || CreateCourseComponent)(_angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdirectiveInject"](_angular_forms__WEBPACK_IMPORTED_MODULE_1__.FormBuilder), _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdirectiveInject"](_angular_common_http__WEBPACK_IMPORTED_MODULE_2__.HttpClient), _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdirectiveInject"](_angular_router__WEBPACK_IMPORTED_MODULE_3__.Router));
    };
  }
  static {
    this.ɵcmp = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdefineComponent"]({
      type: CreateCourseComponent,
      selectors: [["app-create-course"]],
      decls: 89,
      vars: 23,
      consts: [[1, "cc"], [1, "cc-header"], [1, "cc-title-wrap"], [1, "cc-title"], [1, "cc-subtitle"], [1, "cc-actions"], ["routerLink", "/back-office/trainer/manage-courses", 1, "btn", "btn-secondary"], ["class", "cc-alert cc-alert--error", 4, "ngIf"], ["class", "cc-alert cc-alert--success", 4, "ngIf"], [1, "card"], [1, "card-header"], [1, "card-title"], [1, "badge"], ["novalidate", "", 1, "form", 3, "formGroup", "ngSubmit"], [1, "field"], [1, "label"], ["formControlName", "title", "placeholder", "e.g., Spring Boot Microservices", "autocomplete", "off", 1, "input"], ["class", "hint error", 4, "ngIf"], ["rows", "7", "formControlName", "description", "placeholder", "Describe the content, goals, and prerequisites\u2026", 1, "textarea"], [1, "row"], ["formControlName", "category", 1, "select"], ["value", ""], [3, "value", 4, "ngFor", "ngForOf"], ["formControlName", "subCategory", 1, "select", 3, "disabled"], ["class", "hint", 4, "ngIf"], ["type", "number", "min", "0", "step", "0.01", "formControlName", "price", 1, "input"], ["type", "number", "min", "1", "step", "1", "formControlName", "durationHours", 1, "input"], [1, "card-inner"], [1, "section-head"], [1, "section-title"], [1, "section-subtitle"], [1, "upload-row"], [1, "upload-box"], ["type", "file", "accept", "image/*", 1, "file", 3, "disabled", "change"], [1, "upload-hint"], [1, "upload-title"], [1, "upload-sub"], ["class", "preview", 4, "ngIf", "ngIfElse"], ["previewEmpty", ""], ["formControlName", "imageUrl", "placeholder", "https://...", "autocomplete", "off", 1, "input"], [1, "hint"], ["class", "inline-info", 4, "ngIf"], [1, "form-actions"], ["type", "submit", 1, "btn", "btn-primary", 3, "disabled"], ["type", "button", 1, "btn", "btn-secondary", 3, "disabled", "click"], [1, "cc-alert", "cc-alert--error"], [1, "cc-alert", "cc-alert--success"], [1, "hint", "error"], [3, "value"], [1, "preview"], ["alt", "Course cover preview", 3, "src"], ["type", "button", 1, "btn", "btn-small", "btn-danger", 3, "disabled", "click"], [1, "preview", "preview--empty"], [1, "preview-text"], [1, "inline-info"]],
      template: function CreateCourseComponent_Template(rf, ctx) {
        if (rf & 1) {
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](0, "div", 0)(1, "div", 1)(2, "div", 2)(3, "h2", 3);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](4, "Create New Course");
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](5, "p", 4);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](6, " Add course details and an optional cover image. The image will be stored as a URL. ");
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]()();
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](7, "div", 5)(8, "a", 6);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](9, " \u2190 Back to My Courses ");
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]()()();
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtemplate"](10, CreateCourseComponent_div_10_Template, 2, 1, "div", 7);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtemplate"](11, CreateCourseComponent_div_11_Template, 2, 1, "div", 8);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](12, "section", 9)(13, "div", 10)(14, "h3", 11);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](15, "Course Information");
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](16, "span", 12);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](17, "Create");
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]()();
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](18, "form", 13);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵlistener"]("ngSubmit", function CreateCourseComponent_Template_form_ngSubmit_18_listener() {
            return ctx.submit();
          });
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](19, "label", 14)(20, "span", 15);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](21, "Title");
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](22, "input", 16);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtemplate"](23, CreateCourseComponent_small_23_Template, 2, 0, "small", 17);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](24, "label", 14)(25, "span", 15);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](26, "Description");
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](27, "textarea", 18);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtemplate"](28, CreateCourseComponent_small_28_Template, 2, 0, "small", 17);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](29, "div", 19)(30, "label", 14)(31, "span", 15);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](32, "Category");
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](33, "select", 20)(34, "option", 21);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](35, "Select category");
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtemplate"](36, CreateCourseComponent_option_36_Template, 2, 2, "option", 22);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵpipe"](37, "keyvalue");
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtemplate"](38, CreateCourseComponent_small_38_Template, 2, 0, "small", 17);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](39, "label", 14)(40, "span", 15);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](41, "SubCategory");
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](42, "select", 23)(43, "option", 21);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](44, "Select sub category");
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtemplate"](45, CreateCourseComponent_option_45_Template, 2, 2, "option", 22);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtemplate"](46, CreateCourseComponent_small_46_Template, 2, 0, "small", 17);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtemplate"](47, CreateCourseComponent_small_47_Template, 2, 0, "small", 24);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtemplate"](48, CreateCourseComponent_small_48_Template, 2, 0, "small", 24);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]()();
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](49, "div", 19)(50, "label", 14)(51, "span", 15);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](52, "Price");
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](53, "input", 25);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtemplate"](54, CreateCourseComponent_small_54_Template, 2, 0, "small", 17);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](55, "label", 14)(56, "span", 15);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](57, "Duration (hours)");
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](58, "input", 26);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtemplate"](59, CreateCourseComponent_small_59_Template, 2, 0, "small", 17);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]()();
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](60, "div", 27)(61, "div", 28)(62, "h4", 29);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](63, "Cover Image");
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](64, "p", 30);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](65, "Upload an image or paste a direct URL (recommended 16:9).");
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]()();
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](66, "div", 31)(67, "div", 32)(68, "input", 33);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵlistener"]("change", function CreateCourseComponent_Template_input_change_68_listener($event) {
            return ctx.onImageSelected($event);
          });
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](69, "div", 34)(70, "div", 35);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](71, "Upload image");
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](72, "div", 36);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](73, " PNG, JPG, WEBP (max size depends on your uploader) ");
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]()()();
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtemplate"](74, CreateCourseComponent_div_74_Template, 4, 2, "div", 37);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtemplate"](75, CreateCourseComponent_ng_template_75_Template, 3, 0, "ng-template", null, 38, _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtemplateRefExtractor"]);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](77, "label", 14)(78, "span", 15);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](79, "Image URL");
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](80, "input", 39);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](81, "small", 40);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](82, " If you upload an image, this field will be auto-filled with the generated URL. ");
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]()();
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtemplate"](83, CreateCourseComponent_div_83_Template, 2, 0, "div", 41);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](84, "div", 42)(85, "button", 43);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](86);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](87, "button", 44);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵlistener"]("click", function CreateCourseComponent_Template_button_click_87_listener() {
            return ctx.resetForm();
          });
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](88, " Reset ");
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]()()()()();
        }
        if (rf & 2) {
          const _r13 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵreference"](76);
          let tmp_3_0;
          let tmp_4_0;
          let tmp_6_0;
          let tmp_9_0;
          let tmp_10_0;
          let tmp_11_0;
          let tmp_12_0;
          let tmp_13_0;
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](10);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("ngIf", ctx.error);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](1);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("ngIf", ctx.success);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](7);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("formGroup", ctx.form);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](5);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("ngIf", ((tmp_3_0 = ctx.form.get("title")) == null ? null : tmp_3_0.touched) && ((tmp_3_0 = ctx.form.get("title")) == null ? null : tmp_3_0.invalid));
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](5);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("ngIf", ((tmp_4_0 = ctx.form.get("description")) == null ? null : tmp_4_0.touched) && ((tmp_4_0 = ctx.form.get("description")) == null ? null : tmp_4_0.invalid));
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](8);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("ngForOf", _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵpipeBind1"](37, 21, ctx.categoryCatalog));
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](2);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("ngIf", ((tmp_6_0 = ctx.form.get("category")) == null ? null : tmp_6_0.touched) && ((tmp_6_0 = ctx.form.get("category")) == null ? null : tmp_6_0.invalid));
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](4);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("disabled", !ctx.subCategories.length);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](3);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("ngForOf", ctx.subCategories);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](1);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("ngIf", ((tmp_9_0 = ctx.form.get("subCategory")) == null ? null : tmp_9_0.touched) && ((tmp_9_0 = ctx.form.get("subCategory")) == null ? null : tmp_9_0.invalid));
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](1);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("ngIf", ((tmp_10_0 = ctx.form.get("category")) == null ? null : tmp_10_0.value) && !ctx.subCategories.length);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](1);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("ngIf", !((tmp_11_0 = ctx.form.get("category")) == null ? null : tmp_11_0.value));
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](6);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("ngIf", ((tmp_12_0 = ctx.form.get("price")) == null ? null : tmp_12_0.touched) && ((tmp_12_0 = ctx.form.get("price")) == null ? null : tmp_12_0.invalid));
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](5);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("ngIf", ((tmp_13_0 = ctx.form.get("durationHours")) == null ? null : tmp_13_0.touched) && ((tmp_13_0 = ctx.form.get("durationHours")) == null ? null : tmp_13_0.invalid));
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](9);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("disabled", ctx.uploadingImage || ctx.saving);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](6);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("ngIf", ctx.imagePreview)("ngIfElse", _r13);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](9);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("ngIf", ctx.uploadingImage);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](2);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("disabled", ctx.saving || ctx.uploadingImage || ctx.form.invalid);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](1);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtextInterpolate1"](" ", ctx.saving ? "Creating\u2026" : "Create Course", " ");
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](1);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("disabled", ctx.saving || ctx.uploadingImage);
        }
      },
      dependencies: [_angular_common__WEBPACK_IMPORTED_MODULE_4__.NgForOf, _angular_common__WEBPACK_IMPORTED_MODULE_4__.NgIf, _angular_forms__WEBPACK_IMPORTED_MODULE_1__["ɵNgNoValidate"], _angular_forms__WEBPACK_IMPORTED_MODULE_1__.NgSelectOption, _angular_forms__WEBPACK_IMPORTED_MODULE_1__["ɵNgSelectMultipleOption"], _angular_forms__WEBPACK_IMPORTED_MODULE_1__.DefaultValueAccessor, _angular_forms__WEBPACK_IMPORTED_MODULE_1__.NumberValueAccessor, _angular_forms__WEBPACK_IMPORTED_MODULE_1__.SelectControlValueAccessor, _angular_forms__WEBPACK_IMPORTED_MODULE_1__.NgControlStatus, _angular_forms__WEBPACK_IMPORTED_MODULE_1__.NgControlStatusGroup, _angular_forms__WEBPACK_IMPORTED_MODULE_1__.MinValidator, _angular_forms__WEBPACK_IMPORTED_MODULE_1__.FormGroupDirective, _angular_forms__WEBPACK_IMPORTED_MODULE_1__.FormControlName, _angular_router__WEBPACK_IMPORTED_MODULE_3__.RouterLink, _angular_common__WEBPACK_IMPORTED_MODULE_4__.KeyValuePipe],
      styles: ["\n\n\n\n\n\n\n\n\n\n   [_nghost-%COMP%] {\n    display: block;\n  }\n  \n  \n\n  .cc[_ngcontent-%COMP%] {\n    max-width: 1100px;\n    margin: 0 auto;\n    padding: 26px 26px 34px;\n    display: flex;\n    flex-direction: column;\n    gap: 16px;\n    color: inherit;\n  }\n  \n  \n\n  .cc-header[_ngcontent-%COMP%] {\n    display: flex;\n    align-items: flex-start;\n    justify-content: space-between;\n    gap: 16px;\n    padding: 18px;\n    border-radius: 18px;\n    border: 1px solid rgba(0, 0, 0, 0.08);\n    background: rgba(255, 255, 255, 0.72);\n    box-shadow: 0 12px 30px rgba(0, 0, 0, 0.05);\n    backdrop-filter: blur(10px);\n  }\n  \n  .cc-title-wrap[_ngcontent-%COMP%] {\n    display: flex;\n    flex-direction: column;\n    gap: 6px;\n  }\n  \n  .cc-title[_ngcontent-%COMP%] {\n    margin: 0;\n    font-size: 26px;\n    line-height: 1.15;\n    font-weight: 750;\n    letter-spacing: -0.3px;\n  }\n  \n  .cc-subtitle[_ngcontent-%COMP%] {\n    margin: 0;\n    font-size: 14px;\n    line-height: 1.45;\n    opacity: 0.72;\n    max-width: 760px;\n  }\n  \n  .cc-actions[_ngcontent-%COMP%] {\n    display: flex;\n    align-items: center;\n    gap: 10px;\n  }\n  \n  \n\n  .cc-alert[_ngcontent-%COMP%] {\n    padding: 12px 14px;\n    border-radius: 14px;\n    border: 1px solid transparent;\n    background: rgba(255, 255, 255, 0.68);\n    box-shadow: 0 10px 24px rgba(0, 0, 0, 0.04);\n  }\n  \n  .cc-alert--error[_ngcontent-%COMP%] {\n    border-color: rgba(255, 70, 70, 0.22);\n    background: rgba(255, 70, 70, 0.08);\n  }\n  \n  .cc-alert--success[_ngcontent-%COMP%] {\n    border-color: rgba(0, 200, 120, 0.22);\n    background: rgba(0, 200, 120, 0.10);\n  }\n  \n  \n\n  .card[_ngcontent-%COMP%] {\n    border-radius: 18px;\n    border: 1px solid rgba(0, 0, 0, 0.08);\n    background: rgba(255, 255, 255, 0.78);\n    box-shadow: 0 14px 34px rgba(0, 0, 0, 0.05);\n    overflow: hidden;\n  }\n  \n  \n\n  .card-header[_ngcontent-%COMP%] {\n    display: flex;\n    align-items: center;\n    justify-content: space-between;\n    gap: 12px;\n    padding: 14px 16px;\n    border-bottom: 1px solid rgba(0, 0, 0, 0.06);\n    background: rgba(255, 255, 255, 0.90);\n    backdrop-filter: blur(8px);\n  }\n  \n  .card-title[_ngcontent-%COMP%] {\n    margin: 0;\n    font-size: 15px;\n    font-weight: 750;\n    letter-spacing: -0.1px;\n  }\n  \n  .badge[_ngcontent-%COMP%] {\n    display: inline-flex;\n    align-items: center;\n    gap: 8px;\n    font-size: 12px;\n    padding: 6px 10px;\n    border-radius: 999px;\n    border: 1px solid rgba(110, 160, 255, 0.25);\n    background: rgba(110, 160, 255, 0.12);\n    color: inherit;\n  }\n  \n  \n\n  .form[_ngcontent-%COMP%] {\n    padding: 18px;\n    display: flex;\n    flex-direction: column;\n    gap: 14px;\n  }\n  \n  \n\n  .field[_ngcontent-%COMP%] {\n    display: flex;\n    flex-direction: column;\n    gap: 7px;\n  }\n  \n  .label[_ngcontent-%COMP%] {\n    font-size: 13px;\n    font-weight: 650;\n    opacity: 0.86;\n  }\n  \n  \n\n  .input[_ngcontent-%COMP%], .textarea[_ngcontent-%COMP%], .select[_ngcontent-%COMP%] {\n    width: 100%;\n    border-radius: 14px;\n    border: 1px solid rgba(0, 0, 0, 0.10);\n    background: rgba(255, 255, 255, 0.85);\n    padding: 12px 12px;\n    outline: none;\n    transition: box-shadow 0.15s ease, border-color 0.15s ease, transform 0.12s ease, background 0.15s ease;\n    color: inherit;\n  }\n  \n  .input[_ngcontent-%COMP%]::placeholder, .textarea[_ngcontent-%COMP%]::placeholder {\n    opacity: 0.6;\n  }\n  \n  .input[_ngcontent-%COMP%]:focus, .textarea[_ngcontent-%COMP%]:focus, .select[_ngcontent-%COMP%]:focus {\n    border-color: rgba(110, 160, 255, 0.55);\n    box-shadow: 0 0 0 4px rgba(110, 160, 255, 0.18);\n  }\n  \n  .textarea[_ngcontent-%COMP%] {\n    resize: vertical;\n    min-height: 140px;\n  }\n  \n  .select[_ngcontent-%COMP%] {\n    appearance: none;\n    background-image:\n      linear-gradient(45deg, transparent 50%, rgba(0,0,0,0.55) 50%),\n      linear-gradient(135deg, rgba(0,0,0,0.55) 50%, transparent 50%);\n    background-position:\n      calc(100% - 18px) calc(50% - 3px),\n      calc(100% - 13px) calc(50% - 3px);\n    background-size: 6px 6px, 6px 6px;\n    background-repeat: no-repeat;\n    padding-right: 38px;\n  }\n  \n  .select[_ngcontent-%COMP%]:disabled {\n    opacity: 0.65;\n    cursor: not-allowed;\n    filter: grayscale(0.15);\n  }\n  \n  \n\n  .row[_ngcontent-%COMP%] {\n    display: grid;\n    grid-template-columns: 1fr 1fr;\n    gap: 12px;\n  }\n  \n  \n\n  .hint[_ngcontent-%COMP%] {\n    font-size: 12px;\n    opacity: 0.75;\n    line-height: 1.35;\n  }\n  \n  .hint.error[_ngcontent-%COMP%] {\n    opacity: 1;\n    color: #d93939;\n  }\n  \n  \n\n  .card-inner[_ngcontent-%COMP%] {\n    margin-top: 4px;\n    padding: 14px;\n    border-radius: 16px;\n    border: 1px solid rgba(0, 0, 0, 0.06);\n    background: rgba(0, 0, 0, 0.02);\n  }\n  \n  .section-head[_ngcontent-%COMP%] {\n    display: flex;\n    flex-direction: column;\n    gap: 4px;\n    margin-bottom: 10px;\n  }\n  \n  .section-title[_ngcontent-%COMP%] {\n    margin: 0;\n    font-size: 13px;\n    font-weight: 750;\n    letter-spacing: -0.1px;\n  }\n  \n  .section-subtitle[_ngcontent-%COMP%] {\n    margin: 0;\n    font-size: 12px;\n    opacity: 0.72;\n    line-height: 1.35;\n  }\n  \n  \n\n  .upload-row[_ngcontent-%COMP%] {\n    display: grid;\n    grid-template-columns: 1fr 240px;\n    gap: 12px;\n    align-items: stretch;\n    margin-bottom: 10px;\n  }\n  \n  \n\n  .upload-box[_ngcontent-%COMP%] {\n    position: relative;\n    border-radius: 16px;\n    border: 1px dashed rgba(0, 0, 0, 0.18);\n    background: rgba(255, 255, 255, 0.55);\n    padding: 14px;\n    display: flex;\n    gap: 12px;\n    align-items: center;\n    overflow: hidden;\n  }\n  \n  .file[_ngcontent-%COMP%] {\n    width: 160px;\n    max-width: 45%;\n  }\n  \n  .upload-hint[_ngcontent-%COMP%] {\n    display: flex;\n    flex-direction: column;\n    gap: 4px;\n    min-width: 0;\n  }\n  \n  .upload-title[_ngcontent-%COMP%] {\n    font-size: 13px;\n    font-weight: 750;\n    opacity: 0.9;\n  }\n  \n  .upload-sub[_ngcontent-%COMP%] {\n    font-size: 12px;\n    opacity: 0.72;\n    line-height: 1.35;\n  }\n  \n  \n\n  .preview[_ngcontent-%COMP%] {\n    border-radius: 16px;\n    border: 1px solid rgba(0, 0, 0, 0.10);\n    background: rgba(255, 255, 255, 0.75);\n    overflow: hidden;\n    display: flex;\n    flex-direction: column;\n  }\n  \n  .preview[_ngcontent-%COMP%]   img[_ngcontent-%COMP%] {\n    width: 100%;\n    height: 150px;\n    object-fit: cover;\n    display: block;\n  }\n  \n  .preview[_ngcontent-%COMP%]   .btn[_ngcontent-%COMP%] {\n    border-radius: 0;\n    border-left: 0;\n    border-right: 0;\n    border-bottom: 0;\n    justify-content: center;\n  }\n  \n  .preview--empty[_ngcontent-%COMP%] {\n    display: grid;\n    place-items: center;\n    min-height: 150px;\n  }\n  \n  .preview-text[_ngcontent-%COMP%] {\n    font-size: 12px;\n    opacity: 0.7;\n    padding: 10px;\n    text-align: center;\n  }\n  \n  \n\n  .inline-info[_ngcontent-%COMP%] {\n    margin-top: 8px;\n    padding: 10px 12px;\n    border-radius: 14px;\n    border: 1px solid rgba(110, 160, 255, 0.22);\n    background: rgba(110, 160, 255, 0.10);\n    font-size: 12px;\n    opacity: 0.9;\n  }\n  \n  \n\n  .btn[_ngcontent-%COMP%] {\n    border: 1px solid rgba(0, 0, 0, 0.10);\n    background: rgba(255, 255, 255, 0.80);\n    color: inherit;\n    padding: 10px 12px;\n    border-radius: 14px;\n    cursor: pointer;\n    text-decoration: none;\n    display: inline-flex;\n    align-items: center;\n    justify-content: center;\n    gap: 8px;\n    transition: transform 0.12s ease, box-shadow 0.12s ease, background 0.12s ease, border-color 0.12s ease;\n    -webkit-user-select: none;\n            user-select: none;\n  }\n  \n  .btn[_ngcontent-%COMP%]:hover {\n    transform: translateY(-1px);\n    background: rgba(255, 255, 255, 0.95);\n    box-shadow: 0 10px 22px rgba(0, 0, 0, 0.06);\n  }\n  \n  .btn[_ngcontent-%COMP%]:active {\n    transform: translateY(0);\n    box-shadow: none;\n  }\n  \n  .btn[_ngcontent-%COMP%]:disabled {\n    opacity: 0.6;\n    cursor: not-allowed;\n    transform: none;\n    box-shadow: none;\n  }\n  \n  \n\n  .btn-primary[_ngcontent-%COMP%] {\n    border-color: rgba(110, 160, 255, 0.30);\n    background: rgba(110, 160, 255, 0.18);\n  }\n  \n  .btn-secondary[_ngcontent-%COMP%] {\n    background: rgba(255, 255, 255, 0.65);\n  }\n  \n  .btn-danger[_ngcontent-%COMP%] {\n    border-color: rgba(255, 90, 90, 0.25);\n    background: rgba(255, 90, 90, 0.12);\n  }\n  \n  .btn-small[_ngcontent-%COMP%] {\n    padding: 9px 10px;\n    border-radius: 12px;\n    font-size: 12px;\n  }\n  \n  \n\n  .form-actions[_ngcontent-%COMP%] {\n    display: flex;\n    gap: 10px;\n    flex-wrap: wrap;\n    padding-top: 4px;\n    margin-top: 4px;\n  }\n  \n  \n\n  .dark-theme[_nghost-%COMP%]   .cc-header[_ngcontent-%COMP%], .dark-theme   [_nghost-%COMP%]   .cc-header[_ngcontent-%COMP%], .dark-theme[_nghost-%COMP%]   .card[_ngcontent-%COMP%], .dark-theme   [_nghost-%COMP%]   .card[_ngcontent-%COMP%], .dark-theme[_nghost-%COMP%]   .cc-alert[_ngcontent-%COMP%], .dark-theme   [_nghost-%COMP%]   .cc-alert[_ngcontent-%COMP%] {\n    border-color: rgba(255, 255, 255, 0.14);\n    background: rgba(255, 255, 255, 0.05);\n    box-shadow: none;\n  }\n  \n  .dark-theme[_nghost-%COMP%]   .card-header[_ngcontent-%COMP%], .dark-theme   [_nghost-%COMP%]   .card-header[_ngcontent-%COMP%] {\n    border-bottom-color: rgba(255, 255, 255, 0.10);\n    background: rgba(12, 16, 24, 0.55);\n  }\n  \n  .dark-theme[_nghost-%COMP%]   .input[_ngcontent-%COMP%], .dark-theme   [_nghost-%COMP%]   .input[_ngcontent-%COMP%], .dark-theme[_nghost-%COMP%]   .textarea[_ngcontent-%COMP%], .dark-theme   [_nghost-%COMP%]   .textarea[_ngcontent-%COMP%], .dark-theme[_nghost-%COMP%]   .select[_ngcontent-%COMP%], .dark-theme   [_nghost-%COMP%]   .select[_ngcontent-%COMP%] {\n    border-color: rgba(255, 255, 255, 0.14);\n    background: rgba(255, 255, 255, 0.06);\n  }\n  \n  .dark-theme[_nghost-%COMP%]   .upload-box[_ngcontent-%COMP%], .dark-theme   [_nghost-%COMP%]   .upload-box[_ngcontent-%COMP%], .dark-theme[_nghost-%COMP%]   .card-inner[_ngcontent-%COMP%], .dark-theme   [_nghost-%COMP%]   .card-inner[_ngcontent-%COMP%] {\n    border-color: rgba(255, 255, 255, 0.16);\n    background: rgba(255, 255, 255, 0.04);\n  }\n  \n  .dark-theme[_nghost-%COMP%]   .btn[_ngcontent-%COMP%], .dark-theme   [_nghost-%COMP%]   .btn[_ngcontent-%COMP%] {\n    border-color: rgba(255, 255, 255, 0.14);\n    background: rgba(255, 255, 255, 0.06);\n  }\n  \n  .dark-theme[_nghost-%COMP%]   .select[_ngcontent-%COMP%], .dark-theme   [_nghost-%COMP%]   .select[_ngcontent-%COMP%] {\n    background-image:\n      linear-gradient(45deg, transparent 50%, rgba(255,255,255,0.65) 50%),\n      linear-gradient(135deg, rgba(255,255,255,0.65) 50%, transparent 50%);\n  }\n  \n  \n\n  @media (max-width: 900px) {\n    .cc[_ngcontent-%COMP%] {\n      padding: 16px;\n    }\n  \n    .cc-header[_ngcontent-%COMP%] {\n      flex-direction: column;\n      align-items: flex-start;\n    }\n  \n    .row[_ngcontent-%COMP%] {\n      grid-template-columns: 1fr;\n    }\n  \n    .upload-row[_ngcontent-%COMP%] {\n      grid-template-columns: 1fr;\n    }\n  \n    .preview[_ngcontent-%COMP%]   img[_ngcontent-%COMP%], .preview--empty[_ngcontent-%COMP%] {\n      height: 180px;\n      min-height: 180px;\n    }\n  \n    .file[_ngcontent-%COMP%] {\n      width: 100%;\n      max-width: 100%;\n    }\n  }\n/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8uL3NyYy9hcHAvYmFjay1vZmZpY2UvY3JlYXRlLWNvdXJzZS9jcmVhdGUtY291cnNlLmNvbXBvbmVudC5jc3MiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7Ozs7OEJBTzhCOztHQUUzQjtJQUNDLGNBQWM7RUFDaEI7O0VBRUEsaUJBQWlCO0VBQ2pCO0lBQ0UsaUJBQWlCO0lBQ2pCLGNBQWM7SUFDZCx1QkFBdUI7SUFDdkIsYUFBYTtJQUNiLHNCQUFzQjtJQUN0QixTQUFTO0lBQ1QsY0FBYztFQUNoQjs7RUFFQSxXQUFXO0VBQ1g7SUFDRSxhQUFhO0lBQ2IsdUJBQXVCO0lBQ3ZCLDhCQUE4QjtJQUM5QixTQUFTO0lBQ1QsYUFBYTtJQUNiLG1CQUFtQjtJQUNuQixxQ0FBcUM7SUFDckMscUNBQXFDO0lBQ3JDLDJDQUEyQztJQUMzQywyQkFBMkI7RUFDN0I7O0VBRUE7SUFDRSxhQUFhO0lBQ2Isc0JBQXNCO0lBQ3RCLFFBQVE7RUFDVjs7RUFFQTtJQUNFLFNBQVM7SUFDVCxlQUFlO0lBQ2YsaUJBQWlCO0lBQ2pCLGdCQUFnQjtJQUNoQixzQkFBc0I7RUFDeEI7O0VBRUE7SUFDRSxTQUFTO0lBQ1QsZUFBZTtJQUNmLGlCQUFpQjtJQUNqQixhQUFhO0lBQ2IsZ0JBQWdCO0VBQ2xCOztFQUVBO0lBQ0UsYUFBYTtJQUNiLG1CQUFtQjtJQUNuQixTQUFTO0VBQ1g7O0VBRUEsV0FBVztFQUNYO0lBQ0Usa0JBQWtCO0lBQ2xCLG1CQUFtQjtJQUNuQiw2QkFBNkI7SUFDN0IscUNBQXFDO0lBQ3JDLDJDQUEyQztFQUM3Qzs7RUFFQTtJQUNFLHFDQUFxQztJQUNyQyxtQ0FBbUM7RUFDckM7O0VBRUE7SUFDRSxxQ0FBcUM7SUFDckMsbUNBQW1DO0VBQ3JDOztFQUVBLFNBQVM7RUFDVDtJQUNFLG1CQUFtQjtJQUNuQixxQ0FBcUM7SUFDckMscUNBQXFDO0lBQ3JDLDJDQUEyQztJQUMzQyxnQkFBZ0I7RUFDbEI7O0VBRUEsZ0JBQWdCO0VBQ2hC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SUFDdkMscUNBQXFDO0VBQ3ZDOztFQUVBOztJQUVFLHVDQUF1QztJQUN2QyxxQ0FBcUM7RUFDdkM7O0VBRUE7SUFDRSx1Q0FBdUM7SUFDdkMscUNBQXFDO0VBQ3ZDOztFQUVBO0lBQ0U7OzBFQUVzRTtFQUN4RTs7RUFFQSxlQUFlO0VBQ2Y7SUFDRTtNQUNFLGFBQWE7SUFDZjs7SUFFQTtNQUNFLHNCQUFzQjtNQUN0Qix1QkFBdUI7SUFDekI7O0lBRUE7TUFDRSwwQkFBMEI7SUFDNUI7O0lBRUE7TUFDRSwwQkFBMEI7SUFDNUI7O0lBRUE7O01BRUUsYUFBYTtNQUNiLGlCQUFpQjtJQUNuQjs7SUFFQTtNQUNFLFdBQVc7TUFDWCxlQUFlO0lBQ2pCO0VBQ0YiLCJzb3VyY2VzQ29udGVudCI6WyIvKiA9PT09PT09PT09PT09PT09PT09PT09PT09XHJcbiAgIENyZWF0ZSBDb3Vyc2UgKGNjKSAtIFJlZG9uZVxyXG4gICBNb2Rlcm4sIGNsZWFuLCBkYXNoYm9hcmQtZnJpZW5kbHlcclxuICAgV29ya3Mgd2l0aDogLmNjLCAuY2FyZCwgLmZvcm0sIC5yb3csIC5pbnB1dCwgLnRleHRhcmVhLCAuc2VsZWN0LFxyXG4gICAgICAgICAgICAgIC51cGxvYWQtcm93LCAudXBsb2FkLWJveCwgLnVwbG9hZC1oaW50LCAucHJldmlldywgLmZpbGUsXHJcbiAgICAgICAgICAgICAgLmNhcmQtaW5uZXIsIC5zZWN0aW9uLWhlYWQsIC5zZWN0aW9uLXRpdGxlLCAuc2VjdGlvbi1zdWJ0aXRsZSxcclxuICAgICAgICAgICAgICAuaW5saW5lLWluZm8sIC5idG4gKCsgdmFyaWFudHMpLCAuY2MtYWxlcnQgKCsgdmFyaWFudHMpXHJcbiAgID09PT09PT09PT09PT09PT09PT09PT09PT0gKi9cclxuXHJcbiAgIDpob3N0IHtcclxuICAgIGRpc3BsYXk6IGJsb2NrO1xyXG4gIH1cclxuICBcclxuICAvKiBQYWdlIHdyYXBwZXIgKi9cclxuICAuY2Mge1xyXG4gICAgbWF4LXdpZHRoOiAxMTAwcHg7XHJcbiAgICBtYXJnaW46IDAgYXV0bztcclxuICAgIHBhZGRpbmc6IDI2cHggMjZweCAzNHB4O1xyXG4gICAgZGlzcGxheTogZmxleDtcclxuICAgIGZsZXgtZGlyZWN0aW9uOiBjb2x1bW47XHJcbiAgICBnYXA6IDE2cHg7XHJcbiAgICBjb2xvcjogaW5oZXJpdDtcclxuICB9XHJcbiAgXHJcbiAgLyogSGVhZGVyICovXHJcbiAgLmNjLWhlYWRlciB7XHJcbiAgICBkaXNwbGF5OiBmbGV4O1xyXG4gICAgYWxpZ24taXRlbXM6IGZsZXgtc3RhcnQ7XHJcbiAgICBqdXN0aWZ5LWNvbnRlbnQ6IHNwYWNlLWJldHdlZW47XHJcbiAgICBnYXA6IDE2cHg7XHJcbiAgICBwYWRkaW5nOiAxOHB4O1xyXG4gICAgYm9yZGVyLXJhZGl1czogMThweDtcclxuICAgIGJvcmRlcjogMXB4IHNvbGlkIHJnYmEoMCwgMCwgMCwgMC4wOCk7XHJcbiAgICBiYWNrZ3JvdW5kOiByZ2JhKDI1NSwgMjU1LCAyNTUsIDAuNzIpO1xyXG4gICAgYm94LXNoYWRvdzogMCAxMnB4IDMwcHggcmdiYSgwLCAwLCAwLCAwLjA1KTtcclxuICAgIGJhY2tkcm9wLWZpbHRlcjogYmx1cigxMHB4KTtcclxuICB9XHJcbiAgXHJcbiAgLmNjLXRpdGxlLXdyYXAge1xyXG4gICAgZGlzcGxheTogZmxleDtcclxuICAgIGZsZXgtZGlyZWN0aW9uOiBjb2x1bW47XHJcbiAgICBnYXA6IDZweDtcclxuICB9XHJcbiAgXHJcbiAgLmNjLXRpdGxlIHtcclxuICAgIG1hcmdpbjogMDtcclxuICAgIGZvbnQtc2l6ZTogMjZweDtcclxuICAgIGxpbmUtaGVpZ2h0OiAxLjE1O1xyXG4gICAgZm9udC13ZWlnaHQ6IDc1MDtcclxuICAgIGxldHRlci1zcGFjaW5nOiAtMC4zcHg7XHJcbiAgfVxyXG4gIFxyXG4gIC5jYy1zdWJ0aXRsZSB7XHJcbiAgICBtYXJnaW46IDA7XHJcbiAgICBmb250LXNpemU6IDE0cHg7XHJcbiAgICBsaW5lLWhlaWdodDogMS40NTtcclxuICAgIG9wYWNpdHk6IDAuNzI7XHJcbiAgICBtYXgtd2lkdGg6IDc2MHB4O1xyXG4gIH1cclxuICBcclxuICAuY2MtYWN0aW9ucyB7XHJcbiAgICBkaXNwbGF5OiBmbGV4O1xyXG4gICAgYWxpZ24taXRlbXM6IGNlbnRlcjtcclxuICAgIGdhcDogMTBweDtcclxuICB9XHJcbiAgXHJcbiAgLyogQWxlcnRzICovXHJcbiAgLmNjLWFsZXJ0IHtcclxuICAgIHBhZGRpbmc6IDEycHggMTRweDtcclxuICAgIGJvcmRlci1yYWRpdXM6IDE0cHg7XHJcbiAgICBib3JkZXI6IDFweCBzb2xpZCB0cmFuc3BhcmVudDtcclxuICAgIGJhY2tncm91bmQ6IHJnYmEoMjU1LCAyNTUsIDI1NSwgMC42OCk7XHJcbiAgICBib3gtc2hhZG93OiAwIDEwcHggMjRweCByZ2JhKDAsIDAsIDAsIDAuMDQpO1xyXG4gIH1cclxuICBcclxuICAuY2MtYWxlcnQtLWVycm9yIHtcclxuICAgIGJvcmRlci1jb2xvcjogcmdiYSgyNTUsIDcwLCA3MCwgMC4yMik7XHJcbiAgICBiYWNrZ3JvdW5kOiByZ2JhKDI1NSwgNzAsIDcwLCAwLjA4KTtcclxuICB9XHJcbiAgXHJcbiAgLmNjLWFsZXJ0LS1zdWNjZXNzIHtcclxuICAgIGJvcmRlci1jb2xvcjogcmdiYSgwLCAyMDAsIDEyMCwgMC4yMik7XHJcbiAgICBiYWNrZ3JvdW5kOiByZ2JhKDAsIDIwMCwgMTIwLCAwLjEwKTtcclxuICB9XHJcbiAgXHJcbiAgLyogQ2FyZCAqL1xyXG4gIC5jYXJkIHtcclxuICAgIGJvcmRlci1yYWRpdXM6IDE4cHg7XHJcbiAgICBib3JkZXI6IDFweCBzb2xpZCByZ2JhKDAsIDAsIDAsIDAuMDgpO1xyXG4gICAgYmFja2dyb3VuZDogcmdiYSgyNTUsIDI1NSwgMjU1LCAwLjc4KTtcclxuICAgIGJveC1zaGFkb3c6IDAgMTRweCAzNHB4IHJnYmEoMCwgMCwgMCwgMC4wNSk7XHJcbiAgICBvdmVyZmxvdzogaGlkZGVuO1xyXG4gIH1cclxuICBcclxuICAvKiBDYXJkIGhlYWRlciAqL1xyXG4gIC5jYXJkLWhlYWRlciB7XHJcbiAgICBkaXNwbGF5OiBmbGV4O1xyXG4gICAgYWxpZ24taXRlbXM6IGNlbnRlcjtcclxuICAgIGp1c3RpZnktY29udGVudDogc3BhY2UtYmV0d2VlbjtcclxuICAgIGdhcDogMTJweDtcclxuICAgIHBhZGRpbmc6IDE0cHggMTZweDtcclxuICAgIGJvcmRlci1ib3R0b206IDFweCBzb2xpZCByZ2JhKDAsIDAsIDAsIDAuMDYpO1xyXG4gICAgYmFja2dyb3VuZDogcmdiYSgyNTUsIDI1NSwgMjU1LCAwLjkwKTtcclxuICAgIGJhY2tkcm9wLWZpbHRlcjogYmx1cig4cHgpO1xyXG4gIH1cclxuICBcclxuICAuY2FyZC10aXRsZSB7XHJcbiAgICBtYXJnaW46IDA7XHJcbiAgICBmb250LXNpemU6IDE1cHg7XHJcbiAgICBmb250LXdlaWdodDogNzUwO1xyXG4gICAgbGV0dGVyLXNwYWNpbmc6IC0wLjFweDtcclxuICB9XHJcbiAgXHJcbiAgLmJhZGdlIHtcclxuICAgIGRpc3BsYXk6IGlubGluZS1mbGV4O1xyXG4gICAgYWxpZ24taXRlbXM6IGNlbnRlcjtcclxuICAgIGdhcDogOHB4O1xyXG4gICAgZm9udC1zaXplOiAxMnB4O1xyXG4gICAgcGFkZGluZzogNnB4IDEwcHg7XHJcbiAgICBib3JkZXItcmFkaXVzOiA5OTlweDtcclxuICAgIGJvcmRlcjogMXB4IHNvbGlkIHJnYmEoMTEwLCAxNjAsIDI1NSwgMC4yNSk7XHJcbiAgICBiYWNrZ3JvdW5kOiByZ2JhKDExMCwgMTYwLCAyNTUsIDAuMTIpO1xyXG4gICAgY29sb3I6IGluaGVyaXQ7XHJcbiAgfVxyXG4gIFxyXG4gIC8qIEZvcm0gKi9cclxuICAuZm9ybSB7XHJcbiAgICBwYWRkaW5nOiAxOHB4O1xyXG4gICAgZGlzcGxheTogZmxleDtcclxuICAgIGZsZXgtZGlyZWN0aW9uOiBjb2x1bW47XHJcbiAgICBnYXA6IDE0cHg7XHJcbiAgfVxyXG4gIFxyXG4gIC8qIEZpZWxkcyAqL1xyXG4gIC5maWVsZCB7XHJcbiAgICBkaXNwbGF5OiBmbGV4O1xyXG4gICAgZmxleC1kaXJlY3Rpb246IGNvbHVtbjtcclxuICAgIGdhcDogN3B4O1xyXG4gIH1cclxuICBcclxuICAubGFiZWwge1xyXG4gICAgZm9udC1zaXplOiAxM3B4O1xyXG4gICAgZm9udC13ZWlnaHQ6IDY1MDtcclxuICAgIG9wYWNpdHk6IDAuODY7XHJcbiAgfVxyXG4gIFxyXG4gIC8qIElucHV0cyAvIFRleHRhcmVhIC8gU2VsZWN0ICovXHJcbiAgLmlucHV0LFxyXG4gIC50ZXh0YXJlYSxcclxuICAuc2VsZWN0IHtcclxuICAgIHdpZHRoOiAxMDAlO1xyXG4gICAgYm9yZGVyLXJhZGl1czogMTRweDtcclxuICAgIGJvcmRlcjogMXB4IHNvbGlkIHJnYmEoMCwgMCwgMCwgMC4xMCk7XHJcbiAgICBiYWNrZ3JvdW5kOiByZ2JhKDI1NSwgMjU1LCAyNTUsIDAuODUpO1xyXG4gICAgcGFkZGluZzogMTJweCAxMnB4O1xyXG4gICAgb3V0bGluZTogbm9uZTtcclxuICAgIHRyYW5zaXRpb246IGJveC1zaGFkb3cgMC4xNXMgZWFzZSwgYm9yZGVyLWNvbG9yIDAuMTVzIGVhc2UsIHRyYW5zZm9ybSAwLjEycyBlYXNlLCBiYWNrZ3JvdW5kIDAuMTVzIGVhc2U7XHJcbiAgICBjb2xvcjogaW5oZXJpdDtcclxuICB9XHJcbiAgXHJcbiAgLmlucHV0OjpwbGFjZWhvbGRlcixcclxuICAudGV4dGFyZWE6OnBsYWNlaG9sZGVyIHtcclxuICAgIG9wYWNpdHk6IDAuNjtcclxuICB9XHJcbiAgXHJcbiAgLmlucHV0OmZvY3VzLFxyXG4gIC50ZXh0YXJlYTpmb2N1cyxcclxuICAuc2VsZWN0OmZvY3VzIHtcclxuICAgIGJvcmRlci1jb2xvcjogcmdiYSgxMTAsIDE2MCwgMjU1LCAwLjU1KTtcclxuICAgIGJveC1zaGFkb3c6IDAgMCAwIDRweCByZ2JhKDExMCwgMTYwLCAyNTUsIDAuMTgpO1xyXG4gIH1cclxuICBcclxuICAudGV4dGFyZWEge1xyXG4gICAgcmVzaXplOiB2ZXJ0aWNhbDtcclxuICAgIG1pbi1oZWlnaHQ6IDE0MHB4O1xyXG4gIH1cclxuICBcclxuICAuc2VsZWN0IHtcclxuICAgIGFwcGVhcmFuY2U6IG5vbmU7XHJcbiAgICBiYWNrZ3JvdW5kLWltYWdlOlxyXG4gICAgICBsaW5lYXItZ3JhZGllbnQoNDVkZWcsIHRyYW5zcGFyZW50IDUwJSwgcmdiYSgwLDAsMCwwLjU1KSA1MCUpLFxyXG4gICAgICBsaW5lYXItZ3JhZGllbnQoMTM1ZGVnLCByZ2JhKDAsMCwwLDAuNTUpIDUwJSwgdHJhbnNwYXJlbnQgNTAlKTtcclxuICAgIGJhY2tncm91bmQtcG9zaXRpb246XHJcbiAgICAgIGNhbGMoMTAwJSAtIDE4cHgpIGNhbGMoNTAlIC0gM3B4KSxcclxuICAgICAgY2FsYygxMDAlIC0gMTNweCkgY2FsYyg1MCUgLSAzcHgpO1xyXG4gICAgYmFja2dyb3VuZC1zaXplOiA2cHggNnB4LCA2cHggNnB4O1xyXG4gICAgYmFja2dyb3VuZC1yZXBlYXQ6IG5vLXJlcGVhdDtcclxuICAgIHBhZGRpbmctcmlnaHQ6IDM4cHg7XHJcbiAgfVxyXG4gIFxyXG4gIC5zZWxlY3Q6ZGlzYWJsZWQge1xyXG4gICAgb3BhY2l0eTogMC42NTtcclxuICAgIGN1cnNvcjogbm90LWFsbG93ZWQ7XHJcbiAgICBmaWx0ZXI6IGdyYXlzY2FsZSgwLjE1KTtcclxuICB9XHJcbiAgXHJcbiAgLyogVHdvIGNvbHVtbnMgcm93ICovXHJcbiAgLnJvdyB7XHJcbiAgICBkaXNwbGF5OiBncmlkO1xyXG4gICAgZ3JpZC10ZW1wbGF0ZS1jb2x1bW5zOiAxZnIgMWZyO1xyXG4gICAgZ2FwOiAxMnB4O1xyXG4gIH1cclxuICBcclxuICAvKiBIaW50ICovXHJcbiAgLmhpbnQge1xyXG4gICAgZm9udC1zaXplOiAxMnB4O1xyXG4gICAgb3BhY2l0eTogMC43NTtcclxuICAgIGxpbmUtaGVpZ2h0OiAxLjM1O1xyXG4gIH1cclxuICBcclxuICAuaGludC5lcnJvciB7XHJcbiAgICBvcGFjaXR5OiAxO1xyXG4gICAgY29sb3I6ICNkOTM5Mzk7XHJcbiAgfVxyXG4gIFxyXG4gIC8qIElubmVyIHNlY3Rpb24gKGltYWdlIGNhcmQpICovXHJcbiAgLmNhcmQtaW5uZXIge1xyXG4gICAgbWFyZ2luLXRvcDogNHB4O1xyXG4gICAgcGFkZGluZzogMTRweDtcclxuICAgIGJvcmRlci1yYWRpdXM6IDE2cHg7XHJcbiAgICBib3JkZXI6IDFweCBzb2xpZCByZ2JhKDAsIDAsIDAsIDAuMDYpO1xyXG4gICAgYmFja2dyb3VuZDogcmdiYSgwLCAwLCAwLCAwLjAyKTtcclxuICB9XHJcbiAgXHJcbiAgLnNlY3Rpb24taGVhZCB7XHJcbiAgICBkaXNwbGF5OiBmbGV4O1xyXG4gICAgZmxleC1kaXJlY3Rpb246IGNvbHVtbjtcclxuICAgIGdhcDogNHB4O1xyXG4gICAgbWFyZ2luLWJvdHRvbTogMTBweDtcclxuICB9XHJcbiAgXHJcbiAgLnNlY3Rpb24tdGl0bGUge1xyXG4gICAgbWFyZ2luOiAwO1xyXG4gICAgZm9udC1zaXplOiAxM3B4O1xyXG4gICAgZm9udC13ZWlnaHQ6IDc1MDtcclxuICAgIGxldHRlci1zcGFjaW5nOiAtMC4xcHg7XHJcbiAgfVxyXG4gIFxyXG4gIC5zZWN0aW9uLXN1YnRpdGxlIHtcclxuICAgIG1hcmdpbjogMDtcclxuICAgIGZvbnQtc2l6ZTogMTJweDtcclxuICAgIG9wYWNpdHk6IDAuNzI7XHJcbiAgICBsaW5lLWhlaWdodDogMS4zNTtcclxuICB9XHJcbiAgXHJcbiAgLyogVXBsb2FkIHJvdyAqL1xyXG4gIC51cGxvYWQtcm93IHtcclxuICAgIGRpc3BsYXk6IGdyaWQ7XHJcbiAgICBncmlkLXRlbXBsYXRlLWNvbHVtbnM6IDFmciAyNDBweDtcclxuICAgIGdhcDogMTJweDtcclxuICAgIGFsaWduLWl0ZW1zOiBzdHJldGNoO1xyXG4gICAgbWFyZ2luLWJvdHRvbTogMTBweDtcclxuICB9XHJcbiAgXHJcbiAgLyogVXBsb2FkIGJveCAqL1xyXG4gIC51cGxvYWQtYm94IHtcclxuICAgIHBvc2l0aW9uOiByZWxhdGl2ZTtcclxuICAgIGJvcmRlci1yYWRpdXM6IDE2cHg7XHJcbiAgICBib3JkZXI6IDFweCBkYXNoZWQgcmdiYSgwLCAwLCAwLCAwLjE4KTtcclxuICAgIGJhY2tncm91bmQ6IHJnYmEoMjU1LCAyNTUsIDI1NSwgMC41NSk7XHJcbiAgICBwYWRkaW5nOiAxNHB4O1xyXG4gICAgZGlzcGxheTogZmxleDtcclxuICAgIGdhcDogMTJweDtcclxuICAgIGFsaWduLWl0ZW1zOiBjZW50ZXI7XHJcbiAgICBvdmVyZmxvdzogaGlkZGVuO1xyXG4gIH1cclxuICBcclxuICAuZmlsZSB7XHJcbiAgICB3aWR0aDogMTYwcHg7XHJcbiAgICBtYXgtd2lkdGg6IDQ1JTtcclxuICB9XHJcbiAgXHJcbiAgLnVwbG9hZC1oaW50IHtcclxuICAgIGRpc3BsYXk6IGZsZXg7XHJcbiAgICBmbGV4LWRpcmVjdGlvbjogY29sdW1uO1xyXG4gICAgZ2FwOiA0cHg7XHJcbiAgICBtaW4td2lkdGg6IDA7XHJcbiAgfVxyXG4gIFxyXG4gIC51cGxvYWQtdGl0bGUge1xyXG4gICAgZm9udC1zaXplOiAxM3B4O1xyXG4gICAgZm9udC13ZWlnaHQ6IDc1MDtcclxuICAgIG9wYWNpdHk6IDAuOTtcclxuICB9XHJcbiAgXHJcbiAgLnVwbG9hZC1zdWIge1xyXG4gICAgZm9udC1zaXplOiAxMnB4O1xyXG4gICAgb3BhY2l0eTogMC43MjtcclxuICAgIGxpbmUtaGVpZ2h0OiAxLjM1O1xyXG4gIH1cclxuICBcclxuICAvKiBQcmV2aWV3ICovXHJcbiAgLnByZXZpZXcge1xyXG4gICAgYm9yZGVyLXJhZGl1czogMTZweDtcclxuICAgIGJvcmRlcjogMXB4IHNvbGlkIHJnYmEoMCwgMCwgMCwgMC4xMCk7XHJcbiAgICBiYWNrZ3JvdW5kOiByZ2JhKDI1NSwgMjU1LCAyNTUsIDAuNzUpO1xyXG4gICAgb3ZlcmZsb3c6IGhpZGRlbjtcclxuICAgIGRpc3BsYXk6IGZsZXg7XHJcbiAgICBmbGV4LWRpcmVjdGlvbjogY29sdW1uO1xyXG4gIH1cclxuICBcclxuICAucHJldmlldyBpbWcge1xyXG4gICAgd2lkdGg6IDEwMCU7XHJcbiAgICBoZWlnaHQ6IDE1MHB4O1xyXG4gICAgb2JqZWN0LWZpdDogY292ZXI7XHJcbiAgICBkaXNwbGF5OiBibG9jaztcclxuICB9XHJcbiAgXHJcbiAgLnByZXZpZXcgLmJ0biB7XHJcbiAgICBib3JkZXItcmFkaXVzOiAwO1xyXG4gICAgYm9yZGVyLWxlZnQ6IDA7XHJcbiAgICBib3JkZXItcmlnaHQ6IDA7XHJcbiAgICBib3JkZXItYm90dG9tOiAwO1xyXG4gICAganVzdGlmeS1jb250ZW50OiBjZW50ZXI7XHJcbiAgfVxyXG4gIFxyXG4gIC5wcmV2aWV3LS1lbXB0eSB7XHJcbiAgICBkaXNwbGF5OiBncmlkO1xyXG4gICAgcGxhY2UtaXRlbXM6IGNlbnRlcjtcclxuICAgIG1pbi1oZWlnaHQ6IDE1MHB4O1xyXG4gIH1cclxuICBcclxuICAucHJldmlldy10ZXh0IHtcclxuICAgIGZvbnQtc2l6ZTogMTJweDtcclxuICAgIG9wYWNpdHk6IDAuNztcclxuICAgIHBhZGRpbmc6IDEwcHg7XHJcbiAgICB0ZXh0LWFsaWduOiBjZW50ZXI7XHJcbiAgfVxyXG4gIFxyXG4gIC8qIElubGluZSBpbmZvICovXHJcbiAgLmlubGluZS1pbmZvIHtcclxuICAgIG1hcmdpbi10b3A6IDhweDtcclxuICAgIHBhZGRpbmc6IDEwcHggMTJweDtcclxuICAgIGJvcmRlci1yYWRpdXM6IDE0cHg7XHJcbiAgICBib3JkZXI6IDFweCBzb2xpZCByZ2JhKDExMCwgMTYwLCAyNTUsIDAuMjIpO1xyXG4gICAgYmFja2dyb3VuZDogcmdiYSgxMTAsIDE2MCwgMjU1LCAwLjEwKTtcclxuICAgIGZvbnQtc2l6ZTogMTJweDtcclxuICAgIG9wYWNpdHk6IDAuOTtcclxuICB9XHJcbiAgXHJcbiAgLyogQnV0dG9ucyAqL1xyXG4gIC5idG4ge1xyXG4gICAgYm9yZGVyOiAxcHggc29saWQgcmdiYSgwLCAwLCAwLCAwLjEwKTtcclxuICAgIGJhY2tncm91bmQ6IHJnYmEoMjU1LCAyNTUsIDI1NSwgMC44MCk7XHJcbiAgICBjb2xvcjogaW5oZXJpdDtcclxuICAgIHBhZGRpbmc6IDEwcHggMTJweDtcclxuICAgIGJvcmRlci1yYWRpdXM6IDE0cHg7XHJcbiAgICBjdXJzb3I6IHBvaW50ZXI7XHJcbiAgICB0ZXh0LWRlY29yYXRpb246IG5vbmU7XHJcbiAgICBkaXNwbGF5OiBpbmxpbmUtZmxleDtcclxuICAgIGFsaWduLWl0ZW1zOiBjZW50ZXI7XHJcbiAgICBqdXN0aWZ5LWNvbnRlbnQ6IGNlbnRlcjtcclxuICAgIGdhcDogOHB4O1xyXG4gICAgdHJhbnNpdGlvbjogdHJhbnNmb3JtIDAuMTJzIGVhc2UsIGJveC1zaGFkb3cgMC4xMnMgZWFzZSwgYmFja2dyb3VuZCAwLjEycyBlYXNlLCBib3JkZXItY29sb3IgMC4xMnMgZWFzZTtcclxuICAgIHVzZXItc2VsZWN0OiBub25lO1xyXG4gIH1cclxuICBcclxuICAuYnRuOmhvdmVyIHtcclxuICAgIHRyYW5zZm9ybTogdHJhbnNsYXRlWSgtMXB4KTtcclxuICAgIGJhY2tncm91bmQ6IHJnYmEoMjU1LCAyNTUsIDI1NSwgMC45NSk7XHJcbiAgICBib3gtc2hhZG93OiAwIDEwcHggMjJweCByZ2JhKDAsIDAsIDAsIDAuMDYpO1xyXG4gIH1cclxuICBcclxuICAuYnRuOmFjdGl2ZSB7XHJcbiAgICB0cmFuc2Zvcm06IHRyYW5zbGF0ZVkoMCk7XHJcbiAgICBib3gtc2hhZG93OiBub25lO1xyXG4gIH1cclxuICBcclxuICAuYnRuOmRpc2FibGVkIHtcclxuICAgIG9wYWNpdHk6IDAuNjtcclxuICAgIGN1cnNvcjogbm90LWFsbG93ZWQ7XHJcbiAgICB0cmFuc2Zvcm06IG5vbmU7XHJcbiAgICBib3gtc2hhZG93OiBub25lO1xyXG4gIH1cclxuICBcclxuICAvKiBWYXJpYW50cyAqL1xyXG4gIC5idG4tcHJpbWFyeSB7XHJcbiAgICBib3JkZXItY29sb3I6IHJnYmEoMTEwLCAxNjAsIDI1NSwgMC4zMCk7XHJcbiAgICBiYWNrZ3JvdW5kOiByZ2JhKDExMCwgMTYwLCAyNTUsIDAuMTgpO1xyXG4gIH1cclxuICBcclxuICAuYnRuLXNlY29uZGFyeSB7XHJcbiAgICBiYWNrZ3JvdW5kOiByZ2JhKDI1NSwgMjU1LCAyNTUsIDAuNjUpO1xyXG4gIH1cclxuICBcclxuICAuYnRuLWRhbmdlciB7XHJcbiAgICBib3JkZXItY29sb3I6IHJnYmEoMjU1LCA5MCwgOTAsIDAuMjUpO1xyXG4gICAgYmFja2dyb3VuZDogcmdiYSgyNTUsIDkwLCA5MCwgMC4xMik7XHJcbiAgfVxyXG4gIFxyXG4gIC5idG4tc21hbGwge1xyXG4gICAgcGFkZGluZzogOXB4IDEwcHg7XHJcbiAgICBib3JkZXItcmFkaXVzOiAxMnB4O1xyXG4gICAgZm9udC1zaXplOiAxMnB4O1xyXG4gIH1cclxuICBcclxuICAvKiBGb3JtIGFjdGlvbnMgKi9cclxuICAuZm9ybS1hY3Rpb25zIHtcclxuICAgIGRpc3BsYXk6IGZsZXg7XHJcbiAgICBnYXA6IDEwcHg7XHJcbiAgICBmbGV4LXdyYXA6IHdyYXA7XHJcbiAgICBwYWRkaW5nLXRvcDogNHB4O1xyXG4gICAgbWFyZ2luLXRvcDogNHB4O1xyXG4gIH1cclxuICBcclxuICAvKiBEYXJrIHRoZW1lIHRvbGVyYW5jZSAqL1xyXG4gIDpob3N0LWNvbnRleHQoLmRhcmstdGhlbWUpIC5jYy1oZWFkZXIsXHJcbiAgOmhvc3QtY29udGV4dCguZGFyay10aGVtZSkgLmNhcmQsXHJcbiAgOmhvc3QtY29udGV4dCguZGFyay10aGVtZSkgLmNjLWFsZXJ0IHtcclxuICAgIGJvcmRlci1jb2xvcjogcmdiYSgyNTUsIDI1NSwgMjU1LCAwLjE0KTtcclxuICAgIGJhY2tncm91bmQ6IHJnYmEoMjU1LCAyNTUsIDI1NSwgMC4wNSk7XHJcbiAgICBib3gtc2hhZG93OiBub25lO1xyXG4gIH1cclxuICBcclxuICA6aG9zdC1jb250ZXh0KC5kYXJrLXRoZW1lKSAuY2FyZC1oZWFkZXIge1xyXG4gICAgYm9yZGVyLWJvdHRvbS1jb2xvcjogcmdiYSgyNTUsIDI1NSwgMjU1LCAwLjEwKTtcclxuICAgIGJhY2tncm91bmQ6IHJnYmEoMTIsIDE2LCAyNCwgMC41NSk7XHJcbiAgfVxyXG4gIFxyXG4gIDpob3N0LWNvbnRleHQoLmRhcmstdGhlbWUpIC5pbnB1dCxcclxuICA6aG9zdC1jb250ZXh0KC5kYXJrLXRoZW1lKSAudGV4dGFyZWEsXHJcbiAgOmhvc3QtY29udGV4dCguZGFyay10aGVtZSkgLnNlbGVjdCB7XHJcbiAgICBib3JkZXItY29sb3I6IHJnYmEoMjU1LCAyNTUsIDI1NSwgMC4xNCk7XHJcbiAgICBiYWNrZ3JvdW5kOiByZ2JhKDI1NSwgMjU1LCAyNTUsIDAuMDYpO1xyXG4gIH1cclxuICBcclxuICA6aG9zdC1jb250ZXh0KC5kYXJrLXRoZW1lKSAudXBsb2FkLWJveCxcclxuICA6aG9zdC1jb250ZXh0KC5kYXJrLXRoZW1lKSAuY2FyZC1pbm5lciB7XHJcbiAgICBib3JkZXItY29sb3I6IHJnYmEoMjU1LCAyNTUsIDI1NSwgMC4xNik7XHJcbiAgICBiYWNrZ3JvdW5kOiByZ2JhKDI1NSwgMjU1LCAyNTUsIDAuMDQpO1xyXG4gIH1cclxuICBcclxuICA6aG9zdC1jb250ZXh0KC5kYXJrLXRoZW1lKSAuYnRuIHtcclxuICAgIGJvcmRlci1jb2xvcjogcmdiYSgyNTUsIDI1NSwgMjU1LCAwLjE0KTtcclxuICAgIGJhY2tncm91bmQ6IHJnYmEoMjU1LCAyNTUsIDI1NSwgMC4wNik7XHJcbiAgfVxyXG4gIFxyXG4gIDpob3N0LWNvbnRleHQoLmRhcmstdGhlbWUpIC5zZWxlY3Qge1xyXG4gICAgYmFja2dyb3VuZC1pbWFnZTpcclxuICAgICAgbGluZWFyLWdyYWRpZW50KDQ1ZGVnLCB0cmFuc3BhcmVudCA1MCUsIHJnYmEoMjU1LDI1NSwyNTUsMC42NSkgNTAlKSxcclxuICAgICAgbGluZWFyLWdyYWRpZW50KDEzNWRlZywgcmdiYSgyNTUsMjU1LDI1NSwwLjY1KSA1MCUsIHRyYW5zcGFyZW50IDUwJSk7XHJcbiAgfVxyXG4gIFxyXG4gIC8qIFJlc3BvbnNpdmUgKi9cclxuICBAbWVkaWEgKG1heC13aWR0aDogOTAwcHgpIHtcclxuICAgIC5jYyB7XHJcbiAgICAgIHBhZGRpbmc6IDE2cHg7XHJcbiAgICB9XHJcbiAgXHJcbiAgICAuY2MtaGVhZGVyIHtcclxuICAgICAgZmxleC1kaXJlY3Rpb246IGNvbHVtbjtcclxuICAgICAgYWxpZ24taXRlbXM6IGZsZXgtc3RhcnQ7XHJcbiAgICB9XHJcbiAgXHJcbiAgICAucm93IHtcclxuICAgICAgZ3JpZC10ZW1wbGF0ZS1jb2x1bW5zOiAxZnI7XHJcbiAgICB9XHJcbiAgXHJcbiAgICAudXBsb2FkLXJvdyB7XHJcbiAgICAgIGdyaWQtdGVtcGxhdGUtY29sdW1uczogMWZyO1xyXG4gICAgfVxyXG4gIFxyXG4gICAgLnByZXZpZXcgaW1nLFxyXG4gICAgLnByZXZpZXctLWVtcHR5IHtcclxuICAgICAgaGVpZ2h0OiAxODBweDtcclxuICAgICAgbWluLWhlaWdodDogMTgwcHg7XHJcbiAgICB9XHJcbiAgXHJcbiAgICAuZmlsZSB7XHJcbiAgICAgIHdpZHRoOiAxMDAlO1xyXG4gICAgICBtYXgtd2lkdGg6IDEwMCU7XHJcbiAgICB9XHJcbiAgfSJdLCJzb3VyY2VSb290IjoiIn0= */"]
    });
  }
}

/***/ }),

/***/ 8062:
/*!**********************************************************************!*\
  !*** ./src/app/back-office/create-lesson/create-lesson.component.ts ***!
  \**********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   CreateLessonComponent: () => (/* binding */ CreateLessonComponent)
/* harmony export */ });
/* harmony import */ var _angular_forms__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/forms */ 4456);
/* harmony import */ var _angular_common_http__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/common/http */ 6443);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ 7580);
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/router */ 5072);
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @angular/common */ 316);







function CreateLessonComponent_small_11_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](0, "small");
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](1, " Title is required (max 160 characters). ");
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
  }
}
function CreateLessonComponent_small_16_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](0, "small");
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](1, " Order index is required and must be \u2265 1. ");
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
  }
}
function CreateLessonComponent_div_33_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](0, "div", 16);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const ctx_r2 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtextInterpolate1"](" ", ctx_r2.error, " ");
  }
}
function CreateLessonComponent_div_34_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](0, "div", 17);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const ctx_r3 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtextInterpolate1"](" ", ctx_r3.success, " ");
  }
}
class CreateLessonComponent {
  constructor(fb, http, route, router) {
    this.fb = fb;
    this.http = http;
    this.route = route;
    this.router = router;
    this.saving = false;
    this.error = null;
    this.success = null;
    this.API_URL = '/api/lesson/instructor';
  }
  ngOnInit() {
    this.courseId = Number(this.route.snapshot.paramMap.get('courseId'));
    if (!this.courseId || Number.isNaN(this.courseId)) {
      this.error = 'Missing courseId in route.';
      return;
    }
    this.form = this.fb.group({
      courseId: [this.courseId, [_angular_forms__WEBPACK_IMPORTED_MODULE_1__.Validators.required]],
      title: ['', [_angular_forms__WEBPACK_IMPORTED_MODULE_1__.Validators.required, _angular_forms__WEBPACK_IMPORTED_MODULE_1__.Validators.maxLength(160)]],
      contentText: [''],
      // User can paste full URL; we will extract ID before sending
      youtubeVideoId: ['', [_angular_forms__WEBPACK_IMPORTED_MODULE_1__.Validators.maxLength(200)]],
      // Optional: can be empty string; we will send null
      pdfRef: ['', [_angular_forms__WEBPACK_IMPORTED_MODULE_1__.Validators.maxLength(255)]],
      // REQUIRED by backend
      orderIndex: [1, [_angular_forms__WEBPACK_IMPORTED_MODULE_1__.Validators.required, _angular_forms__WEBPACK_IMPORTED_MODULE_1__.Validators.min(1)]]
    });
  }
  authHeaders() {
    const token = localStorage.getItem('token');
    let headers = new _angular_common_http__WEBPACK_IMPORTED_MODULE_2__.HttpHeaders();
    if (token) headers = headers.set('Authorization', `Bearer ${token}`);
    return headers;
  }
  extractYoutubeId(input) {
    const s = (input || '').trim();
    if (!s) return null;
    // ID already
    if (/^[a-zA-Z0-9_-]{6,32}$/.test(s) && !s.includes('http')) return s;
    const m1 = s.match(/[?&]v=([^&]+)/);
    if (m1?.[1]) return m1[1].substring(0, 32);
    const m2 = s.match(/youtu\.be\/([^?&]+)/);
    if (m2?.[1]) return m2[1].substring(0, 32);
    const m3 = s.match(/\/embed\/([^?&]+)/);
    if (m3?.[1]) return m3[1].substring(0, 32);
    return null;
  }
  submit() {
    this.error = null;
    this.success = null;
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const raw = this.form.getRawValue();
    const youtubeId = this.extractYoutubeId(String(raw.youtubeVideoId || ''));
    // If user typed something but we couldn't parse it -> block
    if (String(raw.youtubeVideoId || '').trim() && !youtubeId) {
      this.error = 'Invalid YouTube link/ID. Please provide a valid YouTube URL or just the ID.';
      return;
    }
    const pdf = String(raw.pdfRef || '').trim();
    const payload = {
      courseId: Number(raw.courseId),
      title: String(raw.title || '').trim(),
      contentText: String(raw.contentText || '').trim() || null,
      youtubeVideoId: youtubeId || null,
      pdfRef: pdf ? pdf : null,
      orderIndex: Number(raw.orderIndex)
    };
    if (!payload.title) {
      this.error = 'Title is required.';
      return;
    }
    if (!payload.orderIndex || Number.isNaN(payload.orderIndex) || payload.orderIndex < 1) {
      this.error = 'Order index must be >= 1.';
      return;
    }
    // DTO limit safety
    if (payload.youtubeVideoId && payload.youtubeVideoId.length > 32) {
      this.error = 'YouTube ID is too long (max 32 characters).';
      return;
    }
    this.saving = true;
    this.http.post(this.API_URL, payload, {
      headers: this.authHeaders()
    }).subscribe({
      next: () => {
        this.saving = false;
        this.success = 'Lesson created successfully.';
        // Go back to builder
        setTimeout(() => {
          this.router.navigate(['/back-office/trainer/courses', this.courseId, 'builder']);
        }, 500);
      },
      error: err => {
        this.saving = false;
        const msg = err?.error?.message || err?.error?.error || (typeof err?.error === 'string' ? err.error : null) || err?.message || 'Failed to create lesson.';
        this.error = msg;
      }
    });
  }
  resetForm() {
    if (!this.form) return;
    this.form.reset({
      courseId: this.courseId,
      title: '',
      orderIndex: 1,
      contentText: '',
      youtubeVideoId: '',
      pdfRef: ''
    });
    this.error = null;
    this.success = null;
  }
  cancel() {
    this.router.navigate(['/back-office/trainer/courses', this.courseId, 'builder']);
  }
  static {
    this.ɵfac = function CreateLessonComponent_Factory(t) {
      return new (t || CreateLessonComponent)(_angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdirectiveInject"](_angular_forms__WEBPACK_IMPORTED_MODULE_1__.FormBuilder), _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdirectiveInject"](_angular_common_http__WEBPACK_IMPORTED_MODULE_2__.HttpClient), _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdirectiveInject"](_angular_router__WEBPACK_IMPORTED_MODULE_3__.ActivatedRoute), _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdirectiveInject"](_angular_router__WEBPACK_IMPORTED_MODULE_3__.Router));
    };
  }
  static {
    this.ɵcmp = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdefineComponent"]({
      type: CreateLessonComponent,
      selectors: [["app-create-lesson"]],
      decls: 40,
      vars: 8,
      consts: [[1, "create-lesson-container"], [1, "header"], ["type", "button", 1, "back-btn", 3, "click"], ["novalidate", "", 1, "lesson-form", 3, "formGroup", "ngSubmit"], [1, "form-group"], ["type", "text", "formControlName", "title", "placeholder", "e.g. Introduction to Spring Boot"], [4, "ngIf"], ["type", "number", "min", "1", "step", "1", "formControlName", "orderIndex", "placeholder", "1"], ["formControlName", "contentText", "rows", "6", "placeholder", "Write the lesson explanation or instructions..."], ["type", "text", "formControlName", "youtubeVideoId", "placeholder", "ID: dQw4w9WgXcQ or URL: https://youtu.be/dQw4w9WgXcQ"], ["type", "text", "formControlName", "pdfRef", "placeholder", "e.g. cloudinary public_id or direct PDF URL"], ["class", "error", 4, "ngIf"], ["class", "success", 4, "ngIf"], [1, "buttons"], ["type", "submit", 3, "disabled"], ["type", "button", 1, "reset-btn", 3, "disabled", "click"], [1, "error"], [1, "success"]],
      template: function CreateLessonComponent_Template(rf, ctx) {
        if (rf & 1) {
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](0, "div", 0)(1, "div", 1)(2, "h2");
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](3, "Create Lesson");
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](4, "button", 2);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵlistener"]("click", function CreateLessonComponent_Template_button_click_4_listener() {
            return ctx.cancel();
          });
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](5, "\u2190 Back to Builder");
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]()();
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](6, "form", 3);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵlistener"]("ngSubmit", function CreateLessonComponent_Template_form_ngSubmit_6_listener() {
            return ctx.submit();
          });
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](7, "div", 4)(8, "label");
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](9, "Lesson Title");
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](10, "input", 5);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtemplate"](11, CreateLessonComponent_small_11_Template, 2, 0, "small", 6);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](12, "div", 4)(13, "label");
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](14, "Order Index");
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](15, "input", 7);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtemplate"](16, CreateLessonComponent_small_16_Template, 2, 0, "small", 6);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](17, "div", 4)(18, "label");
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](19, "Lesson Content (optional)");
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](20, "textarea", 8);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](21, "div", 4)(22, "label");
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](23, "YouTube (ID or URL) (optional)");
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](24, "input", 9);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](25, "small");
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](26, " You can paste a full YouTube link; it will be converted to an ID automatically. ");
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]()();
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](27, "div", 4)(28, "label");
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](29, "PDF Reference (optional)");
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](30, "input", 10);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](31, "small");
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](32, " Leave empty if this lesson has no PDF. (Max 255 characters) ");
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]()();
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtemplate"](33, CreateLessonComponent_div_33_Template, 2, 1, "div", 11);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtemplate"](34, CreateLessonComponent_div_34_Template, 2, 1, "div", 12);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](35, "div", 13)(36, "button", 14);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](37);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](38, "button", 15);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵlistener"]("click", function CreateLessonComponent_Template_button_click_38_listener() {
            return ctx.resetForm();
          });
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](39, " Reset ");
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]()()()();
        }
        if (rf & 2) {
          let tmp_1_0;
          let tmp_2_0;
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](6);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("formGroup", ctx.form);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](5);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("ngIf", ((tmp_1_0 = ctx.form.get("title")) == null ? null : tmp_1_0.touched) && ((tmp_1_0 = ctx.form.get("title")) == null ? null : tmp_1_0.invalid));
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](5);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("ngIf", ((tmp_2_0 = ctx.form.get("orderIndex")) == null ? null : tmp_2_0.touched) && ((tmp_2_0 = ctx.form.get("orderIndex")) == null ? null : tmp_2_0.invalid));
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](17);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("ngIf", ctx.error);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](1);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("ngIf", ctx.success);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](2);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("disabled", ctx.saving || ctx.form.invalid);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](1);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtextInterpolate1"](" ", ctx.saving ? "Creating..." : "Create Lesson", " ");
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](1);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("disabled", ctx.saving);
        }
      },
      dependencies: [_angular_common__WEBPACK_IMPORTED_MODULE_4__.NgIf, _angular_forms__WEBPACK_IMPORTED_MODULE_1__["ɵNgNoValidate"], _angular_forms__WEBPACK_IMPORTED_MODULE_1__.DefaultValueAccessor, _angular_forms__WEBPACK_IMPORTED_MODULE_1__.NumberValueAccessor, _angular_forms__WEBPACK_IMPORTED_MODULE_1__.NgControlStatus, _angular_forms__WEBPACK_IMPORTED_MODULE_1__.NgControlStatusGroup, _angular_forms__WEBPACK_IMPORTED_MODULE_1__.MinValidator, _angular_forms__WEBPACK_IMPORTED_MODULE_1__.FormGroupDirective, _angular_forms__WEBPACK_IMPORTED_MODULE_1__.FormControlName],
      styles: ["\n\n\n\n\n.create-lesson-container[_ngcontent-%COMP%] {\n    max-width: 980px;\n    margin: 40px auto;\n    padding: 0 18px;\n    font-family: system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif;\n    color: #0f172a;\n  }\n  \n  \n\n  .header[_ngcontent-%COMP%] {\n    display: flex;\n    align-items: flex-start;\n    justify-content: space-between;\n    gap: 16px;\n    margin-bottom: 16px;\n  }\n  \n  .header[_ngcontent-%COMP%]   h2[_ngcontent-%COMP%] {\n    margin: 0;\n    font-size: 32px;\n    line-height: 1.15;\n    font-weight: 800;\n    letter-spacing: -0.02em;\n  }\n  \n  \n\n  .back-btn[_ngcontent-%COMP%] {\n    border: 1px solid #e2e8f0;\n    background: #ffffff;\n    color: #0f172a;\n    padding: 10px 14px;\n    border-radius: 12px;\n    font-weight: 600;\n    cursor: pointer;\n    transition: transform 0.08s ease, box-shadow 0.15s ease, border-color 0.15s ease;\n    white-space: nowrap;\n  }\n  \n  .back-btn[_ngcontent-%COMP%]:hover {\n    border-color: #cbd5e1;\n    box-shadow: 0 10px 22px rgba(15, 23, 42, 0.08);\n    transform: translateY(-1px);\n  }\n  \n  .back-btn[_ngcontent-%COMP%]:active {\n    transform: translateY(0);\n    box-shadow: none;\n  }\n  \n  \n\n  .lesson-form[_ngcontent-%COMP%] {\n    background: #ffffff;\n    border: 1px solid #e2e8f0;\n    border-radius: 18px;\n    padding: 22px;\n    box-shadow: 0 14px 34px rgba(15, 23, 42, 0.06);\n  }\n  \n  \n\n  .form-group[_ngcontent-%COMP%] {\n    margin-bottom: 16px;\n  }\n  \n  .form-group[_ngcontent-%COMP%]   label[_ngcontent-%COMP%] {\n    display: block;\n    font-size: 13px;\n    font-weight: 700;\n    color: #0f172a;\n    margin-bottom: 8px;\n  }\n  \n  \n\n  .lesson-form[_ngcontent-%COMP%]   input[type=\"text\"][_ngcontent-%COMP%], .lesson-form[_ngcontent-%COMP%]   input[type=\"number\"][_ngcontent-%COMP%], .lesson-form[_ngcontent-%COMP%]   textarea[_ngcontent-%COMP%] {\n    width: 100%;\n    border: 1px solid #e2e8f0;\n    border-radius: 12px;\n    padding: 12px 12px;\n    font-size: 14px;\n    outline: none;\n    background: #ffffff;\n    transition: border-color 0.15s ease, box-shadow 0.15s ease;\n  }\n  \n  .lesson-form[_ngcontent-%COMP%]   textarea[_ngcontent-%COMP%] {\n    min-height: 150px;\n    resize: vertical;\n    line-height: 1.5;\n  }\n  \n  \n\n  .lesson-form[_ngcontent-%COMP%]   input[_ngcontent-%COMP%]:focus, .lesson-form[_ngcontent-%COMP%]   textarea[_ngcontent-%COMP%]:focus {\n    border-color: #93c5fd; \n\n    box-shadow: 0 0 0 4px rgba(147, 197, 253, 0.35);\n  }\n  \n  \n\n  .lesson-form[_ngcontent-%COMP%]   small[_ngcontent-%COMP%] {\n    display: block;\n    margin-top: 8px;\n    color: #64748b;\n    font-size: 12px;\n    line-height: 1.35;\n  }\n  \n  \n\n  .lesson-form[_ngcontent-%COMP%]   small.ng-star-inserted[_ngcontent-%COMP%] {\n    \n\n  }\n  \n  .form-group[_ngcontent-%COMP%]   small[_ngcontent-%COMP%] {\n    opacity: 0.95;\n  }\n  \n  .form-group[_ngcontent-%COMP%]   small[ng-reflect-ng-if=\"true\"][_ngcontent-%COMP%] {\n    \n\n  }\n  \n  \n\n  .lesson-form[_ngcontent-%COMP%]   .form-group[_ngcontent-%COMP%]:nth-child(1), .lesson-form[_ngcontent-%COMP%]   .form-group[_ngcontent-%COMP%]:nth-child(2) {\n    \n\n  }\n  \n  \n\n\n\n  .row[_ngcontent-%COMP%] {\n    display: grid;\n    grid-template-columns: 1.6fr 0.7fr;\n    gap: 14px;\n  }\n  \n  \n\n  .error[_ngcontent-%COMP%], .success[_ngcontent-%COMP%] {\n    border-radius: 12px;\n    padding: 12px 14px;\n    font-weight: 600;\n    margin: 14px 0;\n    border: 1px solid transparent;\n  }\n  \n  .error[_ngcontent-%COMP%] {\n    background: #fef2f2;\n    border-color: #fecaca;\n    color: #7f1d1d;\n  }\n  \n  .success[_ngcontent-%COMP%] {\n    background: #ecfdf5;\n    border-color: #bbf7d0;\n    color: #065f46;\n  }\n  \n  \n\n  .buttons[_ngcontent-%COMP%] {\n    display: flex;\n    gap: 12px;\n    align-items: center;\n    justify-content: flex-end;\n    margin-top: 10px;\n    padding-top: 16px;\n    border-top: 1px solid #eef2f7;\n  }\n  \n  \n\n  .buttons[_ngcontent-%COMP%]   button[type=\"submit\"][_ngcontent-%COMP%] {\n    border: 1px solid #1d4ed8;\n    background: #2563eb;\n    color: #ffffff;\n    padding: 11px 16px;\n    border-radius: 12px;\n    font-weight: 800;\n    cursor: pointer;\n    transition: transform 0.08s ease, box-shadow 0.15s ease, filter 0.15s ease;\n  }\n  \n  .buttons[_ngcontent-%COMP%]   button[type=\"submit\"][_ngcontent-%COMP%]:hover {\n    box-shadow: 0 14px 30px rgba(37, 99, 235, 0.25);\n    transform: translateY(-1px);\n    filter: brightness(1.02);\n  }\n  \n  .buttons[_ngcontent-%COMP%]   button[type=\"submit\"][_ngcontent-%COMP%]:active {\n    transform: translateY(0);\n    box-shadow: none;\n  }\n  \n  \n\n  .reset-btn[_ngcontent-%COMP%] {\n    border: 1px solid #e2e8f0;\n    background: #ffffff;\n    color: #0f172a;\n    padding: 11px 14px;\n    border-radius: 12px;\n    font-weight: 800;\n    cursor: pointer;\n    transition: transform 0.08s ease, box-shadow 0.15s ease, border-color 0.15s ease;\n  }\n  \n  .reset-btn[_ngcontent-%COMP%]:hover {\n    border-color: #cbd5e1;\n    box-shadow: 0 10px 22px rgba(15, 23, 42, 0.08);\n    transform: translateY(-1px);\n  }\n  \n  .reset-btn[_ngcontent-%COMP%]:active {\n    transform: translateY(0);\n    box-shadow: none;\n  }\n  \n  \n\n  button[disabled][_ngcontent-%COMP%] {\n    opacity: 0.6;\n    cursor: not-allowed;\n    transform: none !important;\n    box-shadow: none !important;\n  }\n  \n  \n\n  input[type=\"number\"][_ngcontent-%COMP%]::-webkit-outer-spin-button, input[type=\"number\"][_ngcontent-%COMP%]::-webkit-inner-spin-button {\n    -webkit-appearance: none;\n    margin: 0;\n  }\n  input[type=\"number\"][_ngcontent-%COMP%] {\n    -moz-appearance: textfield;\n  }\n  \n  \n\n  [_nghost-%COMP%] {\n    display: block;\n  }\n/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8uL3NyYy9hcHAvYmFjay1vZmZpY2UvY3JlYXRlLWxlc3Nvbi9jcmVhdGUtbGVzc29uLmNvbXBvbmVudC5jc3MiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsZ0NBQWdDOztBQUVoQyxpQkFBaUI7QUFDakI7SUFDSSxnQkFBZ0I7SUFDaEIsaUJBQWlCO0lBQ2pCLGVBQWU7SUFDZiwwRUFBMEU7SUFDMUUsY0FBYztFQUNoQjs7RUFFQSxXQUFXO0VBQ1g7SUFDRSxhQUFhO0lBQ2IsdUJBQXVCO0lBQ3ZCLDhCQUE4QjtJQUM5QixTQUFTO0lBQ1QsbUJBQW1CO0VBQ3JCOztFQUVBO0lBQ0UsU0FBUztJQUNULGVBQWU7SUFDZixpQkFBaUI7SUFDakIsZ0JBQWdCO0lBQ2hCLHVCQUF1QjtFQUN6Qjs7RUFFQSxnQkFBZ0I7RUFDaEI7SUFDRSx5QkFBeUI7SUFDekIsbUJBQW1CO0lBQ25CLGNBQWM7SUFDZCxrQkFBa0I7SUFDbEIsbUJBQW1CO0lBQ25CLGdCQUFnQjtJQUNoQixlQUFlO0lBQ2YsZ0ZBQWdGO0lBQ2hGLG1CQUFtQjtFQUNyQjs7RUFFQTtJQUNFLHFCQUFxQjtJQUNyQiw4Q0FBOEM7SUFDOUMsMkJBQTJCO0VBQzdCOztFQUVBO0lBQ0Usd0JBQXdCO0lBQ3hCLGdCQUFnQjtFQUNsQjs7RUFFQSxjQUFjO0VBQ2Q7SUFDRSxtQkFBbUI7SUFDbkIseUJBQXlCO0lBQ3pCLG1CQUFtQjtJQUNuQixhQUFhO0lBQ2IsOENBQThDO0VBQ2hEOztFQUVBLFdBQVc7RUFDWDtJQUNFLG1CQUFtQjtFQUNyQjs7RUFFQTtJQUNFLGNBQWM7SUFDZCxlQUFlO0lBQ2YsZ0JBQWdCO0lBQ2hCLGNBQWM7SUFDZCxrQkFBa0I7RUFDcEI7O0VBRUEsV0FBVztFQUNYOzs7SUFHRSxXQUFXO0lBQ1gseUJBQXlCO0lBQ3pCLG1CQUFtQjtJQUNuQixrQkFBa0I7SUFDbEIsZUFBZTtJQUNmLGFBQWE7SUFDYixtQkFBbUI7SUFDbkIsMERBQTBEO0VBQzVEOztFQUVBO0lBQ0UsaUJBQWlCO0lBQ2pCLGdCQUFnQjtJQUNoQixnQkFBZ0I7RUFDbEI7O0VBRUEsVUFBVTtFQUNWOztJQUVFLHFCQUFxQixFQUFFLGNBQWM7SUFDckMsK0NBQStDO0VBQ2pEOztFQUVBLGdCQUFnQjtFQUNoQjtJQUNFLGNBQWM7SUFDZCxlQUFlO0lBQ2YsY0FBYztJQUNkLGVBQWU7SUFDZixpQkFBaUI7RUFDbkI7O0VBRUEsMEJBQTBCO0VBQzFCO0lBQ0UsaUJBQWlCO0VBQ25COztFQUVBO0lBQ0UsYUFBYTtFQUNmOztFQUVBO0lBQ0UsNEJBQTRCO0VBQzlCOztFQUVBLDJDQUEyQztFQUMzQzs7SUFFRSxxQkFBcUI7RUFDdkI7O0VBRUE7O0dBRUM7RUFDRDtJQUNFLGFBQWE7SUFDYixrQ0FBa0M7SUFDbEMsU0FBUztFQUNYOztFQUVBLGFBQWE7RUFDYjs7SUFFRSxtQkFBbUI7SUFDbkIsa0JBQWtCO0lBQ2xCLGdCQUFnQjtJQUNoQixjQUFjO0lBQ2QsNkJBQTZCO0VBQy9COztFQUVBO0lBQ0UsbUJBQW1CO0lBQ25CLHFCQUFxQjtJQUNyQixjQUFjO0VBQ2hCOztFQUVBO0lBQ0UsbUJBQW1CO0lBQ25CLHFCQUFxQjtJQUNyQixjQUFjO0VBQ2hCOztFQUVBLGdCQUFnQjtFQUNoQjtJQUNFLGFBQWE7SUFDYixTQUFTO0lBQ1QsbUJBQW1CO0lBQ25CLHlCQUF5QjtJQUN6QixnQkFBZ0I7SUFDaEIsaUJBQWlCO0lBQ2pCLDZCQUE2QjtFQUMvQjs7RUFFQSxtQkFBbUI7RUFDbkI7SUFDRSx5QkFBeUI7SUFDekIsbUJBQW1CO0lBQ25CLGNBQWM7SUFDZCxrQkFBa0I7SUFDbEIsbUJBQW1CO0lBQ25CLGdCQUFnQjtJQUNoQixlQUFlO0lBQ2YsMEVBQTBFO0VBQzVFOztFQUVBO0lBQ0UsK0NBQStDO0lBQy9DLDJCQUEyQjtJQUMzQix3QkFBd0I7RUFDMUI7O0VBRUE7SUFDRSx3QkFBd0I7SUFDeEIsZ0JBQWdCO0VBQ2xCOztFQUVBLGlCQUFpQjtFQUNqQjtJQUNFLHlCQUF5QjtJQUN6QixtQkFBbUI7SUFDbkIsY0FBYztJQUNkLGtCQUFrQjtJQUNsQixtQkFBbUI7SUFDbkIsZ0JBQWdCO0lBQ2hCLGVBQWU7SUFDZixnRkFBZ0Y7RUFDbEY7O0VBRUE7SUFDRSxxQkFBcUI7SUFDckIsOENBQThDO0lBQzlDLDJCQUEyQjtFQUM3Qjs7RUFFQTtJQUNFLHdCQUF3QjtJQUN4QixnQkFBZ0I7RUFDbEI7O0VBRUEsb0JBQW9CO0VBQ3BCO0lBQ0UsWUFBWTtJQUNaLG1CQUFtQjtJQUNuQiwwQkFBMEI7SUFDMUIsMkJBQTJCO0VBQzdCOztFQUVBLGlDQUFpQztFQUNqQzs7SUFFRSx3QkFBd0I7SUFDeEIsU0FBUztFQUNYO0VBQ0E7SUFDRSwwQkFBMEI7RUFDNUI7O0VBRUEsc0RBQXNEO0VBQ3REO0lBQ0UsY0FBYztFQUNoQiIsInNvdXJjZXNDb250ZW50IjpbIi8qIGNyZWF0ZS1sZXNzb24uY29tcG9uZW50LmNzcyAqL1xyXG5cclxuLyogUGFnZSB3cmFwcGVyICovXHJcbi5jcmVhdGUtbGVzc29uLWNvbnRhaW5lciB7XHJcbiAgICBtYXgtd2lkdGg6IDk4MHB4O1xyXG4gICAgbWFyZ2luOiA0MHB4IGF1dG87XHJcbiAgICBwYWRkaW5nOiAwIDE4cHg7XHJcbiAgICBmb250LWZhbWlseTogc3lzdGVtLXVpLCAtYXBwbGUtc3lzdGVtLCBTZWdvZSBVSSwgUm9ib3RvLCBBcmlhbCwgc2Fucy1zZXJpZjtcclxuICAgIGNvbG9yOiAjMGYxNzJhO1xyXG4gIH1cclxuICBcclxuICAvKiBIZWFkZXIgKi9cclxuICAuaGVhZGVyIHtcclxuICAgIGRpc3BsYXk6IGZsZXg7XHJcbiAgICBhbGlnbi1pdGVtczogZmxleC1zdGFydDtcclxuICAgIGp1c3RpZnktY29udGVudDogc3BhY2UtYmV0d2VlbjtcclxuICAgIGdhcDogMTZweDtcclxuICAgIG1hcmdpbi1ib3R0b206IDE2cHg7XHJcbiAgfVxyXG4gIFxyXG4gIC5oZWFkZXIgaDIge1xyXG4gICAgbWFyZ2luOiAwO1xyXG4gICAgZm9udC1zaXplOiAzMnB4O1xyXG4gICAgbGluZS1oZWlnaHQ6IDEuMTU7XHJcbiAgICBmb250LXdlaWdodDogODAwO1xyXG4gICAgbGV0dGVyLXNwYWNpbmc6IC0wLjAyZW07XHJcbiAgfVxyXG4gIFxyXG4gIC8qIEJhY2sgYnV0dG9uICovXHJcbiAgLmJhY2stYnRuIHtcclxuICAgIGJvcmRlcjogMXB4IHNvbGlkICNlMmU4ZjA7XHJcbiAgICBiYWNrZ3JvdW5kOiAjZmZmZmZmO1xyXG4gICAgY29sb3I6ICMwZjE3MmE7XHJcbiAgICBwYWRkaW5nOiAxMHB4IDE0cHg7XHJcbiAgICBib3JkZXItcmFkaXVzOiAxMnB4O1xyXG4gICAgZm9udC13ZWlnaHQ6IDYwMDtcclxuICAgIGN1cnNvcjogcG9pbnRlcjtcclxuICAgIHRyYW5zaXRpb246IHRyYW5zZm9ybSAwLjA4cyBlYXNlLCBib3gtc2hhZG93IDAuMTVzIGVhc2UsIGJvcmRlci1jb2xvciAwLjE1cyBlYXNlO1xyXG4gICAgd2hpdGUtc3BhY2U6IG5vd3JhcDtcclxuICB9XHJcbiAgXHJcbiAgLmJhY2stYnRuOmhvdmVyIHtcclxuICAgIGJvcmRlci1jb2xvcjogI2NiZDVlMTtcclxuICAgIGJveC1zaGFkb3c6IDAgMTBweCAyMnB4IHJnYmEoMTUsIDIzLCA0MiwgMC4wOCk7XHJcbiAgICB0cmFuc2Zvcm06IHRyYW5zbGF0ZVkoLTFweCk7XHJcbiAgfVxyXG4gIFxyXG4gIC5iYWNrLWJ0bjphY3RpdmUge1xyXG4gICAgdHJhbnNmb3JtOiB0cmFuc2xhdGVZKDApO1xyXG4gICAgYm94LXNoYWRvdzogbm9uZTtcclxuICB9XHJcbiAgXHJcbiAgLyogRm9ybSBjYXJkICovXHJcbiAgLmxlc3Nvbi1mb3JtIHtcclxuICAgIGJhY2tncm91bmQ6ICNmZmZmZmY7XHJcbiAgICBib3JkZXI6IDFweCBzb2xpZCAjZTJlOGYwO1xyXG4gICAgYm9yZGVyLXJhZGl1czogMThweDtcclxuICAgIHBhZGRpbmc6IDIycHg7XHJcbiAgICBib3gtc2hhZG93OiAwIDE0cHggMzRweCByZ2JhKDE1LCAyMywgNDIsIDAuMDYpO1xyXG4gIH1cclxuICBcclxuICAvKiBMYXlvdXQgKi9cclxuICAuZm9ybS1ncm91cCB7XHJcbiAgICBtYXJnaW4tYm90dG9tOiAxNnB4O1xyXG4gIH1cclxuICBcclxuICAuZm9ybS1ncm91cCBsYWJlbCB7XHJcbiAgICBkaXNwbGF5OiBibG9jaztcclxuICAgIGZvbnQtc2l6ZTogMTNweDtcclxuICAgIGZvbnQtd2VpZ2h0OiA3MDA7XHJcbiAgICBjb2xvcjogIzBmMTcyYTtcclxuICAgIG1hcmdpbi1ib3R0b206IDhweDtcclxuICB9XHJcbiAgXHJcbiAgLyogSW5wdXRzICovXHJcbiAgLmxlc3Nvbi1mb3JtIGlucHV0W3R5cGU9XCJ0ZXh0XCJdLFxyXG4gIC5sZXNzb24tZm9ybSBpbnB1dFt0eXBlPVwibnVtYmVyXCJdLFxyXG4gIC5sZXNzb24tZm9ybSB0ZXh0YXJlYSB7XHJcbiAgICB3aWR0aDogMTAwJTtcclxuICAgIGJvcmRlcjogMXB4IHNvbGlkICNlMmU4ZjA7XHJcbiAgICBib3JkZXItcmFkaXVzOiAxMnB4O1xyXG4gICAgcGFkZGluZzogMTJweCAxMnB4O1xyXG4gICAgZm9udC1zaXplOiAxNHB4O1xyXG4gICAgb3V0bGluZTogbm9uZTtcclxuICAgIGJhY2tncm91bmQ6ICNmZmZmZmY7XHJcbiAgICB0cmFuc2l0aW9uOiBib3JkZXItY29sb3IgMC4xNXMgZWFzZSwgYm94LXNoYWRvdyAwLjE1cyBlYXNlO1xyXG4gIH1cclxuICBcclxuICAubGVzc29uLWZvcm0gdGV4dGFyZWEge1xyXG4gICAgbWluLWhlaWdodDogMTUwcHg7XHJcbiAgICByZXNpemU6IHZlcnRpY2FsO1xyXG4gICAgbGluZS1oZWlnaHQ6IDEuNTtcclxuICB9XHJcbiAgXHJcbiAgLyogRm9jdXMgKi9cclxuICAubGVzc29uLWZvcm0gaW5wdXQ6Zm9jdXMsXHJcbiAgLmxlc3Nvbi1mb3JtIHRleHRhcmVhOmZvY3VzIHtcclxuICAgIGJvcmRlci1jb2xvcjogIzkzYzVmZDsgLyogc29mdCBibHVlICovXHJcbiAgICBib3gtc2hhZG93OiAwIDAgMCA0cHggcmdiYSgxNDcsIDE5NywgMjUzLCAwLjM1KTtcclxuICB9XHJcbiAgXHJcbiAgLyogSW5saW5lIGhlbHAgKi9cclxuICAubGVzc29uLWZvcm0gc21hbGwge1xyXG4gICAgZGlzcGxheTogYmxvY2s7XHJcbiAgICBtYXJnaW4tdG9wOiA4cHg7XHJcbiAgICBjb2xvcjogIzY0NzQ4YjtcclxuICAgIGZvbnQtc2l6ZTogMTJweDtcclxuICAgIGxpbmUtaGVpZ2h0OiAxLjM1O1xyXG4gIH1cclxuICBcclxuICAvKiBWYWxpZGF0aW9uIGVycm9yIHRleHQgKi9cclxuICAubGVzc29uLWZvcm0gc21hbGwubmctc3Rhci1pbnNlcnRlZCB7XHJcbiAgICAvKiBrZWVwIGRlZmF1bHQgKi9cclxuICB9XHJcbiAgXHJcbiAgLmZvcm0tZ3JvdXAgc21hbGwge1xyXG4gICAgb3BhY2l0eTogMC45NTtcclxuICB9XHJcbiAgXHJcbiAgLmZvcm0tZ3JvdXAgc21hbGxbbmctcmVmbGVjdC1uZy1pZj1cInRydWVcIl0ge1xyXG4gICAgLyogbm8tb3A7IEFuZ3VsYXIgaW50ZXJuYWwgKi9cclxuICB9XHJcbiAgXHJcbiAgLyogT3B0aW9uYWwgZ3JpZCBmb3IgdGhlIGZpcnN0IHR3byBmaWVsZHMgKi9cclxuICAubGVzc29uLWZvcm0gLmZvcm0tZ3JvdXA6bnRoLWNoaWxkKDEpLFxyXG4gIC5sZXNzb24tZm9ybSAuZm9ybS1ncm91cDpudGgtY2hpbGQoMikge1xyXG4gICAgLyogbm8tb3AgYnkgZGVmYXVsdCAqL1xyXG4gIH1cclxuICBcclxuICAvKiBNYWtlIFRpdGxlICsgT3JkZXJJbmRleCBpbiBvbmUgcm93IGlmIHlvdSB3YW50OlxyXG4gICAgIHdyYXAgdGhvc2UgdHdvIGJsb2NrcyBpbiA8ZGl2IGNsYXNzPVwicm93XCI+IC4uLiA8L2Rpdj5cclxuICAqL1xyXG4gIC5yb3cge1xyXG4gICAgZGlzcGxheTogZ3JpZDtcclxuICAgIGdyaWQtdGVtcGxhdGUtY29sdW1uczogMS42ZnIgMC43ZnI7XHJcbiAgICBnYXA6IDE0cHg7XHJcbiAgfVxyXG4gIFxyXG4gIC8qIE1lc3NhZ2VzICovXHJcbiAgLmVycm9yLFxyXG4gIC5zdWNjZXNzIHtcclxuICAgIGJvcmRlci1yYWRpdXM6IDEycHg7XHJcbiAgICBwYWRkaW5nOiAxMnB4IDE0cHg7XHJcbiAgICBmb250LXdlaWdodDogNjAwO1xyXG4gICAgbWFyZ2luOiAxNHB4IDA7XHJcbiAgICBib3JkZXI6IDFweCBzb2xpZCB0cmFuc3BhcmVudDtcclxuICB9XHJcbiAgXHJcbiAgLmVycm9yIHtcclxuICAgIGJhY2tncm91bmQ6ICNmZWYyZjI7XHJcbiAgICBib3JkZXItY29sb3I6ICNmZWNhY2E7XHJcbiAgICBjb2xvcjogIzdmMWQxZDtcclxuICB9XHJcbiAgXHJcbiAgLnN1Y2Nlc3Mge1xyXG4gICAgYmFja2dyb3VuZDogI2VjZmRmNTtcclxuICAgIGJvcmRlci1jb2xvcjogI2JiZjdkMDtcclxuICAgIGNvbG9yOiAjMDY1ZjQ2O1xyXG4gIH1cclxuICBcclxuICAvKiBCdXR0b25zIHJvdyAqL1xyXG4gIC5idXR0b25zIHtcclxuICAgIGRpc3BsYXk6IGZsZXg7XHJcbiAgICBnYXA6IDEycHg7XHJcbiAgICBhbGlnbi1pdGVtczogY2VudGVyO1xyXG4gICAganVzdGlmeS1jb250ZW50OiBmbGV4LWVuZDtcclxuICAgIG1hcmdpbi10b3A6IDEwcHg7XHJcbiAgICBwYWRkaW5nLXRvcDogMTZweDtcclxuICAgIGJvcmRlci10b3A6IDFweCBzb2xpZCAjZWVmMmY3O1xyXG4gIH1cclxuICBcclxuICAvKiBQcmltYXJ5IGJ1dHRvbiAqL1xyXG4gIC5idXR0b25zIGJ1dHRvblt0eXBlPVwic3VibWl0XCJdIHtcclxuICAgIGJvcmRlcjogMXB4IHNvbGlkICMxZDRlZDg7XHJcbiAgICBiYWNrZ3JvdW5kOiAjMjU2M2ViO1xyXG4gICAgY29sb3I6ICNmZmZmZmY7XHJcbiAgICBwYWRkaW5nOiAxMXB4IDE2cHg7XHJcbiAgICBib3JkZXItcmFkaXVzOiAxMnB4O1xyXG4gICAgZm9udC13ZWlnaHQ6IDgwMDtcclxuICAgIGN1cnNvcjogcG9pbnRlcjtcclxuICAgIHRyYW5zaXRpb246IHRyYW5zZm9ybSAwLjA4cyBlYXNlLCBib3gtc2hhZG93IDAuMTVzIGVhc2UsIGZpbHRlciAwLjE1cyBlYXNlO1xyXG4gIH1cclxuICBcclxuICAuYnV0dG9ucyBidXR0b25bdHlwZT1cInN1Ym1pdFwiXTpob3ZlciB7XHJcbiAgICBib3gtc2hhZG93OiAwIDE0cHggMzBweCByZ2JhKDM3LCA5OSwgMjM1LCAwLjI1KTtcclxuICAgIHRyYW5zZm9ybTogdHJhbnNsYXRlWSgtMXB4KTtcclxuICAgIGZpbHRlcjogYnJpZ2h0bmVzcygxLjAyKTtcclxuICB9XHJcbiAgXHJcbiAgLmJ1dHRvbnMgYnV0dG9uW3R5cGU9XCJzdWJtaXRcIl06YWN0aXZlIHtcclxuICAgIHRyYW5zZm9ybTogdHJhbnNsYXRlWSgwKTtcclxuICAgIGJveC1zaGFkb3c6IG5vbmU7XHJcbiAgfVxyXG4gIFxyXG4gIC8qIFJlc2V0IGJ1dHRvbiAqL1xyXG4gIC5yZXNldC1idG4ge1xyXG4gICAgYm9yZGVyOiAxcHggc29saWQgI2UyZThmMDtcclxuICAgIGJhY2tncm91bmQ6ICNmZmZmZmY7XHJcbiAgICBjb2xvcjogIzBmMTcyYTtcclxuICAgIHBhZGRpbmc6IDExcHggMTRweDtcclxuICAgIGJvcmRlci1yYWRpdXM6IDEycHg7XHJcbiAgICBmb250LXdlaWdodDogODAwO1xyXG4gICAgY3Vyc29yOiBwb2ludGVyO1xyXG4gICAgdHJhbnNpdGlvbjogdHJhbnNmb3JtIDAuMDhzIGVhc2UsIGJveC1zaGFkb3cgMC4xNXMgZWFzZSwgYm9yZGVyLWNvbG9yIDAuMTVzIGVhc2U7XHJcbiAgfVxyXG4gIFxyXG4gIC5yZXNldC1idG46aG92ZXIge1xyXG4gICAgYm9yZGVyLWNvbG9yOiAjY2JkNWUxO1xyXG4gICAgYm94LXNoYWRvdzogMCAxMHB4IDIycHggcmdiYSgxNSwgMjMsIDQyLCAwLjA4KTtcclxuICAgIHRyYW5zZm9ybTogdHJhbnNsYXRlWSgtMXB4KTtcclxuICB9XHJcbiAgXHJcbiAgLnJlc2V0LWJ0bjphY3RpdmUge1xyXG4gICAgdHJhbnNmb3JtOiB0cmFuc2xhdGVZKDApO1xyXG4gICAgYm94LXNoYWRvdzogbm9uZTtcclxuICB9XHJcbiAgXHJcbiAgLyogRGlzYWJsZWQgc3RhdGVzICovXHJcbiAgYnV0dG9uW2Rpc2FibGVkXSB7XHJcbiAgICBvcGFjaXR5OiAwLjY7XHJcbiAgICBjdXJzb3I6IG5vdC1hbGxvd2VkO1xyXG4gICAgdHJhbnNmb3JtOiBub25lICFpbXBvcnRhbnQ7XHJcbiAgICBib3gtc2hhZG93OiBub25lICFpbXBvcnRhbnQ7XHJcbiAgfVxyXG4gIFxyXG4gIC8qIE1ha2UgbnVtYmVyIGlucHV0IGxvb2sgY2xlYW4gKi9cclxuICBpbnB1dFt0eXBlPVwibnVtYmVyXCJdOjotd2Via2l0LW91dGVyLXNwaW4tYnV0dG9uLFxyXG4gIGlucHV0W3R5cGU9XCJudW1iZXJcIl06Oi13ZWJraXQtaW5uZXItc3Bpbi1idXR0b24ge1xyXG4gICAgLXdlYmtpdC1hcHBlYXJhbmNlOiBub25lO1xyXG4gICAgbWFyZ2luOiAwO1xyXG4gIH1cclxuICBpbnB1dFt0eXBlPVwibnVtYmVyXCJdIHtcclxuICAgIC1tb3otYXBwZWFyYW5jZTogdGV4dGZpZWxkO1xyXG4gIH1cclxuICBcclxuICAvKiBOaWNlIHBhZ2UgYmFja2dyb3VuZCBmZWVsIGlmIHlvdXIgZ2xvYmFsIGlzIHBsYWluICovXHJcbiAgOmhvc3Qge1xyXG4gICAgZGlzcGxheTogYmxvY2s7XHJcbiAgfSJdLCJzb3VyY2VSb290IjoiIn0= */"]
    });
  }
}

/***/ }),

/***/ 1909:
/*!******************************************************************!*\
  !*** ./src/app/back-office/edit-course/edit-course.component.ts ***!
  \******************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   EditCourseComponent: () => (/* binding */ EditCourseComponent)
/* harmony export */ });
/* harmony import */ var _angular_forms__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/forms */ 4456);
/* harmony import */ var _angular_common_http__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/common/http */ 6443);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ 7580);
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/router */ 5072);
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @angular/common */ 316);







function EditCourseComponent_div_9_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](0, "div", 10);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const ctx_r0 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtextInterpolate"](ctx_r0.error);
  }
}
function EditCourseComponent_div_10_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](0, "div", 11);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtextInterpolate"](ctx_r1.success);
  }
}
function EditCourseComponent_div_11_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](0, "div", 12);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](1, "Loading...");
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
  }
}
function EditCourseComponent_form_12_div_30_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](0, "div", 31);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](1, " Uploading image... ");
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
  }
}
function EditCourseComponent_form_12_Template(rf, ctx) {
  if (rf & 1) {
    const _r6 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](0, "form", 13);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵlistener"]("ngSubmit", function EditCourseComponent_form_12_Template_form_ngSubmit_0_listener() {
      _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵrestoreView"](_r6);
      const ctx_r5 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnextContext"]();
      return _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵresetView"](ctx_r5.submit());
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](1, "div", 14)(2, "div", 15)(3, "div", 16)(4, "label", 17);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](5, "Title");
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](6, "input", 18);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](7, "div", 16)(8, "label", 17);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](9, "Description");
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](10, "textarea", 19);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](11, "div", 20)(12, "div", 21)(13, "label", 17);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](14, "Price");
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](15, "input", 22);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](16, "div", 21)(17, "label", 17);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](18, "Duration (hours)");
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](19, "input", 23);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]()()()();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](20, "div", 24)(21, "div", 15)(22, "div", 25)(23, "h5", 2);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](24, "Course Image");
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](25, "button", 26);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵlistener"]("click", function EditCourseComponent_form_12_Template_button_click_25_listener() {
      _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵrestoreView"](_r6);
      const ctx_r7 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnextContext"]();
      return _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵresetView"](ctx_r7.removeImage());
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](26, " Remove ");
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]()();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](27, "div", 27)(28, "img", 28);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵlistener"]("error", function EditCourseComponent_form_12_Template_img_error_28_listener($event) {
      _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵrestoreView"](_r6);
      const ctx_r8 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnextContext"]();
      return _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵresetView"](ctx_r8.onImageError($event));
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]()();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](29, "input", 29);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵlistener"]("change", function EditCourseComponent_form_12_Template_input_change_29_listener($event) {
      _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵrestoreView"](_r6);
      const ctx_r9 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnextContext"]();
      return _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵresetView"](ctx_r9.onImageSelected($event));
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtemplate"](30, EditCourseComponent_form_12_div_30_Template, 2, 0, "div", 30);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](31, "div", 31);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](32, " Saved URL: ");
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](33, "div", 32);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](34);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]()()()();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](35, "button", 33);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const ctx_r3 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnextContext"]();
    let tmp_5_0;
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("formGroup", ctx_r3.form);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](25);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("disabled", ctx_r3.uploadingImage);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("src", ctx_r3.currentImageUrl || "assets/images/course-placeholder.jpg", _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵsanitizeUrl"]);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("disabled", ctx_r3.uploadingImage);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("ngIf", ctx_r3.uploadingImage);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](4);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtextInterpolate"](((tmp_5_0 = ctx_r3.form.get("imageUrl")) == null ? null : tmp_5_0.value) || "\u2014");
  }
}
class EditCourseComponent {
  constructor(fb, http, route, router) {
    this.fb = fb;
    this.http = http;
    this.route = route;
    this.router = router;
    this.loading = false;
    this.saving = false;
    this.uploadingImage = false;
    this.error = null;
    this.success = null;
    // affichage image
    this.currentImageUrl = null;
    this.API_URL = '/api/instructor/courses';
    this.CLOUDINARY_CLOUD_NAME = 'doobtx5fl';
    this.CLOUDINARY_UPLOAD_PRESET = 'courses_unsigned';
    this.CLOUDINARY_UPLOAD_URL = `https://api.cloudinary.com/v1_1/${this.CLOUDINARY_CLOUD_NAME}/image/upload`;
  }
  ngOnInit() {
    this.courseId = Number(this.route.snapshot.paramMap.get('id'));
    if (!this.courseId) {
      this.error = 'Missing course id in route.';
      return;
    }
    this.form = this.fb.group({
      title: ['', [_angular_forms__WEBPACK_IMPORTED_MODULE_1__.Validators.required, _angular_forms__WEBPACK_IMPORTED_MODULE_1__.Validators.minLength(3), _angular_forms__WEBPACK_IMPORTED_MODULE_1__.Validators.maxLength(120)]],
      description: ['', [_angular_forms__WEBPACK_IMPORTED_MODULE_1__.Validators.required, _angular_forms__WEBPACK_IMPORTED_MODULE_1__.Validators.minLength(10), _angular_forms__WEBPACK_IMPORTED_MODULE_1__.Validators.maxLength(2000)]],
      price: [0, [_angular_forms__WEBPACK_IMPORTED_MODULE_1__.Validators.required, _angular_forms__WEBPACK_IMPORTED_MODULE_1__.Validators.min(0)]],
      durationHours: [1, [_angular_forms__WEBPACK_IMPORTED_MODULE_1__.Validators.required, _angular_forms__WEBPACK_IMPORTED_MODULE_1__.Validators.min(1), _angular_forms__WEBPACK_IMPORTED_MODULE_1__.Validators.max(999)]],
      imageUrl: ['']
    });
    this.loadCourse();
  }
  authHeaders() {
    const token = localStorage.getItem('token');
    let headers = new _angular_common_http__WEBPACK_IMPORTED_MODULE_2__.HttpHeaders();
    if (token) headers = headers.set('Authorization', `Bearer ${token}`);
    return headers;
  }
  loadCourse() {
    this.loading = true;
    this.error = null;
    this.http.get(`${this.API_URL}/${this.courseId}`, {
      headers: this.authHeaders()
    }).subscribe({
      next: c => {
        this.loading = false;
        this.currentImageUrl = c.imageUrl ?? null;
        this.form.patchValue({
          title: c.title ?? '',
          description: c.description ?? '',
          price: c.price ?? 0,
          durationHours: c.durationHours ?? 1,
          imageUrl: c.imageUrl ?? ''
        }, {
          emitEvent: false
        });
      },
      error: err => {
        this.loading = false;
        this.error = err?.error?.message || err?.message || 'Failed to load course.';
      }
    });
  }
  submit() {
    this.error = null;
    this.success = null;
    if (this.uploadingImage) {
      this.error = 'Please wait until the image upload finishes.';
      return;
    }
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.saving = true;
    const raw = this.form.getRawValue();
    const payload = {
      title: String(raw.title || '').trim(),
      description: String(raw.description || '').trim(),
      price: Math.max(0, Number(raw.price ?? 0)),
      durationHours: Math.max(1, Number(raw.durationHours ?? 1)),
      imageUrl: raw.imageUrl ? String(raw.imageUrl).trim() : null
    };
    this.http.put(`${this.API_URL}/${this.courseId}`, payload, {
      headers: this.authHeaders()
    }).subscribe({
      next: updated => {
        this.saving = false;
        this.success = 'Course updated successfully.';
        this.currentImageUrl = updated?.imageUrl ?? payload.imageUrl ?? this.currentImageUrl;
        setTimeout(() => this.router.navigate(['/back-office/trainer/manage-courses']), 500);
      },
      error: err => {
        this.saving = false;
        this.error = err?.error?.message || err?.message || 'Failed to update course.';
      }
    });
  }
  cancel() {
    this.router.navigate(['/back-office/trainer/manage-courses']);
  }
  removeImage() {
    this.currentImageUrl = null;
    this.form.patchValue({
      imageUrl: ''
    }, {
      emitEvent: false
    });
  }
  onImageError(event) {
    event.target.src = 'assets/images/course-placeholder.jpg';
  }
  onImageSelected(event) {
    const input = event.target;
    const file = input?.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      this.error = 'Please select a valid image file.';
      input.value = '';
      return;
    }
    this.uploadingImage = true;
    this.error = null;
    this.success = null;
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', this.CLOUDINARY_UPLOAD_PRESET);
    formData.append('folder', 'courses');
    this.http.post(this.CLOUDINARY_UPLOAD_URL, formData).subscribe({
      next: res => {
        const uploadedUrl = res?.secure_url || res?.url || null;
        if (!uploadedUrl) {
          this.error = 'Upload succeeded but no image URL was returned.';
          this.uploadingImage = false;
          return;
        }
        this.form.patchValue({
          imageUrl: uploadedUrl
        }, {
          emitEvent: false
        });
        this.currentImageUrl = uploadedUrl;
        this.uploadingImage = false;
        this.success = 'Image uploaded successfully.';
      },
      error: err => {
        this.uploadingImage = false;
        this.error = err?.error?.error?.message || err?.error?.message || 'Image upload failed.';
      }
    });
  }
  static {
    this.ɵfac = function EditCourseComponent_Factory(t) {
      return new (t || EditCourseComponent)(_angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdirectiveInject"](_angular_forms__WEBPACK_IMPORTED_MODULE_1__.FormBuilder), _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdirectiveInject"](_angular_common_http__WEBPACK_IMPORTED_MODULE_2__.HttpClient), _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdirectiveInject"](_angular_router__WEBPACK_IMPORTED_MODULE_3__.ActivatedRoute), _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdirectiveInject"](_angular_router__WEBPACK_IMPORTED_MODULE_3__.Router));
    };
  }
  static {
    this.ɵcmp = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdefineComponent"]({
      type: EditCourseComponent,
      selectors: [["app-edit-course"]],
      decls: 13,
      vars: 7,
      consts: [[1, "container", "py-4"], [1, "d-flex", "align-items-center", "justify-content-between", "mb-3"], [1, "m-0"], [1, "d-flex", "gap-2"], [1, "btn", "btn-outline-secondary", 3, "disabled", "click"], [1, "btn", "btn-primary", 3, "disabled", "click"], ["class", "alert alert-danger", 4, "ngIf"], ["class", "alert alert-success", 4, "ngIf"], ["class", "text-muted", 4, "ngIf"], ["class", "row g-3", 3, "formGroup", "ngSubmit", 4, "ngIf"], [1, "alert", "alert-danger"], [1, "alert", "alert-success"], [1, "text-muted"], [1, "row", "g-3", 3, "formGroup", "ngSubmit"], [1, "col-lg-7"], [1, "card", "p-3"], [1, "mb-3"], [1, "form-label"], ["formControlName", "title", 1, "form-control"], ["rows", "6", "formControlName", "description", 1, "form-control"], [1, "row", "g-3"], [1, "col-md-6"], ["type", "number", "formControlName", "price", "min", "0", "step", "0.5", 1, "form-control"], ["type", "number", "formControlName", "durationHours", "min", "1", 1, "form-control"], [1, "col-lg-5"], [1, "d-flex", "justify-content-between", "align-items-center", "mb-2"], ["type", "button", 1, "btn", "btn-outline-danger", "btn-sm", 3, "disabled", "click"], [1, "ratio", "ratio-16x9", "rounded", "overflow-hidden", "bg-light", "mb-3"], ["alt", "Course cover", 2, "object-fit", "cover", "width", "100%", "height", "100%", 3, "src", "error"], ["type", "file", "accept", "image/*", 1, "form-control", 3, "disabled", "change"], ["class", "small text-muted mt-2", 4, "ngIf"], [1, "small", "text-muted", "mt-2"], [1, "text-break"], ["type", "submit", 1, "d-none"]],
      template: function EditCourseComponent_Template(rf, ctx) {
        if (rf & 1) {
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](0, "div", 0)(1, "div", 1)(2, "h2", 2);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](3, "Edit Course");
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](4, "div", 3)(5, "button", 4);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵlistener"]("click", function EditCourseComponent_Template_button_click_5_listener() {
            return ctx.cancel();
          });
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](6, " Back ");
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](7, "button", 5);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵlistener"]("click", function EditCourseComponent_Template_button_click_7_listener() {
            return ctx.submit();
          });
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](8);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]()()();
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtemplate"](9, EditCourseComponent_div_9_Template, 2, 1, "div", 6);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtemplate"](10, EditCourseComponent_div_10_Template, 2, 1, "div", 7);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtemplate"](11, EditCourseComponent_div_11_Template, 2, 0, "div", 8);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtemplate"](12, EditCourseComponent_form_12_Template, 36, 6, "form", 9);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        }
        if (rf & 2) {
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](5);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("disabled", ctx.saving || ctx.uploadingImage);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](2);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("disabled", ctx.saving || ctx.uploadingImage || ctx.loading);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](1);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtextInterpolate1"](" ", ctx.saving ? "Saving..." : "Save Changes", " ");
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](1);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("ngIf", ctx.error);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](1);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("ngIf", ctx.success);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](1);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("ngIf", ctx.loading);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](1);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("ngIf", !ctx.loading);
        }
      },
      dependencies: [_angular_common__WEBPACK_IMPORTED_MODULE_4__.NgIf, _angular_forms__WEBPACK_IMPORTED_MODULE_1__["ɵNgNoValidate"], _angular_forms__WEBPACK_IMPORTED_MODULE_1__.DefaultValueAccessor, _angular_forms__WEBPACK_IMPORTED_MODULE_1__.NumberValueAccessor, _angular_forms__WEBPACK_IMPORTED_MODULE_1__.NgControlStatus, _angular_forms__WEBPACK_IMPORTED_MODULE_1__.NgControlStatusGroup, _angular_forms__WEBPACK_IMPORTED_MODULE_1__.MinValidator, _angular_forms__WEBPACK_IMPORTED_MODULE_1__.FormGroupDirective, _angular_forms__WEBPACK_IMPORTED_MODULE_1__.FormControlName],
      styles: ["/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IiIsInNvdXJjZVJvb3QiOiIifQ== */"]
    });
  }
}

/***/ }),

/***/ 5385:
/*!**************************************************************************!*\
  !*** ./src/app/back-office/trainer-courses/trainer-courses.component.ts ***!
  \**************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   TrainerCoursesComponent: () => (/* binding */ TrainerCoursesComponent)
/* harmony export */ });
/* harmony import */ var _angular_common_http__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/common/http */ 6443);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ 7580);
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/common */ 316);




function TrainerCoursesComponent_div_4_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](0, "div");
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](1, "Loading...");
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
  }
}
function TrainerCoursesComponent_div_5_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](0, "div");
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtextInterpolate"](ctx_r1.error);
  }
}
function TrainerCoursesComponent_div_6_tr_11_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](0, "tr")(1, "td");
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](3, "td");
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](4);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](5, "td")(6, "span", 8);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](7);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]()()();
  }
  if (rf & 2) {
    const c_r4 = ctx.$implicit;
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtextInterpolate"](c_r4.title);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtextInterpolate"](c_r4.enrollments);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("ngClass", c_r4.archived ? "status--draft" : "status--active");
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtextInterpolate1"](" ", c_r4.archived ? "Draft" : "Active", " ");
  }
}
function TrainerCoursesComponent_div_6_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](0, "div", 5)(1, "table", 6)(2, "thead")(3, "tr")(4, "th");
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](5, "Course");
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](6, "th");
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](7, "Enrollments");
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](8, "th");
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](9, "Status");
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]()()();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](10, "tbody");
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtemplate"](11, TrainerCoursesComponent_div_6_tr_11_Template, 8, 4, "tr", 7);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]()()();
  }
  if (rf & 2) {
    const ctx_r2 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](11);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("ngForOf", ctx_r2.courses);
  }
}
class TrainerCoursesComponent {
  constructor(http) {
    this.http = http;
    this.courses = [];
    this.loading = true;
    this.error = null;
    this.API = 'http://localhost:8081/instructor/dashboard/courses';
  }
  ngOnInit() {
    const token = localStorage.getItem('token');
    const headers = new _angular_common_http__WEBPACK_IMPORTED_MODULE_1__.HttpHeaders({
      Authorization: token ? `Bearer ${token}` : ''
    });
    this.http.get(this.API, {
      headers
    }).subscribe({
      next: res => {
        this.courses = res ?? [];
        this.loading = false;
      },
      error: () => {
        this.error = 'Failed to load trainer courses';
        this.loading = false;
      }
    });
  }
  static {
    this.ɵfac = function TrainerCoursesComponent_Factory(t) {
      return new (t || TrainerCoursesComponent)(_angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdirectiveInject"](_angular_common_http__WEBPACK_IMPORTED_MODULE_1__.HttpClient));
    };
  }
  static {
    this.ɵcmp = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdefineComponent"]({
      type: TrainerCoursesComponent,
      selectors: [["app-trainer-courses"]],
      decls: 7,
      vars: 3,
      consts: [[1, "section", "section--wide"], [1, "section-header"], [1, "section-title"], [4, "ngIf"], ["class", "table-wrap", 4, "ngIf"], [1, "table-wrap"], [1, "data-table"], [4, "ngFor", "ngForOf"], [1, "status", 3, "ngClass"]],
      template: function TrainerCoursesComponent_Template(rf, ctx) {
        if (rf & 1) {
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](0, "div", 0)(1, "div", 1)(2, "h2", 2);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](3, "My Courses");
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]()();
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtemplate"](4, TrainerCoursesComponent_div_4_Template, 2, 0, "div", 3);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtemplate"](5, TrainerCoursesComponent_div_5_Template, 2, 1, "div", 3);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtemplate"](6, TrainerCoursesComponent_div_6_Template, 12, 1, "div", 4);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        }
        if (rf & 2) {
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](4);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("ngIf", ctx.loading);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](1);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("ngIf", ctx.error);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](1);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("ngIf", !ctx.loading && !ctx.error);
        }
      },
      dependencies: [_angular_common__WEBPACK_IMPORTED_MODULE_2__.NgClass, _angular_common__WEBPACK_IMPORTED_MODULE_2__.NgForOf, _angular_common__WEBPACK_IMPORTED_MODULE_2__.NgIf],
      styles: ["/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IiIsInNvdXJjZVJvb3QiOiIifQ== */"]
    });
  }
}

/***/ }),

/***/ 2065:
/*!********************************************************************!*\
  !*** ./src/app/back-office/trainer-home/trainer-home.component.ts ***!
  \********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   TrainerHomeComponent: () => (/* binding */ TrainerHomeComponent)
/* harmony export */ });
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/common */ 316);
/* harmony import */ var _angular_common_http__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/common/http */ 6443);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ 7580);





function TrainerHomeComponent_ng_container_10_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementContainerStart"](0);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵpipe"](2, "number");
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementContainerEnd"]();
  }
  if (rf & 2) {
    const ctx_r0 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtextInterpolate1"](" ", _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵpipeBind1"](2, 1, ctx_r0.totalStudents), " ");
  }
}
function TrainerHomeComponent_ng_template_11_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](0, " \u2014 ");
  }
}
function TrainerHomeComponent_ng_container_22_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementContainerStart"](0);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵpipe"](2, "number");
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementContainerEnd"]();
  }
  if (rf & 2) {
    const ctx_r3 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtextInterpolate1"](" ", _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵpipeBind1"](2, 1, ctx_r3.activeCourses), " ");
  }
}
function TrainerHomeComponent_ng_template_23_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](0, " \u2014 ");
  }
}
function TrainerHomeComponent_tr_55_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](0, "tr")(1, "td", 46);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](2, "Loading courses\u2026");
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]()();
  }
}
function TrainerHomeComponent_tr_56_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](0, "tr")(1, "td", 46);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]()();
  }
  if (rf & 2) {
    const ctx_r7 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtextInterpolate"](ctx_r7.coursesError);
  }
}
function TrainerHomeComponent_tr_57_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](0, "tr")(1, "td", 46);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](2, "No courses found.");
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]()();
  }
}
function TrainerHomeComponent_tr_58_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](0, "tr")(1, "td");
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](3, "td");
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](4);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](5, "td")(6, "span", 47);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](7);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]()()();
  }
  if (rf & 2) {
    const row_r10 = ctx.$implicit;
    const ctx_r9 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtextInterpolate"](row_r10.title);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtextInterpolate"](row_r10.enrollments);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("ngClass", ctx_r9.getStatusClass(row_r10));
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtextInterpolate1"](" ", ctx_r9.getStatusLabel(row_r10), " ");
  }
}
class TrainerHomeComponent {
  constructor(http) {
    this.http = http;
    this.totalStudents = 0;
    this.activeCourses = 0;
    this.loadingStats = true;
    this.statsError = null;
    this.coursesRows = [];
    this.loadingCourses = true;
    this.coursesError = null;
    this.STATS_API = 'http://localhost:8081/instructor/dashboard/stats';
    this.COURSES_API = 'http://localhost:8081/instructor/dashboard/courses';
  }
  ngOnInit() {
    this.loadStats();
    this.loadCourses();
  }
  authHeaders() {
    const token = localStorage.getItem('token');
    return new _angular_common_http__WEBPACK_IMPORTED_MODULE_1__.HttpHeaders({
      Authorization: token ? `Bearer ${token}` : ''
    });
  }
  loadStats() {
    this.loadingStats = true;
    this.statsError = null;
    this.http.get(this.STATS_API, {
      headers: this.authHeaders()
    }).subscribe({
      next: res => {
        this.totalStudents = res?.totalStudents ?? 0;
        this.activeCourses = res?.activeCourses ?? 0;
        this.loadingStats = false;
      },
      error: err => {
        this.loadingStats = false;
        this.statsError = err?.error?.message || 'Failed to load stats (401/CORS?)';
      }
    });
  }
  loadCourses() {
    this.loadingCourses = true;
    this.coursesError = null;
    this.http.get(this.COURSES_API, {
      headers: this.authHeaders()
    }).subscribe({
      next: rows => {
        this.coursesRows = Array.isArray(rows) ? rows : [];
        this.loadingCourses = false;
      },
      error: err => {
        this.loadingCourses = false;
        this.coursesError = err?.error?.message || 'Failed to load courses (401/CORS?)';
      }
    });
  }
  getStatusLabel(row) {
    return row.archived ? 'Draft' : 'Active';
  }
  getStatusClass(row) {
    return row.archived ? 'status--draft' : 'status--active';
  }
  static {
    this.ɵfac = function TrainerHomeComponent_Factory(t) {
      return new (t || TrainerHomeComponent)(_angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdirectiveInject"](_angular_common_http__WEBPACK_IMPORTED_MODULE_1__.HttpClient));
    };
  }
  static {
    this.ɵcmp = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdefineComponent"]({
      type: TrainerHomeComponent,
      selectors: [["app-trainer-home"]],
      standalone: true,
      features: [_angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵStandaloneFeature"]],
      decls: 108,
      vars: 8,
      consts: [["aria-label", "Overview statistics", 1, "stats-row"], [1, "stat-card"], ["aria-hidden", "true", 1, "stat-icon", "stat-icon--blue"], ["viewBox", "0 0 24 24", "fill", "none", "stroke", "currentColor", "stroke-width", "2"], ["d", "M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"], ["cx", "9", "cy", "7", "r", "4"], ["d", "M23 21v-2a4 4 0 0 0-3-3.87"], ["d", "M16 3.13a4 4 0 0 1 0 7.75"], [1, "stat-content"], [1, "stat-value"], [4, "ngIf", "ngIfElse"], ["studentsSkeleton", ""], [1, "stat-label"], ["aria-hidden", "true", 1, "stat-icon", "stat-icon--purple"], ["d", "M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"], ["d", "M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"], ["coursesSkeleton", ""], ["aria-hidden", "true", 1, "stat-icon", "stat-icon--green"], ["x1", "12", "y1", "1", "x2", "12", "y2", "23"], ["d", "M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"], [1, "two-col"], ["aria-labelledby", "courses-table-heading", 1, "section", "section--wide"], [1, "section-header"], ["id", "courses-table-heading", 1, "section-title"], ["routerLink", "/back-office/trainer/manage-courses", 1, "link-more"], [1, "table-wrap"], ["role", "table", 1, "data-table"], ["scope", "col"], [4, "ngIf"], [4, "ngFor", "ngForOf"], ["aria-labelledby", "enrollments-heading", 1, "section", "section--narrow"], ["id", "enrollments-heading", 1, "section-title"], ["href", "#", 1, "link-more"], [1, "enrollment-list"], [1, "enrollment-item"], [1, "enrollment-avatar"], [1, "enrollment-info"], [1, "enrollment-name"], [1, "enrollment-course"], [1, "enrollment-time"], [1, "notifications-panel"], [1, "panel-title"], [1, "notif-list"], [1, "notif-item"], [1, "notif-dot"], [1, "notif-text"], ["colspan", "3"], [1, "status", 3, "ngClass"]],
      template: function TrainerHomeComponent_Template(rf, ctx) {
        if (rf & 1) {
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](0, "section", 0)(1, "div", 1)(2, "div", 2);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnamespaceSVG"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](3, "svg", 3);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](4, "path", 4)(5, "circle", 5)(6, "path", 6)(7, "path", 7);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]()();
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnamespaceHTML"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](8, "div", 8)(9, "span", 9);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtemplate"](10, TrainerHomeComponent_ng_container_10_Template, 3, 3, "ng-container", 10);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtemplate"](11, TrainerHomeComponent_ng_template_11_Template, 1, 0, "ng-template", null, 11, _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtemplateRefExtractor"]);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](13, "span", 12);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](14, "Total Students");
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]()()();
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](15, "div", 1)(16, "div", 13);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnamespaceSVG"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](17, "svg", 3);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](18, "path", 14)(19, "path", 15);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]()();
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnamespaceHTML"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](20, "div", 8)(21, "span", 9);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtemplate"](22, TrainerHomeComponent_ng_container_22_Template, 3, 3, "ng-container", 10);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtemplate"](23, TrainerHomeComponent_ng_template_23_Template, 1, 0, "ng-template", null, 16, _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtemplateRefExtractor"]);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](25, "span", 12);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](26, "Active Courses");
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]()()();
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](27, "div", 1)(28, "div", 17);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnamespaceSVG"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](29, "svg", 3);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](30, "line", 18)(31, "path", 19);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]()();
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnamespaceHTML"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](32, "div", 8)(33, "span", 9);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](34, "$24,580");
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](35, "span", 12);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](36, "Revenue (30d)");
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]()()()();
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](37, "div", 20)(38, "section", 21)(39, "div", 22)(40, "h2", 23);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](41, " Course Management ");
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](42, "a", 24);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](43, " Manage all ");
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]()();
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](44, "div", 25)(45, "table", 26)(46, "thead")(47, "tr")(48, "th", 27);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](49, "Course");
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](50, "th", 27);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](51, "Enrollments");
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](52, "th", 27);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](53, "Status");
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]()()();
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](54, "tbody");
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtemplate"](55, TrainerHomeComponent_tr_55_Template, 3, 0, "tr", 28);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtemplate"](56, TrainerHomeComponent_tr_56_Template, 3, 1, "tr", 28);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtemplate"](57, TrainerHomeComponent_tr_57_Template, 3, 0, "tr", 28);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtemplate"](58, TrainerHomeComponent_tr_58_Template, 8, 4, "tr", 29);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]()()()();
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](59, "aside", 30)(60, "div", 22)(61, "h2", 31);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](62, " Recent Enrollments ");
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](63, "a", 32);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](64, " View all ");
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]()();
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](65, "ul", 33)(66, "li", 34)(67, "span", 35);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](68, "MK");
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](69, "div", 36)(70, "span", 37);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](71, "Maria Kim");
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](72, "span", 38);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](73, "Advanced JavaScript");
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]()();
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](74, "time", 39);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](75, "2h ago");
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]()();
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](76, "li", 34)(77, "span", 35);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](78, "JL");
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](79, "div", 36)(80, "span", 37);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](81, "James Lee");
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](82, "span", 38);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](83, "React Fundamentals");
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]()();
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](84, "time", 39);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](85, "3h ago");
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]()();
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](86, "li", 34)(87, "span", 35);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](88, "AS");
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](89, "div", 36)(90, "span", 37);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](91, "Anna Smith");
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](92, "span", 38);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](93, "Cloud Architecture");
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]()();
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](94, "time", 39);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](95, "Yesterday");
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]()()();
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](96, "div", 40)(97, "h3", 41);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](98, "Notifications");
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](99, "ul", 42)(100, "li", 43);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](101, "span", 44);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](102, "span", 45);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](103, " New review on \"Advanced JavaScript\" ");
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]()();
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](104, "li", 43);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](105, "span", 44);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](106, "span", 45);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](107, " Workshop \"API Design\" scheduled for Feb 20 ");
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]()()()()()();
        }
        if (rf & 2) {
          const _r1 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵreference"](12);
          const _r4 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵreference"](24);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](10);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("ngIf", !ctx.loadingStats)("ngIfElse", _r1);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](12);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("ngIf", !ctx.loadingStats)("ngIfElse", _r4);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](33);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("ngIf", ctx.loadingCourses);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](1);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("ngIf", !ctx.loadingCourses && ctx.coursesError);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](1);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("ngIf", !ctx.loadingCourses && !ctx.coursesError && ctx.coursesRows.length === 0);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](1);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("ngForOf", ctx.coursesRows);
        }
      },
      dependencies: [_angular_common__WEBPACK_IMPORTED_MODULE_2__.CommonModule, _angular_common__WEBPACK_IMPORTED_MODULE_2__.NgClass, _angular_common__WEBPACK_IMPORTED_MODULE_2__.NgForOf, _angular_common__WEBPACK_IMPORTED_MODULE_2__.NgIf, _angular_common__WEBPACK_IMPORTED_MODULE_2__.DecimalPipe],
      styles: ["\n\n\n\n\n   .aletheia-trainer[_ngcontent-%COMP%] {\n    --aletheia-bg: #f8fafc;\n    --aletheia-surface: #ffffff;\n    --aletheia-sidebar: #0f172a;\n    --aletheia-text: #1e293b;\n    --aletheia-text-muted: #64748b;\n    --aletheia-accent: #6366f1;\n    --aletheia-accent-light: #818cf8;\n    --aletheia-accent-soft: rgba(99, 102, 241, 0.1);\n    --aletheia-border: #e2e8f0;\n    --aletheia-shadow: 0 1px 3px rgba(0, 0, 0, 0.06);\n    --aletheia-shadow-md: 0 4px 12px rgba(0, 0, 0, 0.06);\n    --aletheia-radius: 12px;\n    --aletheia-radius-sm: 8px;\n    --aletheia-font: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;\n  }\n  \n  .aletheia-dashboard[_ngcontent-%COMP%] {\n    display: flex;\n    min-height: 100vh;\n    font-family: var(--aletheia-font);\n    font-size: 1rem;\n    color: var(--aletheia-text);\n    background: var(--aletheia-bg);\n  }\n  \n  .sidebar[_ngcontent-%COMP%] {\n    width: 260px;\n    flex-shrink: 0;\n    background: var(--aletheia-sidebar);\n    padding: 1.5rem 0;\n    position: sticky;\n    top: 0;\n    height: 100vh;\n  }\n  \n  .sidebar-brand[_ngcontent-%COMP%] {\n    padding: 0 1.5rem 1.5rem;\n    border-bottom: 1px solid rgba(255, 255, 255, 0.08);\n    margin-bottom: 1rem;\n  }\n  \n  .brand-text[_ngcontent-%COMP%] {\n    font-weight: 700;\n    font-size: 1.25rem;\n    letter-spacing: 0.05em;\n    color: #fff;\n    display: block;\n  }\n  \n  .brand-role[_ngcontent-%COMP%] {\n    font-size: 0.75rem;\n    color: #94a3b8;\n    text-transform: uppercase;\n    letter-spacing: 0.05em;\n    margin-top: 0.25rem;\n    display: block;\n  }\n  \n  .sidebar-nav[_ngcontent-%COMP%] {\n    display: flex;\n    flex-direction: column;\n    gap: 0.25rem;\n    padding: 0 0.75rem;\n  }\n  \n  .nav-item[_ngcontent-%COMP%] {\n    display: flex;\n    align-items: center;\n    gap: 0.75rem;\n    padding: 0.75rem 1rem;\n    border-radius: var(--aletheia-radius-sm);\n    color: #94a3b8;\n    text-decoration: none;\n    font-weight: 500;\n    transition: background 0.2s, color 0.2s;\n  }\n  \n  .nav-item[_ngcontent-%COMP%]:hover {\n    color: #fff;\n    background: rgba(255, 255, 255, 0.06);\n  }\n  \n  .nav-item--active[_ngcontent-%COMP%] {\n    color: var(--aletheia-accent-light);\n    background: var(--aletheia-accent-soft);\n  }\n  \n  .nav-icon[_ngcontent-%COMP%] {\n    width: 1.25rem;\n    height: 1.25rem;\n    flex-shrink: 0;\n  }\n  \n  .nav-icon[_ngcontent-%COMP%]   svg[_ngcontent-%COMP%] {\n    width: 100%;\n    height: 100%;\n  }\n  \n  .main-content[_ngcontent-%COMP%] {\n    flex: 1;\n    min-width: 0;\n    padding: 1.5rem 2rem 2rem;\n  }\n  \n  .top-header[_ngcontent-%COMP%] {\n    display: flex;\n    align-items: center;\n    justify-content: space-between;\n    margin-bottom: 1.5rem;\n  }\n  \n  .page-title[_ngcontent-%COMP%] {\n    font-size: 1.5rem;\n    font-weight: 700;\n    margin: 0;\n    color: var(--aletheia-text);\n  }\n  \n  .header-right[_ngcontent-%COMP%] {\n    display: flex;\n    align-items: center;\n    gap: 1rem;\n  }\n  \n  .icon-btn[_ngcontent-%COMP%] {\n    position: relative;\n    width: 2.5rem;\n    height: 2.5rem;\n    border: none;\n    border-radius: var(--aletheia-radius-sm);\n    background: var(--aletheia-surface);\n    color: var(--aletheia-text-muted);\n    cursor: pointer;\n    display: flex;\n    align-items: center;\n    justify-content: center;\n    box-shadow: var(--aletheia-shadow);\n  }\n  \n  .icon-btn[_ngcontent-%COMP%]   svg[_ngcontent-%COMP%] {\n    width: 1.25rem;\n    height: 1.25rem;\n  }\n  \n  .badge-dot[_ngcontent-%COMP%] {\n    position: absolute;\n    top: 0.35rem;\n    right: 0.35rem;\n    min-width: 1.125rem;\n    height: 1.125rem;\n    padding: 0 0.25rem;\n    font-size: 0.6875rem;\n    font-weight: 600;\n    color: #fff;\n    background: var(--aletheia-accent);\n    border-radius: 999px;\n    display: flex;\n    align-items: center;\n    justify-content: center;\n  }\n  \n  .avatar-wrap[_ngcontent-%COMP%] {\n    width: 2.5rem;\n    height: 2.5rem;\n    border-radius: 50%;\n    overflow: hidden;\n    background: linear-gradient(135deg, var(--aletheia-accent), #8b5cf6);\n    display: flex;\n    align-items: center;\n    justify-content: center;\n  }\n  \n  .avatar[_ngcontent-%COMP%] {\n    font-size: 0.8125rem;\n    font-weight: 600;\n    color: #fff;\n  }\n  \n  \n\n  .stats-row[_ngcontent-%COMP%] {\n    display: grid;\n    grid-template-columns: repeat(3, 1fr);\n    gap: 1.25rem;\n    margin-bottom: 2rem;\n  }\n  \n  .stat-card[_ngcontent-%COMP%] {\n    background: var(--aletheia-surface);\n    border-radius: var(--aletheia-radius);\n    box-shadow: var(--aletheia-shadow-md);\n    border: 1px solid var(--aletheia-border);\n    padding: 1.25rem;\n    display: flex;\n    align-items: center;\n    gap: 1rem;\n  }\n  \n  .stat-icon[_ngcontent-%COMP%] {\n    width: 2.75rem;\n    height: 2.75rem;\n    border-radius: var(--aletheia-radius-sm);\n    display: flex;\n    align-items: center;\n    justify-content: center;\n    flex-shrink: 0;\n  }\n  \n  .stat-icon[_ngcontent-%COMP%]   svg[_ngcontent-%COMP%] {\n    width: 1.5rem;\n    height: 1.5rem;\n    color: #fff;\n  }\n  \n  .stat-icon--blue[_ngcontent-%COMP%] {\n    background: linear-gradient(135deg, #6366f1, #818cf8);\n  }\n  \n  .stat-icon--purple[_ngcontent-%COMP%] {\n    background: linear-gradient(135deg, #8b5cf6, #a78bfa);\n  }\n  \n  .stat-icon--green[_ngcontent-%COMP%] {\n    background: linear-gradient(135deg, #10b981, #34d399);\n  }\n  \n  .stat-content[_ngcontent-%COMP%] {\n    display: flex;\n    flex-direction: column;\n    gap: 0.125rem;\n  }\n  \n  .stat-value[_ngcontent-%COMP%] {\n    font-size: 1.5rem;\n    font-weight: 700;\n    color: var(--aletheia-text);\n  }\n  \n  .stat-label[_ngcontent-%COMP%] {\n    font-size: 0.875rem;\n    color: var(--aletheia-text-muted);\n  }\n  \n  \n\n  .two-col[_ngcontent-%COMP%] {\n    display: grid;\n    grid-template-columns: 1fr 380px;\n    gap: 1.5rem;\n  }\n  \n  .section[_ngcontent-%COMP%] {\n    margin-bottom: 0;\n  }\n  \n  .section-header[_ngcontent-%COMP%] {\n    display: flex;\n    align-items: center;\n    justify-content: space-between;\n    margin-bottom: 1rem;\n  }\n  \n  .section-title[_ngcontent-%COMP%] {\n    font-size: 1.125rem;\n    font-weight: 600;\n    margin: 0;\n    color: var(--aletheia-text);\n  }\n  \n  .link-more[_ngcontent-%COMP%] {\n    font-size: 0.875rem;\n    font-weight: 500;\n    color: var(--aletheia-accent);\n    text-decoration: none;\n  }\n  \n  .link-more[_ngcontent-%COMP%]:hover {\n    text-decoration: underline;\n  }\n  \n  \n\n  .table-wrap[_ngcontent-%COMP%] {\n    background: var(--aletheia-surface);\n    border-radius: var(--aletheia-radius);\n    box-shadow: var(--aletheia-shadow-md);\n    border: 1px solid var(--aletheia-border);\n    overflow: hidden;\n  }\n  \n  .data-table[_ngcontent-%COMP%] {\n    width: 100%;\n    border-collapse: collapse;\n    font-size: 0.9375rem;\n  }\n  \n  .data-table[_ngcontent-%COMP%]   th[_ngcontent-%COMP%] {\n    text-align: left;\n    padding: 0.875rem 1.25rem;\n    font-weight: 600;\n    color: var(--aletheia-text-muted);\n    background: #f8fafc;\n    border-bottom: 1px solid var(--aletheia-border);\n  }\n  \n  .data-table[_ngcontent-%COMP%]   td[_ngcontent-%COMP%] {\n    padding: 0.875rem 1.25rem;\n    border-bottom: 1px solid var(--aletheia-border);\n    color: var(--aletheia-text);\n  }\n  \n  .data-table[_ngcontent-%COMP%]   tbody[_ngcontent-%COMP%]   tr[_ngcontent-%COMP%]:last-child   td[_ngcontent-%COMP%] {\n    border-bottom: none;\n  }\n  \n  .status[_ngcontent-%COMP%] {\n    display: inline-block;\n    padding: 0.25rem 0.625rem;\n    border-radius: 999px;\n    font-size: 0.75rem;\n    font-weight: 500;\n  }\n  \n  .status--active[_ngcontent-%COMP%] {\n    background: rgba(16, 185, 129, 0.12);\n    color: #059669;\n  }\n  \n  .status--draft[_ngcontent-%COMP%] {\n    background: rgba(100, 116, 139, 0.12);\n    color: #64748b;\n  }\n  \n  \n\n  .enrollment-list[_ngcontent-%COMP%] {\n    list-style: none;\n    margin: 0 0 1.5rem;\n    padding: 0;\n    background: var(--aletheia-surface);\n    border-radius: var(--aletheia-radius);\n    box-shadow: var(--aletheia-shadow-md);\n    border: 1px solid var(--aletheia-border);\n    overflow: hidden;\n  }\n  \n  .enrollment-item[_ngcontent-%COMP%] {\n    padding: 1rem 1.25rem;\n    border-bottom: 1px solid var(--aletheia-border);\n    display: flex;\n    align-items: center;\n    gap: 0.75rem;\n  }\n  \n  .enrollment-item[_ngcontent-%COMP%]:last-child {\n    border-bottom: none;\n  }\n  \n  .enrollment-avatar[_ngcontent-%COMP%] {\n    width: 2.25rem;\n    height: 2.25rem;\n    border-radius: 50%;\n    background: var(--aletheia-accent-soft);\n    color: var(--aletheia-accent);\n    font-size: 0.75rem;\n    font-weight: 600;\n    display: flex;\n    align-items: center;\n    justify-content: center;\n    flex-shrink: 0;\n  }\n  \n  .enrollment-info[_ngcontent-%COMP%] {\n    flex: 1;\n    min-width: 0;\n    display: flex;\n    flex-direction: column;\n    gap: 0.125rem;\n  }\n  \n  .enrollment-name[_ngcontent-%COMP%] {\n    font-weight: 500;\n    color: var(--aletheia-text);\n  }\n  \n  .enrollment-course[_ngcontent-%COMP%] {\n    font-size: 0.8125rem;\n    color: var(--aletheia-text-muted);\n  }\n  \n  .enrollment-time[_ngcontent-%COMP%] {\n    font-size: 0.75rem;\n    color: var(--aletheia-text-muted);\n    flex-shrink: 0;\n  }\n  \n  \n\n  .notifications-panel[_ngcontent-%COMP%] {\n    background: var(--aletheia-surface);\n    border-radius: var(--aletheia-radius);\n    box-shadow: var(--aletheia-shadow-md);\n    border: 1px solid var(--aletheia-border);\n    padding: 1.25rem;\n  }\n  \n  .panel-title[_ngcontent-%COMP%] {\n    font-size: 0.9375rem;\n    font-weight: 600;\n    margin: 0 0 1rem;\n    color: var(--aletheia-text);\n  }\n  \n  .notif-list[_ngcontent-%COMP%] {\n    list-style: none;\n    margin: 0;\n    padding: 0;\n  }\n  \n  .notif-item[_ngcontent-%COMP%] {\n    display: flex;\n    align-items: flex-start;\n    gap: 0.75rem;\n    padding: 0.5rem 0;\n    border-bottom: 1px solid var(--aletheia-border);\n    font-size: 0.875rem;\n    color: var(--aletheia-text);\n  }\n  \n  .notif-item[_ngcontent-%COMP%]:last-child {\n    border-bottom: none;\n  }\n  \n  .notif-dot[_ngcontent-%COMP%] {\n    width: 8px;\n    height: 8px;\n    border-radius: 50%;\n    background: var(--aletheia-accent);\n    flex-shrink: 0;\n    margin-top: 0.4rem;\n  }\n  \n  .notif-text[_ngcontent-%COMP%] {\n    flex: 1;\n  }\n  \n  @media (max-width: 1024px) {\n    .two-col[_ngcontent-%COMP%] {\n      grid-template-columns: 1fr;\n    }\n  \n    .stats-row[_ngcontent-%COMP%] {\n      grid-template-columns: 1fr;\n    }\n  }\n  \n  @media (max-width: 768px) {\n    .aletheia-dashboard[_ngcontent-%COMP%] {\n      flex-direction: column;\n    }\n  \n    .sidebar[_ngcontent-%COMP%] {\n      width: 100%;\n      height: auto;\n      position: relative;\n      padding: 1rem;\n      display: flex;\n      align-items: center;\n      justify-content: space-between;\n    }\n  \n    .sidebar-brand[_ngcontent-%COMP%] {\n      padding: 0;\n      border: none;\n      margin: 0;\n    }\n  \n    .sidebar-nav[_ngcontent-%COMP%] {\n      flex-direction: row;\n      padding: 0;\n      gap: 0;\n      flex-wrap: wrap;\n    }\n  \n    .nav-item[_ngcontent-%COMP%]   .nav-label[_ngcontent-%COMP%] {\n      display: none;\n    }\n  \n    .brand-role[_ngcontent-%COMP%] {\n      display: none;\n    }\n  \n    .main-content[_ngcontent-%COMP%] {\n      padding: 1rem;\n    }\n  \n    .table-wrap[_ngcontent-%COMP%] {\n      overflow-x: auto;\n    }\n  \n    .data-table[_ngcontent-%COMP%] {\n      min-width: 400px;\n    }\n  }\n  \n  @media (prefers-reduced-motion: reduce) {\n    .nav-item[_ngcontent-%COMP%] {\n      transition: none;\n    }\n  }\n  \n/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8uL3NyYy9hcHAvYmFjay1vZmZpY2UvdHJhaW5lci1ob21lL3RyYWluZXItaG9tZS5jb21wb25lbnQuY3NzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOztpREFFaUQ7O0dBRTlDO0lBQ0Msc0JBQXNCO0lBQ3RCLDJCQUEyQjtJQUMzQiwyQkFBMkI7SUFDM0Isd0JBQXdCO0lBQ3hCLDhCQUE4QjtJQUM5QiwwQkFBMEI7SUFDMUIsZ0NBQWdDO0lBQ2hDLCtDQUErQztJQUMvQywwQkFBMEI7SUFDMUIsZ0RBQWdEO0lBQ2hELG9EQUFvRDtJQUNwRCx1QkFBdUI7SUFDdkIseUJBQXlCO0lBQ3pCLHFGQUFxRjtFQUN2Rjs7RUFFQTtJQUNFLGFBQWE7SUFDYixpQkFBaUI7SUFDakIsaUNBQWlDO0lBQ2pDLGVBQWU7SUFDZiwyQkFBMkI7SUFDM0IsOEJBQThCO0VBQ2hDOztFQUVBO0lBQ0UsWUFBWTtJQUNaLGNBQWM7SUFDZCxtQ0FBbUM7SUFDbkMsaUJBQWlCO0lBQ2pCLGdCQUFnQjtJQUNoQixNQUFNO0lBQ04sYUFBYTtFQUNmOztFQUVBO0lBQ0Usd0JBQXdCO0lBQ3hCLGtEQUFrRDtJQUNsRCxtQkFBbUI7RUFDckI7O0VBRUE7SUFDRSxnQkFBZ0I7SUFDaEIsa0JBQWtCO0lBQ2xCLHNCQUFzQjtJQUN0QixXQUFXO0lBQ1gsY0FBYztFQUNoQjs7RUFFQTtJQUNFLGtCQUFrQjtJQUNsQixjQUFjO0lBQ2QseUJBQXlCO0lBQ3pCLHNCQUFzQjtJQUN0QixtQkFBbUI7SUFDbkIsY0FBYztFQUNoQjs7RUFFQTtJQUNFLGFBQWE7SUFDYixzQkFBc0I7SUFDdEIsWUFBWTtJQUNaLGtCQUFrQjtFQUNwQjs7RUFFQTtJQUNFLGFBQWE7SUFDYixtQkFBbUI7SUFDbkIsWUFBWTtJQUNaLHFCQUFxQjtJQUNyQix3Q0FBd0M7SUFDeEMsY0FBYztJQUNkLHFCQUFxQjtJQUNyQixnQkFBZ0I7SUFDaEIsdUNBQXVDO0VBQ3pDOztFQUVBO0lBQ0UsV0FBVztJ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QUNyQyx3Q0FBd0M7SUFDeEMsZ0JBQWdCO0VBQ2xCOztFQUVBO0lBQ0Usb0JBQW9CO0lBQ3BCLGdCQUFnQjtJQUNoQixnQkFBZ0I7SUFDaEIsMkJBQTJCO0VBQzdCOztFQUVBO0lBQ0UsZ0JBQWdCO0lBQ2hCLFNBQVM7SUFDVCxVQUFVO0VBQ1o7O0VBRUE7SUFDRSxhQUFhO0lBQ2IsdUJBQXVCO0lBQ3ZCLFlBQVk7SUFDWixpQkFBaUI7SUFDakIsK0NBQStDO0lBQy9DLG1CQUFtQjtJQUNuQiwyQkFBMkI7RUFDN0I7O0VBRUE7SUFDRSxtQkFBbUI7RUFDckI7O0VBRUE7SUFDRSxVQUFVO0lBQ1YsV0FBVztJQUNYLGtCQUFrQjtJQUNsQixrQ0FBa0M7SUFDbEMsY0FBYztJQUNkLGtCQUFrQjtFQUNwQjs7RUFFQTtJQUNFLE9BQU87RUFDVDs7RUFFQTtJQUNFO01BQ0UsMEJBQTBCO0lBQzVCOztJQUVBO01BQ0UsMEJBQTBCO0lBQzVCO0VBQ0Y7O0VBRUE7SUFDRTtNQUNFLHNCQUFzQjtJQUN4Qjs7SUFFQTtNQUNFLFdBQVc7TUFDWCxZQUFZO01BQ1osa0JBQWtCO01BQ2xCLGFBQWE7TUFDYixhQUFhO01BQ2IsbUJBQW1CO01BQ25CLDhCQUE4QjtJQUNoQzs7SUFFQTtNQUNFLFVBQVU7TUFDVixZQUFZO01BQ1osU0FBUztJQUNYOztJQUVBO01BQ0UsbUJBQW1CO01BQ25CLFVBQVU7TUFDVixNQUFNO01BQ04sZUFBZTtJQUNqQjs7SUFFQTtNQUNFLGFBQWE7SUFDZjs7SUFFQTtNQUNFLGFBQWE7SUFDZjs7SUFFQTtNQUNFLGFBQWE7SUFDZjs7SUFFQTtNQUNFLGdCQUFnQjtJQUNsQjs7SUFFQTtNQUNFLGdCQUFnQjtJQUNsQjtFQUNGOztFQUVBO0lBQ0U7TUFDRSxnQkFBZ0I7SUFDbEI7RUFDRiIsInNvdXJjZXNDb250ZW50IjpbIi8qID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XHJcbiAgIEFMRVRIRUlBIMOiwoDCkyBUcmFpbmVyIERhc2hib2FyZFxyXG4gICA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAqL1xyXG5cclxuICAgLmFsZXRoZWlhLXRyYWluZXIge1xyXG4gICAgLS1hbGV0aGVpYS1iZzogI2Y4ZmFmYztcclxuICAgIC0tYWxldGhlaWEtc3VyZmFjZTogI2ZmZmZmZjtcclxuICAgIC0tYWxldGhlaWEtc2lkZWJhcjogIzBmMTcyYTtcclxuICAgIC0tYWxldGhlaWEtdGV4dDogIzFlMjkzYjtcclxuICAgIC0tYWxldGhlaWEtdGV4dC1tdXRlZDogIzY0NzQ4YjtcclxuICAgIC0tYWxldGhlaWEtYWNjZW50OiAjNjM2NmYxO1xyXG4gICAgLS1hbGV0aGVpYS1hY2NlbnQtbGlnaHQ6ICM4MThjZjg7XHJcbiAgICAtLWFsZXRoZWlhLWFjY2VudC1zb2Z0OiByZ2JhKDk5LCAxMDIsIDI0MSwgMC4xKTtcclxuICAgIC0tYWxldGhlaWEtYm9yZGVyOiAjZTJlOGYwO1xyXG4gICAgLS1hbGV0aGVpYS1zaGFkb3c6IDAgMXB4IDNweCByZ2JhKDAsIDAsIDAsIDAuMDYpO1xyXG4gICAgLS1hbGV0aGVpYS1zaGFkb3ctbWQ6IDAgNHB4IDEycHggcmdiYSgwLCAwLCAwLCAwLjA2KTtcclxuICAgIC0tYWxldGhlaWEtcmFkaXVzOiAxMnB4O1xyXG4gICAgLS1hbGV0aGVpYS1yYWRpdXMtc206IDhweDtcclxuICAgIC0tYWxldGhlaWEtZm9udDogc3lzdGVtLXVpLCAtYXBwbGUtc3lzdGVtLCBCbGlua01hY1N5c3RlbUZvbnQsICdTZWdvZSBVSScsIHNhbnMtc2VyaWY7XHJcbiAgfVxyXG4gIFxyXG4gIC5hbGV0aGVpYS1kYXNoYm9hcmQge1xyXG4gICAgZGlzcGxheTogZmxleDtcclxuICAgIG1pbi1oZWlnaHQ6IDEwMHZoO1xyXG4gICAgZm9udC1mYW1pbHk6IHZhcigtLWFsZXRoZWlhLWZvbnQpO1xyXG4gICAgZm9udC1zaXplOiAxcmVtO1xyXG4gICAgY29sb3I6IHZhcigtLWFsZXRoZWlhLXRleHQpO1xyXG4gICAgYmFja2dyb3VuZDogdmFyKC0tYWxldGhlaWEtYmcpO1xyXG4gIH1cclxuICBcclxuICAuc2lkZWJhciB7XHJcbiAgICB3aWR0aDogMjYwcHg7XHJcbiAgICBmbGV4LXNocmluazogMDtcclxuICAgIGJhY2tncm91bmQ6IHZhcigtLWFsZXRoZWlhLXNpZGViYXIpO1xyXG4gICAgcGFkZGluZzogMS41cmVtIDA7XHJcbiAgICBwb3NpdGlvbjogc3RpY2t5O1xyXG4gICAgdG9wOiAwO1xyXG4gICAgaGVpZ2h0OiAxMDB2aDtcclxuICB9XHJcbiAgXHJcbiAgLnNpZGViYXItYnJhbmQge1xyXG4gICAgcGFkZGluZzogMCAxLjVyZW0gMS41cmVtO1xyXG4gICAgYm9yZGVyLWJvdHRvbTogMXB4IHNvbGlkIHJnYmEoMjU1LCAyNTUsIDI1NSwgMC4wOCk7XHJcbiAgICBtYXJnaW4tYm90dG9tOiAxcmVtO1xyXG4gIH1cclxuICBcclxuICAuYnJhbmQtdGV4dCB7XHJcbiAgICBmb250LXdlaWdodDogNzAwO1xyXG4gICAgZm9udC1zaXplOiAxLjI1cmVtO1xyXG4gICAgbGV0dGVyLXNwYWNpbmc6IDAuMDVlbTtcclxuICAgIGNvbG9yOiAjZmZmO1xyXG4gICAgZGlzcGxheTogYmxvY2s7XHJcbiAgfVxyXG4gIFxyXG4gIC5icmFuZC1yb2xlIHtcclxuICAgIGZvbnQtc2l6ZTogMC43NXJlbTtcclxuICAgIGNvbG9yOiAjOTRhM2I4O1xyXG4gICAgdGV4dC10cmFuc2Zvcm06IHVwcGVyY2FzZTtcclxuICAgIGxldHRlci1zcGFjaW5nOiAwLjA1ZW07XHJcbiAgICBtYXJnaW4tdG9wOiAwLjI1cmVtO1xyXG4gICAgZGlzcGxheTogYmxvY2s7XHJcbiAgfVxyXG4gIFxyXG4gIC5zaWRlYmFyLW5hdiB7XHJcbiAgICBkaXNwbGF5OiBmbGV4O1xyXG4gICAgZmxleC1kaXJlY3Rpb246IGNvbHVtbjtcclxuICAgIGdhcDogMC4yNXJlbTtcclxuICAgIHBhZGRpbmc6IDAgMC43NXJlbTtcclxuICB9XHJcbiAgXHJcbiAgLm5hdi1pdGVtIHtcclxuICAgIGRpc3BsYXk6IGZsZXg7XHJcbiAgICBhbGlnbi1pdGVtczogY2VudGVyO1xyXG4gICAgZ2FwOiAwLjc1cmVtO1xyXG4gICAgcGFkZGluZzogMC43NXJlbSAxcmVtO1xyXG4gICAgYm9yZGVyLXJhZGl1czogdmFyKC0tYWxldGhlaWEtcmFkaXVzLXNtKTtcclxuICAgIGNvbG9yOiAjOTRhM2I4O1xyXG4gICAgdGV4dC1kZWNvcmF0aW9uOiBub25lO1xyXG4gICAgZm9udC13ZWlnaHQ6IDUwMDtcclxuICAgIHRyYW5zaXRpb246IGJhY2tncm91bmQgMC4ycywgY29sb3IgMC4ycztcclxuICB9XHJcbiAgXHJcbiAgLm5hdi1pdGVtOmhvdmVyIHtcclxuICAgIGNvbG9yOiAjZmZmO1xyXG4gICAgYmFja2dyb3VuZDogcmdiYSgyNTUsIDI1NSwgMjU1LCAwLjA2KTtcclxuICB9XHJcbiAgXHJcbiAgLm5hdi1pdGVtLS1hY3RpdmUge1xyXG4gICAgY29sb3I6IHZhcigtLWFsZXRoZWlhLWFjY2VudC1saWdodCk7XHJcbiAgICBiYWNrZ3JvdW5kOiB2YXIoLS1hbGV0aGVpYS1hY2NlbnQtc29mdCk7XHJcbiAgfVxyXG4gIFxyXG4gIC5uYXYtaWNvbiB7XHJcbiAgICB3aWR0aDogMS4yNXJlbTtcclxuICAgIGhlaWdodDogMS4yNXJlbTtcclxuICAgIGZsZXgtc2hyaW5rOiAwO1xyXG4gIH1cclxuICBcclxuICAubmF2LWljb24gc3ZnIHtcclxuICAgIHdpZHRoOiAxMDAlO1xyXG4gICAgaGVpZ2h0OiAxMDAlO1xyXG4gIH1cclxuICBcclxuICAubWFpbi1jb250ZW50IHtcclxuICAgIGZsZXg6IDE7XHJcbiAgICBtaW4td2lkdGg6IDA7XHJcbiAgICBwYWRkaW5nOiAxLjVyZW0gMnJlbSAycmVtO1xyXG4gIH1cclxuICBcclxuICAudG9wLWhlYWRlciB7XHJcbiAgICBkaXNwbGF5OiBmbGV4O1xyXG4gICAgYWxpZ24taXRlbXM6IGNlbnRlcjtcclxuICAgIGp1c3RpZnktY29udGVudDogc3BhY2UtYmV0d2VlbjtcclxuICAgIG1hcmdpbi1ib3R0b206IDEuNXJlbTtcclxuICB9XHJcbiAgXHJcbiAgLnBhZ2UtdGl0bGUge1xyXG4gICAgZm9udC1zaXplOiAxLjVyZW07XHJcbiAgICBmb250LXdlaWdodDogNzAwO1xyXG4gICAgbWFyZ2luOiAwO1xyXG4gICAgY29sb3I6IHZhcigtLWFsZXRoZWlhLXRleHQpO1xyXG4gIH1cclxuICBcclxuICAuaGVhZGVyLXJpZ2h0IHtcclxuICAgIGRpc3BsYXk6IGZsZXg7XHJcbiAgICBhbGlnbi1pdGVtczogY2VudGVyO1xyXG4gICAgZ2FwOiAxcmVtO1xyXG4gIH1cclxuICBcclxuICAuaWNvbi1idG4ge1xyXG4gICAgcG9zaXRpb246IHJlbGF0aXZlO1xyXG4gICAgd2lkdGg6IDIuNXJlbTtcclxuICAgIGhlaWdodDogMi41cmVtO1xyXG4gICAgYm9yZGVyOiBub25lO1xyXG4gICAgYm9yZGVyLXJhZGl1czogdmFyKC0tYWxldGhlaWEtcmFkaXVzLXNtKTtcclxuICAgIGJhY2tncm91bmQ6IHZhcigtLWFsZXRoZWlhLXN1cmZhY2UpO1xyXG4gICAgY29sb3I6IHZhcigtLWFsZXRoZWlhLXRleHQtbXV0ZWQpO1xyXG4gICAgY3Vyc29yOiBwb2ludGVyO1xyXG4gICAgZGlzcGxheTogZmxleDtcclxuICAgIGFsaWduLWl0ZW1zOiBjZW50ZXI7XHJcbiAgICBqdXN0aWZ5LWNvbnRlbnQ6IGNlbnRlcjtcclxuICAgIGJveC1zaGFkb3c6IHZhcigtLWFsZXRoZWlhLXNoYWRvdyk7XHJcbiAgfVxyXG4gIFxyXG4gIC5pY29uLWJ0biBzdmcge1xyXG4gICAgd2lkdGg6IDEuMjVyZW07XHJcbiAgICBoZWlnaHQ6IDEuMjVyZW07XHJcbiAgfVxyXG4gIFxyXG4gIC5iYWRnZS1kb3Qge1xyXG4gICAgcG9zaXRpb246IGFic29sdXRlO1xyXG4gICAgdG9wOiAwLjM1cmVtO1xyXG4gICAgcmlnaHQ6IDAuMzVyZW07XHJcbiAgICBtaW4td2lkdGg6IDEuMTI1cmVtO1xyXG4gICAgaGVpZ2h0OiAxLjEyNXJlbTtcclxuICAgIHBhZGRpbmc6IDAgMC4yNXJlbTtcclxuICAgIGZvbnQtc2l6ZTogMC42ODc1cmVtO1xyXG4gICAgZm9udC13ZWlnaHQ6IDYwMDtcclxuICAgIGNvbG9yOiAjZmZmO1xyXG4gICAgYmFja2dyb3VuZDogdmFyKC0tYWxldGhlaWEtYWNjZW50KTtcclxuICAgIGJvcmRlci1yYWRpdXM6IDk5OXB4O1xyXG4gICAgZGlzcGxheTogZmxleDtcclxuICAgIGFsaWduLWl0ZW1zOiBjZW50ZXI7XHJcbiAgICBqdXN0aWZ5LWNvbnRlbnQ6IGNlbnRlcjtcclxuICB9XHJcbiAgXHJcbiAgLmF2YXRhci13cmFwIHtcclxuICAgIHdpZHRoOiAyLjVyZW07XHJcbiAgICBoZWlnaHQ6IDIuNXJlbTtcclxuICAgIGJvcmRlci1yYWRpdXM6IDUwJTtcclxuICAgIG92ZXJmbG93OiBoaWRkZW47XHJcbiAgICBiYWNrZ3JvdW5kOiBsaW5lYXItZ3JhZGllbnQoMTM1ZGVnLCB2YXIoLS1hbGV0aGVpYS1hY2NlbnQpLCAjOGI1Y2Y2KTtcclxuICAgIGRpc3BsYXk6IGZsZXg7XHJcbiAgICBhbGlnbi1pdGVtczogY2VudGVyO1xyXG4gICAganVzdGlmeS1jb250ZW50OiBjZW50ZXI7XHJcbiAgfVxyXG4gIFxyXG4gIC5hdmF0YXIge1xyXG4gICAgZm9udC1zaXplOiAwLjgxMjVyZW07XHJcbiAgICBmb250LXdlaWdodDogNjAwO1xyXG4gICAgY29sb3I6ICNmZmY7XHJcbiAgfVxyXG4gIFxyXG4gIC8qIFN0YXRzIHJvdyAqL1xyXG4gIC5zdGF0cy1yb3cge1xyXG4gICAgZGlzcGxheTogZ3JpZDtcclxuICAgIGdyaWQtdGVtcGxhdGUtY29sdW1uczogcmVwZWF0KDMsIDFmcik7XHJcbiAgICBnYXA6IDEuMjVyZW07XHJcbiAgICBtYXJnaW4tYm90dG9tOiAycmVtO1xyXG4gIH1cclxuICBcclxuICAuc3RhdC1jYXJkIHtcclxuICAgIGJhY2tncm91bmQ6IHZhcigtLWFsZXRoZWlhLXN1cmZhY2UpO1xyXG4gICAgYm9yZGVyLXJhZGl1czogdmFyKC0tYWxldGhlaWEtcmFkaXVzKTtcclxuICAgIGJveC1zaGFkb3c6IHZhcigtLWFsZXRoZWlhLXNoYWRvdy1tZCk7XHJcbiAgICBib3JkZXI6IDFweCBzb2xpZCB2YXIoLS1hbGV0aGVpYS1ib3JkZXIpO1xyXG4gICAgcGFkZGluZzogMS4yNXJlbTtcclxuICAgIGRpc3BsYXk6IGZsZXg7XHJcbiAgICBhbGlnbi1pdGVtczogY2VudGVyO1xyXG4gICAgZ2FwOiAxcmVtO1xyXG4gIH1cclxuICBcclxuICAuc3RhdC1pY29uIHtcclxuICAgIHdpZHRoOiAyLjc1cmVtO1xyXG4gICAgaGVpZ2h0OiAyLjc1cmVtO1xyXG4gICAgYm9yZGVyLXJhZGl1czogdmFyKC0tYWxldGhlaWEtcmFkaXVzLXNtKTtcclxuICAgIGRpc3BsYXk6IGZsZXg7XHJcbiAgICBhbGlnbi1pdGVtczogY2VudGVyO1xyXG4gICAganVzdGlmeS1jb250ZW50OiBjZW50ZXI7XHJcbiAgICBmbGV4LXNocmluazogMDtcclxuICB9XHJcbiAgXHJcbiAgLnN0YXQtaWNvbiBzdmcge1xyXG4gICAgd2lkdGg6IDEuNXJlbTtcclxuICAgIGhlaWdodDogMS41cmVtO1xyXG4gICAgY29sb3I6ICNmZmY7XHJcbiAgfVxyXG4gIFxyXG4gIC5zdGF0LWljb24tLWJsdWUge1xyXG4gICAgYmFja2dyb3VuZDogbGluZWFyLWdyYWRpZW50KDEzNWRlZywgIzYzNjZmMSwgIzgxOGNmOCk7XHJcbiAgfVxyXG4gIFxyXG4gIC5zdGF0LWljb24tLXB1cnBsZSB7XHJcbiAgICBiYWNrZ3JvdW5kOiBsaW5lYXItZ3JhZGllbnQoMTM1ZGVnLCAjOGI1Y2Y2LCAjYTc4YmZhKTtcclxuICB9XHJcbiAgXHJcbiAgLnN0YXQtaWNvbi0tZ3JlZW4ge1xyXG4gICAgYmFja2dyb3VuZDogbGluZWFyLWdyYWRpZW50KDEzNWRlZywgIzEwYjk4MSwgIzM0ZDM5OSk7XHJcbiAgfVxyXG4gIFxyXG4gIC5zdGF0LWNvbnRlbnQge1xyXG4gICAgZGlzcGxheTogZmxleDtcclxuICAgIGZsZXgtZGlyZWN0aW9uOiBjb2x1bW47XHJcbiAgICBnYXA6IDAuMTI1cmVtO1xyXG4gIH1cclxuICBcclxuICAuc3RhdC12YWx1ZSB7XHJcbiAgICBmb250LXNpemU6IDEuNXJlbTtcclxuICAgIGZvbnQtd2VpZ2h0OiA3MDA7XHJcbiAgICBjb2xvcjogdmFyKC0tYWxldGhlaWEtdGV4dCk7XHJcbiAgfVxyXG4gIFxyXG4gIC5zdGF0LWxhYmVsIHtcclxuICAgIGZvbnQtc2l6ZTogMC44NzVyZW07XHJcbiAgICBjb2xvcjogdmFyKC0tYWxldGhlaWEtdGV4dC1tdXRlZCk7XHJcbiAgfVxyXG4gIFxyXG4gIC8qIFR3byBjb2wgbGF5b3V0ICovXHJcbiAgLnR3by1jb2wge1xyXG4gICAgZGlzcGxheTogZ3JpZDtcclxuICAgIGdyaWQtdGVtcGxhdGUtY29sdW1uczogMWZyIDM4MHB4O1xyXG4gICAgZ2FwOiAxLjVyZW07XHJcbiAgfVxyXG4gIFxyXG4gIC5zZWN0aW9uIHtcclxuICAgIG1hcmdpbi1ib3R0b206IDA7XHJcbiAgfVxyXG4gIFxyXG4gIC5zZWN0aW9uLWhlYWRlciB7XHJcbiAgICBkaXNwbGF5OiBmbGV4O1xyXG4gICAgYWxpZ24taXRlbXM6IGNlbnRlcjtcclxuICAgIGp1c3RpZnktY29udGVudDogc3BhY2UtYmV0d2VlbjtcclxuICAgIG1hcmdpbi1ib3R0b206IDFyZW07XHJcbiAgfVxyXG4gIFxyXG4gIC5zZWN0aW9uLXRpdGxlIHtcclxuICAgIGZvbnQtc2l6ZTogMS4xMjVyZW07XHJcbiAgICBmb250LXdlaWdodDogNjAwO1xyXG4gICAgbWFyZ2luOiAwO1xyXG4gICAgY29sb3I6IHZhcigtLWFsZXRoZWlhLXRleHQpO1xyXG4gIH1cclxuICBcclxuICAubGluay1tb3JlIHtcclxuICAgIGZvbnQtc2l6ZTogMC44NzVyZW07XHJcbiAgICBmb250LXdlaWdodDogNTAwO1xyXG4gICAgY29sb3I6IHZhcigtLWFsZXRoZWlhLWFjY2VudCk7XHJcbiAgICB0ZXh0LWRlY29yYXRpb246IG5vbmU7XHJcbiAgfVxyXG4gIFxyXG4gIC5saW5rLW1vcmU6aG92ZXIge1xyXG4gICAgdGV4dC1kZWNvcmF0aW9uOiB1bmRlcmxpbmU7XHJcbiAgfVxyXG4gIFxyXG4gIC8qIFRhYmxlICovXHJcbiAgLnRhYmxlLXdyYXAge1xyXG4gICAgYmFja2dyb3VuZDogdmFyKC0tYWxldGhlaWEtc3VyZmFjZSk7XHJcbiAgICBib3JkZXItcmFkaXVzOiB2YXIoLS1hbGV0aGVpYS1yYWRpdXMpO1xyXG4gICAgYm94LXNoYWRvdzogdmFyKC0tYWxldGhlaWEtc2hhZG93LW1kKTtcclxuICAgIGJvcmRlcjogMXB4IHNvbGlkIHZhcigtLWFsZXRoZWlhLWJvcmRlcik7XHJcbiAgICBvdmVyZmxvdzogaGlkZGVuO1xyXG4gIH1cclxuICBcclxuICAuZGF0YS10YWJsZSB7XHJcbiAgICB3aWR0aDogMTAwJTtcclxuICAgIGJvcmRlci1jb2xsYXBzZTogY29sbGFwc2U7XHJcbiAgICBmb250LXNpemU6IDAuOTM3NXJlbTtcclxuICB9XHJcbiAgXHJcbiAgLmRhdGEtdGFibGUgdGgge1xyXG4gICAgdGV4dC1hbGlnbjogbGVmdDtcclxuICAgIHBhZGRpbmc6IDAuODc1cmVtIDEuMjVyZW07XHJcbiAgICBmb250LXdlaWdodDogNjAwO1xyXG4gICAgY29sb3I6IHZhcigtLWFsZXRoZWlhLXRleHQtbXV0ZWQpO1xyXG4gICAgYmFja2dyb3VuZDogI2Y4ZmFmYztcclxuICAgIGJvcmRlci1ib3R0b206IDFweCBzb2xpZCB2YXIoLS1hbGV0aGVpYS1ib3JkZXIpO1xyXG4gIH1cclxuICBcclxuICAuZGF0YS10YWJsZSB0ZCB7XHJcbiAgICBwYWRkaW5nOiAwLjg3NXJlbSAxLjI1cmVtO1xyXG4gICAgYm9yZGVyLWJvdHRvbTogMXB4IHNvbGlkIHZhcigtLWFsZXRoZWlhLWJvcmRlcik7XHJcbiAgICBjb2xvcjogdmFyKC0tYWxldGhlaWEtdGV4dCk7XHJcbiAgfVxyXG4gIFxyXG4gIC5kYXRhLXRhYmxlIHRib2R5IHRyOmxhc3QtY2hpbGQgdGQge1xyXG4gICAgYm9yZGVyLWJvdHRvbTogbm9uZTtcclxuICB9XHJcbiAgXHJcbiAgLnN0YXR1cyB7XHJcbiAgICBkaXNwbGF5OiBpbmxpbmUtYmxvY2s7XHJcbiAgICBwYWRkaW5nOiAwLjI1cmVtIDAuNjI1cmVtO1xyXG4gICAgYm9yZGVyLXJhZGl1czogOTk5cHg7XHJcbiAgICBmb250LXNpemU6IDAuNzVyZW07XHJcbiAgICBmb250LXdlaWdodDogNTAwO1xyXG4gIH1cclxuICBcclxuICAuc3RhdHVzLS1hY3RpdmUge1xyXG4gICAgYmFja2dyb3VuZDogcmdiYSgxNiwgMTg1LCAxMjksIDAuMTIpO1xyXG4gICAgY29sb3I6ICMwNTk2Njk7XHJcbiAgfVxyXG4gIFxyXG4gIC5zdGF0dXMtLWRyYWZ0IHtcclxuICAgIGJhY2tncm91bmQ6IHJnYmEoMTAwLCAxMTYsIDEzOSwgMC4xMik7XHJcbiAgICBjb2xvcjogIzY0NzQ4YjtcclxuICB9XHJcbiAgXHJcbiAgLyogRW5yb2xsbWVudHMgbGlzdCAqL1xyXG4gIC5lbnJvbGxtZW50LWxpc3Qge1xyXG4gICAgbGlzdC1zdHlsZTogbm9uZTtcclxuICAgIG1hcmdpbjogMCAwIDEuNXJlbTtcclxuICAgIHBhZGRpbmc6IDA7XHJcbiAgICBiYWNrZ3JvdW5kOiB2YXIoLS1hbGV0aGVpYS1zdXJmYWNlKTtcclxuICAgIGJvcmRlci1yYWRpdXM6IHZhcigtLWFsZXRoZWlhLXJhZGl1cyk7XHJcbiAgICBib3gtc2hhZG93OiB2YXIoLS1hbGV0aGVpYS1zaGFkb3ctbWQpO1xyXG4gICAgYm9yZGVyOiAxcHggc29saWQgdmFyKC0tYWxldGhlaWEtYm9yZGVyKTtcclxuICAgIG92ZXJmbG93OiBoaWRkZW47XHJcbiAgfVxyXG4gIFxyXG4gIC5lbnJvbGxtZW50LWl0ZW0ge1xyXG4gICAgcGFkZGluZzogMXJlbSAxLjI1cmVtO1xyXG4gICAgYm9yZGVyLWJvdHRvbTogMXB4IHNvbGlkIHZhcigtLWFsZXRoZWlhLWJvcmRlcik7XHJcbiAgICBkaXNwbGF5OiBmbGV4O1xyXG4gICAgYWxpZ24taXRlbXM6IGNlbnRlcjtcclxuICAgIGdhcDogMC43NXJlbTtcclxuICB9XHJcbiAgXHJcbiAgLmVucm9sbG1lbnQtaXRlbTpsYXN0LWNoaWxkIHtcclxuICAgIGJvcmRlci1ib3R0b206IG5vbmU7XHJcbiAgfVxyXG4gIFxyXG4gIC5lbnJvbGxtZW50LWF2YXRhciB7XHJcbiAgICB3aWR0aDogMi4yNXJlbTtcclxuICAgIGhlaWdodDogMi4yNXJlbTtcclxuICAgIGJvcmRlci1yYWRpdXM6IDUwJTtcclxuICAgIGJhY2tncm91bmQ6IHZhcigtLWFsZXRoZWlhLWFjY2VudC1zb2Z0KTtcclxuICAgIGNvbG9yOiB2YXIoLS1hbGV0aGVpYS1hY2NlbnQpO1xyXG4gICAgZm9udC1zaXplOiAwLjc1cmVtO1xyXG4gICAgZm9udC13ZWlnaHQ6IDYwMDtcclxuICAgIGRpc3BsYXk6IGZsZXg7XHJcbiAgICBhbGlnbi1pdGVtczogY2VudGVyO1xyXG4gICAganVzdGlmeS1jb250ZW50OiBjZW50ZXI7XHJcbiAgICBmbGV4LXNocmluazogMDtcclxuICB9XHJcbiAgXHJcbiAgLmVucm9sbG1lbnQtaW5mbyB7XHJcbiAgICBmbGV4OiAxO1xyXG4gICAgbWluLXdpZHRoOiAwO1xyXG4gICAgZGlzcGxheTogZmxleDtcclxuICAgIGZsZXgtZGlyZWN0aW9uOiBjb2x1bW47XHJcbiAgICBnYXA6IDAuMTI1cmVtO1xyXG4gIH1cclxuICBcclxuICAuZW5yb2xsbWVudC1uYW1lIHtcclxuICAgIGZvbnQtd2VpZ2h0OiA1MDA7XHJcbiAgICBjb2xvcjogdmFyKC0tYWxldGhlaWEtdGV4dCk7XHJcbiAgfVxyXG4gIFxyXG4gIC5lbnJvbGxtZW50LWNvdXJzZSB7XHJcbiAgICBmb250LXNpemU6IDAuODEyNXJlbTtcclxuICAgIGNvbG9yOiB2YXIoLS1hbGV0aGVpYS10ZXh0LW11dGVkKTtcclxuICB9XHJcbiAgXHJcbiAgLmVucm9sbG1lbnQtdGltZSB7XHJcbiAgICBmb250LXNpemU6IDAuNzVyZW07XHJcbiAgICBjb2xvcjogdmFyKC0tYWxldGhlaWEtdGV4dC1tdXRlZCk7XHJcbiAgICBmbGV4LXNocmluazogMDtcclxuICB9XHJcbiAgXHJcbiAgLyogTm90aWZpY2F0aW9ucyBwYW5lbCAqL1xyXG4gIC5ub3RpZmljYXRpb25zLXBhbmVsIHtcclxuICAgIGJhY2tncm91bmQ6IHZhcigtLWFsZXRoZWlhLXN1cmZhY2UpO1xyXG4gICAgYm9yZGVyLXJhZGl1czogdmFyKC0tYWxldGhlaWEtcmFkaXVzKTtcclxuICAgIGJveC1zaGFkb3c6IHZhcigtLWFsZXRoZWlhLXNoYWRvdy1tZCk7XHJcbiAgICBib3JkZXI6IDFweCBzb2xpZCB2YXIoLS1hbGV0aGVpYS1ib3JkZXIpO1xyXG4gICAgcGFkZGluZzogMS4yNXJlbTtcclxuICB9XHJcbiAgXHJcbiAgLnBhbmVsLXRpdGxlIHtcclxuICAgIGZvbnQtc2l6ZTogMC45Mzc1cmVtO1xyXG4gICAgZm9udC13ZWlnaHQ6IDYwMDtcclxuICAgIG1hcmdpbjogMCAwIDFyZW07XHJcbiAgICBjb2xvcjogdmFyKC0tYWxldGhlaWEtdGV4dCk7XHJcbiAgfVxyXG4gIFxyXG4gIC5ub3RpZi1saXN0IHtcclxuICAgIGxpc3Qtc3R5bGU6IG5vbmU7XHJcbiAgICBtYXJnaW46IDA7XHJcbiAgICBwYWRkaW5nOiAwO1xyXG4gIH1cclxuICBcclxuICAubm90aWYtaXRlbSB7XHJcbiAgICBkaXNwbGF5OiBmbGV4O1xyXG4gICAgYWxpZ24taXRlbXM6IGZsZXgtc3RhcnQ7XHJcbiAgICBnYXA6IDAuNzVyZW07XHJcbiAgICBwYWRkaW5nOiAwLjVyZW0gMDtcclxuICAgIGJvcmRlci1ib3R0b206IDFweCBzb2xpZCB2YXIoLS1hbGV0aGVpYS1ib3JkZXIpO1xyXG4gICAgZm9udC1zaXplOiAwLjg3NXJlbTtcclxuICAgIGNvbG9yOiB2YXIoLS1hbGV0aGVpYS10ZXh0KTtcclxuICB9XHJcbiAgXHJcbiAgLm5vdGlmLWl0ZW06bGFzdC1jaGlsZCB7XHJcbiAgICBib3JkZXItYm90dG9tOiBub25lO1xyXG4gIH1cclxuICBcclxuICAubm90aWYtZG90IHtcclxuICAgIHdpZHRoOiA4cHg7XHJcbiAgICBoZWlnaHQ6IDhweDtcclxuICAgIGJvcmRlci1yYWRpdXM6IDUwJTtcclxuICAgIGJhY2tncm91bmQ6IHZhcigtLWFsZXRoZWlhLWFjY2VudCk7XHJcbiAgICBmbGV4LXNocmluazogMDtcclxuICAgIG1hcmdpbi10b3A6IDAuNHJlbTtcclxuICB9XHJcbiAgXHJcbiAgLm5vdGlmLXRleHQge1xyXG4gICAgZmxleDogMTtcclxuICB9XHJcbiAgXHJcbiAgQG1lZGlhIChtYXgtd2lkdGg6IDEwMjRweCkge1xyXG4gICAgLnR3by1jb2wge1xyXG4gICAgICBncmlkLXRlbXBsYXRlLWNvbHVtbnM6IDFmcjtcclxuICAgIH1cclxuICBcclxuICAgIC5zdGF0cy1yb3cge1xyXG4gICAgICBncmlkLXRlbXBsYXRlLWNvbHVtbnM6IDFmcjtcclxuICAgIH1cclxuICB9XHJcbiAgXHJcbiAgQG1lZGlhIChtYXgtd2lkdGg6IDc2OHB4KSB7XHJcbiAgICAuYWxldGhlaWEtZGFzaGJvYXJkIHtcclxuICAgICAgZmxleC1kaXJlY3Rpb246IGNvbHVtbjtcclxuICAgIH1cclxuICBcclxuICAgIC5zaWRlYmFyIHtcclxuICAgICAgd2lkdGg6IDEwMCU7XHJcbiAgICAgIGhlaWdodDogYXV0bztcclxuICAgICAgcG9zaXRpb246IHJlbGF0aXZlO1xyXG4gICAgICBwYWRkaW5nOiAxcmVtO1xyXG4gICAgICBkaXNwbGF5OiBmbGV4O1xyXG4gICAgICBhbGlnbi1pdGVtczogY2VudGVyO1xyXG4gICAgICBqdXN0aWZ5LWNvbnRlbnQ6IHNwYWNlLWJldHdlZW47XHJcbiAgICB9XHJcbiAgXHJcbiAgICAuc2lkZWJhci1icmFuZCB7XHJcbiAgICAgIHBhZGRpbmc6IDA7XHJcbiAgICAgIGJvcmRlcjogbm9uZTtcclxuICAgICAgbWFyZ2luOiAwO1xyXG4gICAgfVxyXG4gIFxyXG4gICAgLnNpZGViYXItbmF2IHtcclxuICAgICAgZmxleC1kaXJlY3Rpb246IHJvdztcclxuICAgICAgcGFkZGluZzogMDtcclxuICAgICAgZ2FwOiAwO1xyXG4gICAgICBmbGV4LXdyYXA6IHdyYXA7XHJcbiAgICB9XHJcbiAgXHJcbiAgICAubmF2LWl0ZW0gLm5hdi1sYWJlbCB7XHJcbiAgICAgIGRpc3BsYXk6IG5vbmU7XHJcbiAgICB9XHJcbiAgXHJcbiAgICAuYnJhbmQtcm9sZSB7XHJcbiAgICAgIGRpc3BsYXk6IG5vbmU7XHJcbiAgICB9XHJcbiAgXHJcbiAgICAubWFpbi1jb250ZW50IHtcclxuICAgICAgcGFkZGluZzogMXJlbTtcclxuICAgIH1cclxuICBcclxuICAgIC50YWJsZS13cmFwIHtcclxuICAgICAgb3ZlcmZsb3cteDogYXV0bztcclxuICAgIH1cclxuICBcclxuICAgIC5kYXRhLXRhYmxlIHtcclxuICAgICAgbWluLXdpZHRoOiA0MDBweDtcclxuICAgIH1cclxuICB9XHJcbiAgXHJcbiAgQG1lZGlhIChwcmVmZXJzLXJlZHVjZWQtbW90aW9uOiByZWR1Y2UpIHtcclxuICAgIC5uYXYtaXRlbSB7XHJcbiAgICAgIHRyYW5zaXRpb246IG5vbmU7XHJcbiAgICB9XHJcbiAgfVxyXG4gICJdLCJzb3VyY2VSb290IjoiIn0= */"]
    });
  }
}

/***/ }),

/***/ 5406:
/*!********************************!*\
  !*** ./src/app/filter.pipe.ts ***!
  \********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   FilterPipe: () => (/* binding */ FilterPipe)
/* harmony export */ });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ 7580);

class FilterPipe {
  transform(items, searchText) {
    if (!items) return [];
    if (!searchText) return items;
    searchText = searchText.toLowerCase();
    return items.filter(it => {
      return it.title.toLowerCase().includes(searchText) || it.type.toLowerCase().includes(searchText) || it.totalScore?.toString().includes(searchText) || it.dueDate.toString().toLowerCase().includes(searchText);
    });
  }
  static {
    this.ɵfac = function FilterPipe_Factory(t) {
      return new (t || FilterPipe)();
    };
  }
  static {
    this.ɵpipe = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdefinePipe"]({
      name: "filter",
      type: FilterPipe,
      pure: true
    });
  }
}

/***/ })

}]);
//# sourceMappingURL=src_app_back-office_back-office_module_ts.js.map
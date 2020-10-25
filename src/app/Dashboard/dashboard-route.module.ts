import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { DashboardComponent } from "./dashboard/dashboard.component";
import { DashboardHomeComponent } from "./home/dashboard-home.component";
import { EditUserComponent } from "./user/edit/edit-user.component";
import { UserListComponent } from "./user/list/user-list.component";
import { RoleListComponent } from "./role/list/role-list.component";
import { RoleEditComponent } from "./role/edit/role-edit.component";
import { AuthGuardService } from "../shared/Auth/auth-guard.service";
import { CategoryListComponent } from "./category/list/category-list.component";
import { CategoryEditComponent } from "./category/edit/category-edit.component";
import { CanActiveRoleService } from "../shared/Guard/canActive-role.service";
import { UnitListComponent } from "./unit/list/unit-list.component";
import { UnitEditComponent } from "./unit/edit/unit-edit.component";
import { AttributeEditComponent } from "./attribute/edit/attribute-edit.component";
import { AttributeListComponent } from "./attribute/list/attribute-list.component";
import { ItemListComponent } from "./item/list/item-list.component";
import { ItemEditComponent } from "./item/edit/item-edit.component";
import { UserResolverService } from "./user/user-resolver.service";
import { RoleListResolver } from "./role/role-list-resolver.service";
import { UnitListResolverService } from "./unit/unit-list-resolver.service";
import { ItemResolverService } from "./item/item-resolver.service";
import { ChatComponent } from "./chat/chat.component";
import { CategoryEditService } from "./category/category-edit.service";
import { UnitEditService } from "./unit/unit-edit.service";
import { TituteListComponent } from "./titute/list/titute-list.component";
import { TituteEditComponent } from "./titute/edit/titute-edit.component";
import { TituteEditResolverService } from "./titute/titute-edit-resolver.service";
import { YeareducationListComponent } from "./yeareducation/list/yeareducation-list.component";
import { YeareducationEditComponent } from "./yeareducation/edit/yeareducation-edit.component";
import { YeareducationEditResolverService } from "./yeareducation/yeareducation-edit-resolver.service";
import { GradeEditComponent } from "./grade/edit/grade-edit.component";
import { GradeListComponent } from "./grade/list/grade-list.component";
import { GradeEditResolverService } from "./grade/grade-edit-resolver.service";
import { ClassListComponent } from "./class/list/class-list.component";
import { ClassEditComponent } from "./class/edit/class-edit.component";
import { ClassEditResolverService } from "./class/class-edit-resolver.service";
import { OrgChartListComponent } from "./orgchart/list/orgchart-list.component";
import { OrgChartEditComponent } from "./orgchart/edit/orgchart-edit.component";
import { OrgChartEditResolveService } from "./orgchart/orgchart-edit-resolve.service";
import { InsuranceListComponent } from "./insurance/list/insurance-list.component";
import { InsuranceEditComponent } from "./insurance/edit/insurance-edit.component";
import { InsuranceEditResolverService } from "./insurance/insurance-edit-resolver.service";
import { EducationListComponent } from "./education/list/education-list.component";
import { EducationEditComponent } from "./education/edit/education-edit.component";
import { EducationEditResolverService } from "./education/education-edit-resolver.service";
import { SalaryListComponent } from "./salary/list/salary-list.component";
import { SalaryEditComponent } from "./salary/edit/salary-edit.component";
import { SalaryEditResolverService } from "./salary/salary-edit-resolver.service";
import { OrgPersonListComponent } from "./orgperson/list/orgperson-list.component";
import { OrgPersonEditComponent } from "./orgperson/edit/orgperson-edit.component";
import { OrgPersonEditResolverService } from "./orgperson/orgperson-edit-resolver.service";
import { TimeAndDaysListComponent } from "./timeanddays/list/timeanddays-list.component";
import { TimeAndDaysEditComponent } from "./timeanddays/edit/timeanddays-edit.component";
import { TimeAndDaysEditResolverService } from "./timeanddays/timeanddays-edit-resolver.service";
import { TimeScheduleListComponent } from "./timeschedule/list/timeschedule-list.component";
import { TimeScheduleEditComponent } from "./timeschedule/edit/timeschedule-edit.component";
import { TimeScheduleEditResolverService } from "./timeschedule/timeschedule-edit-resolver.service";
import { TeacherListComponent } from "./teacher/list/teacher-list.component";
import { TeacherEditComponent } from "./teacher/edit/teacher-edit.component";
import { TeacherEditResolverService } from "./teacher/teacher-edit-resolver.service";
import { CourseListComponent } from "./course/list/course-list.component";
import { CourseEditComponent } from "./course/edit/course-edit.component";
import { CourseEditResolverService } from "./course/course-edit-resolver.service";
import { StudentListComponent } from "./student/list/student-list.component";
import { StudentEditComponent } from "./student/edit/student-edit.component";
import { StudentEditResolverService } from "./student/student-edit-resolver.service";
import { ExamTypeListComponent } from "./Exam/examtype/list/examtype-list.component";
import { ExamTypeEditComponent } from "./Exam/examtype/edit/examtype-edit.component";
import { ExamTypeEditResolverService } from "./Exam/examtype/examtype-edit-resolver.service";
import { ExamListComponent } from "./Exam/exam/list/exam-list.component";
import { ExamEditComponent } from "./Exam/exam/edit/exam-edit.component";
import { ExamEditResolverService } from "./Exam/exam/exam-edit-resolver.service";
import { ExamScoreListComponent } from "./Exam/examscore/list/examscore-list.component";
import { ExamScoreEditComponent } from "./Exam/examscore/edit/examscore-edit.component";
import { ExamScoreEditResolverService } from "./Exam/examscore/examscore-edit-resolver.service";
import { QuestionListComponent } from "./Question/question/list/question-list.component";
import { QuestionEditComponent } from "./Question/question/edit/question-edit.component";
import { QuestionEditResolveService } from "./Question/question/question-edit-resolve.service";
import { QuestionOptionListComponent } from "./Question/questionoption/list/questionoption-list.component";
import { QuestionOptionEditComponent } from "./Question/questionoption/edit/questionoption-edit.component";
import { QuestionOptionEditResolveService } from "./Question/questionoption/questionoption-edit-resolve.service";
import { ContractListComponent } from "./Financial/contract/contract-list/contract-list.component";
import { ContractEditComponent } from "./Financial/contract/contract-edit/contract-edit.component";
import { ContractTypeEditResolverService } from "./Financial/contract-type/contract-type-edit-resolver.service";
import { ContractTypeListComponent } from "./Financial/contract-type/contract-type-list/contract-type-list.component";
import { ContractTypeEditComponent } from "./Financial/contract-type/contract-type-edit/contract-type-edit.component";
import { PaymentTypeListComponent } from "./Financial/payment-type/payment-type-list/payment-type-list.component";
import { PaymentTypeEditComponent } from "./Financial/payment-type/payment-type-edit/payment-type-edit.component";
import { StdPaymentListComponent } from "./Financial/std-payment/std-payment-list/std-payment-list.component";
import { StdPaymentEditComponent } from "./Financial/std-payment/std-payment-edit/std-payment-edit.component";
import { ContractEditResolverService } from "./Financial/contract/contract-edit-resolver-service.service";
import { PaymentTypeResolverService } from "./Financial/payment-type/payment-type-resolver.service";
import { StdPaymentEditResolverService } from "./Financial/std-payment/std-payment-edit-resolver.service";
import { PostListComponent } from "./WebSiteManagment/post/post-list/post-list.component";
import { PostEditComponent } from "./WebSiteManagment/post/post-edit/post-edit.component";
import { PostEditResolverService } from "./WebSiteManagment/post/post-edit-resolver.service";
import { MainSlideShowListComponent } from "./WebSiteManagment/main-slide-show/main-slide-show-list/main-slide-show-list.component";
import { MainSlideShowEditResolverService } from "./WebSiteManagment/main-slide-show/main-slide-show-edit-resolver.service";
import { MainSlideShowEditComponent } from "./WebSiteManagment/main-slide-show/main-slide-show-edit/main-slide-show-edit.component";
import { ScheduleListComponent } from "./WebSiteManagment/schedule/schedule-list/schedule-list.component";
import { ScheduleEditComponent } from "./WebSiteManagment/schedule/schedule-edit/schedule-edit.component";
import { ScheduleEditResolverService } from "./WebSiteManagment/schedule/schedule-edit-resolver.service";
import { AdvertisingListComponent } from "./WebSiteManagment/advertising/advertising-list/advertising-list.component";
import { AdvertisingEditComponent } from "./WebSiteManagment/advertising/advertising-edit/advertising-edit.component";
import { AdvertisingEditResolverService } from "./WebSiteManagment/advertising/advertising-edit-resolver.service";
import { CommentListComponent } from "./WebSiteManagment/comment/comment-list/comment-list.component";
import { StudentStudyRecordComponent } from "./student/student-study-record/student-study-record.component";
import { StudentWorkbookComponent } from "./student/student-workbook/student-workbook.component";
import { ExamAnalizeComponent } from "./chart-report/exam-analize/exam-analize.component";
import { PrintDataComponent } from "../shared/components/print-data/print-data.component";
import { StudentTypeListComponent } from "./student/StudentType/student-type-list/student-type-list.component";
import { StudentTypeEditComponent } from "./student/StudentType/student-type-edit/student-type-edit.component";
import { StudentTypeEditResolveService } from "./student/StudentType/student-type-edit-resolve.service";
import { TicketConversationsComponent } from "./ticket/ticket-conversations/ticket-conversations.component";
import { ViewTicketConversationComponent } from "./ticket/view-ticket-conversation/view-ticket-conversation.component";
import { NotificationListComponent } from "./notification/notification-list/notification-list.component";
import { NotificationEditComponent } from "./notification/notification-edit/notification-edit.component";
import { NotificationEditResolveService } from "./notification/notification-edit-resolve.service";
import { PictureListComponent } from "./WebSiteManagment/gallery/picture/picture-list/picture-list.component";
import { PictureEditComponent } from "./WebSiteManagment/gallery/picture/picture-edit/picture-edit.component";
import { PictureEditResolverService } from "./WebSiteManagment/gallery/picture/picture-edit-resolver.service";
import { PictureGalleryListComponent } from "./WebSiteManagment/gallery/picture-gallery/picture-gallery-list/picture-gallery-list.component";
import { PictureGalleryEditComponent } from "./WebSiteManagment/gallery/picture-gallery/picture-gallery-edit/picture-gallery-edit.component";
import { PictureGalleryEditResolveService } from "./WebSiteManagment/gallery/picture-gallery/picture-gallery-edit-resolve.service";
import { ClassBookListComponent } from "./student/class-book/class-book-list/class-book-list.component";
import { ClassBookEditComponent } from "./student/class-book/class-book-edit/class-book-edit.component";
import { ClassBookEditResolveService } from "./student/class-book/class-book-edit-resolve.service";
import { BestStudentListComponent } from "./WebSiteManagment/best-student/best-student-list/best-student-list.component";
import { BestStudentEditComponent } from "./WebSiteManagment/best-student/best-student-edit/best-student-edit.component";
import { BestStudentResolveService } from "./WebSiteManagment/best-student/best-student-resolve.service";
import { WriterListComponent } from "./Products/Writer/writer-list/writer-list.component";
import { WriterEditComponent } from "./Products/Writer/writer-edit/writer-edit.component";
import { WriterEditResolverService } from "./Products/Writer/writer-edit-resolver.service";
import { ProductCategoryListComponent } from "./Products/ProductCategory/product-category-list/product-category-list.component";
import { ProductCategoryEditComponent } from "./Products/ProductCategory/product-category-edit/product-category-edit.component";
import { ProductCategoryEditResolverService } from "./Products/ProductCategory/product-category-edit-resolver.service";
import { ProductListComponent } from "./Products/Product/product-list/product-list.component";
import { ProductEditComponent } from "./Products/Product/product-edit/product-edit.component";
import { ProductEditResolverService } from "./Products/Product/product-edit-resolver.service";
import { LinkListComponent } from "./Products/Link/link-list/link-list.component";
import { LinkEditComponent } from "./Products/Link/link-edit/link-edit.component";
import { LinkEditResolverService } from "./Products/Link/link-edit-resolver.service";
import { ScoreThemplateListComponent } from "./student/Score/ScoreThemplate/score-themplate-list/score-themplate-list.component";
import { ScoreThemplateEditComponent } from "./student/Score/ScoreThemplate/score-themplate-edit/score-themplate-edit.component";
import { ScoreThemplateEditResolveService } from "./student/Score/ScoreThemplate/score-themplate-edit-resolve.service";
import { StudentScoreListComponent } from "./student/Score/StudentScore/student-score-list/student-score-list.component";
import { StudentScoreEditComponent } from "./student/Score/StudentScore/student-score-edit/student-score-edit.component";
import { StudentScoreEditResolveService } from "./student/Score/StudentScore/student-score-edit-resolve.service";
import { AddPictureGroupComponent } from "./WebSiteManagment/gallery/picture/picture-edit/add-picture-group/add-picture-group.component";
import { LogListComponent } from "./Log/log-list/log-list.component";
import { ExamAnalizeStdtypeComponent } from "./chart-report/exam-analize-stdtype/exam-analize-stdtype.component";
import { LoadIdataResolverService } from "../shared/Auth/load-idata-resolver.service";
import { WorkbookListComponent } from "./workbook/workbook-list/workbook-list.component";
import { WorkbookEditComponent } from "./workbook/workbook-edit/workbook-edit.component";
import { WorkbookEditResolverService } from "./workbook/workbook-edit-resolver.service";
import { WorkbookReportByClassComponent } from "./chart-report/workbook-report-by-class/workbook-report-by-class.component";
import { WorkbookComparisonComponent } from "./chart-report/workbook-comparison/workbook-comparison.component";
import { CommentTotalType } from "./WebSiteManagment/comment/product-comment";
import { OnlineClassListComponent } from "./OnlineClass/online-class-list/online-class-list.component";
import { OnlineClassResolverService } from "./OnlineClass/online-class-resolver.service";
import { OnlineClassEditComponent } from "./OnlineClass/online-class-edit/online-class-edit.component";
import { ListStudentDailyScheduleComponent } from "./student/student-daily-schedule/list-student-daily-schedule/list-student-daily-schedule.component";
import { StudentDailyScheduleDetailComponent } from "./student/student-daily-schedule/list-student-daily-schedule/student-daily-schedule-detail/student-daily-schedule-detail.component";
import { EditStudentDailyScheduleComponent } from "./student/student-daily-schedule/edit-student-daily-schedule/edit-student-daily-schedule.component";

@NgModule({
    imports: [
        RouterModule.forChild([
            {
                path: "print",
                component: PrintDataComponent
            },
            {
                path: "dashboard",
                component: DashboardComponent,
                canActivate: [AuthGuardService],
                canActivateChild: [AuthGuardService, CanActiveRoleService],
                children: [
                    {
                        path: "",
                        pathMatch: "full",
                        component: DashboardHomeComponent,
                        data: {
                            role: ""
                        }
                    },
                    {
                        path: "user",
                        children: [
                            {
                                path: "",
                                component: UserListComponent,
                                pathMatch: "full",
                                data: {
                                    role: ["view_User"]
                                }
                            },
                            {
                                path: "edit/:id",
                                component: EditUserComponent,
                                data: {
                                    role: ["add_User", "edit_User"]
                                },
                                resolve: {
                                    user: UserResolverService,
                                    role: RoleListResolver
                                }
                            }
                        ]
                    },
                    {
                        path: "role",
                        children: [
                            {
                                path: "",
                                component: RoleListComponent,
                                pathMatch: "full",
                                // resolve: { roles: RoleResolver }
                                data: {
                                    role: ["view_Role"]
                                }
                            },
                            {
                                path: "edit/:id",
                                component: RoleEditComponent,
                                data: {
                                    role: ["add_Role", "edit_Role"]
                                }
                            }
                        ]
                    },
                    {
                        path: "category",
                        children: [
                            {
                                path: "",
                                component: CategoryListComponent,
                                pathMatch: "full",
                                data: {
                                    role: ["view_Category"],
                                    Type: 0
                                }
                            },
                            {
                                path: "edit/:id",
                                component: CategoryEditComponent,
                                data: {
                                    role: ["add_Category", "edit_Category"],
                                    Type: 0
                                },
                                resolve: { cat: CategoryEditService }
                            }
                        ]
                    },
                    {
                        path: "online-exam",
                        children: [
                            {
                                path: "",
                                component: CategoryListComponent,
                                pathMatch: "full",
                                data: {
                                    role: ["view_OnlineExam"],
                                    Type: 1
                                }
                            },
                            {
                                path: "edit/:id",
                                component: CategoryEditComponent,
                                data: {
                                    role: ["add_OnlineExam", "edit_OnlineExam"],
                                    Type: 1
                                },
                                resolve: { cat: CategoryEditService }
                            },
                            {
                                path: "option",
                                children: [
                                    {
                                        path: "",
                                        component: AttributeListComponent,
                                        pathMatch: "full",
                                        data: {
                                            role: ["view_OnlineExamOption"],
                                            Type: 1
                                        }
                                    },
                                    {
                                        path: "edit/:id",
                                        component: AttributeEditComponent,
                                        data: {
                                            role: ["add_OnlineExamOption", "edit_OnlineExamOption"],
                                            Type: 1
                                        },
                                        resolve: { unit: UnitListResolverService }
                                    }
                                ]
                            },
                            {
                                path: "result",
                                children: [
                                    {
                                        path: "",
                                        component: ItemListComponent,
                                        pathMatch: "full",
                                        data: {
                                            role: ["view_OnlineExamResult"],
                                            Type: 1
                                        }
                                    },
                                    {
                                        path: "edit/:id",
                                        component: ItemEditComponent,
                                        data: {
                                            role: ["add_OnlineExamResult", "edit_OnlineExamResult"],
                                            Type: 1
                                        },
                                        resolve: {
                                            item: ItemResolverService
                                        }
                                    }
                                ]
                            },
                        ]
                    },
                    {
                        path: "unit",
                        children: [
                            {
                                path: "",
                                component: UnitListComponent,
                                pathMatch: "full",
                                data: {
                                    role: ["view_Unit"]
                                }
                            },
                            {
                                path: "edit/:id",
                                component: UnitEditComponent,
                                data: {
                                    role: ["add_Unit", "edit_Unit"]
                                },
                                resolve: { unit: UnitEditService }
                            }
                        ]
                    },
                    {
                        path: "attribute",
                        children: [
                            {
                                path: "",
                                component: AttributeListComponent,
                                pathMatch: "full",
                                data: {
                                    role: ["view_Attribute"],
                                    Type: 0
                                }
                            },
                            {
                                path: "edit/:id",
                                component: AttributeEditComponent,
                                data: {
                                    role: ["add_Attribute", "edit_Attribute"],
                                    Type: 0
                                },
                                resolve: { unit: UnitListResolverService }
                            }
                        ]
                    },
                    {
                        path: "attribute-template",
                        children: [
                            {
                                path: "",
                                component: AttributeListComponent,
                                pathMatch: "full",
                                data: {
                                    role: ["view_Attribute"],
                                    Type: 2
                                }
                            },
                            {
                                path: "edit/:id",
                                component: AttributeEditComponent,
                                data: {
                                    role: ["add_Attribute", "edit_Attribute"],
                                    Type: 2
                                },
                                resolve: { unit: UnitListResolverService }
                            }
                        ]
                    },
                    {
                        path: "item",
                        children: [
                            {
                                path: "",
                                component: ItemListComponent,
                                pathMatch: "full",
                                data: {
                                    role: ["view_Item"],
                                    Type: 0
                                }
                            },
                            {
                                path: "edit/:id",
                                component: ItemEditComponent,
                                data: {
                                    role: ["add_Item", "edit_Item"],
                                    Type: 0
                                },
                                resolve: {
                                    item: ItemResolverService
                                }
                            }
                        ]
                    },
                    {
                        path: "chat",
                        component: ChatComponent
                    },
                    {
                        path: "titute",
                        children: [
                            {
                                path: "",
                                component: TituteListComponent,
                                pathMatch: "full",
                                data: {
                                    role: ["view_InsTitute"]
                                }
                            },
                            {
                                path: "edit/:id",
                                component: TituteEditComponent,
                                data: {
                                    role: ["add_InsTitute", "edit_InsTitute"]
                                },
                                resolve: {
                                    titute: TituteEditResolverService
                                }
                            }
                        ]
                    },
                    {
                        path: "yeareducation",
                        children: [
                            {
                                path: "",
                                component: YeareducationListComponent,
                                pathMatch: "full",
                                data: {
                                    role: ["view_Yeareducation"]
                                }
                            },
                            {
                                path: "edit/:id",
                                component: YeareducationEditComponent,
                                data: {
                                    role: [
                                        "add_Yeareducation",
                                        "edit_Yeareducation"
                                    ]
                                },
                                resolve: {
                                    yeareducation: YeareducationEditResolverService
                                }
                            }
                        ]
                    },
                    {
                        path: "grade",
                        children: [
                            {
                                path: "",
                                component: GradeListComponent,
                                pathMatch: "full",
                                data: {
                                    role: ["view_Grade"]
                                }
                            },
                            {
                                path: "edit/:id",
                                component: GradeEditComponent,
                                data: {
                                    role: ["add_Grade", "edit_Grade"]
                                },
                                resolve: {
                                    grade: GradeEditResolverService
                                }
                            }
                        ]
                    },
                    {
                        path: "class",
                        children: [
                            {
                                path: "",
                                component: ClassListComponent,
                                pathMatch: "full",
                                data: {
                                    role: ["view_Class"]
                                }
                            },
                            {
                                path: "edit/:id",
                                component: ClassEditComponent,
                                data: {
                                    role: ["add_Class", "edit_Class"]
                                },
                                resolve: {
                                    class: ClassEditResolverService
                                }
                            }
                        ]
                    },
                    {
                        path: "orgchart",
                        children: [
                            {
                                path: "",
                                component: OrgChartListComponent,
                                pathMatch: "full",
                                data: {
                                    role: ["view_OrgChart"]
                                }
                            },
                            {
                                path: "edit/:id",
                                component: OrgChartEditComponent,
                                data: {
                                    role: ["add_OrgChart", "edit_OrgChart"]
                                },
                                resolve: {
                                    orgchart: OrgChartEditResolveService
                                }
                            }
                        ]
                    },
                    {
                        path: "insurance",
                        children: [
                            {
                                path: "",
                                component: InsuranceListComponent,
                                pathMatch: "full",
                                data: {
                                    role: ["view_Insurance"]
                                }
                            },
                            {
                                path: "edit/:id",
                                component: InsuranceEditComponent,
                                data: {
                                    role: ["add_Insurance", "edit_Insurance"]
                                },
                                resolve: {
                                    insurance: InsuranceEditResolverService
                                }
                            }
                        ]
                    },
                    {
                        path: "education",
                        children: [
                            {
                                path: "",
                                component: EducationListComponent,
                                pathMatch: "full",
                                data: {
                                    role: ["view_Education"]
                                }
                            },
                            {
                                path: "edit/:id",
                                component: EducationEditComponent,
                                data: {
                                    role: ["add_Education", "edit_Education"]
                                },
                                resolve: {
                                    education: EducationEditResolverService
                                }
                            }
                        ]
                    },
                    {
                        path: "salary",
                        children: [
                            {
                                path: "",
                                component: SalaryListComponent,
                                pathMatch: "full",
                                data: {
                                    role: ["view_Salary"]
                                }
                            },
                            {
                                path: "edit/:id",
                                component: SalaryEditComponent,
                                data: {
                                    role: ["add_Salary", "edit_Salary"]
                                },
                                resolve: {
                                    salary: SalaryEditResolverService
                                }
                            }
                        ]
                    },
                    {
                        path: "orgperson",
                        children: [
                            {
                                path: "",
                                component: OrgPersonListComponent,
                                pathMatch: "full",
                                data: {
                                    role: ["view_OrgPerson"]
                                }
                            },
                            {
                                path: "edit/:id",
                                component: OrgPersonEditComponent,
                                data: {
                                    role: ["add_OrgPerson", "edit_OrgPerson"]
                                },
                                resolve: {
                                    orgperson: OrgPersonEditResolverService
                                }
                            }
                        ]
                    },
                    {
                        path: "dayofweek",
                        children: [
                            {
                                path: "",
                                component: TimeAndDaysListComponent,
                                pathMatch: "full",
                                data: {
                                    role: ["view_TimeandDays"]
                                }
                            },
                            {
                                path: "edit/:id",
                                component: TimeAndDaysEditComponent,
                                data: {
                                    role: [
                                        "add_TimeandDays",
                                        "edit_TimeandDays"
                                    ]
                                },
                                resolve: {
                                    timeanddays: TimeAndDaysEditResolverService
                                }
                            }
                        ]
                    },
                    {
                        path: "timesch",
                        children: [
                            {
                                path: "",
                                component: TimeScheduleListComponent,
                                pathMatch: "full",
                                data: {
                                    role: ["view_TimeSchedule"]
                                }
                            },
                            {
                                path: "edit/:id",
                                component: TimeScheduleEditComponent,
                                data: {
                                    role: [
                                        "add_TimeSchedule",
                                        "edit_TimeSchedule"
                                    ]
                                },
                                resolve: {
                                    timeschedule: TimeScheduleEditResolverService
                                }
                            }
                        ]
                    },
                    {
                        path: "teacher",
                        children: [
                            {
                                path: "",
                                component: TeacherListComponent,
                                pathMatch: "full",
                                data: {
                                    role: ["view_Teacher"]
                                }
                            },
                            {
                                path: "edit/:id",
                                component: TeacherEditComponent,
                                data: {
                                    role: [
                                        "add_Teacher",
                                        "edit_Teacher"
                                    ]
                                },
                                resolve: {
                                    teacher: TeacherEditResolverService
                                }
                            }
                        ]
                    },
                    {
                        path: "course",
                        children: [
                            {
                                path: "",
                                component: CourseListComponent,
                                pathMatch: "full",
                                data: {
                                    role: ["view_Course"]
                                }
                            },
                            {
                                path: "edit/:id",
                                component: CourseEditComponent,
                                data: {
                                    role: [
                                        "add_Course",
                                        "edit_Course"
                                    ]
                                },
                                resolve: {
                                    course: CourseEditResolverService
                                }
                            }
                        ]
                    },
                    {
                        path: "student",
                        children: [
                            {
                                path: "",
                                component: StudentListComponent,
                                pathMatch: "full",
                                data: {
                                    role: ["view_Student"]
                                }
                            },
                            {
                                path: "edit/:id",
                                component: StudentEditComponent,
                                data: {
                                    role: [
                                        "add_Student",
                                        "edit_Student"
                                    ]
                                },
                                resolve: {
                                    std: StudentEditResolverService
                                }
                            },
                            {
                                path: "study-record",
                                component: StudentStudyRecordComponent,
                                data: {
                                    role: ["view_StudentStudyRecord"]
                                }
                            },
                            {
                                path: "workbook",
                                component: StudentWorkbookComponent,
                                data: {
                                    role: ["view_StudentWorkbook"]
                                }
                            },
                            {
                                path: "student-type",
                                children: [
                                    {
                                        path: "",
                                        pathMatch: "full",
                                        component: StudentTypeListComponent,
                                        data: {
                                            role: ["view_StudentType"]
                                        }
                                    },
                                    {
                                        path: "edit/:id",
                                        component: StudentTypeEditComponent,
                                        data: {
                                            role: [
                                                "add_StudentType",
                                                "edit_StudentType"
                                            ]
                                        },
                                        resolve: {
                                            studentType: StudentTypeEditResolveService
                                        }
                                    }
                                ]
                            },
                            {
                                path: "daily-schedule",
                                children: [
                                    {
                                        path: "",
                                        pathMatch: "full",
                                        component: ListStudentDailyScheduleComponent,
                                        data: {
                                            role: ["view_StudentDailySchedule"]
                                        }
                                    },
                                    {
                                        path: "view/:id",
                                        component: StudentDailyScheduleDetailComponent
                                    },
                                    {
                                        path: "edit/:id",
                                        component: EditStudentDailyScheduleComponent,
                                        data: {
                                            role: [
                                                "view_StudentDailySchedule",
                                                "view_StudentDailySchedule"
                                            ]
                                        }
                                    }
                                ]
                            },
                            {
                                path: "class-book",
                                children: [
                                    {
                                        path: "",
                                        pathMatch: "full",
                                        component: ClassBookListComponent,
                                        data: {
                                            role: ["view_ClassBook"]
                                        }
                                    },
                                    {
                                        path: "edit/:id",
                                        component: ClassBookEditComponent,
                                        data: {
                                            role: [
                                                "add_ClassBook",
                                                "edit_ClassBook"
                                            ]
                                        },
                                        resolve: {
                                            classBook: ClassBookEditResolveService
                                        }
                                    }
                                ]
                            },
                            {
                                path: "score-themplate",
                                children: [
                                    {
                                        path: "",
                                        pathMatch: "full",
                                        component: ScoreThemplateListComponent,
                                        data: {
                                            role: ["view_ScoreThemplate"]
                                        }
                                    },
                                    {
                                        path: "edit/:id",
                                        component: ScoreThemplateEditComponent,
                                        data: {
                                            role: [
                                                "add_ScoreThemplate",
                                                "edit_ScoreThemplate"
                                            ]
                                        },
                                        resolve: {
                                            scoreThemplate: ScoreThemplateEditResolveService
                                        }
                                    }
                                ]
                            },
                            {
                                path: "student-score",
                                children: [
                                    {
                                        path: "",
                                        pathMatch: "full",
                                        component: StudentScoreListComponent,
                                        data: {
                                            role: ["view_StudentScore"]
                                        }
                                    },
                                    {
                                        path: "edit/:id",
                                        component: StudentScoreEditComponent,
                                        data: {
                                            role: [
                                                "add_StudentScore",
                                                "edit_StudentScore"
                                            ]
                                        },
                                        resolve: {
                                            studentScore: StudentScoreEditResolveService
                                        }
                                    }
                                ]
                            },

                        ]
                    },
                    {
                        path: "examtype",
                        children: [
                            {
                                path: "",
                                component: ExamTypeListComponent,
                                pathMatch: "full",
                                data: {
                                    role: ["view_ExamType"]
                                }
                            },
                            {
                                path: "edit/:id",
                                component: ExamTypeEditComponent,
                                data: {
                                    role: [
                                        "add_ExamType",
                                        "edit_ExamType"
                                    ]
                                },
                                resolve: {
                                    examtype: ExamTypeEditResolverService
                                }
                            }
                        ]
                    },
                    {
                        path: "exam",
                        children: [
                            {
                                path: "",
                                component: ExamListComponent,
                                pathMatch: "full",
                                data: {
                                    role: ["view_Exam"]
                                }
                            },
                            {
                                path: "edit/:id",
                                component: ExamEditComponent,
                                data: {
                                    role: [
                                        "add_Exam",
                                        "edit_Exam"
                                    ]
                                },
                                resolve: {
                                    exam: ExamEditResolverService
                                }
                            }
                        ]
                    },
                    {
                        path: "examscore",
                        children: [
                            {
                                path: "",
                                component: ExamScoreListComponent,
                                pathMatch: "full",
                                data: {
                                    role: ["view_ExamScore"]
                                }
                            },
                            {
                                path: "edit/:id",
                                component: ExamScoreEditComponent,
                                data: {
                                    role: [
                                        "add_ExamScore",
                                        "edit_ExamScore"
                                    ]
                                },
                                resolve: {
                                    examscore: ExamScoreEditResolverService
                                }
                            }
                        ]
                    },
                    {
                        path: "question",
                        children: [
                            {
                                path: "",
                                component: QuestionListComponent,
                                pathMatch: "full",
                                data: {
                                    role: ["view_Question"]
                                }
                            },
                            {
                                path: "edit/:id",
                                component: QuestionEditComponent,
                                data: {
                                    role: [
                                        "add_Question",
                                        "edit_Question"
                                    ]
                                },
                                resolve: {
                                    question: QuestionEditResolveService
                                }
                            }
                        ]
                    },
                    {
                        path: "questionoption",
                        children: [
                            {
                                path: "",
                                component: QuestionOptionListComponent,
                                pathMatch: "full",
                                data: {
                                    role: ["view_QuestionOption"]
                                }
                            },
                            {
                                path: "edit/:id",
                                component: QuestionOptionEditComponent,
                                data: {
                                    role: [
                                        "add_QuestionOption",
                                        "edit_QuestionOption"
                                    ]
                                },
                                resolve: {
                                    questionoption: QuestionOptionEditResolveService
                                }
                            }
                        ]
                    },
                    {
                        path: "contracttype",
                        children: [
                            {
                                path: "",
                                component: ContractTypeListComponent,
                                pathMatch: "full",
                                data: {
                                    role: ["view_ContractType"]
                                }
                            },
                            {
                                path: "edit/:id",
                                component: ContractTypeEditComponent,
                                data: {
                                    role: [
                                        "add_ContractType",
                                        "edit_ContractType"
                                    ]
                                },
                                resolve: {
                                    contracttype: ContractTypeEditResolverService
                                }
                            }
                        ]
                    },
                    {
                        path: "contract",
                        children: [
                            {
                                path: "",
                                component: ContractListComponent,
                                pathMatch: "full",
                                data: {
                                    role: ["view_Contract"]
                                }
                            },
                            {
                                path: "edit/:id",
                                component: ContractEditComponent,
                                data: {
                                    role: [
                                        "add_Contract",
                                        "edit_Contract"
                                    ]
                                },
                                resolve: {
                                    contract: ContractEditResolverService
                                }
                            }
                        ]
                    },
                    {
                        path: "paymenttype",
                        children: [
                            {
                                path: "",
                                component: PaymentTypeListComponent,
                                pathMatch: "full",
                                data: {
                                    role: ["view_PaymentType"]
                                }
                            },
                            {
                                path: "edit/:id",
                                component: PaymentTypeEditComponent,
                                data: {
                                    role: [
                                        "add_PaymentType",
                                        "edit_PaymentType"
                                    ]
                                },
                                resolve: {
                                    paymenttype: PaymentTypeResolverService
                                }
                            }
                        ]
                    },
                    {
                        path: "stdpayment",
                        children: [
                            {
                                path: "",
                                component: StdPaymentListComponent,
                                pathMatch: "full",
                                data: {
                                    role: ["view_StdPayment"]
                                }
                            },
                            {
                                path: "edit/:id",
                                component: StdPaymentEditComponent,
                                data: {
                                    role: [
                                        "add_StdPayment",
                                        "edit_StdPayment"
                                    ]
                                },
                                resolve: {
                                    stdpayment: StdPaymentEditResolverService
                                }
                            }
                        ]
                    },
                    {
                        path: "post",
                        children: [
                            {
                                path: "",
                                component: PostListComponent,
                                pathMatch: "full",
                                data: {
                                    role: ["view_Post"]
                                }
                            },
                            {
                                path: "edit/:id",
                                component: PostEditComponent,
                                data: {
                                    role: [
                                        "add_Post",
                                        "edit_Post"
                                    ]
                                },
                                resolve: {
                                    post: PostEditResolverService
                                }
                            }
                        ]
                    },
                    {
                        path: "mainslideshow",
                        children: [
                            {
                                path: "",
                                component: MainSlideShowListComponent,
                                pathMatch: "full",
                                data: {
                                    role: ["view_MainSlideShow"]
                                }
                            },
                            {
                                path: "edit/:id",
                                component: MainSlideShowEditComponent,
                                data: {
                                    role: [
                                        "add_MainSlideShow",
                                        "edit_MainSlideShow"
                                    ]
                                },
                                resolve: {
                                    mainslideshow: MainSlideShowEditResolverService
                                }
                            }
                        ]
                    },
                    {
                        path: "schedule",
                        children: [
                            {
                                path: "",
                                component: ScheduleListComponent,
                                pathMatch: "full",
                                data: {
                                    role: ["view_Schedule"]
                                }
                            },
                            {
                                path: "edit/:id",
                                component: ScheduleEditComponent,
                                data: {
                                    role: [
                                        "add_Schedule",
                                        "edit_Schedule"
                                    ]
                                },
                                resolve: {
                                    schedule: ScheduleEditResolverService
                                }
                            }
                        ]
                    },
                    {
                        path: "advertising",
                        children: [
                            {
                                path: "",
                                component: AdvertisingListComponent,
                                pathMatch: "full",
                                data: {
                                    role: ["view_Advertising"]
                                }
                            },
                            {
                                path: "edit/:id",
                                component: AdvertisingEditComponent,
                                data: {
                                    role: [
                                        "add_Advertising",
                                        "edit_Advertising"
                                    ]
                                },
                                resolve: {
                                    advertising: AdvertisingEditResolverService
                                }
                            }
                        ]
                    },
                    {
                        path: "comment",
                        children: [
                            {
                                path: "",
                                component: CommentListComponent,
                                pathMatch: "full",
                                data: {
                                    role: ["view_Comment"],
                                    type: CommentTotalType.post
                                }
                            }
                        ]
                    },
                    {
                        path: "chart-report",
                        children: [
                            {
                                path: "exam-analize",
                                component: ExamAnalizeComponent,
                                data: {
                                    role: ["view_ExamAnalize"]
                                }
                            },
                            {
                                path: "exam-analize-stdtype",
                                component: ExamAnalizeStdtypeComponent,
                                data: {
                                    role: ["view_ExamAnalize"]
                                }
                            },
                            {
                                path: "workbook",
                                children: [
                                    {
                                        path: "by-class",
                                        component: WorkbookReportByClassComponent,
                                        data: {
                                            role: ["view_StudentWorkbook"]
                                        }
                                    },
                                    {
                                        path: "comparison",
                                        component: WorkbookComparisonComponent,
                                        data: {
                                            role: ["view_StudentWorkbook"]
                                        }
                                    }
                                ]
                            }
                        ]
                    },
                    {
                        path: "ticket",
                        children: [
                            {
                                path: "conversations",
                                children: [
                                    {
                                        path: "",
                                        pathMatch: "full",
                                        component: TicketConversationsComponent
                                    },
                                    {
                                        path: "view/:id",
                                        component: ViewTicketConversationComponent
                                    }
                                ]
                            }
                        ]
                    },
                    {
                        path: "notification",
                        children: [
                            {
                                path: "",
                                pathMatch: "full",
                                component: NotificationListComponent,
                                data: {
                                    role: ["view_Notification"]
                                }
                            },
                            {
                                path: "edit/:id",
                                component: NotificationEditComponent,
                                data: {
                                    role: [
                                        "add_Notification",
                                        "edit_Notification"
                                    ]
                                },
                                resolve: {
                                    notification: NotificationEditResolveService
                                }
                            }
                        ]
                    },
                    {
                        path: "picture",
                        children: [
                            {
                                path: "",
                                pathMatch: "full",
                                component: PictureListComponent,
                                data: {
                                    role: ["view_Picture"]
                                }
                            },
                            {
                                path: "edit/:id",
                                component: PictureEditComponent,
                                data: {
                                    role: [
                                        "add_Picture",
                                        "edit_Picture"
                                    ]
                                },
                                resolve: {
                                    picture: PictureEditResolverService
                                }
                            },
                            {
                                path: "edit/group/0",
                                component: AddPictureGroupComponent,
                                data: {
                                    role: [
                                        "add_Picture"
                                    ]
                                }
                            }
                        ]
                    },
                    {
                        path: "picture-gallery",
                        children: [
                            {
                                path: "",
                                pathMatch: "full",
                                component: PictureGalleryListComponent,
                                data: {
                                    role: ["view_PictureGallery"]
                                }
                            },
                            {
                                path: "edit/:id",
                                component: PictureGalleryEditComponent,
                                data: {
                                    role: [
                                        "add_PictureGallery",
                                        "edit_PictureGallery"
                                    ]
                                },
                                resolve: {
                                    pictureGallery: PictureGalleryEditResolveService
                                }
                            }
                        ]
                    },
                    {
                        path: "best-student",
                        children: [
                            {
                                path: "",
                                pathMatch: "full",
                                component: BestStudentListComponent,
                                data: {
                                    role: ["view_BestStudent"]
                                }
                            },
                            {
                                path: "edit/:id",
                                component: BestStudentEditComponent,
                                data: {
                                    role: [
                                        "add_BestStudent",
                                        "edit_BestStudent"
                                    ]
                                },
                                resolve: {
                                    bestStudent: BestStudentResolveService
                                }
                            }
                        ]
                    },
                    {
                        path: "writer",
                        children: [
                            {
                                path: "",
                                pathMatch: "full",
                                component: WriterListComponent,
                                data: {
                                    role: ["view_Writer"]
                                }
                            },
                            {
                                path: "edit/:id",
                                component: WriterEditComponent,
                                data: {
                                    role: [
                                        "add_Writer",
                                        "edit_Writer"
                                    ]
                                },
                                resolve: {
                                    writer: WriterEditResolverService
                                }
                            }
                        ]
                    },
                    {
                        path: "product-category",
                        children: [
                            {
                                path: "",
                                pathMatch: "full",
                                component: ProductCategoryListComponent,
                                data: {
                                    role: ["view_ProductCategory"]
                                }
                            },
                            {
                                path: "edit/:id",
                                component: ProductCategoryEditComponent,
                                data: {
                                    role: [
                                        "add_ProductCategory",
                                        "edit_ProductCategory"
                                    ]
                                },
                                resolve: {
                                    productCategory: ProductCategoryEditResolverService
                                }
                            }
                        ]
                    },
                    {
                        path: "product",
                        children: [
                            {
                                path: "",
                                pathMatch: "full",
                                component: ProductListComponent,
                                data: {
                                    role: ["view_Product"],
                                    type: 0
                                }
                            },
                            {
                                path: "edit/:id",
                                component: ProductEditComponent,
                                data: {
                                    role: [
                                        "add_Product",
                                        "edit_Product"
                                    ],
                                    type: 0
                                },
                                resolve: {
                                    product: ProductEditResolverService
                                }
                            }
                        ]
                    },
                    {
                        path: "virtual-teaching",
                        children: [
                            {
                                path: "offline",
                                children: [
                                    {
                                        path: "",
                                        pathMatch: "full",
                                        component: ProductListComponent,
                                        data: {
                                            role: ["view_VirtualTeaching"],
                                            type: 1
                                        }
                                    },
                                    {
                                        path: "edit/:id",
                                        component: ProductEditComponent,
                                        data: {
                                            role: [
                                                "add_VirtualTeaching",
                                                "edit_VirtualTeaching"
                                            ],
                                            type: 1
                                        },
                                        resolve: {
                                            product: ProductEditResolverService
                                        }
                                    },
                                    {
                                        path: "link",
                                        children: [
                                            {
                                                path: "",
                                                pathMatch: "full",
                                                component: LinkListComponent,
                                                data: {
                                                    role: ["view_Link"],
                                                    type: 1
                                                }
                                            },
                                            {
                                                path: "edit/:id",
                                                component: LinkEditComponent,
                                                data: {
                                                    role: [
                                                        "add_Link",
                                                        "edit_Link"
                                                    ],
                                                    type: 1
                                                },
                                                resolve: {
                                                    link: LinkEditResolverService
                                                }
                                            }
                                        ]
                                    }
                                ]
                            },
                            {
                                path: "comments",
                                component: CommentListComponent,
                                data: {
                                    type: CommentTotalType.virtualTeaching
                                }
                            }
                        ]
                    },
                    {
                        path: "link",
                        children: [
                            {
                                path: "",
                                pathMatch: "full",
                                component: LinkListComponent,
                                data: {
                                    role: ["view_Link"],
                                    type: 0
                                }
                            },
                            {
                                path: "edit/:id",
                                component: LinkEditComponent,
                                data: {
                                    role: [
                                        "add_Link",
                                        "edit_Link"
                                    ],
                                    type: 0
                                },
                                resolve: {
                                    link: LinkEditResolverService
                                }
                            }
                        ]
                    },
                    {
                        path: "Log",
                        children: [
                            {
                                path: "",
                                pathMatch: "full",
                                component: LogListComponent,
                                data: {
                                    role: ["view_Log"]
                                }
                            }
                        ]
                    },
                    {
                        path: "workbook",
                        children: [
                            {
                                path: "",
                                pathMatch: "full",
                                component: WorkbookListComponent,
                                data: {
                                    role: ["view_Workbook"]
                                }
                            },
                            {
                                path: "edit/:id",
                                component: WorkbookEditComponent,
                                data: {
                                    role: [
                                        "add_Workbook",
                                        "edit_Workbook"
                                    ]
                                },
                                resolve: {
                                    workbook: WorkbookEditResolverService
                                }
                            }
                        ]
                    },
                    {
                        path: "online-class",
                        children: [
                            {
                                path: "",
                                pathMatch: "full",
                                component: OnlineClassListComponent,
                                data: {
                                    role: ["view_OnlineClass"]
                                }
                            },
                            {
                                path: "edit/:id",
                                component: OnlineClassEditComponent,
                                data: {
                                    role: [
                                        "add_OnlineClass",
                                        "edit_OnlineClass"
                                    ]
                                },
                                resolve: {
                                    onlineClass: OnlineClassResolverService
                                }
                            }
                        ]
                    }

                ],
                resolve: {
                    idata: LoadIdataResolverService
                }
            }
        ])
    ],
    exports: [RouterModule]
})
export class DashboardRouteModule { }

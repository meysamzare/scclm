import { NgModule } from "@angular/core";
import { FooterComponent } from "./footer/footer.component";
import { DashboardRouteModule } from "./dashboard-route.module";
import { DashboardComponent } from "./dashboard/dashboard.component";
import { NavbarComponent } from "./navbar/navbar.component";
import { AlertComponent } from "./navbar/alert/alert.component";
import { SidebarComponent } from "./sidebar/sidebar.component";
import { DashboardHomeComponent } from "./home/dashboard-home.component";
import { SharedModule } from "../shared/shared.module";
import { MaterialModule } from "../shared/material.module";
import { EditUserComponent } from "./user/edit/edit-user.component";
import {
    UserListComponent,
    BottomSheetChangeState
} from "./user/list/user-list.component";
import { RoleEditComponent } from "./role/edit/role-edit.component";
import { RoleListComponent } from "./role/list/role-list.component";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { CommonModule } from "@angular/common";
import { RoleListResolver } from "./role/role-list-resolver.service";
import { SweetAlert2Module } from "@sweetalert2/ngx-sweetalert2";
import { NgProgressModule } from "@ngx-progressbar/core";
import { NgProgressHttpModule } from "@ngx-progressbar/http";
import { NgProgressRouterModule } from "@ngx-progressbar/router";
import { AuthGuardService } from "../shared/Auth/auth-guard.service";
import { AuthService } from "../shared/Auth/auth.service";
import { MatBottomSheetModule } from "@angular/material";
import { CategoryListComponent } from "./category/list/category-list.component";
import { CategoryEditComponent } from "./category/edit/category-edit.component";
import { CanActiveRoleService } from "../shared/Guard/canActive-role.service";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { UnitEditComponent } from "./unit/edit/unit-edit.component";
import { UnitListComponent } from "./unit/list/unit-list.component";
import { AttributeEditComponent } from "./attribute/edit/attribute-edit.component";
import { AttributeListComponent } from "./attribute/list/attribute-list.component";
import { ItemEditComponent } from "./item/edit/item-edit.component";
import { ItemListComponent } from "./item/list/item-list.component";
import { UserResolverService } from "./user/user-resolver.service";
import { UnitListResolverService } from "./unit/unit-list-resolver.service";
import { ItemAttrResolverService } from "./item/itemattr-resolver.service";
import { ItemResolverService } from "./item/item-resolver.service";
import { SignalRService } from "../shared/services/signalr.service";
import { ChatComponent } from "./chat/chat.component";
import { PickerModule } from "@ctrl/ngx-emoji-mart";
import { EmojiModule } from "@ctrl/ngx-emoji-mart/ngx-emoji";
import { NgxMaterialTimepickerModule } from "ngx-material-timepicker";
import { CategoryEditService } from "./category/category-edit.service";
import { UnitEditService } from "./unit/unit-edit.service";
import { TituteEditComponent } from "./titute/edit/titute-edit.component";
import { TituteListComponent } from "./titute/list/titute-list.component";
import { TituteEditResolverService } from "./titute/titute-edit-resolver.service";
import { YeareducationEditComponent } from "./yeareducation/edit/yeareducation-edit.component";
import { YeareducationListComponent } from "./yeareducation/list/yeareducation-list.component";
import { YeareducationEditResolverService } from "./yeareducation/yeareducation-edit-resolver.service";
import { GradeEditComponent } from "./grade/edit/grade-edit.component";
import { GradeListComponent } from "./grade/list/grade-list.component";
import { GradeEditResolverService } from "./grade/grade-edit-resolver.service";
import { ClassEditComponent } from "./class/edit/class-edit.component";
import { ClassListComponent } from "./class/list/class-list.component";
import { ClassEditResolverService } from "./class/class-edit-resolver.service";
import { OrgChartEditComponent } from "./orgchart/edit/orgchart-edit.component";
import { OrgChartListComponent } from "./orgchart/list/orgchart-list.component";
import { OrgChartEditResolveService } from "./orgchart/orgchart-edit-resolve.service";
import { InsuranceEditComponent } from "./insurance/edit/insurance-edit.component";
import { InsuranceListComponent } from "./insurance/list/insurance-list.component";
import { InsuranceEditResolverService } from "./insurance/insurance-edit-resolver.service";
import { EducationEditResolverService } from "./education/education-edit-resolver.service";
import { EducationEditComponent } from "./education/edit/education-edit.component";
import { EducationListComponent } from "./education/list/education-list.component";
import { SalaryEditResolverService } from "./salary/salary-edit-resolver.service";
import { SalaryEditComponent } from "./salary/edit/salary-edit.component";
import { SalaryListComponent } from "./salary/list/salary-list.component";
import { OrgPersonEditResolverService } from "./orgperson/orgperson-edit-resolver.service";
import { OrgPersonEditComponent } from "./orgperson/edit/orgperson-edit.component";
import { OrgPersonListComponent } from "./orgperson/list/orgperson-list.component";
import { TimeAndDaysEditComponent } from "./timeanddays/edit/timeanddays-edit.component";
import { TimeAndDaysListComponent } from "./timeanddays/list/timeanddays-list.component";
import { TimeAndDaysEditResolverService } from "./timeanddays/timeanddays-edit-resolver.service";
import { TimeScheduleEditComponent } from "./timeschedule/edit/timeschedule-edit.component";
import { TimeScheduleListComponent } from "./timeschedule/list/timeschedule-list.component";
import { TimeScheduleEditResolverService } from "./timeschedule/timeschedule-edit-resolver.service";
import { TeacherEditComponent } from "./teacher/edit/teacher-edit.component";
import { TeacherListComponent } from "./teacher/list/teacher-list.component";
import { TeacherEditResolverService } from "./teacher/teacher-edit-resolver.service";
import { CourseEditComponent } from "./course/edit/course-edit.component";
import { CourseListComponent } from "./course/list/course-list.component";
import { CourseEditResolverService } from "./course/course-edit-resolver.service";
import { StudentEditComponent } from "./student/edit/student-edit.component";
import { StudentListComponent } from "./student/list/student-list.component";
import { StudentEditResolverService } from "./student/student-edit-resolver.service";
import { ExamTypeEditComponent } from "./Exam/examtype/edit/examtype-edit.component";
import { ExamTypeListComponent } from "./Exam/examtype/list/examtype-list.component";
import { ExamTypeEditResolverService } from "./Exam/examtype/examtype-edit-resolver.service";
import { ExamEditResolverService } from "./Exam/exam/exam-edit-resolver.service";
import { ExamEditComponent } from "./Exam/exam/edit/exam-edit.component";
import { ExamListComponent } from "./Exam/exam/list/exam-list.component";
import { ExamScoreEditComponent } from "./Exam/examscore/edit/examscore-edit.component";
import { ExamScoreListComponent } from "./Exam/examscore/list/examscore-list.component";
import { ExamScoreEditResolverService } from "./Exam/examscore/examscore-edit-resolver.service";
import { QuestionEditComponent } from "./Question/question/edit/question-edit.component";
import { QuestionListComponent } from "./Question/question/list/question-list.component";
import { QuestionEditResolveService } from "./Question/question/question-edit-resolve.service";
import { QuestionOptionEditComponent } from "./Question/questionoption/edit/questionoption-edit.component";
import { QuestionOptionListComponent } from "./Question/questionoption/list/questionoption-list.component";
import { QuestionOptionEditResolveService } from "./Question/questionoption/questionoption-edit-resolve.service";
import { ItemListActiveDialogComponent } from "./item/list/item-list-active-dialog.component";
import { ItemListChangeAttrGroupComponent } from "./item/list/item-list-changeattr-group.component";
import { ItemEditLongTextSelectComponent } from "./item/edit/item-edit-long-text-select.component";
import { ItemListExcelAttrSelectComponent } from "./item/list/item-list-excel-attr-select.component";
import { RegisterStudentModalComponent } from "./student/modals/register-student/register-student.component";
import { RegistredListStudentModalComponent } from "./student/modals/registred-list/registred-list.component";
import { ScoreSelectGroupModalComponent } from "./Exam/examscore/modals/score-select-group/score-select-group.component";
import { SetScoreGroupModalComponent } from "./Exam/examscore/modals/set-score-group/set-score-group.component";
import { FastEditStudentModalComponent } from "./student/modals/fast-edit/fast-edit.component";
import { BootstrapModule } from "../shared/bootstrap/bootstrap.module";
import { StdChangeStateSheetComponent } from "./student/list/change-state-sheet/change-state-sheet.component";
import { ContractEditComponent } from './Financial/contract/contract-edit/contract-edit.component';
import { ContractListComponent } from '../Dashboard/Financial/contract/contract-list/contract-list.component';
import { ContractTypeListComponent } from '../Dashboard/Financial/contract-type/contract-type-list/contract-type-list.component';
import { ContractTypeEditComponent } from '../Dashboard/Financial/contract-type/contract-type-edit/contract-type-edit.component';
import { PaymentTypeListComponent } from '../Dashboard/Financial/payment-type/payment-type-list/payment-type-list.component';
import { PaymentTypeEditComponent } from '../Dashboard/Financial/payment-type/payment-type-edit/payment-type-edit.component';
import { StdPaymentEditComponent } from '../Dashboard/Financial/std-payment/std-payment-edit/std-payment-edit.component';
import { StdPaymentListComponent } from '../Dashboard/Financial/std-payment/std-payment-list/std-payment-list.component';
import { ContractTypeEditResolverService } from "./Financial/contract-type/contract-type-edit-resolver.service";
import { NgSelectModule } from '@ng-select/ng-select';

import { NgxDropzoneModule } from 'ngx-dropzone';
import { PostEditComponent } from '../Dashboard/WebSiteManagment/post/post-edit/post-edit.component';
import { PostListComponent } from '../Dashboard/WebSiteManagment/post/post-list/post-list.component';
import { MainSlideShowEditComponent } from '../Dashboard/WebSiteManagment/main-slide-show/main-slide-show-edit/main-slide-show-edit.component';
import { MainSlideShowListComponent } from '../Dashboard/WebSiteManagment/main-slide-show/main-slide-show-list/main-slide-show-list.component';
import { ScheduleEditComponent } from '../Dashboard/WebSiteManagment/schedule/schedule-edit/schedule-edit.component';
import { ScheduleListComponent } from '../Dashboard/WebSiteManagment/schedule/schedule-list/schedule-list.component';
import { AdvertisingEditComponent } from '../Dashboard/WebSiteManagment/advertising/advertising-edit/advertising-edit.component';
import { AdvertisingListComponent } from '../Dashboard/WebSiteManagment/advertising/advertising-list/advertising-list.component';
import { CommentListComponent } from '../Dashboard/WebSiteManagment/comment/comment-list/comment-list.component';
import { CommentLocationComponent } from '../Dashboard/WebSiteManagment/comment/comment-list/comment-location/comment-location.component';
import { PostCommentComponent } from "projects/index/src/app/index/post/post-comment/post-comment.component";
import { StudentStudyRecordComponent } from '../Dashboard/student/student-study-record/student-study-record.component';
import { StudentWorkbookComponent } from '../Dashboard/student/student-workbook/student-workbook.component';

import { ChartsModule } from 'ng2-charts';
import { ExamAnalizeComponent } from '../Dashboard/chart-report/exam-analize/exam-analize.component';
import { PrintDataComponent } from '../shared/components/print-data/print-data.component';
import { StudentTypeEditComponent } from '../Dashboard/student/StudentType/student-type-edit/student-type-edit.component';
import { StudentTypeListComponent } from '../Dashboard/student/StudentType/student-type-list/student-type-list.component';
import { ChangeStdPasswordComponent } from '../Dashboard/student/modals/change-std-password/change-std-password.component';
import { TicketConversationsComponent } from '../Dashboard/ticket/ticket-conversations/ticket-conversations.component';
import { ViewTicketConversationComponent } from '../Dashboard/ticket/view-ticket-conversation/view-ticket-conversation.component';
import { SelectReciverUserModalComponent } from '../Dashboard/ticket/view-ticket-conversation/modal/select-reciver-user-modal/select-reciver-user-modal.component';
import { NotificationEditComponent } from '../Dashboard/notification/notification-edit/notification-edit.component';
import { NotificationListComponent } from '../Dashboard/notification/notification-list/notification-list.component';
import { SendNotificationModalComponent } from '../Dashboard/notification/notification-list/send-notification-modal/send-notification-modal.component';
import { PictureGalleryEditComponent } from '../Dashboard/WebSiteManagment/gallery/picture-gallery/picture-gallery-edit/picture-gallery-edit.component';
import { PictureGalleryListComponent } from '../Dashboard/WebSiteManagment/gallery/picture-gallery/picture-gallery-list/picture-gallery-list.component';
import { PictureEditComponent } from '../Dashboard/WebSiteManagment/gallery/picture/picture-edit/picture-edit.component';
import { PictureListComponent } from '../Dashboard/WebSiteManagment/gallery/picture/picture-list/picture-list.component';
import { TeacherChangePasswordModalComponent } from '../Dashboard/teacher/list/teacher-change-password-modal/teacher-change-password-modal.component';
import { ClassBookListComponent } from '../Dashboard/student/class-book/class-book-list/class-book-list.component';
import { ClassBookEditComponent } from '../Dashboard/student/class-book/class-book-edit/class-book-edit.component';
import { BestStudentListComponent } from '../Dashboard/WebSiteManagment/best-student/best-student-list/best-student-list.component';
import { BestStudentEditComponent } from '../Dashboard/WebSiteManagment/best-student/best-student-edit/best-student-edit.component';
import { ActiveYeareducationDirective } from '../shared/Directive/active-yeareducation.directive';
import { CopyClipboardDirective } from '../shared/Directive/copy-clipboard.directive';
import { WriterEditComponent } from '../Dashboard/Products/Writer/writer-edit/writer-edit.component';
import { WriterListComponent } from '../Dashboard/Products/Writer/writer-list/writer-list.component';
import { ProductCategoryEditComponent } from '../Dashboard/Products/ProductCategory/product-category-edit/product-category-edit.component';
import { ProductCategoryListComponent } from '../Dashboard/Products/ProductCategory/product-category-list/product-category-list.component';
import { ProductEditComponent } from '../Dashboard/Products/Product/product-edit/product-edit.component';
import { ProductListComponent } from '../Dashboard/Products/Product/product-list/product-list.component';
import { LinkEditComponent } from '../Dashboard/Products/Link/link-edit/link-edit.component';
import { LinkListComponent } from '../Dashboard/Products/Link/link-list/link-list.component';
import { ScoreThemplateEditComponent } from '../Dashboard/student/Score/ScoreThemplate/score-themplate-edit/score-themplate-edit.component';
import { ScoreThemplateListComponent } from '../Dashboard/student/Score/ScoreThemplate/score-themplate-list/score-themplate-list.component';
import { StudentScoreEditComponent } from '../Dashboard/student/Score/StudentScore/student-score-edit/student-score-edit.component';
import { StudentScoreListComponent } from '../Dashboard/student/Score/StudentScore/student-score-list/student-score-list.component';
import { DataListComponent } from '../shared/components/Data/data-list/data-list.component';
import { DataListItemDirective, DataListActionButton } from '../shared/components/Data/data-list/data-list-item.directive';
import { AddPictureGroupComponent } from '../Dashboard/WebSiteManagment/gallery/picture/picture-edit/add-picture-group/add-picture-group.component';
import { LogListComponent } from '../Dashboard/Log/log-list/log-list.component';
import { ViewLogDescComponent } from '../Dashboard/Log/view-log-desc/view-log-desc.component';
import { NotificationSeenModalComponent } from '../Dashboard/notification/notification-list/notification-seen-modal/notification-seen-modal.component';
import { ExamDetailsComponent } from '../Dashboard/home/exam-details/exam-details.component';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
import { ExamAnalizeStdtypeComponent } from '../Dashboard/chart-report/exam-analize-stdtype/exam-analize-stdtype.component';
import { WorkbookEditComponent } from '../Dashboard/workbook/workbook-edit/workbook-edit.component';
import { WorkbookListComponent } from '../Dashboard/workbook/workbook-list/workbook-list.component';
import { WorkbookReportByClassComponent } from '../Dashboard/chart-report/workbook-report-by-class/workbook-report-by-class.component';
import { WorkbookComparisonComponent } from '../Dashboard/chart-report/workbook-comparison/workbook-comparison.component';

@NgModule({
    imports: [
        DashboardRouteModule,
        MaterialModule,
        BootstrapModule,
        SharedModule,
        FormsModule,
        CommonModule,
        SweetAlert2Module.forRoot(),
        NgProgressModule,
        NgProgressHttpModule,
        NgProgressRouterModule,
        ReactiveFormsModule,
        MatBottomSheetModule,
        BrowserAnimationsModule,
        PickerModule,
        EmojiModule,
        NgxMaterialTimepickerModule,
		NgSelectModule,
        NgxDropzoneModule,
        ChartsModule,
        CKEditorModule
    ],
    declarations: [
        DashboardComponent,
        FooterComponent,
        NavbarComponent,
        AlertComponent,
        SidebarComponent,
        DashboardHomeComponent,
        EditUserComponent,
        UserListComponent,
        RoleEditComponent,
        RoleListComponent,
        BottomSheetChangeState,
        CategoryListComponent,
        CategoryEditComponent,
        UnitEditComponent,
        UnitListComponent,
        AttributeEditComponent,
        AttributeListComponent,
        ItemEditComponent,
        ItemListComponent,
        ChatComponent,
        TituteEditComponent,
        TituteListComponent,
        YeareducationEditComponent,
        YeareducationListComponent,
        GradeEditComponent,
        GradeListComponent,
        ClassEditComponent,
        ClassListComponent,
        OrgChartEditComponent,
        OrgChartListComponent,
        InsuranceEditComponent,
        InsuranceListComponent,
        EducationEditComponent,
        EducationListComponent,
        SalaryEditComponent,
        SalaryListComponent,
        OrgPersonEditComponent,
        OrgPersonListComponent,
        TimeAndDaysEditComponent,
        TimeAndDaysListComponent,
        TimeScheduleEditComponent,
        TimeScheduleListComponent,
        TeacherEditComponent,
        TeacherListComponent,
        CourseEditComponent,
        CourseListComponent,
        StudentEditComponent,
        StudentListComponent,
        ExamTypeEditComponent,
        ExamTypeListComponent,
        ExamEditComponent,
        ExamListComponent,
        ExamScoreEditComponent,
        ExamScoreListComponent,
        QuestionEditComponent,
        QuestionListComponent,
        QuestionOptionEditComponent,
        QuestionOptionListComponent,
        ItemListActiveDialogComponent,
        ItemListChangeAttrGroupComponent,
        ItemEditLongTextSelectComponent,
        ItemListExcelAttrSelectComponent,
        RegisterStudentModalComponent,
        RegistredListStudentModalComponent,
        ScoreSelectGroupModalComponent,
        SetScoreGroupModalComponent,
        FastEditStudentModalComponent,
        StdChangeStateSheetComponent,
        ContractEditComponent,
        ContractListComponent,
        ContractTypeListComponent,
        ContractTypeEditComponent,
        PaymentTypeListComponent,
        PaymentTypeEditComponent,
        StdPaymentEditComponent,
        StdPaymentListComponent,
        PostEditComponent,
        PostListComponent,
        MainSlideShowEditComponent,
        MainSlideShowListComponent,
        ScheduleEditComponent,
        ScheduleListComponent,
        AdvertisingEditComponent,
        AdvertisingListComponent,
        CommentListComponent,
        CommentLocationComponent,
        PostCommentComponent,
        StudentStudyRecordComponent,
        StudentWorkbookComponent,
        ExamAnalizeComponent,
        PrintDataComponent,
        StudentTypeEditComponent,
        StudentTypeListComponent,
        ChangeStdPasswordComponent,
        TicketConversationsComponent,
        ViewTicketConversationComponent,
        SelectReciverUserModalComponent,
        NotificationEditComponent,
        NotificationListComponent,
        SendNotificationModalComponent,
        PictureGalleryEditComponent,
        PictureGalleryListComponent,
        PictureEditComponent,
        PictureListComponent,
        TeacherChangePasswordModalComponent,
        ClassBookListComponent,
        ClassBookEditComponent,
        BestStudentListComponent,
        BestStudentEditComponent,
        ActiveYeareducationDirective,
        CopyClipboardDirective,
        WriterEditComponent,
        WriterListComponent,
        ProductCategoryEditComponent,
        ProductCategoryListComponent,
        ProductEditComponent,
        ProductListComponent,
        LinkEditComponent,
        LinkListComponent,
        ScoreThemplateEditComponent,
        ScoreThemplateListComponent,
        StudentScoreEditComponent,
        StudentScoreListComponent,
        DataListComponent,
        DataListItemDirective,
        DataListActionButton,
        AddPictureGroupComponent,
        LogListComponent,
        ViewLogDescComponent,
        NotificationSeenModalComponent,
        ExamDetailsComponent,
        ExamAnalizeStdtypeComponent,
        WorkbookEditComponent,
        WorkbookListComponent,
        WorkbookReportByClassComponent,
        WorkbookComparisonComponent
    ],
    providers: [
        AuthGuardService,
        AuthService,
        CanActiveRoleService,
        UserResolverService,
        RoleListResolver,
        UnitListResolverService,
        ItemAttrResolverService,
        ItemResolverService,
        SignalRService,
        CategoryEditService,
        UnitEditService,
        TituteEditResolverService,
        YeareducationEditResolverService,
        GradeEditResolverService,
        ClassEditResolverService,
        OrgChartEditResolveService,
        InsuranceEditResolverService,
        EducationEditResolverService,
        SalaryEditResolverService,
        OrgPersonEditResolverService,
        TimeAndDaysEditResolverService,
        TimeScheduleEditResolverService,
        TeacherEditResolverService,
        CourseEditResolverService,
        StudentEditResolverService,
        ExamTypeEditResolverService,
        ExamEditResolverService,
        ExamScoreEditResolverService,
        QuestionEditResolveService,
		QuestionOptionEditResolveService,
        ContractTypeEditResolverService
    ],
    entryComponents: [
        BottomSheetChangeState,
        ItemListActiveDialogComponent,
        ItemListChangeAttrGroupComponent,
        ItemEditLongTextSelectComponent,
        ItemListExcelAttrSelectComponent,
        RegisterStudentModalComponent,
        RegistredListStudentModalComponent,
        ScoreSelectGroupModalComponent,
        SetScoreGroupModalComponent,
        FastEditStudentModalComponent,
        StdChangeStateSheetComponent,
        CommentLocationComponent,
        ChangeStdPasswordComponent,
        SelectReciverUserModalComponent,
        SendNotificationModalComponent,
        TeacherChangePasswordModalComponent,
        ViewLogDescComponent,
        NotificationSeenModalComponent,
        ExamDetailsComponent
    ]
})
export class DashboardModule {}

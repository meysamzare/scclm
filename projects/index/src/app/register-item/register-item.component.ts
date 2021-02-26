import { Component, OnInit, AfterViewInit, OnDestroy, ViewChild, ViewChildren, QueryList, ContentChildren } from '@angular/core';
import { IAttr } from 'src/app/Dashboard/attribute/attribute';
import { IItemAttr } from 'src/app/Dashboard/item/item-attr';
import { ICategory, CategoryAuthorizeState, CategoryRegisterItemStepType } from 'src/app/Dashboard/category/category';
import { FormGroup, NgForm, FormControl, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService, jsondata } from 'src/app/shared/Auth/auth.service';
import { MessageService } from 'src/app/shared/services/message.service';
import { DomSanitizer } from '@angular/platform-browser';
import Swal from "sweetalert2";
import { IUnit } from 'src/app/Dashboard/unit/unit';
import { RegisterItemLoginService } from './login-for-register-item/register-item-login.service';
import { RegisterItemLicenseService } from './license-for-register-item/register-item-license.service';
import { HttpRequest, HttpHeaders, HttpEventType, HttpClient } from '@angular/common/http';
import { map } from 'rxjs/internal/operators/map';
import { last, catchError, debounceTime, finalize, take } from 'rxjs/operators';
import { of } from 'rxjs/internal/observable/of';
import { EMPTY } from 'rxjs/internal/observable/empty';
import { StepsDirective } from './register-step.directive';
import { CountdownFormatFn } from 'ngx-countdown';
import { RegisterItemDataService } from './register-item-data.service';
import { interval } from 'rxjs/internal/observable/interval';
import { AttributeInputSaveItemAttributeEvent } from './attribute-input/attribute-input/attribute-input.component';
import { Subject } from 'rxjs/internal/Subject';
import { EncryptService } from 'src/app/shared/services/encrypt.service';
import { validatePhoneNumber } from './attribute-input/phone-number-validator.directive';
import { validateMeliCode } from './attribute-input/code-meli-validator.directive';

@Component({
    selector: 'app-register-item',
    templateUrl: './register-item.component.html',
    styleUrls: ['./register-item.component.scss']
})
export class RegisterItemCatComponent implements OnInit, AfterViewInit, OnDestroy {
    attrs: IAttr[] | any[] = [];
    itemAttrs: IItemAttr[] = [];
    catId: number = 0;
    cat: ICategory;
    group: FormGroup;
    isFromSts: boolean = false;
    units: IUnit[] = [];

    @ViewChild("fm1", { static: false }) public fm1: NgForm;

    authorizedFullName: string = "---";
    authorizedUsername: string = "---";
    authorizedType: CategoryAuthorizeState = CategoryAuthorizeState.none;

    // Index of Active Attr
    activeStep = 0;
    isPrevStepAllowed = false;

    forceExit = false;

    haveSavedData = false;

    @ViewChild(StepsDirective, { static: false }) RegisterSteps: StepsDirective;
    @ViewChildren("attrInput") attrInputs: QueryList<any>;

    isLoading = false;
    isAttrSetted = false;

    groupValueChanges$ = null;

    countDown$ = new Subject<string>();

    catDesc = null;

    constructor(
        private router: Router,
        private activeRoute: ActivatedRoute,
        public auth: AuthService,
        private message: MessageService,
        private sanitizer: DomSanitizer,
        private loginService: RegisterItemLoginService,
        private licenseService: RegisterItemLicenseService,
        private http: HttpClient,
        private registerItemDataService: RegisterItemDataService,
        private encrypt: EncryptService
    ) { }

    async refreshCat() {
        const data = await this.auth.post("/api/Category/getCategory", this.catId).toPromise();

        if (data.success) {
            this.cat = data.data;

            if (this.isPreview && !this.cat.haveInfo) {
                this.forceExitPage();
            }

            if (!this.cat.canShowByDate && !this.isUploading && !this.isPreview) {
                this.forceExitPage();
            }
        }
    }

    forceExitPage() {
        this.forceExit = true;
        this.router.navigate(["/"]);
    }

    catRefresh$ = null;

    isPreview = false;

    async ngOnInit() {
        this.catRefresh$ = interval(46 * 1000).subscribe(() => this.refreshCat());
        this.countDown$.pipe(debounceTime(700)).subscribe(event => this.countdownEvent(event));

        this.catId = this.activeRoute.snapshot.params["id"];
        this.cat = this.activeRoute.snapshot.data.cat;
        this.units = this.activeRoute.snapshot.data.units;

        if (this.cat.isBackStepAllowed || this.cat.type == 0) {
            this.isPrevStepAllowed = true;
        }

        let previewToken: string = this.activeRoute.snapshot.queryParams["token"];

        try {
            if (previewToken) {
                previewToken = previewToken.replace(/\s/g, "+");
                const previewTokenObject = this.encrypt.decryptObject(previewToken);

                if (previewTokenObject &&
                    previewTokenObject.catId == this.catId &&
                    this.cat.haveInfo
                ) {
                    this.isPreview = true;
                    this.isPrevStepAllowed = true;
                }
            }
        } catch (er) { console.error("PWTK: ", er) }

        if (!this.cat.canShowByDate && !this.isPreview) {
            const title = `مهلت ${this.getRegisterBtnTitle()} به پایان رسیده است`;
            this.message.showWarningAlert(title);
            this.router.navigate(["/"]);
        } else {

            if (this.cat.authorizeState != CategoryAuthorizeState.none && !this.isPreview) {
                if (!this.loginService.isUserAccessToCat(this.catId)) {
                    this.router.navigate([`/register-item/${this.catId}/login`], { skipLocationChange: true });
                    return;
                } else {
                    const token = this.loginService.getLoginToken(this.catId);

                    if (!token) {
                        this.router.navigate(['/']);
                        return;
                    }

                    this.authorizedFullName = token.userFullName;
                    this.authorizedUsername = token.username;
                    this.authorizedType = token.userType;
                }
            }

            if (this.cat.haveLicense && !this.isPreview) {
                if (!this.licenseService.isUserAcceptTheLicense(this.catId)) {
                    this.router.navigate([`/register-item/${this.catId}/license`], { skipLocationChange: true });
                    return;
                }
            }


            const savedData = await this.registerItemDataService.getRegisterItemData(this.cat.id, this.authorizedUsername, this.authorizedType);

            if (savedData && !this.isPreview) {
                if (savedData.itemAttrs) {
                    this.itemAttrs = savedData.itemAttrs;
                }

                if (savedData.files) {
                    this._files = savedData.files;
                }

                if (savedData.attrs && this.cat.useLimitedRandomQuestionNumber) {
                    this.attrs = savedData.attrs;
                } else {
                    await this.refreshAttrs();
                }

                this.haveSavedData = true;
            } else {
                await this.refreshAttrs();

                this.attrs.forEach(attr => {
                    let itemAttr = this.itemAttrs.find(c => c.attributeId == attr.id);
                    if (!itemAttr) {
                        this.itemAttrs.push({
                            itemId: 0,
                            attributeId: attr.id,
                            attrubuteValue: "",
                            attributeFilePath: attr.attrTypeInt == 7 || attr.attrTypeInt == 8 ? "1" : "",
                            fileName: "",
                            score: 0
                        });
                    }
                });

                this.saveItemAttrs();
            }

            if (this.attrs.length == 0) {
                this.router.navigate(["/"]);
                console.error("There is no Attr for cat!", this.catId);
                return;
            }

            this.catDesc = this.sanitizer.bypassSecurityTrustHtml(this.cat.desc);

            if (this.authorizedUsername != "---") {
                this.attrs.filter(c => c.isMeliCode && (c.attrTypeInt == 1 || c.attrTypeInt == 2)).forEach(attr => {
                    this.itemAttrs.find(c => c.attributeId == attr.id).attrubuteValue = this.authorizedUsername;
                });
            }


            this.group = this.toFormGroup(this.attrs);

            await this.totallyCheckForUniqAttrs();

            this.groupValueChanges$ = this.group.valueChanges.subscribe(() => {
                this.saveItemAttrs();
            });

            this.isAttrSetted = true;
        }
    }

    async refreshAttrs() {

        this.isLoading = true;

        let { success, data } = await this.auth.post("/api/Attribute/getAttrsForCat_C", this.catId)
            .pipe(
                take(1),
                finalize(() => this.isLoading = false)
            ).toPromise();

        if (success) {
            this.attrs = data;

            if (this.cat.randomAttribute) {
                let questionAttrs = this.attrs.filter(c => c.attrTypeInt == 11);
                let nonQuestionAttrs = this.attrs.filter(c => c.attrTypeInt != 11);

                questionAttrs = this.shuffleArray(questionAttrs);

                this.attrs = [];

                nonQuestionAttrs.forEach(attr => this.attrs.push(attr));
                questionAttrs.forEach(attr => this.attrs.push(attr));
            }
        }

        return success;
    }


    ngOnDestroy(): void {
        this.licenseService.removeLicense(this.catId);

        if (this.catRefresh$) {
            this.catRefresh$.unsubscribe();
        }

        if (this.countDown$) {
            this.countDown$.unsubscribe();
        }

        if (this.groupValueChanges$) {
            this.groupValueChanges$.unsubscribe();
        }

        if (this.isFormDirty()) {
            this.saveItemAttrs();
        }

        if (this.isFromSts) {
            this.registerItemDataService.removeRegisterItemData(this.cat.id, this.authorizedUsername, this.authorizedType);
            this.loginService.removeToken(this.catId);
        }
    }

    isAllUniqAttrsValid(): boolean {
        if (this.attrInputs) {
            return this.attrInputs.toArray().every(c => !c.IsUniqValueExist)
        }

        return false;
    }

    isAttrUniqValid(attrId: number) {
        if (this.attrInputs) {
            const attrInput = this.attrInputs.toArray().find(c => c.Attribute.id == attrId);

            if (attrInput && attrInput.canCheckForUniqAttr()) {
                return !attrInput.IsUniqValueExist;
            }

            return true;
        }

        return false;
    }

    getMaxStepNumber() {
        if (this.cat.registerItemStepType == 1) {
            return this.attrs.length;
        } else if (this.cat.registerItemStepType == 2) {
            return this.getUnitsThatHaveAttrs().length;
        }

        return 0;
    }

    isStepHasError(step: number) {
        if (this.cat.registerItemStepType == 1) {
            return this.isAttrHasError(step);
        } else if (this.cat.registerItemStepType == 2) {
            return this.isUnitHasError(step);
        }

        return false;
    }

    isUnitHasError(unitId: number) {
        if (this.RegisterSteps) {
            return !this.RegisterSteps.isStepValid(this.getIndexForUnit(unitId));
        }

        return false;
    }

    isStepFinished(step: number) {
        if (this.RegisterSteps) {
            if (this.cat.registerItemStepType == 1) {
                return this.isItemAttrHasValue(step);
            } else if (this.cat.registerItemStepType == 2) {
                const stepIndex = this.getIndexForUnit(step);
                return this.RegisterSteps.isStepCompleted(stepIndex) && this.RegisterSteps.isStepValid(stepIndex);
            }
        }

        return false;
    }



    nextStep() {
        if (this.RegisterSteps.isActiveStepValid() && !this.isUploading) {
            if (this.activeStep == this.getMaxStepNumber() - 2) {
                this.isPrevStepAllowed = true;
            }
            this.activeStep += 1;
        }
    }

    prevStep() {
        if (this.isPrevStepAllowed && this.RegisterSteps.isActiveStepValid() && !this.isUploading) {
            if (this.activeStep != 0) {
                this.activeStep -= 1;
            }
        }
    }

    lastStep() {
        if (this.RegisterSteps.isActiveStepValid()
            && !this.isUploading
            && this.isAllUniqAttrsValid()) {
            this.activeStep = this.getMaxStepNumber() - 1
        }
    }

    goToStep(step: number) {
        if (
            this.RegisterSteps.isActiveStepValid() &&
            this.isPrevStepAllowed &&
            !this.isUploading &&
            this.isAllUniqAttrsValid()
        ) {
            let stepIndex = 0;

            if (this.cat.registerItemStepType == 1) {
                stepIndex = this.getIndexForAttr(step);
            } else if (this.cat.registerItemStepType == 2) {
                stepIndex = this.getIndexForUnit(step);
            }

            this.activeStep = stepIndex;
        }
    }

    async countdownEvent(action) {
        if (action == "done" && !this.isUploading && !this.isPreview) {
            this.sts(true);
        }
    }

    isItemAttrHasValue(attrId: number) {
        const attr = this.attrs.find(c => c.id == attrId);

        const itemAttr = this.itemAttrs.find(c => c.attributeId == attr.id);

        if (itemAttr && itemAttr.attrubuteValue) {
            if (attr.complatabelContent != itemAttr.attrubuteValue) {
                return true;
            }
        }

        return false;
    }

    CountdownTimeUnits: Array<[string, number]> = [
        ['Y', 1000 * 60 * 60 * 24 * 365], // years
        ['M', 1000 * 60 * 60 * 24 * 30], // months
        ['D', 1000 * 60 * 60 * 24], // days
        ['H', 1000 * 60 * 60], // hours
        ['m', 1000 * 60], // minutes
        ['s', 1000], // seconds
        ['S', 1] // million seconds
    ];

    formatDate: CountdownFormatFn = ({ date, formatStr }) => {
        let duration = Number(date || 0);

        return this.CountdownTimeUnits.reduce((current, [name, unit]) => {
            if (current.indexOf(name) !== -1) {
                const v = Math.floor(duration / unit);
                duration -= v * unit;
                return current.replace(new RegExp(`${name}+`, 'g'), (match: string) => {
                    return v.toString().padStart(match.length, '0');
                });
            }
            return current;
        }, formatStr);
    };

    getAttrsForUnit(unitId): IAttr[] | any[] {
        return this.attrs.filter(c => c.unitId == unitId);
    }

    canShowUnit(unitId) {
        let attrs = this.getAttrsForUnit(unitId);

        if (attrs.length == 0) {
            return false;
        }

        return true;
    }

    saveItemAttrs() {
        if (!this.isPreview) {
            this.registerItemDataService.saveRegisterItemData(
                this.cat.id,
                this.itemAttrs,
                this.authorizedUsername,
                this.authorizedType,
                this.activeStep,
                null,
                this.attrs);
        }
    }


    ngAfterViewInit(): void {
        window.scroll(0, 0);

        this.attrInputs.changes.subscribe(c => c.toArray().forEach(async input => {
            await input.checkForUniqValue();
        }))
    }

    toFormGroup(attrs: IAttr[]) {
        let group: any = {};

        attrs.forEach((attr, index) => {
            group["p" + index] = new FormControl(
                {
                    value: this.getDefaultValueForAttr(attr),
                    disabled: attr.isMeliCode && (attr.attrTypeInt == 1 || attr.attrTypeInt == 2) && this.authorizedUsername != "---"
                },
                this.getValidationForAttr(attr)
            );
        });
        return new FormGroup(group);
    }

    getActiveStepNavigationTitle() {
        let stepNavigationTitle = "";
        const activeStep = this.activeStep;

        let stepNumber = "---"
        let totalStep = "";

        let stepTypeTitle = "";

        const attr: IAttr = this.attrs[activeStep];

        if (this.attrs && attr && this.cat.registerItemStepType != 0) {

            if (this.cat.registerItemStepType == 2) {
                const units = this.getUnitsThatHaveAttrs();

                stepTypeTitle = "مرحله";
                totalStep = `${units.length}`;
                stepNumber = `${units.findIndex(c => c == units[activeStep]) + 1}`;
            }

            if (this.cat.registerItemStepType == 1) {

                if (this.cat.type == 1) {
                    const questions = this.attrs.filter(c => c.attrTypeInt == 11);
                    const totalQuestionNumber = questions.length;

                    totalStep = `${totalQuestionNumber}`;
                    stepTypeTitle = "سوال";

                    if (attr.attrTypeInt == 11) {
                        const questionOrder = questions.findIndex(c => c == attr) + 1;
                        stepNumber = `${questionOrder}`;
                    }
                }

                if (this.cat.type == 0) {
                    stepTypeTitle = "فیلد";

                    totalStep = `${this.attrs.length}`;
                    stepNumber = `${activeStep + 1}`;
                }
            }


            stepNavigationTitle = `
            شما در ${stepTypeTitle}
            &nbsp;
            <b>
                ${stepNumber} از ${totalStep} 
            </b>
            &nbsp;
            هستید`;
        }


        return this.sanitizer.bypassSecurityTrustHtml(stepNavigationTitle);
    }

    getStepTooltip(index: number) {
        let tooltipTitle = "";
        const catRegisterStepType = this.cat.registerItemStepType;

        if (this.attrs) {
            if (catRegisterStepType == CategoryRegisterItemStepType.singleAttrStep) {
                const attr: IAttr = this.attrs[index];
                const attrUnitId = attr.unitId;
                const attrUnit = this.units.find(c => c.id == attrUnitId);
                const unitAttrs = this.attrs.filter(c => c.unitId == attrUnitId);
                const attrIndexInAttrUnits = unitAttrs.findIndex(c => c == attr);

                if (attr.attrTypeInt == 11) {
                    tooltipTitle = `سوال شماره ${attrIndexInAttrUnits + 1} ${attrUnit.title}`;
                } else {
                    tooltipTitle = attr.title;
                }

            }

            if (catRegisterStepType == CategoryRegisterItemStepType.unitAttrStep) {
                const units = this.getUnitsThatHaveAttrs();

                tooltipTitle = units[index].title;
            }
        }

        return tooltipTitle;
    }

    getUnitsThatHaveAttrs() {
        const attrsUnitIds = Array.from(new Set((this.attrs as IAttr[]).map(c => c.unitId)));

        return this.units.filter(c => attrsUnitIds.includes(c.id));
    }

    getIndexForUnit(unitId: number) {
        const unit = this.getUnitsThatHaveAttrs().find(c => c.id == unitId);

        return this.getUnitsThatHaveAttrs().indexOf(unit);
    }

    getDefaultValueForAttr(attr): any {

        if (attr.attrTypeInt == 7 || attr.attrTypeInt == 8) {
            return null;
        }

        let itemAttr = this.itemAttrs.find(c => c.attributeId == attr.id);

        if (itemAttr && itemAttr.attrubuteValue) {
            let value = itemAttr.attrubuteValue;
            return value;
        }


        if (attr.attrTypeInt == 11 && attr.questionType == 3) {
            return attr.complatabelContent;
        }

        return null;
    }

    getValidationForAttr(attr: IAttr): any[] {
        let validations = [];

        if (attr.isRequired) {
            validations.push(Validators.required);
        }

        if (attr.isMeliCode && (attr.attrTypeInt == 2 || attr.attrTypeInt == 1)) {
            validations.push(validateMeliCode);
        }

        if (attr.isPhoneNumber && attr.attrTypeInt == 2) {
            validations.push(validatePhoneNumber);
        }

        return validations;
    }

    clearItemAttr(attrId) {
        let controlName = `p${this.getIndexForAttr(attrId)}`;
        this.group.controls[controlName].reset();

        let itemAttr = this.itemAttrs.find(c => c.attributeId == attrId);

        if (itemAttr) {
            itemAttr.attrubuteValue = "";


            let fileObj = this._files.find(c => c.attrId == attrId);
            if (fileObj) {
                this._files.splice(this._files.indexOf(fileObj), 1);
            }
        }
    }

    getIndexForAttr(attrId) {
        return this.attrs.findIndex(c => c.id == attrId);
    }

    getRegisterBtnTitle(): string {
        let btnTitle = this.cat.btnTitle;
        if (!btnTitle || btnTitle == " ") {
            if (this.cat.type == 1) {
                return "ثبت و تحویل پاسخ برگ";
            }

            return "ثبت نام";
        }

        return btnTitle;
    }

    isFormDirty(): boolean {
        if (this.isFromSts || this.forceExit) {
            return false;
        }

        if (this.group) {
            return this.group.dirty;
        }

        return false
    }

    shuffleArray(array: any[]) {

        let shuffled = array
            .map((a) => ({ sort: Math.random(), value: a }))
            .sort((a, b) => a.sort - b.sort)
            .map((a) => a.value)

        return shuffled;
    }

    isAttrHasError(attrId: number) {
        const attrInput = this.attrInputs.toArray().find(c => c.Attribute.id == attrId);

        if (attrInput) {
            return !attrInput.isInputValid();
        }

        return false;
    }

    _files: {
        file: File,
        attrId: number
    }[] = [];

    setAnyItemAttribute(result: AttributeInputSaveItemAttributeEvent) {
        const itemAttr = this.itemAttrs.find(c => c.attributeId == result.attrId);

        if (itemAttr) {
            itemAttr.attrubuteValue = result.attrValue;
            result.File ? itemAttr.fileName = result.File.name : null;
        } else {
            this.itemAttrs.push({
                itemId: 0,
                attributeId: result.attrId,
                attrubuteValue: result.attrValue,
                attributeFilePath: result.File ? "1" : "",
                fileName: result.File ? result.File.name : "",
                score: 0
            });
        }

        if (result.File) {
            this._files.push({
                file: result.File,
                attrId: result.attrId
            });
        }
    }


    async totallyCheckForUniqAttrs() {
        if (!this.isPreview) {
            await Promise.all(this.attrInputs.map(async (attr) => {
                await attr.checkForUniqValue();
            }));
        }
    }

    isUploading = false;
    fileSize_MB = 0;
    uploaded_MB = 0;
    uploaded_PS = 0;

    async sts(isFromCountDownEvent = false, repeatTime = 0) {

        await this.totallyCheckForUniqAttrs();

        if (
            this.group.valid &&
            this.isAllUniqAttrsValid() &&
            !this.isPreview
        ) {
            let isAllowedToSendData = isFromCountDownEvent && repeatTime == 0;

            this.isUploading = true;

            if (!isFromCountDownEvent) {
                let swalData = await Swal.fire({
                    title: "آیا مایل به ثبت داده های فعلی هستید؟",
                    icon: "question",
                    text: "داده های وارد شده شما ثبت، و امکان ویرایش آن پس از ارسال و ثبت نهایی وجود ندارد",
                    confirmButtonText: "بله",
                    cancelButtonText: "خیر",
                    showCancelButton: true,
                    allowOutsideClick: false,
                    allowEnterKey: false,
                });

                isAllowedToSendData = swalData.value ? true : false;
            }


            if (isFromCountDownEvent && repeatTime != 0) {

                if (repeatTime > 20) {
                    this.message.showWarningAlert("متاسفانه در حال حاضر امکان ثبت داده های شما وجود ندارد");
                    this.router.navigateByUrl("/");
                    return;
                }

                let timerInterval;
                let result = await Swal.fire({
                    title: 'تلاش مجدد خودکار',
                    html: 'داده های شما تا <b></b> ثانیه دیگر به سرور ارسال میشود! لطفا صبور باشید و اتصال اینترنت خود را بررسی کنید.',
                    timer: repeatTime * 30 * 1000,
                    timerProgressBar: true,
                    allowEscapeKey: false,
                    allowOutsideClick: false,
                    allowEnterKey: false,
                    onBeforeOpen: () => {
                        Swal.showLoading();
                        timerInterval = setInterval(() => {
                            const content = Swal.getContent();
                            if (content) {
                                const b = content.querySelector('b');
                                if (b) {
                                    b.textContent = `${Number.parseFloat((Swal.getTimerLeft() / 1000).toString()).toFixed(0)}`;
                                }
                            }
                        }, 1000);
                    },
                    onClose: () => {
                        clearInterval(timerInterval);
                    }
                });

                if (result.dismiss === Swal.DismissReason.timer) {
                    isAllowedToSendData = true;
                }
            }


            if (isAllowedToSendData) {

                let object = {
                    itemAttrs: this.itemAttrs,
                    catId: this.catId,
                    authorizedFullName: this.authorizedFullName,
                    authorizedUsername: this.authorizedUsername,
                    authorizedType: this.authorizedType,
                };


                let formData = new FormData();


                if (this._files.length != 0) {
                    this._files.forEach(fileObj => {
                        let file = fileObj.file;
                        formData.append("files", file, file.name);
                    });
                }

                formData.append("object", JSON.stringify(object));

                let url = this.auth.serializeUrl(`/api/Item/SetItemWithAttrs`);

                let token = this.auth.getToken();

                let request = new HttpRequest('POST', url, formData, {
                    reportProgress: true,
                    headers: new HttpHeaders({
                        Authorization: `Bearer ${token}`,
                        "ngsw-bypass": "true"
                    }),
                });

                this.http.request(request).pipe(
                    map(event => {
                        switch (event.type) {
                            case HttpEventType.Sent:
                                this.isUploading = true;
                                break;
                            case HttpEventType.UploadProgress || HttpEventType.DownloadProgress:

                                const percentDone = (100 * event.loaded / event.total);

                                this.uploaded_PS = percentDone;

                                let uploadedSize = event.loaded / 1024 / 1024;
                                this.uploaded_MB = uploadedSize;

                                this.fileSize_MB = event.total / 1024 / 1024

                                break;
                            case HttpEventType.Response:
                                let data = event.body as jsondata;

                                if (!event.ok) {
                                    this.isUploading = false;
                                }

                                if (data.success) {
                                    if (!data.message) {
                                        data.message = "";
                                    }

                                    this.auth.logToServer({
                                        type: 'Add',
                                        agentId: this.auth.getUserId(),
                                        agentType: 'Other',
                                        agentName: this.auth.getUser().fullName,
                                        tableName: 'Item Register From Index',
                                        logSource: 'Index',
                                        object: object,
                                        table: "Item"
                                    }, data);

                                    const dialogTitle = "ثبت داده ها با موفقیت انجام شد";

                                    // if (isFromCountDownEvent) {
                                    //     dialogTitle = `مهلت ${this.cat.btnTitle ? this.cat.btnTitle : "ثبت نام"} به پایان رسید! و داده های شما به صورت خودکار ثبت شدند.`;
                                    // } else {
                                    //     dialogTitle = "ثبت داده ها با موفقیت انجام شد";
                                    // }

                                    Swal.fire({
                                        title: dialogTitle,
                                        icon: "success",
                                        text: data.message + " کد رهگیری شما : " + data.type,
                                        confirmButtonText: "کد رهگیری را یادداشت کردم",
                                        showCancelButton: false,
                                        allowOutsideClick: false,
                                        allowEnterKey: false,
                                    }).then(result => {
                                        if (result.value) {
                                            this.isFromSts = true;
                                            this.router.navigate(["/"]);
                                        }
                                    });
                                } else {
                                    this.message.showMessageforFalseResult(data);
                                    this.isUploading = false;
                                    // if (isFromCountDownEvent) {
                                    //     this.sts(isFromCountDownEvent, repeatTime + 1.5);
                                    // }
                                    if (data.type == "error") {
                                        this.message.showWarningAlert("خطایی روی داده است لطفا با راهبر سیستم تماس حاصل فرمایید");
                                        this.sts(true, repeatTime + 1.5);
                                    }
                                }
                                break;
                        }
                    }),
                    catchError(() => {
                        this.message.showWarningAlert("خطایی روی داده است لطفا با راهبر سیستم تماس حاصل فرمایید");
                        this.isUploading = false;
                        // if (isFromCountDownEvent) {
                        //     this.sts(isFromCountDownEvent, repeatTime + 1.5);
                        // }

                        this.sts(true, repeatTime + 1.5);
                        return of(EMPTY);
                    }),
                    last()
                ).subscribe();
            } else {
                if (isFromCountDownEvent) {
                    this.router.navigateByUrl("/");
                } else {
                    this.isUploading = false;
                }
            }
        } else {
            if (isFromCountDownEvent) {
                let title = `زمان ثبت اطلاعات به پایان رسیده است و اطلاعات شما ناقص است! در حال خروج از صفحه... `;
                this.message.showWarningAlert(title);
                this.router.navigateByUrl("/");
            } else {
                this.message.showWarningAlert("مقادیر خواسته شده را تکمیل نمایید");
            }
        }
    }
}
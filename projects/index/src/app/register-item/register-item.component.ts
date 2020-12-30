import { Component, OnInit, AfterViewInit, OnDestroy, ViewChild } from '@angular/core';
import { IAttr } from 'src/app/Dashboard/attribute/attribute';
import { IItemAttr } from 'src/app/Dashboard/item/item-attr';
import { ICategory, CategoryAuthorizeState } from 'src/app/Dashboard/category/category';
import { FormGroup, NgForm, FormControl, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from 'src/app/shared/Auth/auth.service';
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
import { IAttributeOption } from 'src/app/Dashboard/attribute/attribute-option';
import { StepsDirective } from './register-step.directive';
import { CountdownFormatFn } from 'ngx-countdown';
import { RegisterItemDataService } from './register-item-data.service';
import { interval } from 'rxjs/internal/observable/interval';
import { AttributeInputSaveItemAttributeEvent } from './attribute-input/attribute-input/attribute-input.component';
import { Subject } from 'rxjs/internal/Subject';
import { EncryptService } from 'src/app/shared/services/encrypt.service';

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
    attrUniqList: number[] = [];
    reqfilesAttrint: number[] = [];
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

    isLoading = false;
    isAttrSetted = false;

    groupValueChanges$ = null;

    countDown$ = new Subject<string>();

    constructor(
        private router: Router,
        private activeRoute: ActivatedRoute,
        public auth: AuthService,
        private message: MessageService,
        public sanitizer: DomSanitizer,
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
        this.catRefresh$ = interval(15 * 1000).subscribe(() => this.refreshCat());
        this.countDown$.pipe(debounceTime(700)).subscribe(event => this.countdownEvent(event));

        this.catId = this.activeRoute.snapshot.params["id"];
        this.cat = this.activeRoute.snapshot.data.cat;
        this.units = this.activeRoute.snapshot.data.units;

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
        } catch (er) { console.error(er) }

        if (!this.cat.canShowByDate && !this.isPreview) {
            const title = `مهلت ${this.cat.btnTitle ? this.cat.btnTitle : "ثبت نام"} به پایان رسیده است`;
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

    nextStep() {
        if (this.RegisterSteps.isActiveStepValid()
            && !this.isUploading
            && this.attrUniqList.length == 0
            && this.reqfilesAttrint.length == 0) {

            if (this.activeStep == this.attrs.length - 2) {
                this.isPrevStepAllowed = true;
            }
            this.activeStep += 1;
        }
    }

    prevStep() {
        if (this.isPrevStepAllowed && !this.isUploading) {
            if (this.activeStep != 0) {
                this.activeStep -= 1;
            }
        }
    }

    lastStep() {
        if (this.RegisterSteps.isActiveStepValid()
            && !this.isUploading
            && this.attrUniqList.length == 0
            && this.reqfilesAttrint.length == 0) {

            this.activeStep = this.attrs.length - 1
        }
    }

    goToStep(attrId) {
        if (
            this.RegisterSteps.isActiveStepValid() &&
            this.isPrevStepAllowed &&
            !this.isUploading &&
            this.attrUniqList.length == 0 &&
            this.reqfilesAttrint.length == 0
        ) {
            this.activeStep = this.getIndexForAttr(attrId);
        }
    }

    async countdownEvent(action) {
        if (action == "done" && !this.isUploading && !this.isPreview) {
            this.sts(true);
        }
    }

    isItemAttrHasValue(attr) {
        let itemAttr = this.itemAttrs.find(c => c.attributeId == attr.id);

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
                this._files,
                this.attrs);
        }
    }


    ngAfterViewInit(): void {
        window.scroll(0, 0);
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

    getDefaultValueForAttr(attr): any {

        let itemAttr = this.itemAttrs.find(c => c.attributeId == attr.id);

        if (itemAttr && itemAttr.attrubuteValue) {
            let value = itemAttr.attrubuteValue;
            if (attr.isUniq && (attr.attrTypeInt == 1 || attr.attrTypeInt == 2)) {
                this.checkForUniqValue(value, attr.id);
            }
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
            return "ثبت نام";
        }

        return btnTitle;
    }

    getAttrPlaceholder(placeholder: string, title: string): string {
        if (placeholder) {
            return placeholder;
        }

        return title;
    }

    canShowDesc(desc: string): boolean {
        if (desc) {
            return true;
        }

        return false;
    }


    isValidToShow(cat: ICategory): boolean {
        if (cat.isActive) {
            let datePub: Date = new Date(Date.parse(cat.datePublish));
            let dateEx: Date = new Date(Date.parse(cat.dateExpire));
            let nowDate: Date = new Date();

            if (nowDate > datePub && nowDate < dateEx) {
                return true;
            } else {
                return false;
            }
        } else {
            return false;
        }
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

    openc(picker1) {
        picker1.open();
    }

    setItemAttrDirectly(data, attrId) {
        let itemAttr = this.itemAttrs.find(c => c.attributeId == attrId);

        if (itemAttr) {
            itemAttr.attrubuteValue = data;
        } else {
            this.itemAttrs.push({
                itemId: 0,
                attributeId: attrId,
                attrubuteValue: data,
                attributeFilePath: "",
                fileName: "",
                score: 0
            });
        }
    }

    setItemAttr(event, attrId) {
        let inputValue;
        if (event.target) {
            inputValue = event.target.value;
        } else {
            inputValue = event.checked;
        }

        let itemAttr = this.itemAttrs.find(c => c.attributeId == attrId);

        if (itemAttr) {
            itemAttr.attrubuteValue = inputValue;
        } else {
            this.itemAttrs.push({
                itemId: 0,
                attributeId: attrId,
                attrubuteValue: inputValue,
                attributeFilePath: "",
                fileName: "",
                score: 0
            });
        }
    }

    getItemAttr(attrId): any {
        let itemAttr = this.itemAttrs.find(c => c.attributeId == attrId);

        if (itemAttr) {
            return itemAttr.attrubuteValue;
        }

        return "";
    }

    getShiftedItem(attr: IAttr) {
        let options: IAttributeOption[] = (attr as any).attributeOptions || [];

        if (this.cat.randomAttributeOption) {
            options = this.shuffleArray(options);
        }

        return options;
    }

    shuffleArray(array: any[]) {

        let shuffled = array
            .map((a) => ({ sort: Math.random(), value: a }))
            .sort((a, b) => a.sort - b.sort)
            .map((a) => a.value)


        // for (let i = array.length - 1; i > 0; i--) {
        //     const j = Math.floor(Math.random() * (i + 1));
        //     [array[i], array[j]] = [array[j], array[i]];
        // }

        return shuffled;
    }

    isAttrHasError(attrId: number, includeUniq = true): boolean {
        let input = this.group.controls['p' + this.getIndexForAttr(attrId)];
        if (input.value && (input.invalid ||
            (includeUniq ? this.attrUniqList.some(c => c == attrId) : false) ||
            this.reqfilesAttrint.some(c => c == attrId))) {
            return true
        }

        return false;
    }

    setItemAttrforselect(event, attrId) {
        let itemAttr = this.itemAttrs.find(c => c.attributeId == attrId);

        if (itemAttr) {
            itemAttr.attrubuteValue = event;
        } else {
            this.itemAttrs.push({
                itemId: 0,
                attributeId: attrId,
                attrubuteValue: event,
                attributeFilePath: "",
                fileName: "",
                score: 0
            });
        }
    }

    isLoadingForUniqAttr = false;

    async checkForUniqValue(val: any, attrId: number) {
        try {
            if (!val || this.isAttrHasError(attrId, false) || this.isPreview) {
                return;
            }

            let catId = this.catId;

            this.isLoadingForUniqAttr = true;

            let data = await this.auth.post("/api/Item/CheckForUniqAttr", {
                catId: catId,
                attrId: attrId,
                val: val
            }).pipe(finalize(() => this.isLoadingForUniqAttr = false)).toPromise();

            let un = this.attrUniqList.find(c => c == attrId);
            if (data.success) {
                if (un) {
                    un = attrId;
                } else {
                    this.attrUniqList.push(attrId);
                }
            } else {
                if (un) {
                    let indexOf = this.attrUniqList.indexOf(attrId, 0);
                    if (indexOf > -1) {
                        this.attrUniqList.splice(indexOf, 1);
                    }
                }
            }
        } catch { }
    }

    isAtrrUniqExsist(attrId = 1): boolean {
        if (this.attrUniqList.length != 0) {
            return this.attrUniqList.some(c => c == attrId);
        } else {
            return false;
        }
    }

    setAnyItemAttribute(result: AttributeInputSaveItemAttributeEvent) {
        let itemAttr = this.itemAttrs.find(c => c.attributeId == result.attrId);

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

    _files: {
        file: File,
        attrId: number
    }[] = [];

    setItemAttrforPic(event, attrId, type) {
        let requiredFileAttr = this.reqfilesAttrint.find(c => c == attrId);
        const fileIsInvalid = (message) => {
            event.target.value = null;
            event.target.files = null;
            if (requiredFileAttr) {
                requiredFileAttr = attrId;
            } else {
                let attr = this.attrs.find(c => c.id == attrId);
                if (attr.isRequired) {
                    this.reqfilesAttrint.push(attrId);
                }
            }
            return this.message.showWarningAlert(message);
        }


        let fileObj = this._files.find(c => c.attrId == attrId);
        if (fileObj) {
            this._files.splice(this._files.indexOf(fileObj), 1);
        }

        let attribute = this.attrs.find(c => c.id == attrId);;

        let size = type == "file" ? attribute.maxFileSize : 10;
        let sizeText = type == "file" ? `${attribute.maxFileSize} مگابایت` : `10 مگابایت`;

        if (event.target.files && event.target.files.length > 0) {
            let file: File = event.target.files[0];

            let fileExtentions = file.name.split('.');

            if (fileExtentions.length <= 1) {
                fileIsInvalid("بارگذاری این فایل مجاز نمی باشد!");
                return;
            }

            Object.defineProperty(file, 'name', {
                writable: true,
                value: `${this.getRandomFileName()}.${fileExtentions.slice(-1)[0]}`
            });

            if (file.size / 1024 / 1024 > size) {
                fileIsInvalid("حجم فایل باید کمتر از " + sizeText + " باشد");
                return;
            }

            if (requiredFileAttr) {
                let indexOf = this.reqfilesAttrint.indexOf(attrId, 0);
                if (indexOf > -1) {
                    this.reqfilesAttrint.splice(indexOf, 1);
                }
            }

            this._files.push({
                file: file,
                attrId: attrId
            });

            let itemAttr = this.itemAttrs.find(
                c => c.attributeId == attrId
            );

            let result = "(binery)";

            if (itemAttr) {
                itemAttr.attrubuteValue = result;
                itemAttr.fileName = file.name;
            } else {
                this.itemAttrs.push({
                    itemId: 0,
                    attributeId: attrId,
                    attrubuteValue: result,
                    attributeFilePath: "1",
                    fileName: file.name,
                    score: 0
                });
            }

            this.saveItemAttrs();
        }
    }

    getRandomFileName(filelength = 10): string {
        let result = "";
        let characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let charactersLength = characters.length;
        for (let i = 0; i < filelength; i++) {
            result += characters.charAt(Math.floor(Math.random() * charactersLength));
        }
        return result;
    }

    isFileExist(attrId) {
        if (this.reqfilesAttrint.length != 0) {
            return this.reqfilesAttrint.some(c => c == attrId);
        } else {
            return false;
        }
    }

    async totallyCheckForUniqAttrs() {
        if (!this.isPreview) {
            const reqAttrs = this.attrs.filter(c => c.isUniq && (c.attrTypeInt == 1 || c.attrTypeInt == 2));

            await Promise.all(reqAttrs.map(async (attr) => {
                await this.checkForUniqValue(this.group.controls['p' + this.getIndexForAttr(attr.id)].value, attr.id);
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
            this.reqfilesAttrint.length == 0 &&
            this.attrUniqList.length == 0 &&
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
                                let data: any = event.body;

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
                                    this.message.showWarningAlert("خطایی روی داده است لطفا با راهبر سیستم تماس حاصل فرمایید");
                                    this.message.showMessageforFalseResult(data);
                                    this.isUploading = false;
                                    // if (isFromCountDownEvent) {
                                    //     this.sts(isFromCountDownEvent, repeatTime + 1.5);
                                    // }
                                    this.sts(true, repeatTime + 1.5);
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

export function validateMeliCode(control: FormControl) {

    let isValid = checkForMeliCode(control.value || "");

    return !isValid ? { 'meliCode': { value: control.value } } : null;
}

export function checkForMeliCode(input: string) {
    if (!/^\d{10}$/.test(input)
        || input == '0000000000'
        || input == '1111111111'
        || input == '2222222222'
        || input == '3333333333'
        || input == '4444444444'
        || input == '5555555555'
        || input == '6666666666'
        || input == '7777777777'
        || input == '8888888888'
        || input == '9999999999')
        return false;
    let check = parseInt(input[9]);
    let sum = 0;
    let i;
    for (i = 0; i < 9; ++i) {
        sum += parseInt(input[i]) * (10 - i);
    }
    sum %= 11;
    return (sum < 2 && check == sum) || (sum >= 2 && check + sum == 11);
}
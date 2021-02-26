export class IOnlineClass {
    constructor() { }

    id = 0;

    // auto Set
    meetingId = "";

    name = "";

    gradeId: number = null;
    classId: number = null;
    courseId: number = null;

    onlineClassServerId: number = null;

    authorizeType: number = 0;
    
    allowedAdminIds: number[] = [];
    allowedStudentIds: number[] = [];

    // auto Set
    attendeePW = "";
    // auto Set
    moderatorPW = "";

    welcome = "";

    maxParticipants = null;
    duration = null;

    // auto Set
    logoutURL = "";

    meta = "";
    copyright = "";

    parentMeetingID = "";
    sequence = 0;

    record = false;
    isBreakout = false;
    freeJoin = false;
    autoStartRecording = false;
    allowStartStopRecording = false;
    webcamsOnlyForModerator = false;
    muteOnStart = true;
    allowModsToUnmuteUsers = false;
    lockSettingsDisableCam = false;
    lockSettingsDisableMic = false;
    lockSettingsDisablePrivateChat = false;
    lockSettingsDisablePublicChat = false;
    lockSettingsDisableNote = false;
    lockSettingsLockedLayout = false;
    lockSettingsLockOnJoin = true;


    gradeName = "";
    className = "";
    courseName = "";
}
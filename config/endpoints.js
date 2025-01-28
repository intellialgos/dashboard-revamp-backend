export const ENDPOINTS = {
    LOGIN: 'UserLogin', // LOGIN
    REFRESH_TOKEN: 'RefreshToken', // REFRESH LOGIN TOKEN
    USERS_LIST: 'GetUserList', // GET ALL USERS
    GET_USER: 'GetUser', // GET ONE USER
    POST_USER: 'PostUser', // ADD/EDIT USER
    DELETE_USER: 'DeleteUser', // DELETE USER
    GET_ORGANIZATIONS: 'GetOrgSite', // GET ALL ORGANIZATIONS & SITES (UN-MASKED)
    POST_ORGANIZATION: 'CreateOrganization',
    POST_GROUP: 'CreateGroup',
    DELETE_GROUP: 'DeleteGroup',
    QUERY_EVENTS: 'queryEvents',
    PROCESS_EVENT: 'processEvents',
    REGISTER_BOX: 'RegisterBox',
    DELETE_SITE: 'DeleteBox',
    UPDATE_IO_EVENTS: 'updateioeventstext',
    GET_BOX_STATUS: 'GetBoxStatus',
    GET_IO_EVENTS: 'GetIoEventsText',
    GET_MASKED_ITEM: 'GetMaskedItemKey',
    MASK_ITEM: 'PostMaskedItemKey',
    UPGRADE_BOX_FIRMWARE: 'UpgradeBoxFirmware',
    DELETE_MASKED_ITEM: 'deletemaskeditemkey',
    FAST_RECOVERY: 'QueryFastRecoveryEventCount',
    CONFIGURE_BOX: 'ConfigureBox',
}
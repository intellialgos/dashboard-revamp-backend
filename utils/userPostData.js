import { encodeBase64 } from "./base64.js";
import { hashPassword } from "./hashPassword.js";

export async function getUserPostData(data) {
    
    const editMode = ( data?.userGuid ) ? true : false;
    if ( (
        !editMode && !data?.parentGuid) ||
        !data?.permission ||
        (data?.permission == "customer" && !data?.organization)
    ) {
        return false;
    }

    if ( !editMode && !data?.password ) { return false; }

    const hashedPass = await hashPassword(data.password);
    const status = data?.status ? 1 : 0;
    const filter = (data?.role == "customer") ? encodeBase64({
        organization: data?.organization,
        sites: data?.sites
    }) : "";

    const filteredData = {
        ...( editMode ? {userGuid: data?.userGuid} : {}),
        userName: data?.userName,
        nickName: data?.nickName,
        ...( !editMode ? {parentGuid: data?.parentGuid} : {}),
        ...( hashedPass ? {password: hashedPass} : {}),
        permission: encodeBase64(data?.permission),
        filter: filter,
        status: status,
        remark: data?.remark || ""
    }

    return filteredData;
}
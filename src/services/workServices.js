import {
    getAllWorkRecords,
    addWorkRecord,
} from "../data/database";

import {
    getYesterdayDate,
    formatDate,
} from "../logic/noFap";

export async function loadWorkData() {
    return await getAllWorkRecords();
}

export async function recordWorkDone(didWork) {
    const yesterday = getYesterdayDate();

    const records = await getAllWorkRecords();

    const alreadyRecorded = records.some(
        record => record.date === yesterday
    );

    if (alreadyRecorded) {
        throw new Error("WORK_ALREADY_RECORDED");
    }

    return await addWorkRecord({
        date: yesterday,
        didWork,
        recordedOn: formatDate(new Date()),
    });
}
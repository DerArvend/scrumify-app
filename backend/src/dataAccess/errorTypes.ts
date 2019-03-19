export enum ReportsFetchError {
    InvalidUserId,
    DatabaseError,
}

export enum TeamIdGetError {
    InvalidArgument,
    IdNotFound,
    DatabaseError,
}

export enum WriteReportError {
    InvalidDate,
    InvalidUserId,
    TodayReportExists,
    DatabaseError,
}

export enum GetUserNameError {
    InvaludUuid,
    DatabaseError,
    UserIdNotFound,
}
